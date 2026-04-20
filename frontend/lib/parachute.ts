// Units: time in seconds, distance in meters, mass in kilograms

export interface ParachuteDataPoint {
  time: number;
  distance: number;
  mass: number;
}

export interface ParachuteResults {
  velocity: number;      // m/s
  acceleration: number;  // m/s²
  netForce: number;      // Newtons
  dragForce: number;     // Newtons
}

const G = 9.8; // m/s²

function calculateVelocity(distance: number, time: number): number {
  return distance / time;
}

function calculateAcceleration(velocity: number, time: number): number {
  return velocity / time;
}

function calculateNetForce(mass: number, a: number): number {
  return mass * a;
}

function calculateDragForce(netForce: number, mass: number): number {
  const weight = mass * G;
  return weight - netForce;
}

export function parachuteCalculate(data: ParachuteDataPoint): ParachuteResults {
  const velocity = calculateVelocity(data.distance, data.time);
  const acceleration = calculateAcceleration(velocity, data.time);
  const netForce = calculateNetForce(data.mass, acceleration);
  const dragForce = calculateDragForce(netForce, data.mass);
  return { velocity, acceleration, netForce, dragForce };
}