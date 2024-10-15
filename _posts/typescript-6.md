---
title: "TypeScript 제네릭"
description: "TypeScript의 제네릭에 대해서 알아봅니다."
thumbnail: "/assets/blog/typescript-6/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-10 11:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 제네릭

```ts
function func(value: any) {
  return value;
}

let num = func(10);
let bool = func(10);
let str = func("string");
```

위와 같은 코드를 작성했을 때 `num`과 `bool`과 `str`의 타입은 `any`입니다.
함수는 리턴값을 기준으로 타입 추론을 하기 때문에 `value`를 그대로 리턴하는 `func` 함수는 `valu`를 `any`으로 받기 때문에 그렇습니다.

```ts
num.toUpperCase();
```

하지만 변수가 `any` 타입으로 추론되는 것은 좋지 않습니다.
`num` 변수가 `any` 타입으로 추론되기 때문에 `toUpperCase` 메서드를 사용해도 오류가 발생하지 않습니다.

```ts
function func(value: unknown) {
  return value;
}

let num = func(10);
num.toUpperCase(); // 오류!
num.toFixed(); // 오류!
```

`unknown` 타입으로 정의하면 `toUpperCase` 메서드 사용 시 오류를 발생 시킬 수는 있지만 `toFixed`와 같은 `number` 타입 전용 메서드도 오류를 발생 시킵니다.

`func` 함수를 제네릭 함수로 만들어주면 함수의 인수에 따라 반환값을 가변적으로 정해줄 수 있습니다.

```ts
function func<T>(value: T): T {
  return value;
}
```

제네릭 함수로 만들기 위해 `<T>`를 추가해줍니다.
`T`는 타입을 저장하는 타입 변수입니다.
타입 변수는 인수로 어떤 타입을 전달하는지에 따라 저장되는 타입이 달라집니다.

```ts
let num = func(10);
let bool = func(10);
let str = func("string");
```

제네릭 함수로 변환 후 `num`, `bool`, `str`의 타입은 `number`, `boolean`, `string`으로 정의되어 있습니다.

타입 변수 `T`는 자바스크립트의 변수처럼 상황에 따라 다른 타입을 담을 수 있습니다.
타입 변수의 타입은 함수를 호출할 때마다 결정됩니다.

```ts
let arr = func([1, 2, 3]);
```

`number[]` 타입을 갖는 값을 인수로 전달하면 타입 변수에 `number[]`이 담겨서 `arr`의 타입은 `number[]`이 됩니다.

이때 `arr`의 타입을 `tuple` 타입으로 정의하고 싶다면 어떻게 해야 할까요?

```ts
let arr = func([1, 2, 3] as [number, number, number]);
```

타입 단언으로 해줄 수도 있겠지만

```ts
let arr = func<[number, number, number]>([1, 2, 3]);
```

함수를 호출할 때 함수 뒤에 `<>`를 붙이고 안에 타입 변수 `T`에 할당해주고 싶은 타입을 작성해주면 됩니다.

## 타입 변수 응용하기

### 같은 타입일 수도 있고 다른 타입일 수도 있는 두 개의 인수를 받는 함수

```ts
function swap<T>(a: T, b: T) {
  return [b, a];
}

const [a, b] = swap(1, 2);
```

위와 같이 함수를 작성하면 `swap` 함수에 넘겨줄 매개 변수의 타입을 바꾸면 오류가 발생합니다.

```ts
const [a, b] = swap("1", 2); // 오류!
```

오류가 발생하는 이유는 첫 번째 인수로 `string` 타입의 값을 전달하면 `T`에 `string` 타입이 할당되면서 `b`도 `string` 타입이 할당되기 때문입니다.

```ts
function swap<T, U>(a: T, b: U) {
  return [b, a];
}
```

이 문제는 타입 변수를 하나 더 선언해주면 해결할 수 있습니다.
타입 변수는 여러개를 선언할 수 있습니다.

### 배열을 인수로 받아서 첫 번째 값을 반환하는 함수

```ts
function returnFirstValue<T>(data: T[]) {
  return data[0];
}

let num = returnFirstValue([0, 1, 2]);
let str = returnFirstValue(["hello", "mynameis"]);
```

`returnFirstValue` 함수는 어떤 타입의 배열을 받아서 첫 번째 인덱스 값을 반환해주는 함수입니다.
만약 `data: T`라고 작성하면 오류가 발생합니다.
이유는 `unknown` 타입의 값에 배열 인덱스를 사용했기 때문입니다.
타입 변수를 사용하면 함수 내부에서는 타입 변수에 할당되는 타입이 뭔지 모르고 호출해봐야 알기 때문에 최대한 오류를 발생하지 않는 쪽으로 제한하기 위해 `unknown`으로 추론합니다.
따라서 `data: T[]`로 선언해주면 어떤 배열이 오든 인덱스 접근은 가능하기 때문에 오류가 사라지고 `num`과 `str`는 `number`와 `string` 타입으로 추론됩니다.

```ts
let str = returnFirstValue([1, "hello", "mynameis"]);
```

위와 같이 코드를 수정하면 `str`의 타입은 `number | string`으로 추론됩니다.

```ts
function returnFirstValue<T>(data: [T, ...unknown[]]) {
  return data[0];
}
```

만약 첫 번째로 준 인자의 타입을 무조건 할당받고 싶다면 `[T, ...unknown[]]`로 타입을 바꿔서 받을 수 있습니다.

### 특정 속성을 갖고 있는 인수만 받고 싶은 함수

```ts
function getLength<T extends { length: number }>(data: T) {
  return data.length;
}
```

만약 `length` 속성이 있는 값만 인수로 받는 함수를 만들고 싶다면 확장을 이용할 수 있습니다.
`T extends { length: number }`는 `length` 속성이 있는 객체 타입을 확장하는 타입이라는 뜻입니다.

## map 메서드 타입 정의하기

```ts
const arr = [1, 2, 3];
const newArr = arr.map((it) => it * 2);
```

`map` 메서드의 콜백 함수 안에 `it`이라는 매개 변수의 타입은 `number` 타입으로 추론됩니다.
자동으로 매개변수의 타입이 추론되는 이유는 `map` 메서드의 타입이 어딘가에 별도로 선언이 되어있기 때문입니다.

![lib.es5.d.ts파일에 map메서드가 정의된 사진](/assets/blog/typescript-6/1.png)

`map` 메서드를 타고 들어가면 `lib.es5.d.ts`라는 자바스크립트 내장 함수의 타입들이 선언된 파일에 타입 정의가 된 걸 볼 수 있습니다.
꽤 복잡해보이는 `map` 메서드의 타입을 직접 구현해보도록 하겠습니다.

```ts
function map<T>(arr: T[], callback: (item: T) => T) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i]));
  }
  return result;
}
```

배열의 `map` 메서드 타입은 이미 선언되어 있기 때문에 메서드 타입을 따로 정의하기 위해 별도의 `map` 메서드를 함수로 따로 만들어줍니다.

```ts
map(arr, (it) => it * 2);
map(["hi", "hello"], (it) => it.toUpperCase());
map(["hi", "hello"], (it) => parseInt(it)); // 오류!
```

위 두 줄의 코드는 `it`의 타입이 `number`, `string`으로 추론되어 잘 동작하지만 세 번째 줄의 코드는 오류가 발생합니다.
오류가 발생하는 이유는 콜백 함수의 반환 타입이 `number`가 되기 때문입니다.

하지만 실제 `map` 메서드는 `string` 타입의 배열을 인수로 전달한다고 해서 결과값이 반드시 `string` 배열 타입인 이유는 없습니다.

```ts
function map<T, U>(arr: T[], callback: (item: T) => U) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i]));
  }
  return result;
}

map(["hi", "hello"], (it) => parseInt(it));
```

이럴 때에는 제네릭 함수의 타입 변수를 하나만 사용하면 안 됩니다.
위와 같이 작성하면 오류가 사라지는데 이유는 `arr`에 `string[]` 타입이 들어오고 `item`의 타입도 `string`이 됩니다.
그리고 콜백 함수의 반환값은 `number` 타입이기 때문에 `U`의 타입이 이때 추론되어 `number` 타입이 들어오게 됩니다.

## 제네릭 인터페이스와 타입 별칭

### 제네릭 인터페이스

```ts
interface KeyPair<K, V> {
  key: K;
  value: V;
}

let keyPair: KeyPair<string, number> = {
  key: "key",
  value: 0,
};
```

제네릭 인터페이스를 타입으로 사용할 때에는 반드시 타입 변수에 할당할 타입을 `<>`와 함께 사용해야 합니다.

타입 변수는 타입 파라미터, 제네릭 타입 변수, 제네릭 타입 파라미터 등으로도 불립니다.

제네릭 인터페이스는 특히 객체의 인덱스 시그니처 문법과 함께 사용하면 유연한 객체 타입을 만들 수 있습니다.

```ts
interface Map<V>{
  [key: string]: V
};

let stringMap: Map<string> = {
  key: "value",
};

let booleanMap<boolean> = {
  key: true,
};
```

인덱스 시그니처와 제네릭 인터페이스를 사용하여 만든 `Map` 타입 하나로 다양한 객체를 표현할 수 있습니다.

### 제네릭 타입 별칭

```ts
type Map2<V> = {
  [key: string]: V;
};

let stringMap2: Map2<string> = {
  key: "hello",
};
```

제네릭 타입 별칭을 만드는 법은 제네릭 인터페이스와 문법만 다르고 거의 비슷합니다.

### 제네릭 인터페이스의 활용 예시

```ts
interface Student {
  type: "student";
  school: string;
}

interface Developer {
  type: "developer";
  skill: string;
}

interface User {
  name: string;
  profile: Student | Developer;
}

function goToSchool(user: User) {
  if (user.profile.type !== "student") {
    console.log("잘 못 오셨습니다.");
    return;
  }

  const school = user.profile.school;
  console.log(`${school}로 등교 완료`);
}

const developerUser: User = {
  name: "장원정",
  profile: {
    type: "developer",
    skill: "TypeScript",
  },
};

const studentUser: User = {
  name: "홍길동",
  profile: {
    type: "student",
    school: "안양고등학교",
  },
};
```

`goToSchool` 함수는 `User` 타입을 인수로 받아서 `profile`이 `Student`인 `User`가 들어왔을 때만 등교 완료를 출력하는 함수입니다.
하지만 `User`의 구분이 많아지고 특정 회원만 이용할 수 있는 `goToSchool`과 같은 함수가 많아지면 함수를 만들 때마다 타입 좁히기를 사용해야 하기 때문에 불편해집니다.
이럴 때 제네릭 인터페이스를 사용하면 깔끔하게 코드를 작성할 수 있습니다.

```ts
interface Student {
  type: "student";
  school: string;
}

interface Developer {
  type: "developer";
  skill: string;
}

interface User<T> {
  name: string;
  profile: T;
}

function goToSchool(user: User<Student>) {
  const school = user.profile.school;
  console.log(`${school}로 등교 완료`);
}

const developerUser: User<Developer> = {
  name: "장원정",
  profile: {
    type: "developer",
    skill: "TypeScript",
  },
};

const studentUser: User<Student> = {
  name: "홍길동",
  profile: {
    type: "student",
    school: "안양고등학교",
  },
};

goToSchool(developerUser); // 오류!
```

`User` 인터페이스를 제네릭 인터페이스로 바꿔 `profile`의 타입에 타입 변수를 할당해줍니다.
이렇게 수정하면 `goToSchool` 함수에 타입 좁히기 코드는 없애도 됩니다.
객체 타입들로 조합된 복잡한 객체 타입을 정의하여 사용할 때에는 제네릭 인터페이스를 사용하면 비교적 코드와 타입들의 유형을 깔끔하게 분리해줄 수 있어서 유용합니다.

## 제네릭 클래스

```ts
class NumberList {
  constructor(private list: number[]) {}

  push(data: number) {
    this.list.push(data);
  }

  pop() {
    return this.list.pop();
  }

  print() {
    console.log(this.list);
  }
}

const numberList = new NumberList([1, 2, 3]);
numberList.pop();
numberList.push(4);
numberList.print(); // [1, 2, 4]
```

`NumberList` 클래스를 만들고 메서드도 정상적으로 동작하는 코드입니다.
이때 `StringList` 클래스도 필요하다고 가정하면 `NumberList` 클래스를 만들 때 타입을 `number`로 모두 고정해놔서 `NumerList` 클래스를 똑같이 작성 후 `number` 타입을 `string` 타입으로 바꿔 거의 중복된 클래스를 하나 더 선언해줘야 합니다.
이럴 때 제네릭 클래스를 이용하여 문제를 해결할 수 있습니다.

```ts
class List<T> {
  constructor(private list: T[]) {}

  push(data: T) {
    this.list.push(data);
  }

  pop() {
    return this.list.pop();
  }

  print() {
    console.log(this.list);
  }
}

const numberList = new List([1, 2, 3]);
numberList.pop();
numberList.push(4);
numberList.print(); // [1, 2, 4]

const stringList = new List(["1", "2"]);
```

`NumberList` 클래스를 `List`로 수정 후 제네릭 클래스로 바꿔줍니다.
생성자 함수의 인수로 들어오는 타입을 타입 변수에 할당하여 전달해주는 배열 타입에 대응하는 클래스를 만들 수 있습니다.
제네릭 클래스는 제네릭 인터페이스와 제네릭 타입 변수와는 다르게 클래스의 생성자를 호출할 때 생성자의 인수로 전달하는 값을 기준으로 타입을 추론하기 때문에 반드시 타입 명시를 해주지 않아도 됩니다.

## 프로미스와 제네릭

```ts
const pormise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(20);
  }, 3000);
});

promise.then((response) => {
  console.log(response); // 20
});
```

간단한 비동기 코드를 작성해주고 출력하면 의도한 값인 20이 출력됩니다.
하지만 `console.log(response * 10);`으로 작성하면 오류가 발생합니다.
왜냐하면 `response`는 `unknown` 타입으로 추론되기 때문입니다.
`Promise`는 `resolve`나 `reject`를 호출해서 전달하는 비동기 작업의 결과값 타입을 자동으로 추론할 수 있는 기능을 가지고 있지 않아서 `unknown` 타입으로 추론합니다.

```ts
const pormise = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    resolve(20);
  }, 3000);
});

promise.then((response) => {
  console.log(response * 10);
});
```

자바스크립트의 내장 클래스인 `Promise`는 타입스크립트에서는 제네릭 클래스로 타입이 별도로 선언되어 있습니다.
그렇기 때문에 `Promise`의 생성자를 호출할 때 비동기 작업의 결과값 타입을 할당해주면 `response`의 타입이 할당한 타입으로 추론되고 `resolve`를 호출할 때도 반드시 인수를 전달한 타입으로만 받을 수 있게 바뀝니다.

```ts
const pormise = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    reject("~~ 때문에 실패");
  }, 3000);
});

promise.catch((err) => {
  if (typeof err === "string") {
    console.log(err);
  }
});
```

실패했을 경우 `reject`를 호출하게 되면 `reject` 함수는 `reject: (reason?: any) => void`로 정의되어 있습니다.
인수로 선택적 매개 변수고 `any` 타입으로 정의되어 있습니다.
`catch` 메서드의 매개변수 `err`의 타입 또한 `any` 타입으로 추론됩니다.
`Promise`의 `catch` 메서드 사용 시에는 매개 변수의 타입을 정확히 알 수 없어서 프로젝트의 상황에 맞게 타입 좁히기를 사용해야 합니다.

### 프로미스를 반환하는 함수의 타입을 정의

```ts
interface Post {
  id: number;
  title: string;
  content: string;
}

function fetchPost() {
  return new Promise<Post>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        title: "게시글 제목",
        content: "게시글 컨텐츠",
      });
    }, 3000);
  });
}

const postRequest = fetchPost();

postRequest.then((post) => {
  post.id;
});
```

`fetchPost` 함수의 반환값 타입을 설정하기 위해 `new Promise<Post>`로 작성해줄 수 있습니다.

```ts
function fetchPost(): Promise<Post> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        title: "게시글 제목",
        content: "게시글 컨텐츠",
      });
    }, 3000);
  });
}
```

하지만 `fetchPost` 함수의 반환값 타입으로 `Promise<Post>`으로 설정하여 해결해줄 수도 있습니다.
이 방식이 함수의 선언부만 봐도 반환값 타입을 알 수 있기 때문에 가독성 면에서 더 좋다고 합니다.
