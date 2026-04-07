import { Accelerometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

// low-pass filter
const EMA_ALPHA = 0.05;

// min of seconds between counted breaths
const MIN_BREATH_INTERVAL = 1500; // (ms) = 1.5s

// update frequency
const UPDATE_INTERVAL = 50; // (ms)

// mimn amplitude required for a peak to be real breathing, rejecting large body movements
const MOTION_THRESHOLD = 0.002;

// n.o recent breath intervals used to compute bpm
const BPM_WINDOW = 3;

export default function useBreathTracker() {
  // raw accelerometer
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });

  // breaths per minute
  const [bpm, setBpm] = useState(0);

  // ref of last detected breath peak
  const lastPeakTime = useRef<number | null>(null);

  // ref of recent breath intervals
  const intervals = useRef<number[]>([]);

  // ref of previous slope, indicating a change of direction(-1: falling; 1: rising)
  const prevSlope = useRef(0);

  // ref of previous filtered magnitude
  const prevFilteredMag = useRef(0);

  // ref of accelerometer
  const subscription = useRef<ReturnType<
    typeof Accelerometer.addListener
  > | null>(null);

  const handleData = ({ x, y, z }: { x: number; y: number; z: number }) => {
    // persist
    setData({ x, y, z });

    // 1. compute vector magnitude - orientation independent, using 3 axis
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    // 2. filter using EMA - exponential moving average
    // EMA_t = α * raw_t + (1 − α) * EMA_{t−1}
    const filteredMag =
      EMA_ALPHA * magnitude + (1 - EMA_ALPHA) * prevFilteredMag.current;

    // 3. detect signal slope
    const rawSlope = filteredMag - prevFilteredMag.current;

    const currentSlope =
      rawSlope > 0 ? 1 : rawSlope < 0 ? -1 : prevSlope.current;

    // 4. detect real preak
    const isPeak =
      currentSlope === -1 &&
      prevSlope.current === 1 &&
      Math.abs(rawSlope) > MOTION_THRESHOLD;

    if (isPeak) {
      console.log("is peak");

      const now = Date.now();

      // 5. reject peaks that rise too quickly, likely caused by noises instead
      const timeSinceLast =
        lastPeakTime.current !== null ? now - lastPeakTime.current : Infinity;

      if (timeSinceLast >= MIN_BREATH_INTERVAL) {
        // 6. compute interval between breaths
        if (lastPeakTime.current !== null) {
          const interval = timeSinceLast;
          // rolling window of intervals
          intervals.current = [
            ...intervals.current.slice(-(BPM_WINDOW - 1)),
            interval,
          ];

          // 7. calculate bpm
          if (intervals.current.length >= 2) {
            const meanInterval =
              intervals.current.reduce((a, b) => a + b, 0) /
              intervals.current.length;

            const calculatedBpm = 60000 / meanInterval;
            setBpm(Math.round(calculatedBpm));
          }
        }
        // store timestamp of this peak
        lastPeakTime.current = now;
      }
    }
    prevFilteredMag.current = filteredMag;
    prevSlope.current = currentSlope;
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

    // on mount - subscribe
    subscription.current = Accelerometer.addListener(handleData);

    // cleanup when unmount
    return () => {
      subscription.current?.remove();
      subscription.current = null;
    };
  }, []);

  return { bpm, x, y, z };
}
