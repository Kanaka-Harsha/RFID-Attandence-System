# RFID-Attendance-System

An RFID-Based Attendance System that uses IoT and Web Development to resolve the issue of time management in attendance taking.

## Overview
This project uses an ESP32 Wroom DEVKIT V1 paired with an MFRC522 RFID Scanner to automatically record student attendance. When an RFID card is scanned, the ESP32 reads the UID and sends it over Wi-Fi to a backend server. The server verifies the UID, updates the attendance records, and the results are dynamically displayed on a web-based dashboard.

## Hardware Components
1. ESP32 Wroom DEVKIT V1
2. RFID Scanner Module (MFRC522)
3. LEDs (Green & Red)
4. 20x4 LCD Display (I2C)
5. Buzzer
6. BreadBoard
7. Jumper Wires

## Software & Technologies Used
- **IoT & Hardware:** C++ (Arduino framework), WiFi, HTTPClient, SPI, MFRC522 library, LiquidCrystal_I2C.
- **Backend:** Node.js (Receives HTTP POST requests on `/mark-attendance` from the ESP32 and serves attendance data).
- **Frontend:** HTML, CSS, Vanilla JavaScript (Dashboard for monitoring records in real-time).

## Workflow of the Process
1. **Connectivity:** The ESP32 device connects to the configured Wi-Fi network.
2. **Waiting State:** The system waits for an RFID card to be scanned by the user.
3. **Data Transmission:** The UID of the scanned card is sent to the web server via an HTTP POST request to mark attendance.
4. **Validation (Success):** If the server successfully validates the UID, the green LED lights up, the buzzer sounds, and the LCD displays a "Present" status.
5. **Validation (Failure):** If the UID is invalid or not found, the red LED lights up and the LCD displays an "Absent" status.

## Dashboard Features
- **Live Tracking:** Real-time data refresh to update attendance immediately after a card scan.
- **Detailed View:** Displays student Roll Number, Name, Total Classes, Classes Present, and overall Attendance Percentage.
- **Search & Filter:** Search functionality to quickly find students by Roll Number or Name.
- **Summary Statistics:** Displays total number of students and the average attendance percentage of the class.
