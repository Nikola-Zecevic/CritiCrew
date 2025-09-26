from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select
from database.config import settings
from models.user import User
from models.role import Role
from database.database import get_session
from schemas.user import Register, Login, UserUpdate


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
secret_key = settings.SECRET_KEY.get_secret_value()
algorithm = settings.ALGORITHM
access_token_expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})#int(expire.timestamp())
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        return payload
    except ExpiredSignatureError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired") from exc
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials") from exc
    # except JWTError as exc:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials") from exc
    """except jwt.ExpiredSignatureError:
        raise exc.TokenExpired
    except jwt.InvalidTokenError:
        raise exc.InvalidToken"""
    
def get_user_by_email(db:Session, email: str):
    stmt = select(User).where(User.email == email)
    return db.exec(stmt).first()
def get_user_by_username(db:Session, username: str):
    stmt = select(User).where(User.username == username)
    return db.exec(stmt).first()
def get_user_by_id(db:Session, user_id: int):
    stmt = select(User).where(User.id == user_id)
    return db.exec(stmt).first()
def authenticate_user(db:Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
def get_all_users(db:Session):
    stmt = select(User)
    return db.exec(stmt).all()
def get_role_by_name(db:Session, role_name:str):
    stmt = select(Role).where(Role.name == role_name)
    return db.exec(stmt).first()

def promote_user_to_admin(db:Session, target_user:User):
    admin_role = get_role_by_name(db, "admin")
    if not admin_role:
        raise HTTPException(status_code=400, detail="Admin role not found")
    target_user.role_id = admin_role.id
    db.add(target_user)
    db.commit()
    db.refresh(target_user)
    return target_user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = {"username": username}
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(db, username=token_data["username"])
    if user is None:
        raise credentials_exception
    return user

def get_current_user2(token: str = Depends(oauth2_scheme), db: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception # Invalid token structure
    except JWTError:
        raise credentials_exception # Token verification failed
    user=get_user_by_id(db, int(sub))
    if user is None:
        raise credentials_exception # User not found
    return user


def register(db:Session, user_data):#:Register
    
    if get_user_by_username(db, user_data.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    
    if get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name,
        surname=user_data.surname,
        address=user_data.address,
        role_id = 1
        
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def register2(db:Session, user_data):#:Register
    username=user_data.username.lower()
    email=user_data.email.lower()
    if get_user_by_username(db, username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered")
    

    
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        name=user_data.name,
        surname=user_data.surname,
        address=user_data.address,
        role_id=1
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        print(f"Database error during user registration: {str(e)}")  # For debugging
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}") from e
    return new_user
    

def login(db:Session, user_data):#:Login
    user = authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

def login2(db:Session, form_data):#:OAuth2PasswordRequestForm
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=int(access_token_expire_minutes))
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def users_role(db:Session, user:User):
    if not user.role:
        return "No role assigned"
    return user.role.name

def update_user(db:Session, user:User, user_data):#:UserUpdate
    if user_data.username:
        user.username = user_data.username
    if user_data.email:
        user.email = user_data.email
    if user_data.name:
        user.name = user_data.name
    if user_data.surname:
        user.surname = user_data.surname
    if user_data.address:
        user.address = user_data.address
    if user_data.password:
        user.hashed_password = hash_password(user_data.password)
    if getattr(user_data, 'role_id', None) is not None:
        user.role_id = user_data.role_id
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db:Session, user:User):
    db.delete(user)
    db.commit()

def set_user_role(db:Session, user:User, role_id:int):
    user.role_id = role_id
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def demote_admin_to_regular(db:Session, target_user:User):
    regular_role = get_role_by_name(db, "regular")
    if not regular_role:
        raise HTTPException(status_code=400, detail="Regular role not found")
    target_user.role_id = regular_role.id
    db.add(target_user)
    db.commit()
    db.refresh(target_user)
    return target_user

def update_user2(db:Session, user:User, user_data):#:UserUpdate
    if getattr(user_data, 'username', None) and user_data.username.lower() != user.username:
        if get_user_by_username(db, user_data.username.lower()):
            raise HTTPException(status_code=400, detail="Username already registered")
        user.username = user_data.username.lower()
    if getattr(user_data, 'email', None) and user_data.email.lower() != user.email:
        if get_user_by_email(db, user_data.email.lower()):
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = user_data.email.lower()
    if getattr(user_data, 'name', None):
        user.name = user_data.name
    if getattr(user_data, 'surname', None):
        user.surname = user_data.surname
    if getattr(user_data, 'address', None):
        user.address = user_data.address
    if getattr(user_data, 'password', None):
        user.hashed_password = hash_password(user_data.password)
    if getattr(user_data, 'role_id', None) is not None:
        user.role_id = user_data.role_id
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
