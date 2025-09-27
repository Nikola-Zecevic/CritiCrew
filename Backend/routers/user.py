from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from database.database import get_db, get_session
from models.user import User
from schemas.user import UserUpdate, UserRead, Register, Token, Login
import views.user as user_views

router = APIRouter(prefix="/users", tags=["users"])
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def role_name_of_user(user: User):
    return getattr(user.role, 'name', None) if user and user.role else None

def is_admin_or_superadmin(user: User):
    role_name = role_name_of_user(user)
    return role_name in ["admin", "superadmin"]

def is_superadmin(user):
    role_name = role_name_of_user(user)
    return role_name == "superadmin"

def require_admin_or_superadmin(user: User = Depends(user_views.get_current_user2)):
    if not is_admin_or_superadmin(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
    return user
def require_superadmin(user: User = Depends(user_views.get_current_user2)):
    if not is_superadmin(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Operation not permitted")
    return user

@router.get("/", response_model=List[UserRead])
def list_all_users(session:Session = Depends(get_session), current_user:User=Depends(require_superadmin)):
    return user_views.get_all_users(session)

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED )
def register_user(user_data:Register, session:Session = Depends(get_session)):
    return user_views.register2(session, user_data)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id:int, session:Session = Depends(get_session), current_user:User=Depends(require_superadmin)):
    user = user_views.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user_views.delete_user(session, user)
    return

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    return user_views.login2(session, form_data)

@router.put("/{user_id}/promote", response_model=UserRead)
def promote_user(user_id:int, session:Session = Depends(get_session), current_user:User=Depends(require_superadmin)):
    target_user = user_views.get_user_by_id(session, user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user_views.promote_user_to_admin(session, target_user)

@router.put("/{user_id}/demote", response_model=UserRead)
def demote_user(user_id:int, session:Session = Depends(get_session), current_user:User=Depends(require_superadmin)):
    target_user = user_views.get_user_by_id(session, user_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user_views.demote_admin_to_regular(session, target_user)
    
