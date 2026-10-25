# AI-Based Smart Helmet for Accident Detection and Risk Prevention

An end-to-end IoT and Web Monitoring safety platform designed to detect motorcycle accidents, assess real-time kinematic risk, track GPS coordinates, and notify emergency contacts.

---

## 📌 Project Overview

This project consists of three integrated tiers:
1. **Embedded Hardware (Arduino Uno):** Acquires telemetry from an MPU6050 6-axis IMU (accelerometer + gyroscope) and NEO-6M GPS receiver, executing a deterministic Finite State Machine (FSM) with audible/visual actuators and false-alarm reset capabilities.
2. **Gateway Middleware (Node.js & WebSockets):** Ingests serial telemetry packets over USB UART (9600 baud) and broadcasts sanitized JSON updates via Socket.IO to connected web clients.
3. **Web Monitoring Dashboard (React & Vite):** A modern dark-themed dashboard featuring real-time motion graphs, OpenStreetMap GPS tracking, dynamic multi-factor AI risk assessment, incident logging, and emergency dispatch simulation.

---

## 🏗️ Repository Architecture

```
smart-helmet/
├── smart-helmet-arduino/         # Microcontroller firmware
│   └── smart_helmet.ino          # Arduino C++ sketch with sensor processing & FSM
├── smart-helmet-backend/         # Middleware gateway
│   ├── server.js                 # Node.js Serial-to-WebSocket broker
│   └── package.json
└── smart-helmet-dashboard/       # Frontend client
    ├── src/                      # React components, pages, context, and styles
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

---

## 🔌 Hardware Circuit & Pin Configuration

| Component | Arduino Pin | Description |
| :--- | :--- | :--- |
| **MPU6050 VCC** | `5V` | Logic power |
| **MPU6050 GND** | `GND` | Ground reference |
| **MPU6050 SDA** | `Analog Pin A4` | I2C Serial Data line |
| **MPU6050 SCL** | `Analog Pin A5` | I2C Serial Clock line |
| **NEO-6M GPS TX** | `Digital Pin 4` | SoftwareSerial RX (`GPS_RX`) |
| **NEO-6M GPS RX** | `Digital Pin 3` | SoftwareSerial TX (`GPS_TX`) |
| **Green LED** | `Digital Pin 9` | Normal / Safe Status Indicator |
| **Yellow LED** | `Digital Pin 10` | Elevated Risk Warning Indicator |
| **Red LED** | `Digital Pin 11` | Critical Accident Emergency Indicator |
| **Active Buzzer** | `Digital Pin 8` | Acoustic Emergency Alarm (`tone(8, 2000)`) |
| **Push Button** | `Digital Pin 7` | False-Alarm Reset Switch (`INPUT_PULLUP`) |

---

## 🧠 Decision Thresholds & Risk Analysis

### Finite State Machine (FSM)
* **🟢 SAFE:**
  * Total Acceleration $\le 1.8g$, Rotation $\le 120^\circ/\text{s}$, Tilt $\le 60^\circ$.
  * Actuation: Green LED ON, Buzzer OFF.
* **🟡 RISK (Warning):**
  * Total Acceleration $> 1.8g$ OR Rotation $> 120^\circ/\text{s}$.
  * Actuation: Yellow LED ON, Buzzer OFF.
* **🔴 ACCIDENT (Critical Latched):**
  * Total Acceleration $> 3.0g$ OR Tilt $> 60^\circ$ OR Rotation $> 250^\circ/\text{s}$.
  * Actuation: Red LED ON, 2000 Hz Buzzer Alarm latched until button press.

### Dynamic AI Risk Scoring Formula
The dashboard computes a continuous composite score from real-time motion sensors:
$$\text{RiskScore} = 0.40 \times \left(\frac{A_{\text{total}}}{3.5g} \times 100\right) + 0.30 \times \left(\frac{|\theta_{\text{tilt}}|}{75^\circ} \times 100\right) + 0.30 \times \left(\frac{\Omega_{\text{total}}}{300^\circ/\text{s}} \times 100\right)$$

---

## 🚀 Setup & Execution Guide

### 1. Arduino Firmware
1. Open `smart-helmet-arduino/smart_helmet.ino` in the Arduino IDE.
2. Install required libraries via Library Manager:
   * `Wire` (built-in)
   * `SoftwareSerial` (built-in)
   * `TinyGPSPlus`
3. Connect your Arduino Uno via USB, select your board and COM port, and click **Upload**.

### 2. Node.js Middleware Gateway
```bash
cd smart-helmet-backend
npm install
node server.js
```
*(Verify that `ARDUINO_PORT` in `server.js` matches your device COM port, e.g., `'COM4'`).*

### 3. React Frontend Dashboard
```bash
cd smart-helmet-dashboard
npm install
npm run dev
```
Open your browser at `http://localhost:5173`. Toggle **Demo Mode** to test with the built-in simulator or turn it OFF to receive live hardware telemetry!
