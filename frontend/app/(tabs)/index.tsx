import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Instruction from '../parachute/instruction';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Instruction
        tools="Parachute, Weights, Stopwatch, Measuring Tape"
        diagramImage="https://i.imgur.com/3X9Z5sP.png"
        formula="Drag Force = 0.5 × Air Density × Velocity² × Drag Coefficient × Area"
        instruction="1. Set up the parachute and attach weights to it.\n2. Drop the parachute from a fixed height and time how long it takes to reach the ground.\n3. Measure the distance fallen and calculate the velocity.\n4. Use the formula to calculate the drag force acting on the parachute."
      />
      <View style={styles.footer}>
        <Link href="/parachute/calculate" style={styles.button}>
          <Text style={styles.buttonText}>Start Calculating →</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: '#F0F4F8',
  },
  button: {
    backgroundColor: '#1A2F5A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
