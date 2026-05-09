import os
from typing import List, Union
from pydantic import field_validator, AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Placio"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "placio_prod_secret_8c6f9d2a3b1e4f5g6h7i8j9k0l1m2n3o"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 1 week
    
    # Database
    DATABASE_URL: str = "sqlite:///./placio.db"
    
    # CORS (Pydantic will read this from .env automatically)
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,https://placio-tawny.vercel.app"

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.BACKEND_CORS_ORIGINS:
            return ["*"]
        return [i.strip() for i in self.BACKEND_CORS_ORIGINS.split(",")]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
