from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import jwt, JWTError
from datetime import datetime, timedelta
import joblib
import numpy as np
import mysql.connector  # Importar el conector de MySQL
from mysql.connector import Error

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'wine_quality_db'
}

# Función para obtener la conexión a la base de datos
def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

# Cargar modelos entrenados
modelo_rf = joblib.load("modelo_random_forest.pkl")
modelo_lr = joblib.load("modelo_logistic_regression.pkl")
modelo_svm = joblib.load("modelo_svm.pkl")
scaler = joblib.load("scaler.pkl")

# Configuración JWT
SECRET_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODk4NDEwNiwiaWF0IjoxNjk4OTg0MTA2fQ.W3U9ivlk6ZW1qteEuUvGOjUDp8ed20sBNPKDi4rXWE4"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Inicializar FastAPI
app = FastAPI(title="API de Predicción de Calidad de Vino")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Modelos Pydantic
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

class TokenData(BaseModel):
    username: str | None = None

# Funciones de autenticación
def get_user(db, username: str):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (username,))
    user = cursor.fetchone()
    cursor.close()  # Cerrar el cursor después de usarlo
    return user

def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        db = get_db_connection()
        user = get_user(db, username)
        return user
    except JWTError:
        raise HTTPException(
            status_code=401, detail="No se pudo validar el token")

# RUTAS DE AUTENTICACIÓN
@app.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_db_connection()
    user = get_user(db, form_data.username)
    if not user or not verify_password(form_data.password, user['password']):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/usuario")
async def obtener_usuario_autenticado(current_user: dict = Depends(get_current_user)):
    return current_user

# RUTAS ORIGINALES (sin protección)
@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a la API de predicción de vinos"}

@app.post("/predict_all")
def predecir_todos(features: WineFeatures):
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
    
    datos_escalados = scaler.transform(datos)
    
    pred_rf = modelo_rf.predict(datos_escalados)[0]
    pred_lr = modelo_lr.predict(datos_escalados)[0]
    pred_svm = modelo_svm.predict(datos_escalados)[0]
    
    return {
        "predicciones": {
            "Random Forest": int(pred_rf),
            "Logistic Regression": int(pred_lr),
            "Support Vector Machine": int(pred_svm)
        },
        "mensaje": "Calidad estimada del vino según cada modelo"
    }
