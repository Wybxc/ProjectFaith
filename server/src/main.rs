use std::{path::PathBuf, sync::Arc};

use argh::FromArgs;
use axum::routing::post;
use eyre::Result;
use socketioxide::{
    extract::{Data, SocketRef, State},
    SocketIoBuilder,
};
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
};

use crate::{
    auth::{Auth, AuthService},
    game::GlobalState,
};

mod auth;
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
    #[argh(option, default = "PathBuf::from(\"./web\")")]
    web: PathBuf,

    /// the database path
    #[argh(option, default = "PathBuf::from(\"./data.db\")")]
    db: PathBuf,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt::init();
    let args: Args = argh::from_env();

    let database = Arc::new(polodb_core::Database::open_path(args.db)?);
    let auth_service = AuthService::new(database);

    let (socket_layer, io) = SocketIoBuilder::new()
        .with_state(GlobalState::new())
        .with_state(auth_service.clone())
        .build_layer();

    io.ns(
        "/",
        |s: SocketRef, State::<AuthService>(auth_service), Data::<Auth>(auth)| {
            let Some(claims) = auth_service.verify_token(&auth.token) else {
                s.disconnect().ok();
                return;
            };

            tracing::info!("{} connected", claims.user_id);
            s.extensions.insert(claims);
            s.on("createRoom", events::on_create_room);
            s.on("joinRoom", events::on_join_room);
        },
    );

    let app = axum::Router::new()
        .fallback_service(
            ServeDir::new(args.web.clone()).fallback(ServeFile::new(args.web.join("index.html"))),
        )
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
                .layer(socket_layer),
        )
        .nest(
            "/api",
            axum::Router::new()
                .route("/login", post(auth::on_login))
                .route("/signup", post(auth::on_signup))
                .with_state(auth_service),
        );

    tracing::info!("Listening on {}:{}", args.listen, args.port);
    let listener = tokio::net::TcpListener::bind((args.listen, args.port)).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
