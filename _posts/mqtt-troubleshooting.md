---
title: "ESP32에서 MQTT 통신으로 데이터 받기"
description: "ESP32에서 MQTT 통신으로 보낸 데이터를 받지 못하는 문제를 해결한 과정을 적었습니다."
thumbnail: "/assets/blog/mqtt-troubleshooting/cover.png"
tags: ["Troubleshooting"]
createdAt: "2024-04-03 10:00:00"
category: "DEV"
---

최근 MQTT를 활용하여 ESP32 칩과 통신하는 웹페이지를 개발하고 있습니다.

개발 과정에서 팀의 임베디드 개발자분이 바쁜 일정을 소화하고 계셔서 웹에서 보낸 데이터를 수신하는 부분의 구현이 지연되었습니다.

평소 임베디드 개발에 호기심이 있었기 때문에 이번 기회에 해당 부분을 개발해 보기로 했습니다.

## 💥해결 과정

웹페이지에서 메세지를 전송했음에도 ESP32에서 데이터를 수신하지 못 하는 문제가 있었습니다. 웹에서 보낸 메세지가 ESP32에 수신되어 Tera Term 프로그램에서 로그를 확인할 수 있게 하는 것이 목표입니다.

1. **메세지 전송 확인**: Mosquitto 브로커를 통해 웹에서 보낸 메세지가 정상적으로 전송되는 걸 확인했습니다.
2. **콜백 함수 검토**: MQTT 토픽 구독 후 메세지를 받으면 실행되는 콜백 함수에서 메세지 수신 로그가 찍히지 않는 것을 확인했습니다.

```cs
Serial.print("Received message : ");
```

3. **구독 문제 파악**: 함수 자체에 문제가 없는 것을 확인하고 ESP32가 올바른 토픽을 구독하고 있지 않다는 사실을 알게 됐습니다.

## 결과

토픽을 수정한 후에는 원하는 데이터를 성공적으로 수신할 수 있었습니다.
MQTT를 통해 받은 JSON 메시지를 파싱하는 작업도 수행했습니다.

## JSON 메세지 파싱

```cs
#include <ArduinoJson.h>
```

`ArduinoJson.h`라이브러리를 포함시켜 JSON 데이터를 파싱할 수 있는 환경을 준비합니다.

```cs
StaticJsonDocument<200> doc;
DeserializationError error = deserializeJson(doc, message);

if (error) {
  Serial.print(F("deserializeJson() 실패: "));
  Serial.println(error.f_str());
  return;
}
```

수신된 메세지를 `StaticJsonDocument` 객체로 파싱하고 에러 처리를 해줍니다.

```cs
const char* pwm = nullptr;

if(doc.containsKey("pwm")){
  pwm = doc["pwm"];
  Serial.print("pwm : ");
  Serial.println(pwm);
}
```

파싱된 JSON 객체에서 필요한 데이터를 추출하고 존재하지 않는 키에 대해 null 처리를 합니다.
