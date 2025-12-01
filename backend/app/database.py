from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Use absolute path for database
db_path = os.path.join(os.path.dirname(__file__), "..", "yatragenie.db")
DATABASE_URL = f"sqlite:///{db_path.replace(chr(92), '/')}"  # Convert backslashes to forward slashes for SQLite

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
