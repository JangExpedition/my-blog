---
title: "ORA-00020: maximum number of processes (200) exceeded 원인과 해결"
description: "ESP32에서 MQTT 통신으로 보낸 데이터를 받지 못하는 문제를 해결한 과정을 적었습니다."
thumbnail: "/assets/blog/oracle-troubleshooting/cover.png"
tags: ["Troubleshooting"]
createdAt: "2024년 03월 27일"
category: "DEV"
---

## 개요

사용자가 개인 작업 공간에서 작업을 할 때, 크지 않은 작업임에도 불구하고 서버가 꺼지는 오류가 발생했습니다.

원인을 파악하기 위해 `alert_wind.log` 파일의 로그를 확인했습니다.

```
ORA-00020: maximum number of processes (200) exceeded
ORA-20 errors will not be written to the alert log for
the next minute. Please look at trace files to see all
the ORA-20 errors.
```

`ORA-00020: maximum number of processes (200) exceeded`는 데이터베이스가 설정된 최대 프로세스 수를 초과했음을 의미합니다.
Oracle 인스턴스에서 실행 중인 프로세스 수가 데이터베이스에 설정된 최대 프로세스 수 제한을 초과한 상황입니다.
일반적으로 동시에 너무 많은 연결이 시도될 때 발생하며, 프로세스의 수가 초과되면 더 이상 연결이 거부됩니다.

## 해결 과정

- `SQL PLUS` 프로그램 실행 후 `alert system set processes=1000 scope-spfile;` 명령어를 실행했습니다.
- 오라클을 재실행해야 하는데, SQLPLUS 권한 부족으로 실행하지 못하는 문제가 있었습니다.
- cmd 창에서 `sqlplus/as sysdba` 명령어를 실행하여 system 계정으로 접속했습니다.
- `shutdown immediate;` 명령어로 오라클 종료 후 `startup` 명령어로 오라클을 실행했습니다.
- 적용된 결과를 확인하기 위해 `show parameter processes` 명령어를 실행하였으나 `ora-01012:not logged on` 오류가 발생했습니다.
- `sqlplus 사용자명/비밀번호` 명령어를 실행하여 로그인 후 실행하면 1000으로 바뀐 걸 확인할 수 있었습니다.
  ![oracle processes를 1000으로 늘린 결과](/assets/blog/oracle-troubleshooting/1.png)
