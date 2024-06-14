/**
   PostHTTPClient.ino

    Created on: 21.11.2016

*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

/* this can be run with an emulated server on host:
        cd esp8266-core-root-dir
        cd tests/host
        make ../../libraries/ESP8266WebServer/examples/PostServer/PostServer
        bin/PostServer/PostServer
   then put your PC's IP address in SERVER_IP below, port 9080 (instead of default 80):
*/
//#define SERVER_IP "10.0.1.7:9080" // PC address with emulation on host
#define SERVER_IP "192.168.1.100:3000"
#define PROTOCOL "http://"

#ifndef STASSID
#define STASSID "Zyxel_8D71"
#define STAPSK "Q3GJFPL8GG"
#endif

String CURRENT_TIME = "";
const int DEBOUNCE_DELAY_MS = 5000;
int LED_STATE = HIGH;

long LAST_TIME_SET_MS = 0;
int DEBOUNCE_TIME_SET_MS = 10000;

struct Button {
  int pin;
  bool lastState;
  bool currentState;
  unsigned long lastDebounceTime;
  int index;
};

Button _buttonA = { 2, LOW, 0, 0, 0 };
Button _buttonB = { 14, LOW, 0, 0, 0 };

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

  pinMode(_buttonA.pin, INPUT);
  pinMode(_buttonB.pin, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {

  SendParticipantTime(_buttonA);
  SendParticipantTime(_buttonB);

  long lastTimeSetDifference = millis() - LAST_TIME_SET_MS;
  bool canUpdateTime = lastTimeSetDifference > DEBOUNCE_TIME_SET_MS;

  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED) && canUpdateTime) {
    digitalWrite(BUILTIN_LED, HIGH);
    SetCurrentTime();
    LAST_TIME_SET_MS = millis();
  } else {
    digitalWrite(BUILTIN_LED, LOW);
  }
}

String GET(String path){
    HTTPClient http;
    WiFiClient client;

    const String uri = (String)PROTOCOL + (String)SERVER_IP + path;
    http.begin(client, uri); 
    http.addHeader("Content-Type", "application/json");

    Serial.printf("GET [ %s ]...", uri);
    int httpCode = http.GET();

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("CODE: [ %d ]...", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
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
    WiFiClient client;

    String uri = (String)PROTOCOL + (String)SERVER_IP + path;
    http.begin(client, uri); 
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
  StaticJsonDocument<200> doc;

  DeserializationError error = deserializeJson(doc, reply);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  Serial.print("currentTime: ");
  String currentTime = doc["currentTime"];
  Serial.println(currentTime);
}

void SendParticipantTime(Button buttonData)
{
  int currentStateButton1 = digitalRead(buttonData.pin);
 

  const long timePassedSinceLastPress = millis() - buttonData.lastDebounceTime;
  const bool hasEnoughTimePassed = timePassedSinceLastPress > DEBOUNCE_DELAY_MS;

  if(hasEnoughTimePassed && currentStateButton1 == HIGH) {
     Serial.println("currentStateButton1");
  Serial.println(buttonData.pin);
  Serial.println(currentStateButton1);

    buttonData.lastDebounceTime = millis();
    digitalWrite(buttonData.pin, LOW);
    buttonData.lastState = !buttonData.lastState;
  }
  if(buttonData.pin == 2) {
    _buttonA = buttonData;
  } else {
    _buttonB = buttonData;
  }
}
