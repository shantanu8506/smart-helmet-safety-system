/*
 * =========================================================================================
 * Project: AI-Based Smart Helmet for Accident Detection and Risk Prevention
 * Target Microcontroller: Arduino Uno (ATmega328P)
 * Sensors: 
 *   - InvenSense MPU6050 6-Axis MotionTracking (Accelerometer & Gyroscope) via I2C
 *   - u-blox NEO-6M / GY-NEO6MV2 GPS Receiver Module via SoftwareSerial
 * Actuators & Indicators:
 *   - Green LED  (Pin 9)  : Normal / Safe State Indicator
 *   - Yellow LED (Pin 10) : Elevated Risk Warning Indicator
 *   - Red LED    (Pin 11) : Critical Accident Emergency Indicator
 *   - Active Buzzer (Pin 8): Acoustic Warning / Emergency Siren
 * Input:
 *   - Push Button (Pin 7) : False-Alarm Reset / Manual Emergency Dismissal
 * Communication:
 *   - USB Serial Gateway: 9600 Baud JSON Telemetry Stream to Node.js / React Dashboard
 * =========================================================================================
 */

#include <Wire.h>
#include <SoftwareSerial.h>
#include <TinyGPSPlus.h>

// ================= PIN DEFINITIONS =================
#define GREEN_LED   9   // Safe / Normal state
#define YELLOW_LED  10  // Elevated risk warning
#define RED_LED     11  // Critical accident alarm

#define BUZZER      8   // Acoustic alarm
#define BUTTON      7   // Push button (Internal Pullup, Active LOW)

// GPS Module Serial Pins
#define GPS_RX      4   // Arduino RX (Connects to GPS TX)
#define GPS_TX      3   // Arduino TX (Connects to GPS RX)

// MPU6050 Default I2C Address (0x68 when AD0 is GND, 0x69 when AD0 is HIGH)
#define MPU_ADDR    0x68

// ================= HARDWARE INSTANCES =================
SoftwareSerial gpsSerial(GPS_RX, GPS_TX);
TinyGPSPlus gps;

// ================= KINEMATIC VARIABLES =================
float AccX, AccY, AccZ;
float GyroX, GyroY, GyroZ;

float totalAcceleration = 1.0; // Vector magnitude in g (baseline ~1.0g at rest)
float tilt = 0.0;              // Tilt angle in degrees (-180 to +180)
float rotation = 0.0;          // Total rotational velocity in deg/s

// Finite State Machine Status
bool accidentLatched = false;
String currentStatus = "SAFE";

// Non-blocking telemetry timer
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 250; // Emit JSON 4 times per second (4 Hz)

// ================= SETUP =================
void setup() {
  // Initialize Serial Monitor / USB communication for Dashboard Gateway
  Serial.begin(9600);
  
  // Initialize GPS Serial Communication
  gpsSerial.begin(9600);

  // Configure Output Pins for Actuators
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // Configure Button Input with Internal Pull-up Resistor
  pinMode(BUTTON, INPUT_PULLUP);

  // Initialize I2C Bus Communication
  Wire.begin();

  // Wake up MPU6050 by clearing Sleep Mode bit (Register 0x6B = 0)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission(true);

  // Configure Accelerometer Sensitivity to +/- 2g (Sensitivity Scale Factor: 16384 LSB/g)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x1C);
  Wire.write(0x00);
  Wire.endTransmission(true);

  // Configure Gyroscope Sensitivity to +/- 250 deg/s (Sensitivity Scale Factor: 131 LSB/(deg/s))
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x1B);
  Wire.write(0x00);
  Wire.endTransmission(true);

  // Initialize Default State: Safe (Green LED ON, others OFF, Buzzer silent)
  digitalWrite(GREEN_LED, HIGH);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);
  noTone(BUZZER);
}

// ================= SENSOR FEATURE EXTRACTION =================
void readMPU6050() {
  // Request 14 consecutive registers starting at 0x3B (ACCEL_XOUT_H)
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  if (Wire.available() >= 14) {
    int16_t rawAccX = (Wire.read() << 8) | Wire.read();
    int16_t rawAccY = (Wire.read() << 8) | Wire.read();
    int16_t rawAccZ = (Wire.read() << 8) | Wire.read();
    
    // Skip Temperature Registers (0x41, 0x42)
    Wire.read(); 
    Wire.read();
    
    int16_t rawGyroX = (Wire.read() << 8) | Wire.read();
    int16_t rawGyroY = (Wire.read() << 8) | Wire.read();
    int16_t rawGyroZ = (Wire.read() << 8) | Wire.read();

    // Convert raw 16-bit values to standard physical units
    AccX = rawAccX / 16384.0; // g
    AccY = rawAccY / 16384.0; // g
    AccZ = rawAccZ / 16384.0; // g

    GyroX = rawGyroX / 131.0;  // deg/s
    GyroY = rawGyroY / 131.0;  // deg/s
    GyroZ = rawGyroZ / 131.0;  // deg/s

    // 1. Total G-Force Vector Magnitude (3-axis Euclidean Norm)
    totalAcceleration = sqrt((AccX * AccX) + (AccY * AccY) + (AccZ * AccZ));

    // 2. Helmet Inclination / Tilt Angle via Trigonometric Projection
    tilt = atan2(AccX, AccZ) * 180.0 / PI;

    // 3. Total Rotational Angular Velocity Magnitude
    rotation = sqrt((GyroX * GyroX) + (GyroY * GyroY) + (GyroZ * GyroZ));
  }
}

// ================= GPS DECODING =================
void readGPS() {
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }
}

// ================= ALGORITHM & FINITE STATE MACHINE =================
void evaluateSafetyState() {
  // Check False Alarm / Reset Push Button (Active LOW)
  if (digitalRead(BUTTON) == LOW) {
    accidentLatched = false;
    currentStatus = "SAFE";

    digitalWrite(RED_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
    noTone(BUZZER); // Crucial: Silence hardware timer interrupt
    
    delay(250); // Simple button debounce
    return;
  }

  // Define Detection Thresholds
  // 1. Crash Impact Threshold: Total acceleration exceeding 3.0g
  // 2. Fall / Tilt Threshold: Helmet inclined beyond +/- 60 degrees
  // 3. Violent Rotation Threshold: Angular velocity exceeding 250 deg/s
  bool severeImpact    = (totalAcceleration > 3.0);
  bool extremeTilt      = (tilt > 60.0 || tilt < -60.0);
  bool extremeRotation  = (rotation > 250.0);

  // Define Warning Risk Thresholds
  bool moderateImpact   = (totalAcceleration > 1.8);
  bool moderateRotation = (rotation > 120.0);

  // State Transition Logic
  if (severeImpact || extremeTilt || extremeRotation || accidentLatched) {
    // Critical Accident State (Latched: Remains active until button press)
    accidentLatched = true;
    currentStatus = "ACCIDENT";

    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, HIGH);
    tone(BUZZER, 2000); // 2 kHz emergency alert tone
  } 
  else if (moderateImpact || moderateRotation) {
    // Elevated Risk State (Non-latched dynamic warning)
    currentStatus = "RISK";

    digitalWrite(GREEN_LED, LOW);
    digitalWrite(YELLOW_LED, HIGH);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER);
  } 
  else {
    // Normal Safe State
    currentStatus = "SAFE";

    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(YELLOW_LED, LOW);
    digitalWrite(RED_LED, LOW);
    noTone(BUZZER);
  }
}

// ================= JSON TELEMETRY EMISSION =================
void emitTelemetryJSON() {
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = millis();

    float latitude = gps.location.isValid() ? gps.location.lat() : 0.0;
    float longitude = gps.location.isValid() ? gps.location.lng() : 0.0;

    // Output formatted single-line JSON packet for the Node.js serial gateway
    Serial.print("{\"status\":\"");     Serial.print(currentStatus);          Serial.print("\",");
    Serial.print("\"acceleration\":"); Serial.print(totalAcceleration, 2);  Serial.print(",");
    Serial.print("\"tilt\":");         Serial.print(abs(tilt), 1);           Serial.print(",");
    Serial.print("\"rotation\":");     Serial.print(rotation, 1);           Serial.print(",");
    Serial.print("\"latitude\":");     Serial.print(latitude, 6);            Serial.print(",");
    Serial.print("\"longitude\":");    Serial.print(longitude, 6);
    Serial.println("}");
  }
}

// ================= MAIN EXECUTION LOOP =================
void loop() {
  readGPS();
  readMPU6050();
  evaluateSafetyState();
  emitTelemetryJSON();

  delay(20); // 50 Hz execution cycle
}
