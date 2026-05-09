from sqlmodel import create_engine, Session, SQLModel
from ..core.config import settings

# Engine configuration for both SQLite and PostgreSQL
engine = create_engine(
    settings.DATABASE_URL,
    # pool_pre_ping is useful for PostgreSQL to handle dropped connections
    pool_pre_ping=True,
    # Only use connect_args for SQLite
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

def create_db_and_tables():
    from ..models.user import User
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
