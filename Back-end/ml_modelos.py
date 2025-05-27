# ml_modelos.py

import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score

# 1. Cargar el dataset
data = pd.read_csv('winequality-red.csv')  

print("📊 Primeras filas del dataset:")
print(data.head())

# 2. Separar variables predictoras (X) y objetivo (y)
X = data.drop('quality', axis=1)
y = data['quality']

# 3. Escalar las variables para mejorar rendimiento
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Dividir los datos en entrenamiento y prueba (80% - 20%)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

print(f"\n✅ Datos cargados y divididos correctamente:")
print(f"Entrenamiento: {X_train.shape}, Prueba: {X_test.shape}")

# 5. Definir los modelos a comparar
modelos = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest": RandomForestClassifier(n_estimators=100),
    "Support Vector Machine": SVC()
}

# 6. Diccionario para almacenar resultados
resultados = {}

# 7. Entrenar y evaluar cada modelo
for nombre, modelo in modelos.items():
    print(f"\n🔧 Entrenando modelo: {nombre}")
    modelo.fit(X_train, y_train)
    y_pred = modelo.predict(X_test)
    
    # Evaluación
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    
    resultados[nombre] = {
        "accuracy": accuracy,
        "precision": report["weighted avg"]["precision"],
        "recall": report["weighted avg"]["recall"],
        "f1-score": report["weighted avg"]["f1-score"]
    }

# 8. Mostrar tabla comparativa
print("\n📈 COMPARACIÓN DE MODELOS:")
for modelo, metricas in resultados.items():
    print(f"\n📌 Modelo: {modelo}")
    for metrica, valor in metricas.items():
        print(f"{metrica.capitalize()}: {valor:.4f}")

# 9. Guardar los modelos y el scaler
joblib.dump(modelos["Random Forest"], "modelo_random_forest.pkl")
joblib.dump(modelos["Logistic Regression"], "modelo_logistic_regression.pkl")
joblib.dump(modelos["Support Vector Machine"], "modelo_svm.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\n💾 Todos los modelos y el scaler fueron guardados exitosamente.")
