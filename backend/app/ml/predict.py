# ml/predict.py - AI Risk Prediction Engine

def predict_student_risk(
    avg_score:       float,
    attendance:      float,
    score_trend:     float,
    failed_subjects: int
) -> dict:
    """
    Predicts if a student is at risk of failing.
    Returns risk level: LOW / MEDIUM / HIGH
    """
    risk_score = 0

    # Score-based risk
    if avg_score < 40:
        risk_score += 40
    elif avg_score < 60:
        risk_score += 20
    elif avg_score < 75:
        risk_score += 10

    # Attendance-based risk
    if attendance < 60:
        risk_score += 35
    elif attendance < 75:
        risk_score += 20
    elif attendance < 85:
        risk_score += 10

    # Trend-based risk (declining scores)
    if score_trend < -15:
        risk_score += 20
    elif score_trend < -5:
        risk_score += 10

    # Failed subjects risk
    risk_score += failed_subjects * 10

    # Cap at 100
    risk_score = min(risk_score, 100)

    # Determine risk level
    if risk_score >= 50:
        risk_level = "HIGH"
    elif risk_score >= 25:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # Recommendations
    recommendations = {
        "HIGH":   "⚠️ Immediate intervention needed! Schedule parent-teacher meeting and assign a mentor.",
        "MEDIUM": "📚 Student needs extra support. Assign additional practice materials and monitor weekly.",
        "LOW":    "✅ Student is performing well. Continue regular monitoring and encouragement."
    }

    return {
        "risk_level":     risk_level,
        "risk_score":     risk_score,
        "recommendation": recommendations[risk_level]
    }


def get_grade(percentage: float) -> str:
    if percentage >= 90:   return "A+"
    elif percentage >= 80: return "A"
    elif percentage >= 70: return "B"
    elif percentage >= 60: return "C"
    elif percentage >= 40: return "D"
    else:                  return "F"
