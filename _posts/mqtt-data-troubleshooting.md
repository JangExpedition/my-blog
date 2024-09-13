---
title: "전송 데이터 최적화"
description: "대용량 데이터를 디바이스로 전송하는 과정에서 발생한 문제를 해결한 경험을 정리했습니다."
thumbnail: "/assets/blog/mqtt-data-troubleshooting/cover.png"
tags: ["Troubleshooting"]
createdAt: "2024년 04월 04일"
category: "DEV"
---

## 문제 상황

MQTT를 통해 엑셀 데이터를 ESP32 디바이스로 전송하려 했으나, 디바이스의 메모리 용량 한계로 인해 대용량 데이터를 한 번에 받을 수 없었습니다.

## 해결 과정

이 문제를 해결하기 위해 데이터를 열 단위로 분리하여 작은 단위로 나누어 전송하기로 했습니다. 자바스크립트 코드를 이용해 엑셀 파일의 각 열 데이터를 별도의 배열로 나눈 후, 순차적으로 디바이스에 전송했습니다.

```js
const headerRow = excelData[0];
let formattedData = {};
headerRow.forEach((header, index) => {
  formattedData[header] = [];
  for (let i = 1; i < excelData.length; i++) {
    formattedData[header].push(excelData[i][index]);
  }
});
```

엑셀 파일의 첫 번째 행을 기준으로 각 열의 데이터를 별도의 배열로 나누는 방식입니다. 이렇게 분리된 데이터를 순차적으로 전송하면, 한 번에 많은 데이터를 전송하는 부담을 줄일 수 있습니다.

## 결과

열별로 데이터를 나누어 전송한 후, 데이터가 정상적으로 전송되고 디바이스에서도 무리 없이 처리되는 것을 확인할 수 있었습니다. 이를 통해 디바이스의 메모리 한계를 극복하고, 안정적인 데이터 전송을 구현할 수 있었습니다.
