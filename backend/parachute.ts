// Units: time in seconds, height in meters, weight in kilograms

interface ParachuteDataPoint {
  time: number;    // seconds since jump
  distance: number;  // meters above ground
  mass: number;  // kg (jumper + equipment)
}

let currentData: ParachuteDataPoint = {
  time: 0,
  distance: 0,
  mass: 0,
};

const dataHistory: ParachuteDataPoint[] = [];

interface ParachuteResults {
  velocity: number; // m/s
  acceleration: number; // m/s²
  netForce: number; // Newtons
  dragForce: number; // Newtons
}


const G = 9.8; // (m/s²)

function calculateVelocity(distance: number, time: number): number {
    return distance / time; // m/s
}

function calculateAcceleration(velocity: number, time: number): number {
    return velocity / time; // m/s²
}

function calculateNetForce (mass: number, a: number) : number{
    return mass * a; // Newtons
}

function calculateDragForce(netForce: number, mass: number): number {
    const weight = mass * G; // Newtons
    return weight - netForce; // Newtons
}


export function parachuteCalculate(data: ParachuteDataPoint): ParachuteResults {
  const velocity = calculateVelocity(data.distance, data.time);
  const acceleration = calculateAcceleration(velocity, data.time);
  const netForce = calculateNetForce(data.mass, acceleration);
  const dragForce = calculateDragForce(netForce, data.mass);
    return {
        velocity,
        acceleration,
        netForce,
        dragForce
    }

}

// export {
// //   ParachuteDataPoint,
//   currentData,
//   dataHistory,
//     ParachuteResults,
// };


const testData: ParachuteDataPoint = {
    time: 10, // seconds
    distance: 100, // meters
    mass: 80, // kg
};

const results = parachuteCalculate(testData);
console.log(results);