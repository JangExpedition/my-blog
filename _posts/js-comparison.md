---
title: "자바스크립트의 비교"
description: "느슨한 동등, 엄격한 동등, Object.is()"
thumbnail: "/assets/blog/js-comparison/cover.png"
tags: ["JavaScript"]
createdAt: "2024-11-18 11:00:00"
category: "DEV"
---

![같다의 사전 정의](/assets/blog/js-comparison/1.png)

JS에서 같음은 사전적 의미 이상으로 복잡하다.
정확하게 일치하는지 따지기도 하지만 아주 유사한지와 같은 더 넓은 관점에서 비교하기도 한다.

### ===, 엄격한 동등 비교

```js
3 === 3.0; // true
"yes" === "yes"; // true
null === null; // true
false === false; // true

42 === "42"; // false
"hello" === "Hello"; // false
true === 1; // false
0 === null; // false
"" === null; // false
null === undefined; // false
```

엄격한 동등 비교는 이름처럼 엄격하게 정확하게 같을 때 참을 반환하는 연산자라고 생각할 수 있다.
대부분의 경우는 맞지만 예상과 다른 경우도 있다.

```js
NaN === NaN; // false
0 === -0; // true
```

위와 같이 `Nan` 과 `-0` 을 만나면 예상과 다르게 동작하기 때문에 `===` 연산자와 함께 쓰지 않는 것이 좋다.

```js
Object.is(NaN, NaN); // true
Object.is(0, -0); // false
Number.isNaN(NaN); // true
```

`NaN` 과 `-0` 을 비교할 때 `Object.is()` 를 사용하는 것이 좋다.
`NaN` 과 같은 경우는 `Number.isNaN()` 을 사용할 수도 있다.

```js
[1, 2, 3] === [1, 2, 3]; // false
({ a: 42 }) === { a: 42 }; // false
((x) => x * 2) === ((x) => x * 2); // false
```

객체끼리 비교할 때는 좀 더 복잡해진다.

```js
const x = [1, 2, 3];
const y = x;

y === x; // true
y === [1, 2, 3]; // false
x === [1, 2, 3]; // false
```

`y === x` 만 `true` 가 되는 이유는 메모리 동작 방식을 이해해야 한다.
간단하게 얘기하면 기본형 데이터는 값을 비교하지만 참조형 데이터는 메모리 주소를 비교한다.
이를 이해하기 위해서는 참조형 데이터가 어떻게 메모리에 저장되는지 알아야 한다.

### 참조형 데이터 메모리 동작 방식

```js
const obj = { a: 1, b: "bbb" };
```

위와 같은 코드를 작성하면 메모리에 아래와 같이 저장된다.

![참조형 데이터 메모리 할당 방식](/assets/blog/js-comparison/1.png)

- 빈 메모리에 `obj`라는 식별자를 선언한다.
- 참조형 데이터이므로 한 메모리에서 여러 메모리를 확보하고 확보한 메모리에 객체의 프로퍼티를 선언한다.
- 비어있는 메모리에 값을 할당하고 주소를 프로퍼티에 할당한다.
- 여러 메모리를 갖고 있는 메모리 주소를 `obj` 가 참조하는 형태로 저장된다.

```js
const obj2 = obj;
```

위와 같은 코드를 실행하면 빈 메모리에 `obj2` 를 선언하고 `obj` 가 참조하고 있는 `@5002` 를 값으로 넣는다.
`obj2 === obj` 의 결과로 `true` 가 나오는 이유는 갖고 있는 두 변수가 같은 메모리 주소를 참조하고 있기 때문이다.
하지만 중첩 객체일 경우는 `false` 가 반환된다.
중첩 객체의 속성까지 비교하기 위해서는 깊은 복사를 해야한다.
이 글은 비교 연산자를 보기 위한 글이므로 깊은 복사까지는 다루지 않는다.

아무튼 참조형 데이터와 기본형 데이터의 비교 방식은 다르다.
JS에서는 객체 구조가 같은지 비교할 방법이 없다.
같은 것을 참조하는지만 비교할 수 있고 구조가 같은지 비교하려면 직접 코드를 작성해야 한다.
하지만 직접 코드를 작성한다 하더라도 함수같은 경우는 정확하게 비교하는 클로저 등을 고려해야 하므로 제대로 된 비교가 불가능하다.

## ==, 느슨한 동등 비교

`==` 연산자는 `===` 연산자와 유사한 방식으로 피연산자가 같은지 비교한다.
두 연산자 모두 피연산자의 타입을 비교하지만 `==` 연산자는 강제 변환을 먼저 실행한다.
실제로 피연산자가 같은 타입이라면 `==` 와 `===` 는 완전히 동일하게 동작한다.

하지만 타입이 다른 경우 `==` 연산자는 비교 이전에 강제로 타입을 맞추는 작업을 수행한다는 점에서 차이가 있다.
강제로 타입을 변환하는 작업을 **먼저** 수행한 뒤 `===` 연산자처럼 동작한다.

```jsx
42 == "42"; // true
1 == true; // true
```

**타입 강제 변환을 피하기 위해서 `===` 만 사용하는 것이 좋을까?**

타입 강제 변환을 피하기 위해서 `==` 연산자를 사용하지 않고 `===` 만 사용하는 것은 대안이 될 수 없다.
왜냐하면 동등 비교 뿐만 아니라 `<` , `>` , `>=` , `<=` 와 같은 비교 연산자가 있기 때문이다.
비교 연산자는 모두 타입 강제 변환이 먼저 일어난다.

```jsx
const arr = ["1", "10", "100", "1000"];
for (let i = 0; i < arr.length && arr[i] < 500; i++) {
  console.log(`${i + 1}번 순회`);
} // 1번 순회 2번 순회 3번 순회
```

`arr[i] < 500` 에서 `arr[i]` 는 문자열이지만 타입 강제 변환을 수반한다.
따라서 세 번까지만 순회하고 반복문이 멈추게 된다.

## 결론

- `===` 연산자를 이용할 때 `NaN` 과 `-0` 을 주의하자. `Object.is()` 를 활용하자.
- 타입 강제 변환을 수반하는 비교를 피하는 방법 보단 비교 연산자의 작동 방식을 제대로 이해하고 활용하는 편이 좋다.