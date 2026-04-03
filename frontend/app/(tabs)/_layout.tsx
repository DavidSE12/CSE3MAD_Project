import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";

import Instruction from "../../components/instruction";
import { Link } from "expo-router";
import { View } from "react-native";
import ParachuteScreen from "../parachute/calculate";

const Tab = createBottomTabNavigator();

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

function HomeScreen() {
  return (
    <View>
      <Instruction
        instruction={instructionData.instruction}
        tools={instructionData.tools}
        diagramImage={instructionData.diagramImage}
        formulas={instructionData.formulas}
      />
      <Link href="/recordVideo">Record video</Link>
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: "Home",
          headerTitle: "Instructions",
        }}
      />
      <Tab.Screen
        name="parachute"
        component={ParachuteScreen}
        options={{
          title: "Parachute",
          headerTitle: "Calculate",
        }}
      />
    </Tab.Navigator>
  );
}
