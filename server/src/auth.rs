use std::sync::Arc;

use axum::{http::StatusCode, response::IntoResponse, Form};
use eyre::{OptionExt, Result};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use polodb_core::{bson::doc as bson, CollectionT, Database};
use rand::{rngs::OsRng, Rng};
use serde::{Deserialize, Serialize};
use sha2::Digest;
use time::OffsetDateTime;
use typeshare::typeshare;

const JWT_SECRET: &[u8] = b"your-secret-key"; // 在生产环境中应使用环境变量

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    id: String,
    salt: Vec<u8>,
    pw_hash: Vec<u8>,
}

impl User {
    pub fn new(id: String, password: &str) -> Self {
        let mut salt = vec![0; 16];
        OsRng.fill(&mut salt[..]);
        let pw_hash = hash_password(password, &salt);
        Self { id, salt, pw_hash }
    }

    pub fn authenticate(&self, password: &str) -> bool {
        let hash = hash_password(password, &self.salt);
        hash == self.pw_hash
    }

    pub fn id(&self) -> &str {
        &self.id
    }
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub iat: f64, // 签发时间
    pub exp: f64, // 过期时间
}

#[derive(Clone)]
pub struct AuthService {
    db: Arc<Database>,
}

impl AuthService {
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    fn register_user(&self, user_id: String, password: String) -> Result<RegisterUserResult> {
        let collection = self.db.collection::<User>("users");

        if collection.find_one(bson! { "id": &user_id })?.is_some() {
            return Ok(RegisterUserResult::UserExists);
        }

        let user = User::new(user_id, &password);
        collection.insert_one(&user)?;

        Ok(RegisterUserResult::Success(user))
    }

    fn create_token(&self, user: &User) -> jsonwebtoken::errors::Result<String> {
        let now = OffsetDateTime::now_utc();
        let claims = Claims {
            sub: user.id().to_owned(),
            iat: now.unix_timestamp() as f64,
            exp: (now + time::Duration::days(7)).unix_timestamp() as f64,
        };

        encode(
            &Header::new(jsonwebtoken::Algorithm::HS256),
            &claims,
            &EncodingKey::from_secret(JWT_SECRET),
        )
    }

    pub async fn authenticate(&self, credentials: Credentials) -> Result<Option<(User, String)>> {
        let collection = self.db.collection::<User>("users");

        if let Some(user) = collection.find_one(bson! { "id": &credentials.user_id })? {
            if user.authenticate(&credentials.password) {
                let token = self.create_token(&user)?;
                return Ok(Some((user, token)));
            }
        }

        Ok(None)
    }

    pub fn verify_token(&self, token: &str) -> Result<Claims> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(JWT_SECRET),
            &Validation::new(jsonwebtoken::Algorithm::HS256),
        )?;

        let collection = self.db.collection::<User>("users");
        let _user = collection
            .find_one(bson! { "id": &token_data.claims.sub })?
            .ok_or_eyre("User not found")?;

        Ok(token_data.claims)
    }
}

#[typeshare]
#[derive(Clone, Deserialize)]
pub struct Credentials {
    user_id: String,
    password: String,
}

enum RegisterUserResult {
    Success(User),
    UserExists,
}

pub async fn on_login(
    auth_service: axum::extract::State<AuthService>,
    Form(creds): Form<Credentials>,
) -> impl IntoResponse {
    match auth_service.authenticate(creds).await {
        Ok(Some((_, token))) => token.into_response(),
        Ok(None) => StatusCode::UNAUTHORIZED.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

pub async fn on_signup(
    auth_service: axum::extract::State<AuthService>,
    Form(creds): Form<Credentials>,
) -> impl IntoResponse {
    match auth_service.register_user(creds.user_id, creds.password) {
        Ok(RegisterUserResult::Success(user)) => match auth_service.create_token(&user) {
            Ok(token) => token.into_response(),
            Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
        },
        Ok(RegisterUserResult::UserExists) => StatusCode::CONFLICT.into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

fn hash_password(password: &str, salt: &[u8]) -> Vec<u8> {
    let mut hasher = sha2::Sha256::new();
    hasher.update(password.as_bytes());
    hasher.update(salt);
    hasher.finalize().to_vec()
}

#[typeshare]
#[derive(Debug, Serialize, Deserialize)]
pub struct Auth {
    pub token: String,
}
