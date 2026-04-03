import Instruction from "../../components/instruction";
import { router } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

const instructionData = {
  instruction:
    "Measure the voltage across the resistor using a multimeter and record the value. Ensure the circuit is powered before taking the reading.",

  tools: [
    "Multimeter",
    "Resistor",
    "Breadboard",
    "Connecting wires",
    "Power supply",
  ],

  diagramImage:
    "https://upload.wikimedia.org/wikipedia/commons/6/6a/Ohm%27s_Law_Pie_Chart.svg",

  formulas: ["V = IR", "P = VI", "R = V / I"],
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Instruction
        instruction={instructionData.instruction}
        tools={instructionData.tools}
        diagramImage={instructionData.diagramImage}
        formulas={instructionData.formulas}
      />
      <Button title="Record" onPress={() => router.push("/recordVideo")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: "#F0F4F8",
  },
  button: {
    backgroundColor: "#1A2F5A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
