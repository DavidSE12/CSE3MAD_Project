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
    velocity: "",
    acceleration: "",
    netForce: "",
    dragForce: "",
  });
  const [isCorrect, setIsCorrect] = useState(false);

  // INPUT step: data entry
  if (step === "INPUT") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.header}>Step 1: Enter Experiment Parameters</Text>
          <Text style={styles.text}>
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

  // Step 2: Calculate
  if (step === "CALCULATE") {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Step 2: Calculate</Text>
        <Text style={styles.text}>
          Please calculate these units and enter your answers. Click on
          Instruction to view the Formulas
        </Text>
        <SafeAreaView style={styles.summaryBox}>
          <Text>
            Mass: {input.mass}kg | Dist: {input.distance}m | Time: {input.time}s
          </Text>
        </SafeAreaView>

        <Text style={styles.header}>Velocity (m/s)</Text>
        <TextInput
          placeholder="v = "
          style={styles.input}
          onChangeText={(t) =>
            setUserCalculation({ ...userCalculation, velocity: t })
          }
          keyboardType="numeric"
        />

        <Text style={styles.header}>Acceleration (m/s²)</Text>
        <TextInput
          placeholder="a = "
          style={styles.input}
          onChangeText={(t) =>
            setUserCalculation({ ...userCalculation, acceleration: t })
          }
          keyboardType="numeric"
        />

        <Text style={styles.header}>Net Force (N)</Text>
        <TextInput
          placeholder=""
          style={styles.input}
          onChangeText={(t) =>
            setUserCalculation({ ...userCalculation, netForce: t })
          }
          keyboardType="numeric"
        />

        <Text style={styles.header}>Drag Force (N)</Text>
        <TextInput
          placeholder=""
          style={styles.input}
          onChangeText={(t) =>
            setUserCalculation({ ...userCalculation, dragForce: t })
          }
          keyboardType="numeric"
        />

        <Button
          title="Submit & Check your answers"
          onPress={() => setStep("RESULT")}
        />
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
  text: {},
  header: {},
  summaryBox: {},
});
