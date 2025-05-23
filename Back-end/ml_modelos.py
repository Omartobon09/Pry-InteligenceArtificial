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

data = pd.read_csv('winequality-red.csv')  

print("📊 Primeras filas del dataset:")
print(data.head())


X = data.drop('quality', axis=1)
y = data['quality']

# 4. Escalar las variables (mejor rendimiento para algunos modelos)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 5. Dividir los datos en entrenamiento y prueba (80% - 20%)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

print(f"\n✅ Datos cargados y divididos correctamente:")
print(f"Entrenamiento: {X_train.shape}, Prueba: {X_test.shape}")

# 6. Definir los modelos a comparar
modelos = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest": RandomForestClassifier(n_estimators=100),
    "Support Vector Machine": SVC()
}

# 7. Diccionario para almacenar resultados
resultados = {}

# 8. Entrenar, predecir y evaluar cada modelo
for nombre, modelo in modelos.items():
    print(f"\n🔧 Entrenando modelo: {nombre}")
    modelo.fit(X_train, y_train)
    y_pred = modelo.predict(X_test)
    
    # Métricas de evaluación
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    
    resultados[nombre] = {
        "accuracy": accuracy,
        "precision": report["weighted avg"]["precision"],
        "recall": report["weighted avg"]["recall"],
        "f1-score": report["weighted avg"]["f1-score"]
    }

# 9. Mostrar tabla comparativa
print("\n📈 COMPARACIÓN DE MODELOS:")
for modelo, metricas in resultados.items():
    print(f"\n📌 Modelo: {modelo}")
    for metrica, valor in metricas.items():
        print(f"{metrica.capitalize()}: {valor:.4f}")

# 10. Guardar el modelo y el scaler
mejor_modelo = modelos["Random Forest"]
joblib.dump(mejor_modelo, "modelo_random_forest.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\n💾 Modelo y scaler guardados exitosamente como 'modelo_random_forest.pkl' y 'scaler.pkl'")
