"""
Configuration settings for AI-SlopeGuard Disaster Intelligence Command Center
"""
import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AI-SlopeGuard Command Center"
    APP_VERSION: str = "2.4.0-SIH-PROD"
    DESCRIPTION: str = "AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region"
    API_PREFIX: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aislopeguard-disaster-resilience-super-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]
    
    # Risk Thresholds
    RAIN_NORMAL_THRESHOLD_MM: float = 50.0
    RAIN_ELEVATED_THRESHOLD_MM: float = 100.0
    RAIN_HIGH_THRESHOLD_MM: float = 150.0
    RAIN_CRITICAL_THRESHOLD_MM: float = 200.0
    
    SOIL_MOISTURE_CRITICAL_PCT: float = 80.0
    TILT_CRITICAL_DEG: float = 3.5
    DISPLACEMENT_CRITICAL_MM: float = 5.0
    
    # Regional Center Coordinates (Default: Tawang, Arunachal Pradesh)
    DEFAULT_LATITUDE: float = 27.5857
    DEFAULT_LONGITUDE: float = 91.8676

settings = Settings()
