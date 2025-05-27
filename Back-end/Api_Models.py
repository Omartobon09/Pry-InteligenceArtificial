from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from jose import jwt, JWTError
from datetime import datetime, timedelta
import joblib
import numpy as np
import mysql.connector
from mysql.connector import Error
from contextlib import contextmanager

# Inicializar FastAPI
app = FastAPI(
    title="Wine Quality API",
    description="API para gestión y análisis de calidad de vinos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos MySQL
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'wine_quality_db'
}

# Configuración JWT
SECRET_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODk4NDEwNiwiaWF0IjoxNjk4OTg0MTA2fQ.W3U9ivlk6ZW1qteEuUvGOjUDp8ed20sBNPKDi4rXWE4"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Cargar modelos entrenados
modelo_rf = joblib.load("modelo_random_forest.pkl")
modelo_lr = joblib.load("modelo_logistic_regression.pkl")
modelo_svm = joblib.load("modelo_svm.pkl")
scaler = joblib.load("scaler.pkl")

# Modelos Pydantic
class WineData(BaseModel):
    fixed_acidity: float = Field(..., ge=0, description="Acidez fija en g/L")
    volatile_acidity: float = Field(..., ge=0, description="Acidez volátil en g/L")
    citric_acid: float = Field(..., ge=0, description="Ácido cítrico en g/L")
    residual_sugar: float = Field(..., ge=0, description="Azúcar residual en g/L")
    chlorides: float = Field(..., ge=0, description="Cloruros en g/L")
    free_sulfur_dioxide: float = Field(..., ge=0, description="SO2 libre en mg/L")
    total_sulfur_dioxide: float = Field(..., ge=0, description="SO2 total en mg/L")
    density: float = Field(..., gt=0, description="Densidad del vino")
    pH: float = Field(..., ge=0, le=14, description="Nivel de pH (0-14)")
    sulphates: float = Field(..., ge=0, description="Sulfatos en g/L")
    alcohol: float = Field(..., ge=0, le=20, description="Contenido de alcohol (%)")
    quality: int = Field(..., ge=0, le=10, description="Calidad del vino (0-10)")

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

class WineResponse(BaseModel):
    wine_id: int  # Cambiado de id a wine_id
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
    quality: int
    created_at: str = None  # Opcional

class QualityDistribution(BaseModel):
    range: str
    count: int
    percentage: float

class AlcoholRange(BaseModel):
    range: str
    count: int
    percentage: float

class QualityReport(BaseModel):
    distribution: List[QualityDistribution]
    average: float
    total: int

class AlcoholReport(BaseModel):
    ranges: List[AlcoholRange]
    average: float
    total: int

class GeneralReport(BaseModel):
    totalWines: int
    averageQuality: float
    averageAlcohol: float
    averagePH: float
    topQualityCount: int
    lastUpdated: str

class TokenData(BaseModel):
    username: str | None = None

# Gestión de base de datos MySQL
@contextmanager
def get_mysql_connection():
    """Obtener conexión a MySQL con manejo de contexto"""
    connection = None
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            yield connection
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise HTTPException(status_code=500, detail=f"Error de conexión a la base de datos: {str(e)}")
    finally:
        if connection and connection.is_connected():
            connection.close()

def init_mysql_database():
    """Inicializar solo la tabla de usuarios si no existe"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor()
            
            # Crear tabla de usuarios si no existe
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            connection.commit()
            print("Verificación de base de datos MySQL completada")
            
    except Error as e:
        print(f"Error al verificar la base de datos: {e}")
        # No lanzar excepción aquí para que la API pueda iniciarse

# Funciones de autenticación
def get_user(connection, username: str):
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
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
        with get_mysql_connection() as connection:
            user = get_user(connection, username)
            return user
    except JWTError:
        raise HTTPException(
            status_code=401, detail="No se pudo validar el token")

# Inicializar la base de datos al inicio
init_mysql_database()

# RUTAS DE AUTENTICACIÓN
@app.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    with get_mysql_connection() as connection:
        user = get_user(connection, form_data.username)
        if not user or not verify_password(form_data.password, user['password']):
            raise HTTPException(status_code=400, detail="Credenciales incorrectas")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user['email']}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}

@app.get("/usuario")
async def obtener_usuario_autenticado(current_user: dict = Depends(get_current_user)):
    return current_user

# ENDPOINTS PRINCIPALES

@app.get("/")
async def root():
    """Endpoint de bienvenida"""
    return {
        "message": "Wine Quality API - MySQL Version",
        "version": "1.0.0",
        "database": "MySQL - wine_quality_db",
        "endpoints": {
            "add_wine": "POST /add_wine",
            "get_wines": "GET /wines",
            "quality_report": "GET /reports/quality",
            "alcohol_report": "GET /reports/alcohol",
            "general_report": "GET /reports/general",
            "predict_all": "POST /predict_all",
            "wine_stats": "GET /wines/stats",
            "login": "POST /login",
            "usuario": "GET /usuario"
        }
    }

@app.post("/add_wine", response_model=dict)
async def add_wine(wine_data: WineData):
    """Agregar un nuevo vino a la base de datos MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor()
            
            # Insertar el nuevo vino (sin created_at)
            insert_query = """
                INSERT INTO wines (
                    fixed_acidity, volatile_acidity, citric_acid, residual_sugar,
                    chlorides, free_sulfur_dioxide, total_sulfur_dioxide, density,
                    pH, sulphates, alcohol, quality
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(insert_query, (
                wine_data.fixed_acidity, wine_data.volatile_acidity, wine_data.citric_acid,
                wine_data.residual_sugar, wine_data.chlorides, wine_data.free_sulfur_dioxide,
                wine_data.total_sulfur_dioxide, wine_data.density, wine_data.pH,
                wine_data.sulphates, wine_data.alcohol, wine_data.quality
            ))
            
            wine_id = cursor.lastrowid
            connection.commit()
            cursor.close()
            
            return {
                "success": True,
                "message": "Vino agregado exitosamente a MySQL",
                "wine_id": wine_id,
                "data": wine_data.dict()
            }
            
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al agregar vino: {str(e)}")

@app.get("/wines", response_model=List[WineResponse])
async def get_wines(limit: int = 100, offset: int = 0):
    """Obtener lista de vinos desde MySQL con paginación"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT * FROM wines 
                ORDER BY wine_id DESC 
                LIMIT %s OFFSET %s
            """
            cursor.execute(query, (limit, offset))
            
            wines = []
            for row in cursor.fetchall():
                # Como no hay created_at en la BD, agregamos una fecha actual
                row['created_at'] = datetime.now().isoformat()
                wines.append(row)
            
            cursor.close()
            return wines
            
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener vinos: {str(e)}")

@app.get("/reports/quality", response_model=QualityReport)
async def get_quality_report():
    """Generar reporte de distribución por calidad desde MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            
            # Obtener total de vinos
            cursor.execute("SELECT COUNT(*) as total FROM wines")
            total = cursor.fetchone()['total']
            
            if total == 0:
                return QualityReport(
                    distribution=[],
                    average=0.0,
                    total=0
                )
            
            # Obtener distribución por rangos de calidad
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN quality BETWEEN 0 AND 4 THEN '0-4'
                        WHEN quality BETWEEN 5 AND 6 THEN '5-6'
                        WHEN quality BETWEEN 7 AND 8 THEN '7-8'
                        WHEN quality BETWEEN 9 AND 10 THEN '9-10'
                    END as quality_range,
                    COUNT(*) as count
                FROM wines 
                GROUP BY quality_range
                ORDER BY quality_range
            """)
            
            distribution = []
            for row in cursor.fetchall():
                if row['quality_range']:
                    percentage = round((row['count'] / total) * 100, 1)
                    distribution.append(QualityDistribution(
                        range=row['quality_range'],
                        count=row['count'],
                        percentage=percentage
                    ))
            
            # Obtener promedio de calidad
            cursor.execute("SELECT AVG(quality) as avg_quality FROM wines")
            avg_quality = cursor.fetchone()['avg_quality'] or 0.0
            
            cursor.close()
            
            return QualityReport(
                distribution=distribution,
                average=round(float(avg_quality), 2),
                total=total
            )
            
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al generar reporte de calidad: {str(e)}")

@app.get("/reports/alcohol", response_model=AlcoholReport)
async def get_alcohol_report():
    """Generar reporte de distribución por contenido alcohólico desde MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            
            # Obtener total de vinos
            cursor.execute("SELECT COUNT(*) as total FROM wines")
            total = cursor.fetchone()['total']
            
            if total == 0:
                return AlcoholReport(
                    ranges=[],
                    average=0.0,
                    total=0
                )
            
            # Obtener distribución por rangos de alcohol
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN alcohol < 10 THEN '8-10%'
                        WHEN alcohol >= 10 AND alcohol < 12 THEN '10-12%'
                        WHEN alcohol >= 12 AND alcohol < 14 THEN '12-14%'
                        WHEN alcohol >= 14 THEN '14%+'
                    END as alcohol_range,
                    COUNT(*) as count
                FROM wines 
                GROUP BY alcohol_range
                ORDER BY alcohol_range
            """)

            ranges = []
            for row in cursor.fetchall():
                if row['alcohol_range']:
                    percentage = round((row['count'] / total) * 100, 1)
                    ranges.append(AlcoholRange(
                        range=row['alcohol_range'],
                        count=row['count'],
                        percentage=percentage
                    ))
            
            # Obtener promedio de alcohol
            cursor.execute("SELECT AVG(alcohol) as avg_alcohol FROM wines")
            avg_alcohol = cursor.fetchone()['avg_alcohol'] or 0.0
            
            cursor.close()
            
            return AlcoholReport(
                ranges=ranges,
                average=round(float(avg_alcohol), 2),
                total=total
            )
            
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al generar reporte de alcohol: {str(e)}")

@app.get("/reports/general", response_model=GeneralReport)
async def get_general_report():
    """Generar reporte general de estadísticas desde MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            
            # Estadísticas generales
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_wines,
                    AVG(quality) as avg_quality,
                    AVG(alcohol) as avg_alcohol,
                    AVG(pH) as avg_ph,
                    SUM(CASE WHEN quality >= 7 THEN 1 ELSE 0 END) as top_quality_count
                FROM wines
            """)
            
            stats = cursor.fetchone()
            cursor.close()
            
            return GeneralReport(
                totalWines=stats['total_wines'] or 0,
                averageQuality=round(float(stats['avg_quality']) if stats['avg_quality'] else 0.0, 2),
                averageAlcohol=round(float(stats['avg_alcohol']) if stats['avg_alcohol'] else 0.0, 2),
                averagePH=round(float(stats['avg_ph']) if stats['avg_ph'] else 0.0, 2),
                topQualityCount=stats['top_quality_count'] or 0,
                lastUpdated=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
            
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al generar reporte general: {str(e)}")

@app.delete("/wines/{wine_id}")
async def delete_wine(wine_id: int):
    """Eliminar un vino específico de MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("DELETE FROM wines WHERE wine_id = %s", (wine_id,))
            
            if cursor.rowcount == 0:
                cursor.close()
                raise HTTPException(status_code=404, detail="Vino no encontrado")
            
            connection.commit()
            cursor.close()
            return {"success": True, "message": "Vino eliminado exitosamente"}
            
    except HTTPException:
        raise
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar vino: {str(e)}")

@app.get("/wines/stats")
async def get_database_stats():
    """Obtener estadísticas rápidas de la base de datos MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                SELECT 
                    COUNT(*) as total,
                    MIN(quality) as min_quality,
                    MAX(quality) as max_quality,
                    AVG(quality) as avg_quality,
                    MIN(alcohol) as min_alcohol,
                    MAX(alcohol) as max_alcohol,
                    AVG(alcohol) as avg_alcohol
                FROM wines
            """)
            
            stats = cursor.fetchone()
            cursor.close()
            
            # Convertir Decimal a float para JSON
            if stats:
                for key, value in stats.items():
                    if value is not None and hasattr(value, '__float__'):
                        stats[key] = float(value)
            
            return stats if stats else {}
            
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")

@app.post("/populate_sample_data")
async def populate_sample_data():
    """Poblar la base de datos MySQL con datos de ejemplo para testing"""
    sample_wines = [
        {
            "fixed_acidity": 7.4, "volatile_acidity": 0.7, "citric_acid": 0.0,
            "residual_sugar": 1.9, "chlorides": 0.076, "free_sulfur_dioxide": 11.0,
            "total_sulfur_dioxide": 34.0, "density": 0.9978, "pH": 3.51,
            "sulphates": 0.56, "alcohol": 9.4, "quality": 5
        },
        {
            "fixed_acidity": 8.1, "volatile_acidity": 0.88, "citric_acid": 0.0,
            "residual_sugar": 2.6, "chlorides": 0.098, "free_sulfur_dioxide": 25.0,
            "total_sulfur_dioxide": 67.0, "density": 0.9968, "pH": 3.2,
            "sulphates": 0.68, "alcohol": 9.8, "quality": 5
        },
        {
            "fixed_acidity": 8.7, "volatile_acidity": 0.27, "citric_acid": 0.41,
            "residual_sugar": 1.45, "chlorides": 0.033, "free_sulfur_dioxide": 5.0,
            "total_sulfur_dioxide": 26.0, "density": 0.9956, "pH": 3.16,
            "sulphates": 0.46, "alcohol": 11.8, "quality": 8
        }
    ]
    
    try:
        added_count = 0
        for wine_data in sample_wines:
            wine = WineData(**wine_data)
            await add_wine(wine)
            added_count += 1
        
        return {
            "success": True,
            "message": f"Se agregaron {added_count} vinos de ejemplo a MySQL",
            "count": added_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al poblar datos: {str(e)}")

# ENDPOINTS DE PREDICCIÓN
@app.post("/predict_all")
def predecir_todos(features: WineFeatures):
    """Predecir calidad del vino usando todos los modelos entrenados"""
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

# Endpoint para verificar conexión a la base de datos
@app.get("/health")
async def health_check():
    """Verificar el estado de la API y la conexión a MySQL"""
    try:
        with get_mysql_connection() as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) as wine_count FROM wines")
            result = cursor.fetchone()
            cursor.close()
            
            return {
                "status": "healthy",
                "database": "MySQL connected",
                "wine_count": result[0],
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "MySQL connection failed",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)