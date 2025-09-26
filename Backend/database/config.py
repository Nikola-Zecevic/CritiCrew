from functools import lru_cache
from urllib.parse import quote_plus
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import SecretStr

BASE_DIR = Path(__file__).resolve().parent.parent#.parent
class Settings(BaseSettings):
    
    DB_USERNAME: str
    DB_PASSWORD: SecretStr
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

    
    SECRET_KEY: SecretStr
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow",
    )

    @property
    def db_url(self) -> str:

        return (
            f"mysql+pymysql://{self.DB_USERNAME}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            f"?ssl_disabled=false&charset=utf8mb4"
        )

        # pw = self.DB_PASSWORD.get_secret_value() if isinstance(self.DB_PASSWORD, SecretStr) else str(self.DB_PASSWORD)
        #user_q=quote_plus(self.DB_USERNAME)
        #pw_quoted = quote_plus(pw)
        #return f"mysql+pymysql://{user_q}:{pw_quoted}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"
        # return f"mysql+pymysql://{self.DB_USERNAME}:{pw_quoted}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"



@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
