use std::sync::{Arc, Mutex};

use argh::FromArgs;
use eyre::Result;
use socketioxide::{extract::SocketRef, SocketIoBuilder};
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
};

use crate::game::{GlobalState, PendingGame};

mod events;
mod game;

/// The Project Faith server.
#[derive(FromArgs)]
struct Args {
    /// the address to listen on
    #[argh(option, default = "String::from(\"0.0.0.0\")")]
    listen: String,

    /// the port to listen on
    #[argh(option, default = "3003")]
    port: u16,

    /// the web assets directory
    #[argh(option, default = "String::from(\"./web\")")]
    web: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    let args: Args = argh::from_env();

    let (socket_layer, io) = SocketIoBuilder::new()
        .with_state(GlobalState::new())
        .build_layer();

    io.ns("/", |s: SocketRef| {
        s.on("createRoom", events::on_create_room);
        s.on("joinRoom", events::on_join_room);
    });

    let cors = CorsLayer::permissive();

    let app = axum::Router::new()
        .fallback_service(
            ServeDir::new(args.web.clone()).fallback(ServeFile::new(args.web + "/index.html")),
        )
        .layer(ServiceBuilder::new().layer(cors).layer(socket_layer));

    tracing::info!("Listening on {}:{}", args.listen, args.port);
    let listener = tokio::net::TcpListener::bind((args.listen, args.port)).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
