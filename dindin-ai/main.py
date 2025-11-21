from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import calendar
from datetime import datetime

app = FastAPI(title="DinDin AI")

class ExpenseItem(BaseModel):
    date: str
    amount: float

class PredictionRequest(BaseModel):
    expenses: List[ExpenseItem]
    target_month: int
    target_year: int

@app.get("/")
def health_check():
    return {"status": "online", "service": "DinDin AI"}

@app.post("/predict")
def predict_spending(data: PredictionRequest):
    try:
        #se nao tiver dados, nao da pra prever
        if not data.expenses:
            return{
                "prediction": 0.0,
                "status": "Sem dados suficientes",
                "trend": "neutral"
            }
        
        #transformar lista em dataframe do pandas
        df = pd.DataFrame([e.dict() for e in data.expenses])

        df['date'] = pd.to_datetime(df['date'])

        df['day'] = df['date'].dt.day

        #agrupar gastos por dia
        daily_expenses = df.groupby('day')['amount'].sum().reset_index()

        #coluna de gasto acumulado
        daily_expenses['cumulative'] = daily_expenses['amount'].cumsum()

        X = daily_expenses[['day']].values
        y = daily_expenses['cumulative'].values

        if len(X) < 2:
            return{
                "prediction": float(y[-1]) if len(y) > 0 else 0.0,
                "status": "Dados insuficientes para calcular tendência",
                "trend": "neutral"
            }
        
        #treinar modelo
        model = LinearRegression()
        model.fit(X, y)

        #prever o final do mes
        _, last_day_of_month = calendar.monthrange(data.target_year, data.target_month)

        #predicao para o ultimo dia
        predicted_total = model.predict([[last_day_of_month]])[0]

        current_total = daily_expenses['amount'].sum()
        final_prediction = max(predicted_total, current_total)

        #analise de tendencia
        trend = "stable"
        if final_prediction > (current_total * 1.1): #10% de margem
            trend="increasing"

        return{
            "prediction": round(float(final_prediction), 2),
            "current_total": round(float(current_total), 2),
            "days_in_month": last_day_of_month,
            "trend": trend,
            "model_score": model.score(X, y)
        }
    
    except Exception as e:
        print(f"Erro na IA: {e}")
        raise HTTPException(status_code=500, detail=str(e))
