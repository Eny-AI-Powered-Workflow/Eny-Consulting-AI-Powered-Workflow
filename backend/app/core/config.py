# /home/obed/Documents/Eny_consulting/backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str 
    SUPABASE_JWT_SECRET: str
    SUPABASE_SERVICE_ROLE_KEY: str = ""  # admin-only, used by scripts/seed_dev_data.py -- never expose to frontend
    DATABASE_URL: str

    # GoHighLevel
    GHL_API_KEY: str = ""
    GHL_LOCATION_ID: str = ""
    GHL_BASE_URL: str = "https://services.leadconnectorhq.com"

    # n8n
    N8N_BASE_URL: str = "http://localhost:5678"
    N8N_API_KEY: str = ""

    # Claude
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-5"  # verify current model string in docs.claude.com

    # Optional lead-enrichment parity with Pipeline Pro (wire up later, not needed for MVP)
    APOLLO_API_KEY: str = ""
    PERPLEXITY_API_KEY: str = ""

    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
