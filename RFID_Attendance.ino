#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>   // SoftwareSerial(rxPin, txPin, inverse_logic)

#define SS_PIN  5
#define RST_PIN 32
#define GREEN_LED 2
#define RED_LED 15 
#define buzz 27

const char* ssid = "K.Harsha_PC";
const char* password = "password";
const char* serverUrl = "http://10.123.6.185:3000/mark-attendance";

SoftwareSerial mySerial(1, 0);
MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClient client;
HTTPClient http;
LiquidCrystal_I2C lcd(0x27, 20, 4);

void setup() 
{
    Serial.begin(115200);
    SPI.begin();
    rfid.PCD_Init();
    
    pinMode(GREEN_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
    pinMode(buzz, OUTPUT);
    
    lcd.begin();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Waiting for card...");
    
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    
    Serial.println("\nConnected!");

    while (!Serial);  // For Yun/Leo/Micro/Zero/...
    delay(100);
    Serial.println("\n\nFingerprint sensor enrollment");

    // set the data rate for the sensor serial port
    finger.begin(57600);

    if (finger.verifyPassword()) 
    {
      Serial.println("Found fingerprint sensor!");
    } 
    else 
    {
      Serial.println("Did not find fingerprint sensor :(");
      while (1) { delay(1); }
    }
}

uint8_t readnumber(void) {
  uint8_t num = 0;

  while (num == 0) {
    while (! Serial.available());
    num = Serial.parseInt();
  }
  return num;
}

void loop() 
{
    if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
        return;
    }

    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
        uid += String(rfid.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();

    Serial.println("RFID UID: " + uid);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Scanning...");

    if (WiFi.status() == WL_CONNECTED) 
    {
        http.begin(client, serverUrl);
        http.addHeader("Content-Type", "application/json");

        String jsonPayload = "{\"rfid_uid\": \"" + uid + "\"}";
        int httpResponseCode = http.POST(jsonPayload);
        Serial.println("Sending UID to Server: " + uid);

        if (httpResponseCode == 200) {
            String response = http.getString();
            Serial.println("\u2705 Valid: " + response);

            digitalWrite(GREEN_LED, HIGH);
            digitalWrite(buzz, HIGH);
            delay(500);
            digitalWrite(GREEN_LED, LOW);
            digitalWrite(buzz, LOW);
            
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print(response);
            lcd.setCursor(0, 2);
            lcd.print("Status: Present");
        } else {
            Serial.println("\u274C Invalid Card!");

            digitalWrite(RED_LED, HIGH);
            delay(500);
            digitalWrite(RED_LED, LOW);
            
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Student: Not Found");
            lcd.setCursor(0, 1);
            lcd.print("Status: Absent");
        }

        http.end();
    }

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
    delay(2000);
}
