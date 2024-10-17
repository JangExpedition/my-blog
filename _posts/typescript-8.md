---
title: "TypeScript 조건부 타입"
description: "TypeScript의 조건부 타입에 대해서 알아봅니다."
thumbnail: "/assets/blog/typescript-8/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-17 12:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 조건부 타입

조건부 타입이란 자바스크립트의 삼항 연산자를 이용하여 조건에 따라 타입을 결정하는 문법입니다.

```ts
type A = number extends string ? string : number;
```

타입 `A`는 `number` 타입이 `string` 타입을 확장하는 타입인지 검사하여 참이라면 `string` 거짓이라면 `number` 타입이 되는 문법입니다.
`number` 타입은 `string` 타입을 확장하지 않으므로 거짓이 되고 `A`의 타입은 `number`가 됩니다.

```ts
type ObjA = {
  a: number;
};

type objB = {
  a: number;
  b: number;
};

type B = ObjB extends ObjA ? number : string;
```

객체 타입으로 하면 `ObjB` 타입은 `ObjA`를 확장하는 타입이 맞으므로 타입 `B`는 `number` 타입이 됩니다.

### 제네릭과 조건부 타입

조건부 타입은 제네릭과 함께 사용하면 위력이 발휘됩니다.

```ts
function removeSpaces(text: string) {
  return text.replaceAll(" ", "");
}

let result = removeSpaces("hi im tazoal");
result.toUpperCase();
```

위와 같은 코드에서 `removeSpaces` 함수에 매개 변수의 타입을 `string | undefined | null`로 바꾸면 함수 내부에서 오류가 발생합니다.

```ts
function removeSpaces(text: string | undefined | null) {
  if (typeof text === "string") {
    return text.replaceAll(" ", "");
  } else {
    return undefined;
  }
}

let result = removeSpaces("hi im tazoal");
result.toUpperCase(); // 오류!
```

함수 내부의 오류를 타입 좁히기로 해결할 수 있습니다.
하지만 `result`의 타입이 `string | undefined`가 되기 때문에 문자열 메서드를 사용할 수 없게 됩니다.

```ts
function removeSpaces<T>(text: T): T extends string ? string : undefined {
  if (typeof text === "string") {
    return text.replaceAll(" ", ""); // 오류!
  } else {
    return undefined; // 오류 !
  }
}

let result = removeSpaces("hi im tazoal");
result.toUpperCase();
let result2 = removeSpaces(undefined);
```

`removeSpaces` 함수를 제네릭 함수로 바꿔주고 매개 인자의 타입에 타입 변수 `T`를 정의해줍니다.
반환값의 타입으로 조건부 타입을 이용하여 `T extends string ? string | undefined`를 추가하여 `string` 타입의 매개 인자가 들어왔을 경우 반환 타입이 `string`이 되도록 합니다.

그렇게 하면 `result`의 타입이 `string`으로 추론되어 문자열 메서드를 사용할 수 있고 `result2`처럼 인수로 `undefined`를 준다면 `undefined` 타입으로 반환해줍니다.

하지만 함수 내부에서 오류가 다시 발생합니다.
오류가 발생하는 이유는 함수 내부에서 조건부 타입의 결과가 어떻게 될지 알 수 없기 때문입니다.
제네릭 함수 내부에서의 `T`는 `unknown` 타입이기 때문에 `as any`로 `any` 타입으로 단언을 해서 해결해야 합니다.

```ts
function removeSpaces<T>(text: T): T extends string ? string : undefined;
function removeSpaces<T>(text: any) {
  if (typeof text === "string") {
    return text.replaceAll(" ", "");
  } else {
    return undefined;
  }
}

let result = removeSpaces("hi im tazoal");
result.toUpperCase();
let result2 = removeSpaces(undefined);
```

하지만 `any` 타입을 사용하는 걸 지양해야 하기 때문에 함수 오버로딩을 통해 해결해야 합니다.

오버로드 시그니처를 작성하고 함수의 반환값 타입을 지워줍니다.
인수의 타입을 `any`로 지정하면 구현 시그니처 내부에서 조건부 타입의 결과를 추론할 수 있게 됩니다.

이렇게 함수 오버로딩, 조건부 타입, 제네릭 타입을 모두 활용하여 사용할 수 있습니다.

## 분산적인 조건부 타입

분산적인 조건부 타입이란 조건부를 유니온과 함께 사용할 때 조건부 타입이 분산적으로 동작하게 업그레이드되는 문법입니다.

```ts
type StringNumberSwitch<T> = T extends number ? string : number;
let a: StringNumberSwitch<number | string>;
```

변수 `a`에 `StringNumberSwitch`의 타입 변수에 단일 타입이 아닌 유니온 타입을 설정하면 기존의 조건부 타입처럼 동작하지 않습니다.
`number | string` 타입은 `number` 타입을 확장하지 않기 때문에 거짓이 되고 `number` 타입이 반환될 것 같지만 실제 결과는 `string | number` 타입이 됩니다.
이유는 조건부 타입에 유니온 타입을 할당하면 일반적인 조건부 타입이 아니라 분산적인 조건부 타입으로 업그레이드 되면서 동작의 방식이 바뀝니다.
타입 변수에 유니온 타입을 할당하게 되면 유니온 타입이 타입 변수에 그대로 들어오는 것이 아니라 한 번은 `number`, 한 번은 `string`으로 분리되어 들어갑니다.
결과적으로 `StringNumberSwitch<number> | StringNumberSwitch<string>`처럼 동작하기 때문에 `string | number` 타입이 됩니다.

### 실용적인 예제

```ts
type Exclude<T, U> = T extends U ? never : T;

type A = Exclude<number | string | boolean, string>;
```

타입 변수 `T`에 할당된 유니온 타입을 하나씩 적용해보면 `number | never | boolean` 타입이 됩니다.
하지만 유니온 타입에 `never` 타입이 포함되어 있으면 `never`는 사라집니다.
이유는 유니온 타입이란 타입간의 합집합을 만드는 타입인데 `never`는 공집합이기 때문에 공집합을 합집합하면 원본 집합이 나오기 때문입니다.
따라서 최종 결과는 `number | boolean` 타입이 됩니다.

`Exclude`라는 조건부 타입을 만들면 `T`와 `U`가 같을 때 `never`를 반환하게 하여 타입을 없애고 다를 때는 그대로 반환하게 하여 유니온 타입으로 부터 특정 타입만 제거한 유니온 타입을 얻을 수 있습니다.

```ts
type Extract<T, U> = T extends U ? T : never;

type B = Extract<number | string | boolean, string>;
```

`Extract` 타입은 분산적인 조건부 타입을 이용하여 유니온 타입에서 특정 타입만 뽑아내도록 만들 수 있습니다.

### 분산적인 조건부 타입을 막는 법

```ts
type StringNumberSwitch<T> = [T] extends [number] ? string : number;
let a: StringNumberSwitch<number | string>;
```

만약 분산적인 조건부 타입이 되지 않게 하고 싶다면 `extends`의 양옆에 대괄호를 씌워주면 됩니다.
그러면 `number | string extends number`는 거짓이 되므로 `a`의 타입은 `number`가 됩니다.

## infer - 조건부 타입 내에서 타입 추론하기

`infer`는 조건부 타입 내에서 특정 타입만 추론해올 수 있는 기능입니다.

```ts
type Func = () => string;
```

`Func` 타입의 반환값에 해당하는 타입만 가져오려면 어떻게 해야 할까요?

```ts
type ReturnType<T> = T extends () => string ? string : never;

type A = ReturnType<Func>;
```

조건부 타입으로 작성해도 문제없이 반환값 타입을 추론해올 수 있습니다.

```ts
type FuncA = () => string;
type FuncB = () => number;

type ReturnType<T> = T extends () => string ? string : never;

type A = ReturnType<FuncA>;
type B = ReturnType<FuncB>;
```

`FuncB`를 만들어서 `ReturnType`의 타입 변수로 전달하면 타입 `B`는 `never`가 됩니다.
하지만 반환값의 타입을 추론해오고 싶은 것이기 때문에 원하는 기능이 제대로 수행되고 있지 않습니다.
조건부 타입을 사용할 때 `extends`의 우항에 반환값 타입을 `string`으로 고정해놨기 때문에 타입 변수의 반환값이 `string`인 경우만 제대로 검사가 진행됩니다.

```ts
type ReturnType<T> = T extends () => infer R ? R : never;
```

이럴 때 `infer`를 사용할 수 있습니다.
반환값 타입에 `infer R`을 작성하고 참일 경우 `R`을 반환해줍니다.
그러면 타입 `A`는 `string`, 타입 `B`는 `number`로 추론해줍니다.
`infer R`은 타입 변수와 같이 생각해주면 `FuncA`를 비교할 때 `() => string`이 `() => R`의 서브 타입인지를 비교합니다.
이 때 `infer R`은 조건식을 참으로 만드는 타입을 추론하도록 동작합니다.
따라서 `R`이 `string` 타입으로 추론되고 조건식이 참이 돼서 `A`의 타입이 `string`이 됩니다.

```ts
type C = ReturnType<number>;
```

타입 `C`는 `never` 타입으로 추론되게 됩니다.
이유는 타입 변수 `T`에 `number`가 들어가는데 `number` 타입이 `() => infer R` 타입의 서브 타입이 될 수 있는 방법이 없습니다.
`R` 타입이 `any` 타입으로 추론된다 하더라도 불가능합니다.
이렇게 추론이 불가한 상황에서는 조건식이 거짓이라 평가하여 `never`가 반환됩니다.
즉 `infer` 다음에 오는 타입을 추론할 수 없는 경우에는 조건식이 거짓이 됩니다.

```ts
type PromiseUnpack<T> = T extends Promise<infer R> ? R : never;

type PromiseA = PromiseUnpack<Promise<number>>;
```

`infer`를 사용하여 `Promise` 함수의 반환값 타입을 추론하는 것도 가능합니다.
동작 과정을 살펴보면 타입 변수 `T`에 `Promise<number>`라는 제네릭 타입이 할당됩니다.
그러면 `Promise<number>` 타입이 `Promise<infer R>`에 서브 타입이 되도록 `R` 타입을 추론하면 `R`은 `number` 타입이 되면 됩니다.
