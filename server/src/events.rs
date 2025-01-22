use serde::{Deserialize, Serialize};
use socketioxide::extract::{AckSender, Data, SocketRef, State};
use typeshare::typeshare;

use crate::game::{Game, GlobalState, PendingGame};

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct CreateRoom {
    pub username: String,
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct CreateRoomResponse {
    pub room: String,
}

pub async fn on_create_room(
    s: SocketRef,
    Data(event): Data<CreateRoom>,
    State(state): State<GlobalState>,
    callback: AckSender,
) {
    let room = format!("room-{}", s.id);
    s.join(room.clone());

    let mut pending_games = state.pending_games.lock().await;
    pending_games.insert(room.clone(), PendingGame::new(event.username.clone()));
    drop(pending_games);

    callback.send(&CreateRoomResponse { room }).ok();
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub struct JoinRoom {
    pub room: String,
    pub username: String,
}

#[typeshare]
#[derive(Serialize, Deserialize)]
pub enum JoinRoomResponse {
    Success,
    NotFound,
    Full,
}

pub async fn on_join_room(
    s: SocketRef,
    Data(event): Data<JoinRoom>,
    State(state): State<GlobalState>,
    callback: AckSender,
) {
    let mut pending_games = state.pending_games.lock().await;
    let Some(pending_game) = pending_games.remove(&event.room) else {
        if state.games.read().await.contains_key(&event.room) {
            callback.send(&JoinRoomResponse::Full).ok();
        } else {
            callback.send(&JoinRoomResponse::NotFound).ok();
        }
        return;
    };
    drop(pending_games);

    let game = Game::new();
    state.games.write().await.insert(event.room.clone(), game);

    s.join(event.room.clone());
    callback.send(&()).ok();
}
