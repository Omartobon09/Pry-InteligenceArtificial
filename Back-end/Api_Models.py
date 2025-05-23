from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Cargar modelo y scaler
modelo = joblib.load("modelo_random_forest.pkl")
scaler = joblib.load("scaler.pkl")

# Inicializar FastAPI
app = FastAPI(title="API de Predicción de Calidad de Vino")

# Definir los campos esperados en la entrada
class WineFeatures(BaseModel):
    fixed_acidity: float
    volatile_acidity: float
    citric_acid: float
    residual_sugar: float
    chlorides: float
    free_sulfur_dioxide: float
    total_sulfur_dioxide: float
    density: float
    pH: float
    sulphates: float
    alcohol: float

@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a la API de predicción de vinos"}

@app.post("/predict")
def predecir_calidad(features: WineFeatures):
    # Convertir a array numpy
    datos = np.array([[ 
        features.fixed_acidity,
        features.volatile_acidity,
        features.citric_acid,
        features.residual_sugar,
        features.chlorides,
        features.free_sulfur_dioxide,
        features.total_sulfur_dioxide,
        features.density,
        features.pH,
        features.sulphates,
        features.alcohol
    ]])

    # Escalar datos
    datos_escalados = scaler.transform(datos)

    # Hacer predicción
    prediccion = modelo.predict(datos_escalados)[0]

    return {
        "prediccion": int(prediccion),
        "mensaje": f"La calidad estimada del vino es: {prediccion}"
    }
