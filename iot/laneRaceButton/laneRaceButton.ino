/**
   PostHTTPClient.ino

    Created on: 21.11.2016

*/
#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClientSecureBearSSL.h>

#include "certs.h"

/* this can be run with an emulated server on host:
        cd esp8266-core-root-dir
        cd tests/host
        make ../../libraries/ESP8266WebServer/examples/PostServer/PostServer
        bin/PostServer/PostServer
   then put your PC's IP address in SERVER_IP below, port 9080 (instead of default 80):
*/
//#define SERVER_IP "10.0.1.7:9080" // PC address with emulation on host
// #define SERVER_IP "172.20.10.6:3000"
// #define SERVER_IP "ocr-event-timer.vercel.app"
// #define PROTOCOL "https://"
#define PROTOCOL "https://"

#ifndef STASSID
// #define STASSID "Zyxel_8D71"
// #define STAPSK "Q3GJFPL8GG"
// #define STASSID "ALHN-9BE9"
// #define STAPSK "0847662363"
#define STASSID "OcrWifi"
#define STAPSK "12345678"
#define IOT_ID "666747d357147815ce862f9a"
#endif

struct Debounce {
  int buttonDelay;
  int timeCheckDelay;
};

struct Clock {
  long long int currentTimeMs;
  long msAtLastUpdate;
};

struct Button {
  int pin;
  bool lastState;
  bool currentState;
  long lastDebounceTime;
  int index;
};

Clock _clock = { 0, 0 };
Debounce _debounce = { 5000, 10000 };

Button _buttonA = { 16, LOW, 0, 0, 0 };
Button _buttonB = { 5, LOW, 0, 0, 1 };

const int ledPin = 4;    // the number of the LED pin

// variables will change:
int buttonState = 0;  // variable for reading the pushbutton status

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(9600);

  Serial.println();
  Serial.println();
  Serial.println();

  WiFi.begin(STASSID, STAPSK);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  pinMode(ledPin, OUTPUT);
  pinMode(_buttonA.pin, INPUT);
  pinMode(_buttonB.pin, INPUT);
}

void loop() {
  ProccessButtonPress(_buttonA);
  ProccessButtonPress(_buttonB);

  long lastTimeSetDifference = millis() - _clock.msAtLastUpdate;
  // bool canUpdateTime = lastTimeSetDifference > _debounce.timeCheckDelay;
  bool canUpdateTime = _clock.currentTimeMs == 0;

  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED) && canUpdateTime) {
    digitalWrite(BUILTIN_LED, HIGH);

    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setFingerprint(fingerprint___vercel_app);

    SetCurrentTime();
  } else {
  }
}

String GET(String path){
    HTTPClient http;
    // WiFiClient client;

    // const String uri = (String)PROTOCOL + ocr_event_timer_host + path;
    const String uri = (String)PROTOCOL + "ocr-event-timer.vercel.app" + path;

    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setFingerprint(fingerprint___vercel_app);

    // http.begin(*client, ocr_event_timer_host, ocr_event_timer_port);
    http.begin(*client, uri);
    http.addHeader("Content-Type", "application/json");

    Serial.printf("GET [ %s ]...", uri);
    int httpCode = http.GET();

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("CODE: [ %d ]...", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        const String& payload = http.getString().c_str();
        Serial.printf("RESPONSE [ %s ]\n", payload);
        http.end();

        return payload;
      }
    } else {
      Serial.printf("ERROR: %s\n", http.errorToString(httpCode).c_str());
      http.end();
    }

    return "";
}

String POST(String path, String params) {
    HTTPClient http;
    // WiFiClient client;

    String uri = (String)PROTOCOL + "ocr-event-timer.vercel.app" +  path;
    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setFingerprint(fingerprint___vercel_app);

    http.begin(*client, uri);
    http.addHeader("Content-Type", "application/json");

    Serial.printf("POST[ %s ]...", uri);
    // start connection and send HTTP header and body
    int httpCode = http.POST(params);
    Serial.printf("CODE [ %d ]...", httpCode);

    // httpCode will be negative on error
    if (httpCode > 0) {
      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.printf("RESPONSE [ %s ]\n", payload);
        http.end();
        return payload;
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    return "";
}

void SetCurrentTime(){
  String reply = GET("/api/nutsack/iot");
  StaticJsonDocument<1024> doc;
  DeserializationError error = deserializeJson(doc, reply);

  JsonObject object = doc.as<JsonObject>();

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  String currentTimeString = object["currentTime"];
  long long int currentTime = strtoll(object["currentTime"], nullptr, 10);
  _clock.currentTimeMs = currentTime;
  _clock.msAtLastUpdate = millis();
}

void ProccessButtonPress(Button buttonData)
{
  buttonData.currentState = digitalRead(buttonData.pin);
  const long timePassedSinceLastPress = millis() - buttonData.lastDebounceTime;
  const bool hasEnoughTimePassed = timePassedSinceLastPress > _debounce.buttonDelay;

  if(hasEnoughTimePassed && buttonData.currentState == LOW) {
    buttonData.lastDebounceTime = millis();
    Serial.printf("Button %d was pressed\n", buttonData.index);
    SendParticipantLaneData(buttonData);
  }

  if(buttonData.pin == _buttonA.pin) {
    _buttonA = buttonData;
  } else {
    _buttonB = buttonData;
  }
}

void SendParticipantLaneData(Button buttonData) {
  StaticJsonDocument<1024> rootDoc;

  // create an object
  JsonObject doc = rootDoc.to<JsonObject>();
  doc["iot_id"] = (String)IOT_ID;
  doc["button_index"] = buttonData.index;

  long timeDifference = millis() - _clock.msAtLastUpdate;
  long long int actualTime = _clock.currentTimeMs + timeDifference;
  doc["end_time"] = actualTime;

  String postParams;
  serializeJson(doc, postParams);

  String reply = POST("/api/ballbag/iot", postParams);
}
