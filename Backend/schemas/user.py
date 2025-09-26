from typing import Optional, Annotated
from sqlmodel import SQLModel
from pydantic import EmailStr, BaseModel, ConfigDict, Field, constr

class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"  

    model_config = ConfigDict(from_attributes=True)  # optional, only if needed

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)  # optional, only if needed

class UserBase(SQLModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    address: Optional[str] = None
    email: EmailStr
    username: str
    role_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)  # optional, only if needed


class UserCreate(UserBase):
    password:str
    model_config = ConfigDict(from_attributes=True)  # optional, only if needed



class UserUpdate(SQLModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)  # optional, only if needed


class UserRead(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)  # optional, only if needed



class Register(SQLModel):
    username: Annotated[str, Field(..., min_length=2, max_length=16)]
    password: Annotated[str, Field(..., min_length=8)]
    email: EmailStr
    name: str
    surname: str
    address: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)  # optional, only if needed


class Login(SQLModel):
    username: str
    password: str
    model_config = ConfigDict(from_attributes=True)