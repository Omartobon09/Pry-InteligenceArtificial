from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import mysql.connector

# Datos de conexión local
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'wine_quality_db'
}

def query_db(sql):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute(sql)
    result = cursor.fetchall()
    conn.close()
    return result

class ActionMejorCalidad(Action):
    def name(self): return "action_mejor_calidad"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT * FROM wines ORDER BY quality DESC LIMIT 1")
        if result:
            vino = result[0]
            dispatcher.utter_message(text=f"El vino con mejor calidad tiene {vino['alcohol']}° de alcohol y calidad {vino['quality']}.")
        return []

class ActionPeorCalidad(Action):
    def name(self): return "action_peor_calidad"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT * FROM wines ORDER BY quality ASC LIMIT 1")
        if result:
            vino = result[0]
            dispatcher.utter_message(text=f"El vino con peor calidad tiene {vino['alcohol']}° de alcohol y calidad {vino['quality']}.")
        return []

class ActionVinoPorId(Action):
    def name(self): return "action_vino_por_id"
    def run(self, dispatcher, tracker, domain):
        texto = tracker.latest_message.get("text")
        id = [int(s) for s in texto.split() if s.isdigit()]
        if not id:
            dispatcher.utter_message(text="Por favor dime el ID del vino.")
            return []
        result = query_db(f"SELECT * FROM wines WHERE wine_id = {id[0]} LIMIT 1")
        if result:
            vino = result[0]
            dispatcher.utter_message(text=f"Vino ID {id[0]}: alcohol {vino['alcohol']}, pH {vino['pH']}, calidad {vino['quality']}.")
        else:
            dispatcher.utter_message(text="No encontré un vino con ese ID.")
        return []

class ActionVinosConMasAlcohol(Action):
    def name(self): return "action_vinos_con_mas_alcohol"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, alcohol, quality FROM wines ORDER BY alcohol DESC LIMIT 3")
        mensaje = "Vinos con más alcohol:\n" + "\n".join(
            [f"ID {r['wine_id']}: {r['alcohol']}°, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionCantidadPorCalidad(Action):
    def name(self): return "action_cantidad_por_calidad"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT quality, COUNT(*) AS cantidad FROM wines GROUP BY quality")
        mensaje = "Cantidad de vinos por calidad:\n" + "\n".join(
            [f"Calidad {r['quality']}: {r['cantidad']} vinos" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionPromedioAlcohol(Action):
    def name(self): return "action_promedio_alcohol"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT AVG(alcohol) as promedio FROM wines")
        promedio = round(result[0]['promedio'], 2)
        dispatcher.utter_message(text=f"El contenido promedio de alcohol es {promedio}°.")
        return []

class ActionVinosPorPH(Action):
    def name(self): return "action_vinos_por_ph"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, pH, quality FROM wines WHERE pH > 3.5 LIMIT 5")
        mensaje = "Vinos con pH mayor a 3.5:\n" + "\n".join(
            [f"ID {r['wine_id']}: pH {r['pH']}, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosConPocoAzucar(Action):
    def name(self): return "action_vinos_con_poco_azucar"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, residual_sugar, quality FROM wines WHERE residual_sugar < 2 LIMIT 5")
        mensaje = "Vinos con menos de 2 de azúcar residual:\n" + "\n".join(
            [f"ID {r['wine_id']}: azúcar {r['residual_sugar']}, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosPorAcidez(Action):
    def name(self): return "action_vinos_por_acidez"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, volatile_acidity, quality FROM wines WHERE volatile_acidity > 0.6 LIMIT 5")
        mensaje = "Vinos con alta acidez volátil:\n" + "\n".join(
            [f"ID {r['wine_id']}: acidez {r['volatile_acidity']}, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionDistribucionCalidad(Action):
    def name(self): return "action_distribucion_calidad"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT quality, COUNT(*) as total FROM wines GROUP BY quality")
        mensaje = "Distribución de calidad:\n" + "\n".join(
            [f"Calidad {r['quality']}: {r['total']} vinos" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosPorSulphates(Action):
    def name(self): return "action_vinos_por_sulphates"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, sulphates, quality FROM wines WHERE sulphates > 0.6 LIMIT 5")
        mensaje = "Vinos con sulphates > 0.6:\n" + "\n".join(
            [f"ID {r['wine_id']}: sulphates {r['sulphates']}, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosIntermedios(Action):
    def name(self): return "action_vinos_intermedios"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, quality FROM wines WHERE quality = 5 OR quality = 6 LIMIT 5")
        mensaje = "Vinos de calidad intermedia:\n" + "\n".join(
            [f"ID {r['wine_id']}, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionContarTotalVinos(Action):
    def name(self): return "action_contar_total_vinos"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT COUNT(*) as total FROM wines")
        dispatcher.utter_message(text=f"Hay un total de {result[0]['total']} vinos en la base de datos.")
        return []

class ActionVinosMuyDensos(Action):
    def name(self): return "action_vinos_muy_densos"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, density FROM wines WHERE density > 1 LIMIT 5")
        mensaje = "Vinos con densidad > 1:\n" + "\n".join(
            [f"ID {r['wine_id']}, densidad {r['density']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosPorSulfuroLibre(Action):
    def name(self): return "action_vinos_por_sulfuro_libre"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, free_sulfur_dioxide FROM wines ORDER BY free_sulfur_dioxide DESC LIMIT 5")
        mensaje = "Top vinos por dióxido de azufre libre:\n" + "\n".join(
            [f"ID {r['wine_id']}: {r['free_sulfur_dioxide']} ppm" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionConsultaVinoNombre(Action):
    def name(self): return "action_consulta_vino_nombre"
    def run(self, dispatcher, tracker, domain):
        return ActionVinoPorId().run(dispatcher, tracker, domain)

class ActionMaximoPH(Action):
    def name(self): return "action_maximo_ph"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT MAX(pH) as max_ph FROM wines")
        dispatcher.utter_message(text=f"El pH máximo registrado es {result[0]['max_ph']}.")
        return []

class ActionVinosBajosEnCloruros(Action):
    def name(self): return "action_vinos_bajos_en_cloruros"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, chlorides FROM wines WHERE chlorides < 0.05 LIMIT 5")
        mensaje = "Vinos con cloruros < 0.05:\n" + "\n".join(
            [f"ID {r['wine_id']}, cloruros {r['chlorides']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosConCitricos(Action):
    def name(self): return "action_vinos_con_citricos"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, citric_acid FROM wines WHERE citric_acid > 0.4 LIMIT 5")
        mensaje = "Vinos con citric acid > 0.4:\n" + "\n".join(
            [f"ID {r['wine_id']}, citric acid {r['citric_acid']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosConDioxidoTotal(Action):
    def name(self): return "action_vinos_con_dioxido_total"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, total_sulfur_dioxide FROM wines ORDER BY total_sulfur_dioxide DESC LIMIT 5")
        mensaje = "Vinos con más dióxido total:\n" + "\n".join(
            [f"ID {r['wine_id']}, total SO₂: {r['total_sulfur_dioxide']} ppm" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionVinosConPHYCalidad(Action):
    def name(self): return "action_vinos_con_ph_y_calidad"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT wine_id, pH, quality FROM wines WHERE pH > 3.3 AND quality >= 7 LIMIT 5")
        mensaje = "Vinos con pH > 3.3 y calidad >= 7:\n" + "\n".join(
            [f"ID {r['wine_id']}: pH {r['pH']}, calidad {r['quality']}" for r in result])
        dispatcher.utter_message(text=mensaje)
        return []

class ActionRecomendarVino(Action):
    def name(self): return "action_recomendar_vino"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT * FROM wines WHERE quality >= 8 ORDER BY RAND() LIMIT 1")
        vino = result[0]
        dispatcher.utter_message(
            text=f"Te recomiendo el vino ID {vino['wine_id']} con calidad {vino['quality']} y alcohol {vino['alcohol']}°.")
        return []

class ActionCalidadPorAlcohol(Action):
    def name(self): return "action_calidad_por_alcohol"
    def run(self, dispatcher, tracker, domain):
        result = query_db("SELECT ROUND(AVG(quality),2) as calidad_prom, ROUND(AVG(alcohol),2) as alcohol_prom FROM wines")
        dispatcher.utter_message(
            text=f"En promedio, los vinos tienen {result[0]['alcohol_prom']}° de alcohol y calidad {result[0]['calidad_prom']}.")
        return []