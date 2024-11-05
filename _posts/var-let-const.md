---
title: "var와 let, const 근데 이제 TDZ를 곁들인"
description: "var와 let, const의 차이점을 알아보고 TDZ도 곁들여보자"
thumbnail: "/assets/blog/var-let-const/cover.png"
tags: ["JavaScript"]
createdAt: "2024-11-05 11:00:00"
category: "DEV"
---

- `var` 키워드는 변수를 중복 선언할 수 있지만 `let`과 `const` 키워드는 중복 선언할 수 없다.
- `var`는 함수 레벨 스코프를 사용하고 `let`과 `const` 키워드는 블록 레벨 스코프를 사용한다.
- `var` 키워드는 생략할 수 있지만 `let`과 `const` 키워드는 생략할 수 없다.

추가로 호이스팅 시에 차이점이 있다.
이 차이로 인해 TDZ(Temporal Dead Zone) 구간이 생긴다.
TDZ 구간이란 무엇이고 어떤 차이가 있길래 TDZ 구간이 생기는지 자세히 알아보자.

### 호이스팅

```js
console.log(b); // undefined
var b = 3;
```

실행 컨텍스트가 생성될 때 가장 먼저 하는 작업 가운데 하나가 호이스팅이다.
실행 컨텍스트가 생성될 때 변수와 함수 선언이 먼저 메모리에 할당된다.
이 과정을 통해 실행 시점에 코드가 어떤 위치에 선언되었는지와 관계없이 선언된 변수나 함수에 접근할 수 있다.

```js
var b;
console.log(b); // undefined
var b = 3;
```

호이스팅은 실제하지 않은 허구의 개념이지만 코드가 어떤 방식으로 처리되는지 이해하기 쉽게 표현해준다.
아무튼 호이스팅을 하게 되면 위 코드처럼 동작하게 되어 코드를 읽는 순서와 실행되는 순서가 달라진다.

실제로 자바스크립트 코드를 작성하다가 의문을 가진 점이 있다.

```js
console.log(c()); // hi
function c() {
  console.log("hi");
}

console.log(d()); // Uncaught ReferenceError: d is not defined
const d = () => console.log("hi");
```

같은 함수를 선언문으로 작성했냐, 할당식으로 작성했냐에 따라 결과가 달라진 경우다.

**왜 선언문으로 작성할 경우에는 위치에 상관없이 함수가 호출이 되는데 할당식으로 작성하면 참조 에러가 발생할까?**

이유는 호이스팅 시에는 변수 뿐만 아니라 함수 선언문도 같이 호이스팅되기 때문이다.

```js
function c() {
  console.log("hi");
}
console.log(c()); // hi
```

호이스팅된 결과를 보면 선언문이 모두 최상단으로 끌어올려지기 때문에 코드를 작성한 위치와 관계없이 실행할 수 있는 것이다.

```js
console.log(e); // undefined
console.log(e()); // Uncaught TypeError: e is not a function
var e = () => console.log("hi");
```

같은 할당식을 `var`에 담으면 오류의 결과가 다르다.
`e`에 `undefined`가 할당됐는데 함수로써 실행시키려고 하니 오류가 발생했다.

**let과 const 키워드는 호이스팅되지 않는 건가?**

그렇지않다.
자바스크립트 엔진에서 변수를 선언할 때 `var`, `let`, `const` 모두 동일하게 처리하지만 메모리에 공간을 확보하는 초기화 단계에서 키워드들을 다르게 처리한다.

### Temporal Dead Zone (TDZ)

`var`는 선언과 초기화가 동시에 이뤄진다.
선언을 하는 순간 메모리에 공간이 확보되어 `undefined`가 먼저 담긴다.

반면 `let`, `const` 키워드로 선언한 리터럴 값은 호이스팅되지만 초기화가 필요한 상태로 관리된다.
자바스크립트 엔진의 내부 동작을 보면 선언과 동시에 메모리에 공간을 할당하지 않고 `position` 값만 정해준다.
즉 선언은 됐지만 초기화 되지않아 변수에 담길 값을 위한 메모리 공간이 할당되지 않은 상태라는 의미로 초기화가 필요한 상태라고 한다.

따라서 메모리 공간이 할당되지 않은 시점에 `let`, `const` 키워드로 생성된 변수들이 TDZ 구간에 들어간다.
이 구간에서 해당 변수에 접근을 시도하면 `Uncaught ReferenceError: 변수명 is not defined` 에러가 발생하게 된다.

정리하면 TDZ란 변수 선언이 호이스팅되었지만 아직 초기화되지 않은 시점부터 변수가 실제로 선언된 구간까지의 기간을 말한다.

함수 할당식으로 작성했을 때도 `var` 키워드와 `let`, `const` 키워드가 다른 오류를 내는 이유도 같다.
`var` 키워드로 작성한 변수는 선언과 동시에 `undefined`가 담기기 때문에 함수로써 호출했기 때문에 `Type Error`가 발생하고 `let`, `const`는 초기화되지 않았기 때문에 참조 에러가 발생한 것이다.

### 결론

`var` 키워드는 선언과 초기화가 동시에 이뤄져 `undefined`로 초기화 되지만 `let`과 `const` 키워드는 TDZ 구간을 지나 실제 초기화 되기 전까지 접근할 수 없다.

`var` 키워드는 예기치 못한 버그를 불러올 수 있기 때문에 `let`과 `const`를 사용하는 것이 권장된다.

### 참조

- https://evan-moon.github.io/2019/06/18/javascript-let-const/
