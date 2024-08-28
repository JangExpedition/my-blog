---
title: "JavaScript"
description: "프론트엔드 개발의 핵심인 JavaScript 내용을 정리했습니다."
coverImage: "/assets/blog/javascript/cover.png"
date: "2024/08/01"
---

https://www.inflearn.com/course/%ED%95%B5%EC%8B%AC%EA%B0%9C%EB%85%90-javascript-flow#

인프런의 코어 자바스크립트 강의를 듣고 정리한 내용입니다.

# 데이터 타입

---

### 기본형 (Primitive Type)

- Number
- String
- Boolean
- null
- undefined
- Symbol(ES6)

### 참조형 (Reference Type)

- Object
  - Array
  - Function
  - RegExp
  - Set / WeakSet (ES6)
  - Map / WeakMap (ES6)

## 메모리 동작 방식

![JavaScript의 데이터 타입](/assets/blog/javascript/1.png)

자바스크립트의 메모리 구조는 스택 메모리와 힙 메모리 영역으로 나뉘어 있다.
스택 메모리에는 변수와 함께 기본형 데이터가 저장되고 힙 메모리에는 참조형 데이터가 저장된다.
하지만 이 강의에서는 스택과 힙에 대해서 깊게 파진 구조에 대해서 최대한 단순화 시켜서 흐름을 파악하게끔 설명해주신다고 한다.

## 기본형

```
var a;
```

위와 같이 변수 a를 선언합니다.
컴퓨터는 메모리 안에서 데이터가 담길 공간을 미리 확보 합니다.
