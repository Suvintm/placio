import sys
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Add the backend directory to the path so we can import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found in .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL)

def sync_schema():
    commands = [
        # College Profile Updates
        "ALTER TABLE collegeprofile ADD COLUMN IF NOT EXISTS campus_address VARCHAR;",
        "ALTER TABLE collegeprofile ADD COLUMN IF NOT EXISTS city VARCHAR;",
        "ALTER TABLE collegeprofile ADD COLUMN IF NOT EXISTS state VARCHAR;",
        "ALTER TABLE collegeprofile ADD COLUMN IF NOT EXISTS tpo_phone VARCHAR;",
        "ALTER TABLE collegeprofile ADD COLUMN IF NOT EXISTS tpo_designation VARCHAR;",
        
        # Company Profile Updates
        "ALTER TABLE companyprofile ADD COLUMN IF NOT EXISTS hr_phone VARCHAR;",
        "ALTER TABLE companyprofile ADD COLUMN IF NOT EXISTS hr_designation VARCHAR;",
        
        # Student Profile Updates
        "ALTER TABLE studentprofile ADD COLUMN IF NOT EXISTS college_code VARCHAR;",
        "ALTER TABLE studentprofile ADD COLUMN IF NOT EXISTS branch VARCHAR;",
        "ALTER TABLE studentprofile ADD COLUMN IF NOT EXISTS batch_year INTEGER;",
        "ALTER TABLE studentprofile ADD COLUMN IF NOT EXISTS cgpa FLOAT;"
    ]

    with engine.connect() as conn:
        print("Starting Database Schema Sync...")
        for cmd in commands:
            try:
                conn.execute(text(cmd))
                conn.commit()
                print(f"Executed: {cmd}")
            except Exception as e:
                print(f"Skipped/Error: {cmd} -> {e}")
        print("Database Schema is now in sync with production models!")

if __name__ == "__main__":
    sync_schema()
