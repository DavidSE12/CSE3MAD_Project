import { parachuteCalculate } from "@/lib/parachute";
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

  // for counting correct/incorrect answers
  const [fieldResults, setFieldResults] = useState({
    velocity: null as boolean | null,
    acceleration: null as boolean | null,
    netForce: null as boolean | null,
    dragForce: null as boolean | null,
  });

  // points for correct answers
  const [pts, setPts] = useState(0);

  // correct answers
  const [correct, setCorrect] = useState(0);

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
          onPress={() => {
            validate();
            setStep("RESULT");
          }}
        />
      </SafeAreaView>
    );
  }

  const result = () => {
    const t = parseFloat(input.time);
    const d = parseFloat(input.distance);
    const m = parseFloat(input.mass);

    return parachuteCalculate({ time: t, distance: d, mass: m });
  };

  function validate() {
    const t = parseFloat(input.time);
    const d = parseFloat(input.distance);
    const m = parseFloat(input.mass);

    const result = parachuteCalculate({ time: t, distance: d, mass: m });

    const entered = {
      velocity: parseFloat(userCalculation.velocity),
      acceleration: parseFloat(userCalculation.acceleration),
      netForce: parseFloat(userCalculation.netForce),
      dragForce: parseFloat(userCalculation.dragForce),
    };

    // accept small rounding differences
    const EPS = 0.05;
    // function to check if answer is correct or not
    const nearlyEqual = (a: number, b: number) => Math.abs(a - b) <= EPS;

    const validationMap = {
      velocity: nearlyEqual(
        parseFloat(userCalculation.velocity),
        result.velocity,
      ),
      acceleration: nearlyEqual(
        parseFloat(userCalculation.acceleration),
        result.acceleration,
      ),
      netForce: nearlyEqual(
        parseFloat(userCalculation.netForce),
        result.netForce,
      ),
      dragForce: nearlyEqual(
        parseFloat(userCalculation.dragForce),
        result.dragForce,
      ),
    };

    setFieldResults(validationMap);

    const correctCount = Object.values(validationMap).filter(
      (f) => f === true,
    ).length;
    setCorrect(correctCount);
  }

  if (step === "RESULT") {
    const correctValues = result();
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Score: {correct} / 4</Text>

        <View style={styles.summaryBox}>
          <Text>
            Velocity: {userCalculation.velocity} (Correct:{" "}
            {correctValues.velocity.toFixed(2)})
          </Text>
          <Text>
            Acceleration: {userCalculation.acceleration} (Correct:{" "}
            {correctValues.acceleration.toFixed(2)})
          </Text>
          <Text>
            Net Force: {userCalculation.velocity} (Correct:{" "}
            {correctValues.netForce.toFixed(2)})
          </Text>
          <Text>
            Drag Force: {userCalculation.velocity} (Correct:{" "}
            {correctValues.dragForce.toFixed(2)})
          </Text>
        </View>

        {/* for debugging  */}
        <Button
          title="Try Again"
          onPress={() => {
            setFieldResults({
              velocity: null,
              acceleration: null,
              netForce: null,
              dragForce: null,
            });
            setStep("INPUT");
          }}
        />
      </SafeAreaView>
    );
  }
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
