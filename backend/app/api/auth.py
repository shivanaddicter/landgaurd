"""
Authentication & Role-Based Access Control API Endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.security import create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    department: str
    jurisdiction: str

DEMO_USERS = {
    "admin": {
        "id": "usr-admin-01",
        "username": "admin",
        "password": "Password123!",
        "email": "command.director@ndma.gov.in",
        "full_name": "Dr. T. Norbu, IAS",
        "role": "super_admin",
        "department": "State Disaster Management Authority (SDMA)",
        "jurisdiction": "North Eastern Region (All 8 States)"
    },
    "officer": {
        "id": "usr-officer-02",
        "username": "officer",
        "password": "Password123!",
        "email": "tawang.disaster@arunachal.gov.in",
        "full_name": "Major R. Sharma (Retd.)",
        "role": "disaster_officer",
        "department": "District Disaster Management Office, Tawang",
        "jurisdiction": "Tawang & West Kameng Sectors"
    },
    "analyst": {
        "id": "usr-analyst-03",
        "username": "analyst",
        "password": "Password123!",
        "email": "geotech.analyst@gsi.gov.in",
        "full_name": "Sunita Hazarika, Ph.D.",
        "role": "analyst",
        "department": "Geological Survey of India (NER)",
        "jurisdiction": "NER Landslide Geospatial Lab"
    }
}

@router.post("/login")
def login(request: LoginRequest):
    user = DEMO_USERS.get(request.username)
    # For hackathon demo ease, allow demo users or fallback demo admin
    if not user or (request.password != user["password"] and request.password != "demo"):
        # If user typed another username, allow demo viewer login
        user = {
            "id": f"usr-{request.username}",
            "username": request.username,
            "email": f"{request.username}@slopeguard.gov.in",
            "full_name": f"Officer {request.username.capitalize()}",
            "role": "disaster_officer",
            "department": "Disaster Response Unit",
            "jurisdiction": "North Eastern Region"
        }
    
    token = create_access_token({
        "sub": user["id"],
        "username": user["username"],
        "role": user["role"]
    })
    
    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "department": user["department"],
            "jurisdiction": user["jurisdiction"]
        }
    }

@router.get("/me")
def get_current_user(token: Optional[str] = None):
    # If token passed or default to admin
    if token:
        payload = decode_token(token)
        if payload and payload.get("username") in DEMO_USERS:
            return {"success": True, "user": DEMO_USERS[payload["username"]]}
    return {"success": True, "user": DEMO_USERS["admin"]}
