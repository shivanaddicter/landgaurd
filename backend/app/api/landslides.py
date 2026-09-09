"""
Historical Landslide Database API Endpoints
Source: Geological Survey of India (GSI) & National Disaster Management Authority (NDMA)
"""
from fastapi import APIRouter, Query, Response
from typing import Optional
import csv
import io
from app.mock_data.seed_data import HISTORICAL_LANDSLIDES

router = APIRouter(prefix="/landslides", tags=["Historical Landslides"])

@router.get("")
def list_landslides(
    query: Optional[str] = None,
    district: Optional[str] = None,
    state: Optional[str] = None,
    severity: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Searchable, filterable historical landslide database with pagination.
    """
    data = HISTORICAL_LANDSLIDES
    
    if query:
        q = query.lower()
        data = [
            item for item in data
            if q in item["id"].lower()
            or q in item["location_name"].lower()
            or q in item["district"].lower()
            or q in item["triggering_factor"].lower()
            or q in item["infrastructure_damage"].lower()
        ]
        
    if district:
        data = [item for item in data if item["district"].lower() == district.lower()]
    if state:
        data = [item for item in data if item["state"].lower() == state.lower()]
    if severity:
        data = [item for item in data if item["severity"].upper() == severity.upper()]
        
    total_count = len(data)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_items = data[start_idx:end_idx]
    
    return {
        "success": True,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit,
        "items": paginated_items
    }

@router.get("/export/csv")
def export_landslides_csv():
    """
    Generates and downloads CSV extract of historical disaster records.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow([
        "Incident ID", "Location Name", "District", "State", "Date",
        "Rainfall Trigger (mm)", "Severity", "Deaths", "Affected Population",
        "Triggering Factor", "Infrastructure Damage", "Latitude", "Longitude"
    ])
    
    for item in HISTORICAL_LANDSLIDES:
        writer.writerow([
            item["id"],
            item["location_name"],
            item["district"],
            item["state"],
            item["date"],
            item["rainfall_trigger_mm"],
            item["severity"],
            item["deaths"],
            item["affected_population"],
            item["triggering_factor"],
            item["infrastructure_damage"],
            item["latitude"],
            item["longitude"]
        ])
        
    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=AI_SlopeGuard_Historical_Landslides.csv"}
    )
