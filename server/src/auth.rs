use std::sync::Arc;

use axum::{http::StatusCode, response::IntoResponse, Form};
use eyre::Result;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use polodb_core::{bson::doc as bson, CollectionT, Database};
use rand::{rngs::OsRng, Rng};
use serde::{Deserialize, Serialize};
use sha2::Digest;
use typeshare::typeshare;

const JWT_SECRET: &[u8] = b"your-secret-key"; // 在生产环境中应使用环境变量

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    id: String,
    salt: Vec<u8>,
    pw_hash: Vec<u8>,
    version: i32, // 新增字段：token版本控制
}

impl User {
    pub fn new(id: String, password: &str) -> Self {
        let mut salt = vec![0; 16];
        OsRng.fill(&mut salt[..]);
        let pw_hash = hash_password(password, &salt);
        Self {
            id,
            salt,
            pw_hash,
            version: 1, // 初始版本号
        }
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
    pub user_id: String,
    pub version: i32,
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
        let claims = Claims {
            user_id: user.id().to_owned(),
            version: user.version,
        };

        encode(
            &Header::default(),
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

    pub fn verify_token(&self, token: &str) -> Option<Claims> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(JWT_SECRET),
            &Validation::new(jsonwebtoken::Algorithm::HS256),
        )
        .ok()?;

        let collection = self.db.collection::<User>("users");
        let user = collection
            .find_one(bson! { "id": &token_data.claims.user_id })
            .ok()??;

        // 验证token版本
        if user.version == token_data.claims.version {
            Some(token_data.claims)
        } else {
            None
        }
    }
}

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
