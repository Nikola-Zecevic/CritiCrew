from sqlmodel import Field, SQLModel

class User(SQLModel, ):
    pass

"""from datetime import datetime
from sqlalchemy import Integer, String, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.database import Base
from typing import List


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(32), unique=True)
    email: Mapped[str] = mapped_column(String(64), unique=True)
    password: Mapped[str] = mapped_column(String(256))
    admin: Mapped[bool] = mapped_column(Boolean, default=False)
    picture: Mapped[str] = mapped_column(String(256), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, insert_default=func.now())
    deleted_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    sales: Mapped[List["Sale"]] = relationship("Sale", back_populates="user")
    rents: Mapped[List["Rent"]] = relationship("Rent", back_populates="user")

    def soft_delete(self):
        self.deleted_at = datetime.now()"""