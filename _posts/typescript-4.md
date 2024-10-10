---
title: "TypeScript 함수와 타입"
description: "TypeScript의 함수에 대해서 정리한 내용입니다."
thumbnail: "/assets/blog/typescript-4/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-09 10:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 함수 타입

### 선택적 매개변수

```ts
function introduce(name = "장원정", tall?: number) {
  console.log(`name: ${name}`);
  if (typeof tall === "number") {
    console.log(`tall: ${tall + 10}`);
  }
}

introduce("장원정", 171);
introduce("장원정");
```

`tall` 매개변수를 선택적 매개변수로 만들었다면 `number | undefined` 타입으로 추론됩니다.
따라서 함수 내부에서 덧셈 연산을 하려고 하면 `tall`이라는 변수가 `undefined`일 수 있기 때문에 오류가 발생합니다.
타입 가드를 만들어 타입을 좁혀야 오류가 사라집니다.

```ts
function introduce(name = "장원정", tall?: number, age: number) {
  // 오류!
  console.log(`name: ${name}`);
  if (typeof tall === "number") {
    console.log(`tall: ${tall + 10}`);
  }
}

introduce("장원정", 171); // 오류!
introduce("장원정"); // 오류!
```

선택적 매개변수는 필수 매개변수보다 앞에 오면 안됩니다.
선택적 매개변수 뒤에 필수 매개변수를 입력하면 함수 정의에서 오류가 발생합니다.

### Rest 파라미터

```ts
function getSum(...rest: number[]) {
  let sum = 0;
  rest.forEach((it) => (sumb += it));
  return sum;
}
```

만약 Rest 파라미터를 매개변수로 받는다면 배열 타입으로 정의할 수 있습니다.
만약 매개변수의 개수를 정해주고 싶다면 `Tuple` 타입을 사용하여 `[number, number, number]`로 정의하면 3개의 `number` 타입 매개변수를 받게 될 것입니다.

## 함수 타입 표현식과 호출 시그니처

```ts
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => a + b;
```

함수 타입 표현식으로 함수를 정의하면 변수에 타입을 정의하듯이 작성해주면 함수의 매개변수와 반환값 타입을 함수 선언식에 직접 입력하지 않아도 함수의 타입을 정의할 수 있습니다.

함수 타입 표현식을 호출 시그니처, 함수 시그니처라고 부르기도 하는데 타입스크립트 공식 문서에서는 함수 타입 표현식이라고 표현하고 있습니다.

```ts
type Operation = (a: number, b: number) => number;

const add: Operation = (a, b) => a + b;
const sub: Operation = (a, b) => a - b;
const multiply: Operation = (a, b) => a * b;
const divide: Operation = (a, b) => a / b;
```

함수 타입 표현식을 이용하면 좋은 점은 사칙연산과 같이 비슷한 함수를 여러개 만들어야 할 때 매개변수와 반환값에 일일히 정의해줘야 한다면 중복된 코드가 많아지는 문제를 간결하게 작성해줄 수 있게 됩니다.

```ts
const add: (a: number, b: number) => number = (a, b) => a + b;
```

함수 타입 표현식은 타입 별칭 없이 표현식만으로 정의할 수 있습니다.

### 호출 시그니처 (콜 시그니처)

```ts
type Operation2 = {
  (a: number, b: number): number;
};

const add2: Operation2 = (a, b) => a + b;
const sub2: Operation2 = (a, b) => a - b;
const multiply2: Operation2 = (a, b) => a * b;
const divide2: Operation2 = (a, b) => a / b;
```

위와 같이 타입을 정의하는 문법을 호출 시그니처라고 부르고 함수 표현식과 동일한 역할을 합니다.
함수의 타입을 정의할 때 객체 타입을 정의하듯이 하는 이유는 자바스크립트의 함수도 객체이기 때문입니다.

```ts
type Operation2 = {
  (a: number, b: number): number;
  name: string;
};

const add2: Operation2 = (a, b) => a + b;
const sub2: Operation2 = (a, b) => a - b;
const multiply2: Operation2 = (a, b) => a * b;
const divide2: Operation2 = (a, b) => a / b;

add2(1, 2);
add2.name;
```

호출 시그니처를 이용하면 하이브리드 타입이라고 해서 객체에 추가적으로 속성을 정의할 수 있습니다.
속성을 추가로 정의하면 `Operation2` 타입을 갖는 변수가 호출될 수도 있고 점 표기법으로 객체를 사용하듯이 사용할 수 있습니다.
하지만 이 내용은 잘 사용할 일이 없다고 합니다.

## 함수 타입의 호환성

함수 타입 호환성이란 특정 함수 타입을 다른 함수 타입으로 취급해도 괜찮은가를 판단하는 말입니다.
함수 타입의 호환성을 판단할 때는 반환값의 타입이 호환되는지, 매개변수의 타입이 호환되는지 두 가지 기준이 있습니다.

반환값의 타입과 매개변수의 타입은 타입호환성을 따라갑니다.

```ts
type Func1 = (a: number, b: number) => void;
tupe Func2 = (a: number) => void;

let func1: Func1 = (a, b) => {};
let func2: Func2 = (a) => {};

func1 = func2;
func2 = func1; // 오류!
```

매개변수의 타입 호환성을 체크할 때는 매개변수의 개수가 다를 때는 할당하려는 함수의 타입에 매개변수의 개수가 더 적을 때만 호환됩니다.

## 함수 오버로딩

함수 오버로딩이란 함수를 매개변수의 개수나 타입에 따라 여러 버전으로 정의하는 방법으로 자바스크립트에서는 지원하지 않고 타입스크립트에서만 지원합니다.

### 오버로드 시그니처

```ts
function func(a: number): void;
function func(a: number, b: number, c: number): void;
```

함수의 구현없이 선언식만 쓰는 것을 오버로드 시그니처라고 부릅니다.
오버로드 시그니처는 함수를 오버로딩하기 위해서 매개변수 별로 다른 버전을 명시해주기 위해 사용합니다.

### 구현 시그니처

```ts
function func() {}

func(); // 오류!
func(1);
func(1, 2); // 오류!
func(1, 2, 3);
```

`func` 함수의 구현부와 매개변수를 다 비웠습니다.
매개변수가 없으니 원래라면 이 함수를 호출하고 매개변수를 넣으려고 하면 오류가 발생합니다.
실제 구현부에 매개변수가 정의되어 있지 않기 때문에 `func()`말고는 비정상인 것처럼 보이지만 `func(1)`, `func(1, 2, 3)`에서만 오류가 발생하지 않습니다.
오버로드 시그니처를 만들었기 때문에 함수를 호출할 때 인수의 타입이 실제 구현부에 정의된 매개변수나 타입을 따르지 않고 오버로드 시그니처의 버전 중 하나를 따릅니다.
오버로드 시그니처를 만들어두면 실제 구현부의 매개변수 타입들은 호출 시에 큰 영향을 미치지 않습니다.

```ts
function func(a: number): void; // 오류!
function func(a: number, b: number, c: number): void;

function func(a: number, b: number, c: number) {}
```

구현 시그니처를 위와 같이 작성하면 첫번째 오버로드 시그니처에서 오류가 발생합니다.
구현 시그니처에서 매개변수 3개가 필수 매개변수로 정의되어 있기 때문에 첫번째 오버로드 시그니처는 의미가 사라지기 때문입니다.

```ts
function func(a: number, b?: number, c?: number) {
  if (typeof b === "number" && typeof c === "number") {
    console.log(a + b + c);
  } else {
    console.log(a * 20);
  }
}
```

오버로드 시그니처의 매개변수 개수에 차이가 있다면 선택적 프로퍼티로 매개변수를 정의하여 모든 오버로드 시그니처가 의미있도록 만들어줘야 합니다.

## 사용자 정의 타입 가드

```ts
type Dog = {
  name: string;
  isBark: boolean;
};

type Cat = {
  name: string;
  isScratch: boolean;
};

type Animal = Dog | Cat;

function warning(animal: Animal) {
  if ("isBark" in animal) {
    // 강아지
  } else if ("isScratch" in animal) {
    // 고양이
  }
}
```

`warning` 함수에서 타입 좁히기를 해야 하는데 타입들이 라이브러리에서 제공되거나 남이 만든 타입이라서 서로소 유니온 타입을 이용하지 못하는 경우라면 `in` 연산자를 사용해야 하는데 `in` 연산자로 타입을 좁히기는 불안 요소가 많습니다.

```ts
function isDog(animal: Animal): animal is Dog {
  return (animal as Dog).isBark !== undefined;
}

function warning(animal: Animal) {
  if (isDog(animal)) {
    // 강아지
  } else if ("isScratch" in animal) {
    // 고양이
  }
}
```

이럴 때 사용하면 좋은 것이 사용자 정의 타입 가드입니다.
객체의 타입이 `Dog`인지 검사를 하는 `isDog` 함수를 만들어 줍니다.
만약 반환값 타입인 `animal is Dog`를 생략한다면 `isDog(animal)` 조건문을 통과해도 `Animal` 타입으로 추론됩니다.
코드만 봤을 때는 반환값이 `true`면 `Dog` 타입이 보장되는 상황인데 타입스크립트는 직접 만든 함수의 반환값을 가지고는 타입을 좁혀주진 않습니다.
이럴 때는 함수 자체를 타입 가드 역할을 하도록 만들어 주도록 반환값 타입으로 `animal is Dog`를 붙여줍니다.
`animal is Dog`는 함수가 `true`를 반환하면 타입은 `Dog` 타입이라고 명시해주는 역할을 합니다.

함수를 타입 가드로 만들어 줄 수 있는 것이 사용자 정의 타입 가드입니다.
