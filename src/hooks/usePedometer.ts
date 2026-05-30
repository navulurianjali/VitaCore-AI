import { useState, useEffect, useRef, useCallback } from "react";

export interface PedometerResult {
  isTracking: boolean;
  permissionGranted: boolean | null;
  sessionSteps: number;
  requestPermission: () => Promise<void>;
  stopTracking: () => void;
}

export function usePedometer(): PedometerResult {
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [sessionSteps, setSessionSteps] = useState(0);

  // Peak detection state
  const lastMagnitude = useRef<number>(0);
  const lastStepTime = useRef<number>(0);
  // Threshold can be adjusted. Usually 1.2 to 2.0 works well for moderate walking.
  const STEP_THRESHOLD = 1.8;
  const TIME_BETWEEN_STEPS_MS = 250; // Minimum time between valid steps (prevents double counting)

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    if (x === null || y === null || z === null) return;

    // Calculate magnitude of the acceleration vector
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    // Normal gravity is ~9.8. We subtract it to isolate physical movement
    const delta = Math.abs(magnitude - 9.8);

    const now = Date.now();

    // Peak detection: if delta crosses threshold and enough time has passed
    if (delta > STEP_THRESHOLD && now - lastStepTime.current > TIME_BETWEEN_STEPS_MS) {
      // Step detected!
      setSessionSteps((prev) => prev + 1);
      lastStepTime.current = now;
    }

    lastMagnitude.current = magnitude;
  }, []);

  const requestPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        if (permissionState === "granted") {
          setPermissionGranted(true);
          startListening();
        } else {
          setPermissionGranted(false);
          alert("Permission to access device motion was denied.");
        }
      } catch (error) {
        console.error("Error requesting DeviceMotion permission:", error);
        setPermissionGranted(false);
      }
    } else {
      // Non-iOS 13+ devices don't require explicit permission in this way
      setPermissionGranted(true);
      startListening();
    }
  };

  const startListening = () => {
    if (typeof window !== "undefined") {
      window.addEventListener("devicemotion", handleMotion, true);
      setIsTracking(true);
      setSessionSteps(0); // reset session steps on start
    }
  };

  const stopTracking = () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("devicemotion", handleMotion, true);
      setIsTracking(false);
    }
  };

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [handleMotion]);

  return {
    isTracking,
    permissionGranted,
    sessionSteps,
    requestPermission,
    stopTracking
  };
}
