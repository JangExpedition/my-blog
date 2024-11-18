---
title: "자바스크립트는 인터프리터 언어일까? 컴파일 언어일까?"
description: "V8 엔진이 JS 코드를 실행하는 과정을 살펴보며 알아보자."
thumbnail: "/assets/blog/js-execution-process/cover.png"
tags: ["JavaScript"]
createdAt: "2024-11-18 10:00:00"
category: "DEV"
---

> 인터프리터 언어: 컴파일 과정없이 소스 코드를 한 줄씩 읽어가며 실행하는 방식을 취함. 스크립트 언어라고도 불린다.
>
> 컴파일 언어: 전체 소스코드를 컴파일러를 통해 기계어로 변환 후 실행하는 언어. 기계어 코드는 CPU가 직접 이해할 수 있음(실행 속도가 상대적으로 빠름).

### V8 엔진의 작동 원리

![V8 엔진이 JS 코드를 실행하는 과정](/assets/blog/js-execution-process/1.png)

내가 이해한 JS 실행 과정이다(틀릴 수도 있다는 뜻).

- V8 엔진이 JS 소스 코드를 Parser에게 전달한다.
- Parser는 AST를 만들어서 Ignigion에게 전달한다.
- Ignition은 AST를 한 줄씩 바이트 코드로 변환하여 실행한다.
- TurboFan(Just-In-Time 컴파일러)은 자주 사용되는 코드를 최적화하여 기계어(네이티브 코드)로 변환하여 CPU가 바로 실행(실행 속도 향상)할 수 있도록 돕고 사용량이 떨어지면 Deoptimizing하기도 한다.

### Parser

V8 엔진이 JS 소스 코드를 전달하면 Lexical Analysis(어휘 분석)과 Syntax Analysis(구문 분석)을 거쳐 AST를 만들고 Ignition에 전달하는 역할을 수행한다.

**Lexical Analysis(어휘 분석)**

```js
var answer = 6 * 7;
```

Parser는 어휘 분석 과정에서 코드를 토큰으로 분해한다.
토큰은 문법적으로 더 이상 나눌 수 없는 코드의 기본 요소를 말한다.
아래는 위 코드를 토큰화한 결과이다.

```js
[
  {
    type: "Keyword",
    value: "var",
  },
  {
    type: "Identifier",
    value: "answer",
  },
  {
    type: "Punctuator",
    value: "=",
  },
  {
    type: "Numeric",
    value: "6",
  },
  {
    type: "Punctuator",
    value: "*",
  },
  {
    type: "Numeric",
    value: "7",
  },
  {
    type: "Punctuator",
    value: ";",
  },
];
```

**Syntax Analysis(구문 분석)**

Parser는 앞서 만든 토큰을 구문 분석한다.
이 때 만약 문법 에러가 있다면 에러 메세지를 출력하게 된다.

![AST](/assets/blog/js-execution-process/2.png)

구문 분석에 에러가 없다면 Parser는 트리 형태의 AST를 만든다.

### Ignition

Ignition은 모든 소스를 한 번에 해석하지 않고 한 줄씩 실행될 때마다 해석하는 인터프리터이다.

### TurboFan

TurboFan은 JIT(Just-In-Time) 컴파일러로 Ignition이 바이트 코드 가운데 최적화가 필요한 코드를 기계어로 변환하여 CPU가 직접 처리할 수 있게 해준다.
사용량이 떨어지면 디옵티마이징하여 Ignition이 바이트 코드를 해석하여 다시 실행하는 방식으로 돌아가게 하기도 한다.

## 결론

![가위칼](/assets/blog/js-execution-process/3.png)

JS 코드는 Ignition이 한 줄씩 바이트 코드로 변환하고 실행하는 방식으로 인터프리터 언어의 특성을 띄지만 TurboFan과 같은 JIT 컴파일러가 자주 실행되는 코드를 기계어로 변환하여 최적화하기 때문에 컴파일 언어의 특정도 함께 갖고 있다.

JS는 인터프리터 언어일까 컴파일 언어일까?
잘 모르겠다.
꼭 이분법적으로 나눠야 하나.
'JS 코드는 인터프리터 언어의 특징과 컴파일 언어의 특징도 가지고 있다.' 정도로 이해하기로 했다.

## 참조

- https://ryankim.hashnode.dev/js
- https://evan-moon.github.io/2019/06/28/v8-analysis/
