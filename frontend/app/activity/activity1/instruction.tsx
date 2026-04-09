import Instruction from "@/src/components/Instruction";
import { useRouter } from "expo-router";
import React from "react";
import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function InstructionScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Instruction
        instruction={instructionData.instruction}
        tools={instructionData.tools}
        diagramImage={instructionData.diagramImage}
        formulas={instructionData.formulas}
      />
      <Button
        title="Start uploading/recording your experiment"
        onPress={() => router.push("/activity/activity1/recordVideo")}
      />
    </SafeAreaView>
  );
}
