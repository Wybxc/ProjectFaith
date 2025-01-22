use argh::FromArgs;
use eyre::Result;
use socketioxide::{extract::SocketRef, SocketIo};
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
};

use crate::events::Message;

mod events;

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

    let (socket_layer, io) = SocketIo::new_layer();

    tracing::info!("Listening on {}:{}", args.listen, args.port);

    io.ns("/", |s: SocketRef| {
        tracing::info!("Connected to namespace /");

        s.on("message", |s: SocketRef| {
            tracing::info!("Received message event");
            s.emit(
                "message-back",
                &Message {
                    message: "Hello World!".to_string(),
                },
            )
            .ok();
        });
    });

    let cors = CorsLayer::permissive();

    let app = axum::Router::new()
        .fallback_service(
            ServeDir::new(args.web.clone()).fallback(ServeFile::new(args.web + "/index.html")),
        )
        .layer(ServiceBuilder::new().layer(cors).layer(socket_layer));

    let listener = tokio::net::TcpListener::bind((args.listen, args.port)).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
