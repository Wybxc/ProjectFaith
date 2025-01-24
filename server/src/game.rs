use std::{collections::HashMap, sync::Arc};

use tokio::sync::{Mutex, RwLock};

#[derive(Clone)]
pub struct GlobalState {
    pub pending_games: Arc<Mutex<HashMap<String, PendingGame>>>,
    pub games: Arc<RwLock<HashMap<String, Game>>>,
}

impl GlobalState {
    pub fn new() -> Self {
        Self {
            pending_games: Arc::new(Mutex::new(HashMap::new())),
            games: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

#[allow(dead_code)]
pub struct PendingGame {
    username: String,
}

impl PendingGame {
    pub fn new(username: String) -> Self {
        Self { username }
    }
}

pub struct Game {}

impl Game {
    pub fn new() -> Self {
        Self {}
    }
}
