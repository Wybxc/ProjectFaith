use serde::{Deserialize, Serialize};
use socketioxide::extract::{AckSender, Data, SocketRef};
use ts_rs::TS;

#[derive(TS, Serialize, Deserialize)]
#[ts(export)]
pub struct CreateRoomResponse {
    pub room: String,
}

pub fn on_create_room(s: SocketRef, callback: AckSender) {
    let room = format!("room-{}", s.id);
    s.join(room.clone());
    callback.send(&CreateRoomResponse { room }).ok();
}

#[derive(TS, Serialize, Deserialize)]
#[ts(export)]
pub struct JoinRoom {
    pub room: String,
    pub username: String,
}

pub fn on_join_room(s: SocketRef, Data(event): Data<JoinRoom>, callback: AckSender) {
    s.join(event.room.clone());
    callback.send(&()).ok();
}
