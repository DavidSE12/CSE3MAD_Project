import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { Text } from "react-native";

import Instruction from "@/components/Instruction";
import { Link } from "expo-router";
import { View } from "react-native";
import ParachuteScreen from "../parachute/calculate";

const Tab = createBottomTabNavigator();

// Placeholder screens for other tabs (you can create these later)
function LeaderboardScreen() {
  return <Text>Leaderboard</Text>;
}

function TeamScreen() {
  return <Text>Team</Text>;
}

function SettingScreen() {
  return <Text>Settings</Text>;
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="leaderboard"
        component={LeaderboardScreen}
        options={{
          title: "Leaderboard",
          headerTitle: "Leaderboard",
          tabBarLabel: "Leaderboard",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="team"
        component={TeamScreen}
        options={{
          title: "Team",
          headerTitle: "Team",
          tabBarLabel: "Team",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="setting"
        component={SettingScreen}
        options={{
          title: "Settings",
          headerTitle: "Settings",
          tabBarLabel: "Setting",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
