import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// for rendering the corresponding stage
type Step = "INPUT" | "CALCULATE" | "RESULT";

export default function CalculationFlow() {
  // user input of experiment units
  const [input, setInput] = useState({ mass: "", time: "", distance: "" });

  // stage of flow, starting with entering parameters
  const [step, setStep] = useState("INPUT");

  const [userCalculation, setUserCalculation] = useState({
    velocity: Number,
    acceleration: Number,
    netForce: Number,
    dragForce: Number,
  });
  const [isCorrect, setIsCorrect] = useState(false);

  // INPUT step: data entry
  if (step === "INPUT") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <Text>Enter Experiment Parameters</Text>
          <Text>
            Based on your experiment set up, please enter the following
            parameters:{" "}
          </Text>
          <Text style={styles.label}>Time (s)</Text>
          <TextInput
            style={styles.input}
            placeholder="t = "
            onChangeText={(t) => setInput({ ...input, time: t })}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Mass (kg)</Text>

          <TextInput
            style={styles.input}
            placeholder="m ="
            onChangeText={(t) => setInput({ ...input, mass: t })}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Distance (m)</Text>

          <TextInput
            style={styles.input}
            placeholder="d ="
            onChangeText={(t) => setInput({ ...input, distance: t })}
            keyboardType="numeric"
          />
          <Button title="Next step" onPress={() => setStep("CALCULATE")} />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  label: {},
});
