"""
AI/ML Model Registry & Evaluation Performance API Endpoints
"""
from fastapi import APIRouter
from app.mock_data.seed_data import MODEL_METRICS

router = APIRouter(prefix="/models", tags=["Model Performance"])

@router.get("")
def get_model_performance():
    """
    Returns AI Model accuracy, ROC-AUC, confusion matrix, and version history.
    """
    prediction_history = [
        {"timestamp": "19:00 IST", "location": "Tawang Valley", "predicted_prob": 82.5, "actual_event": "Minor Slump", "accuracy": "Correct"},
        {"timestamp": "17:30 IST", "location": "Gangtok NH-10", "predicted_prob": 89.5, "actual_event": "Debris Flow", "accuracy": "Correct"},
        {"timestamp": "15:45 IST", "location": "Bomdila Pass", "predicted_prob": 48.0, "actual_event": "No Failure", "accuracy": "Correct"},
        {"timestamp": "14:10 IST", "location": "Itanagar Sec-4", "predicted_prob": 21.0, "actual_event": "No Failure", "accuracy": "Correct"},
        {"timestamp": "12:00 IST", "location": "Cherrapunji", "predicted_prob": 76.4, "actual_event": "Rockfall", "accuracy": "Correct"}
    ]
    
    return {
        "success": True,
        "metrics": MODEL_METRICS,
        "prediction_history": prediction_history
    }
