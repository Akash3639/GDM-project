def build_recommendations(weight: float, sugar_level: float, blood_pressure: str):
    warnings = []
    if sugar_level > 140:
        warnings.append("Blood sugar is above normal range. Consult your doctor.")
    if "/" in blood_pressure:
        try:
            sys, dia = [int(x.strip()) for x in blood_pressure.split("/")]
            if sys > 140 or dia > 90:
                warnings.append("Blood pressure appears high. Monitor closely.")
        except ValueError:
            pass
    if weight < 45:
        warnings.append("Weight seems low for pregnancy. Consider nutritional assessment.")

    diet_plan = [
        "Breakfast: Idli + sambar + boiled egg",
        "Lunch: Brown rice + dal + mixed vegetables + curd",
        "Snack: Roasted chana + fruit",
        "Dinner: Chapati + paneer/tofu curry + salad",
    ]

    exercises = [
        "20-minute slow walk",
        "Prenatal breathing exercises (10 mins)",
        "Trimester-safe stretching (10 mins)",
    ]
    return warnings, diet_plan, exercises
