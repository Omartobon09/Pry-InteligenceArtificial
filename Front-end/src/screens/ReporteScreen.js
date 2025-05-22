import React, { useState } from "react";
import { Platform } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../style/styles";

const ReportsScreen = () => {
  const [criterion1, setCriterion1] = useState("");
  const [criterion2, setCriterion2] = useState("");
  const [criterion3, setCriterion3] = useState("");
  const [reportResults, setReportResults] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toLocaleDateString();
      setSelectedDate(formattedDate);
      setCriterion2(formattedDate);
    }
  };

  const handleGenerateReport = () => {
    const simulatedResults = [
      {
        name: "Malbec",
        type: "Tinto",
        date: "01/04/2024",
        notes: "Perfecto con asado.",
      },
      {
        name: "Sauvignon Blanc",
        type: "Blanco",
        date: "15/03/2024",
        notes: "Refrescante, ideal para la tarde.",
      },
    ];
    setReportResults(simulatedResults);
  };

  const exportToExcel = async () => {
    if (reportResults.length === 0) {
      Alert.alert("No hay datos", "Genera el reporte antes de exportar.");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(reportResults);
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    const uri = FileSystem.cacheDirectory + "reporte_vinos.xlsx";
    await FileSystem.writeAsStringAsync(uri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Compartir reporte Excel",
        UTI: "com.microsoft.excel.xlsx",
      });
    } else {
      Alert.alert(
        "No se puede compartir",
        "Tu dispositivo no permite compartir archivos."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containers_p}>
      <Text style={[styles.welcome, { marginBottom: 20 }]}>
        📊 Reportes por Criterios
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Criterio 1 (ej: tipo de vino)"
        value={criterion1}
        onChangeText={setCriterion1}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Seleccionar fecha"
          value={selectedDate || ""}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date() ? new Date(selectedDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Criterio 3 (ej: nombre)"
        value={criterion3}
        onChangeText={setCriterion3}
      />

      <TouchableOpacity
        style={styles.chatSendButton}
        onPress={handleGenerateReport}
      >
        <Text style={styles.chatSendText}>Generar reporte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.chatSendButton,
          { backgroundColor: "#4CAF50", marginTop: 10 },
        ]}
        onPress={exportToExcel}
      >
        <Text style={styles.chatSendText}>📁 Exportar a Excel</Text>
      </TouchableOpacity>

      {reportResults.length > 0 && (
        <View style={{ marginTop: 30 }}>
          {reportResults.map((item, index) => (
            <View key={index} style={styles.predictionCard}>
              <Text style={styles.predictionType}>🍷 {item.name}</Text>
              <Text style={styles.predictionDescription}>
                Tipo: {item.type}
              </Text>
              <Text style={styles.predictionDescription}>
                Fecha: {item.date}
              </Text>
              <Text style={styles.predictionDescription}>
                Notas: {item.notes}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ReportsScreen;
