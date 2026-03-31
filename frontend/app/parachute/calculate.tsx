import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { parachuteCalculate, type ParachuteResults } from '@/lib/parachute';

export default function CalculateScreen() {
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [mass, setMass] = useState('');
  const [results, setResults] = useState<ParachuteResults | null>(null);

  function handleCalculate() {
    const t = parseFloat(time);
    const d = parseFloat(distance);
    const m = parseFloat(mass);

    if (isNaN(t) || isNaN(d) || isNaN(m)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for all fields.');
      return;
    }
    if (t <= 0) {
      Alert.alert('Invalid Input', 'Time must be greater than 0.');
      return;
    }

    const result = parachuteCalculate({ time: t, distance: d, mass: m });
    setResults(result);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🧮</Text>
        <Text style={styles.headerTitle}>Parachute Calculator</Text>
        <Text style={styles.headerSub}>Enter your experiment data below</Text>
      </View>

      {/* Inputs */}
      <View style={styles.card}>
        <InputField
          label="Time"
          unit="seconds"
          value={time}
          onChangeText={setTime}
          placeholder="e.g. 10"
        />
        <InputField
          label="Distance fallen"
          unit="meters"
          value={distance}
          onChangeText={setDistance}
          placeholder="e.g. 100"
        />
        <InputField
          label="Mass"
          unit="kg"
          value={mass}
          onChangeText={setMass}
          placeholder="e.g. 80"
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {results && (
        <View style={styles.card}>
          <Text style={styles.resultsTitle}>Results</Text>
          <ResultRow label="Velocity" value={results.velocity} unit="m/s" color="#4C9BE8" />
          <ResultRow label="Acceleration" value={results.acceleration} unit="m/s²" color="#7C5CBF" />
          <ResultRow label="Net Force" value={results.netForce} unit="N" color="#E87C4C" />
          <ResultRow label="Drag Force" value={results.dragForce} unit="N" color="#4CBF7C" />
        </View>
      )}

    </ScrollView>
  );
}

function InputField({
  label,
  unit,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  unit: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} <Text style={styles.unit}>({unit})</Text>
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0AEC0"
        keyboardType="numeric"
      />
    </View>
  );
}

function ResultRow({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <View style={styles.resultRow}>
      <View style={[styles.resultAccent, { backgroundColor: color }]} />
      <View style={styles.resultContent}>
        <Text style={styles.resultLabel}>{label}</Text>
        <Text style={[styles.resultValue, { color }]}>
          {value.toFixed(4)} <Text style={styles.resultUnit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },

  // Header
  header: {
    alignItems: 'center',
    backgroundColor: '#1A2F5A',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerEmoji: { fontSize: 44, marginBottom: 10 },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 13,
    color: '#A8C0E8',
    marginTop: 6,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // Input
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2F5A',
    marginBottom: 6,
  },
  unit: {
    fontWeight: '400',
    color: '#718096',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1A202C',
    backgroundColor: '#F7FAFC',
  },

  // Button
  button: {
    backgroundColor: '#1A2F5A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Results
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2F5A',
    marginBottom: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  resultAccent: {
    width: 5,
    alignSelf: 'stretch',
  },
  resultContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  resultUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#718096',
  },
});
