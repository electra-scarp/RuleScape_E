from fastapi import APIRouter
from dataio.ml.runner import run_full_ml

router = APIRouter()

@router.post("/ml/run")
def run_ml(payload: dict):
    return run_full_ml(payload)
