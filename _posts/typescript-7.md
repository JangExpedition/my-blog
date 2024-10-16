---
title: "TypeScript 타입 조작하기"
description: "TypeScript의 타입 조작하기에 대해서 알아봅니다."
thumbnail: "/assets/blog/typescript-7/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-16 11:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

타입 조작하기란 기본 타입이나 별칭, 인터페이스로 만든 타입들을 타입스크립트의 특수한 문법을 이용하여 상황에 따라 다른 타입으로 변환하는 기능입니다.

제네릭도 함수나 인터페이스, 별칭, 클래스 등에 적용하여 상황에 따라 달라지는 가변적인 타입을 정의할 수 있었기 때문에 타입을 조작하는 기능에 포함됩니다.

타입스크립트는 제네릭 이외에도 인덱스드 엑세스 타입, keyof 연산자, Mapped 타입, 템플릿 리터럴 타입, 조건부 타입 등 다양한 타입 조작 기능을 제공합니다.

## 인덱스드 엑세스 타입

인덱스드 엑세스 타입이란 인덱스를 이용하여 다른 타입 내에 특정 프로퍼티의 타입을 추출하는 타입입니다.
인덱스드 엑세스 타입은 객체, 배열, 튜플에 모두 사용할 수 있습니다.

```ts
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
}

function printAuthorInfo(author: { id: number; name: string }) {
  return `${author.name}-${author.id}`;
}

const post: Post = {
  title: "게시글 제목",
  content: "게시글 본문",
  author: {
    id: 1,
    name: "장원정",
  },
};

printAuthorInfo(post.author);
```

`printAuthorInfo` 함수의 `author` 매개변수의 타입을 `{id: number; name: string;}`으로 정의해줬습니다.
하지만 `Post` 타입에서 `author` 속성에 `age` 속성을 추가하라는 수정 사항이 생기면 `post` 변수에서도 추가하고 `printAuthorInfo` 함수의 매개 변수 타입에도 추가를 해줘야 합니다.
만약 함수가 더 많고 속성이 또 추가된다면 일일히 추가해줘야하는 번거로운 작업이 생깁니다.

```ts
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number;
  };
}

function printAuthorInfo(author: Post["author"]) {
  return `${author.name}-${author.id}`;
}

const post: Post = {
  title: "게시글 제목",
  content: "게시글 본문",
  author: {
    id: 1,
    name: "장원정",
    age: 32,
  },
};

printAuthorInfo(post.author);
```

이럴 때 인덱스드 엑세스 타입을 이용하면 좋습니다.
`Post["author"]`를 작성하여 마치 괄호 표기법을 사용하듯이 뽑아내고 싶은 속성의 타입의 `key`값을 적어주면 됩니다.
그러면 `Post` 타입으로 부터 `author` 속성의 `value`인 객체 타입을 추출해줍니다.

인덱스드 엑세스 타입을 이용하면 새로운 타입이 추가되거나 기존 속성의 타입이 변경되었을 때 즉시 반영을 해주기 때문에 원본 타입이 수정되더라도 별도의 작업을 해주지 않아도 됩니다.

인덱스드 엑세스 타입에서 적어준 `"author"` 스트링 리터럴 타입을 인덱스라 부릅니다. 그래서 인덱스를 통해 특정 타입의 속성에 접근한다고 하여 인덱스드 엑세스 타입이라 부르는 것입니다.

인덱스드 엑세스 타입을 객체에 사용 시 주의할 점이 있습니다.

```ts
const key = "author";

Post[key]; // 오류!
```

인덱스에 변수 `key`를 넣으면 오류가 발생합니다.
왜냐하면 인덱스는 오직 타입만 들어올 수 있기 때문입니다.
하지만 `key`는 변수고 곧 값입니다.
인덱스에 들어가는 문자열은 값이 아니라 스트링 리터럴 타입과 같은 타입만 명시할 수 있습니다.

```ts
Post["what"]; // 오류!
```

추가로 인덱스에 타입을 작성할 때 존재하지 않는 속성명을 써주면 오류가 발생합니다.

```ts
Post["author"]["id"];
```

만약 `author` 속성의 `id` 속성의 타입을 가져오고 싶다면 중첩하여 사용할 수도 있습니다.

인덱스드 엑세스 타입은 객체의 특정 속성뿐만 아니라 배열 타입으로 부터 특정 요소의 타입을 뽑아내는 것도 가능합니다.

```ts
type PostList = {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number;
  };
}[];

function printAuthorInfo(author: PostList[number]["author"]) {
  return `${author.name}-${author.id}`;
}

const post: PostList[number] = {
  title: "게시글 제목",
  content: "게시글 본문",
  author: {
    id: 1,
    name: "장원정",
    age: 32,
  },
};

printAuthorInfo(post.author);
```

인덱스드 엑세스 타입을 이용할 때 대괄호 안에 `number`타입을 넣어주면 배열 타입으로 부터 하나의 요소 타입만 가져옵니다.
`number` 대신에 배열의 인덱스에 접근하는 것처럼 숫자를 넣어도 결과는 동일합니다.

```ts
type Tup = [number, string, boolean];
type Tup0 = Tup[0];
type Tup1 = Tup[1];
type Tup2 = Tup[2];
type Tup3 = Tup[3]; // 오류!
type TupeNum = Tup[number];
```

튜플 타입도 위와 같이 사용하면 각각 `number`, `string`, `boolean` 타입이 할당됩니다.
튜플 타입은 길이가 고정된 배열이기 때문에 존재하지 않는 인덱스의 타입을 추출하려 하면 오류가 발생합니다.
또한 배열 타입을 추출할 때처럼 `number`를 넣어주면 튜플 타입 안에 있는 모든 타입의 최적의 공통 타입(`string | number | boolean`)을 추출합니다.

## keyof 연산자

keyof 연산자는 특정 객체 타입으로 부터 속성의 `key`들을 스트링 유니온 타입으로 추출하는 기능입니다.

```ts
interface Person {
  name: string;
  age: number;
}

function getPropertyKey(person, key) {
  return person[key];
}

const person: Person = {
  name: "장원정",
  age: 32,
};

getPropertyKey(person, "name");
```

`getPropertyKey`의 매개 변수 타입은 어떻게 정의해줘야 할까요?
`person` 매개 변수는 `Person` 타입으로 지정하면 되는데 `key` 매개 변수는 애매합니다.

```ts
function getPropertyKey(person: Person, key: string) {
  return person[key]; // 오류!
}
```

만약 `key`를 `string` 타입으로 정의하면 모든 문자열 값이 `person` 객체의 `key`라고 볼 수 없기 때문에 오류가 발생합니다.

```ts
function getPropertyKey(person: Person, key: "name" | "age") {
  return person[key];
}
```

그렇기 때문에 `key`의 타입을 어쩔 수 없이 `"name" | "age"`, 유니온 타입으로 만들어줘야 합니다.
하지만 지금은 `person` 객체의 속성이 두 개만 있지만 만약 20개가 된다면 모든 key들을 다 붙일 수 없기 때문에 유니온을 쓰는 것은 문제가 큽니다.
추가로 `person` 객체에 속성이 추가되거나 수정되도 계속 수정을 해줘야 합니다.

```ts
function getPropertyKey(person: Person, key: keyof Person) {
  return person[key];
}
```

이럴 때 keyof 연잔자를 이용하면 좋습니다.
`keyof Person`으로 타입을 정의하면 `Person` 객체 타입으로 부터 모든 속성의 `key`를 유니온 타입으로 추출합니다.
따라서 `"name" | "age"`로 추출되는데 만약 `Person` 객체 타입에 속성이 추가되거나 수정된다면 자동으로 반영됩니다.

주의할 점은 keyof 연산자는 무조건 타입에만 사용할 수 있는 연산자입니다.
만약 `keyof person`과 같이 변수를 넣어주면 바로 오류가 발생합니다.

keyof 연산자는 typeof 연산자와 함께 사용할 수 있습니다.

```ts
type Person = typeof person;

const person: Person = {
  name: "장원정",
  age: 32,
};
```

만약 typeof 연산자를 위와 같이 사용하면 정의했던 `Person` 타입과 같이 자동으로 타입스크립트가 추론해줍니다.

```ts
function getPropertyKey(person: Person, key: keyof typeof person) {
  return person[key];
}
```

두 연산자를 함께 사용하면 keyof 연산자에 객체 타입을 사용하지 않더라도 typeof 연산자를 작성해줄 수 있습니다.

## Mapped 타입

맵드 타입도 객체 타입을 조작하는 기능입니다.

```ts
interface User {
  id: number;
  name: string;
  age: number;
}

function fetchUser(): User {
  // ... 기능
  return {
    id: 1,
    name: "장원정",
    age: 32,
  };
}

function updateUser(user: User) {
  // ... 수정하는 기능
}

updateUser({
  id: 1,
  name: "장원정",
  age: 25,
});
```

`updateUser` 함수를 사용할 때 변경하고 싶은 속성은 `age` 속성 하나뿐이지만 다른 속성들도 모두 적어주는 것이 아쉽습니다.
지금은 속성이 많지 않지만 만약 속성이 많다면 더욱 번거로울 것입니다.
변경되는 속성만 적어서 보내고 싶은데 매개 변수 타입이 `User`로 되어 있기 때문에 원하는 속성만 보내기 어려운 상황입니다.

`User`의 모든 속성을 선택적 프로퍼티로 작성한 속성을 만들고 매개 변수 타입으로 지정하여 사용할 수도 있습니다.
하지만 `updateUser` 기능 하나 때문에 중복된 코드가 발생하게 됩니다.

이 문제는 맵드 타입으로 해결할 수 있습니다.

```ts
type User = {
  id: number;
  name: string;
  age: number;
};

type PartialUser = {
  [key in keyof "id" | "name" | "age"]?: User[key];
};
```

우선 맵드 타입은 인터페이스로 만들 수 없습니다.
리터럴 타입으로 `User`를 정의한 뒤 `key`의 타입을 정의해줍니다.
인덱스 시그니처를 사용하는 것처럼 대괄호를 열고 `key in "id" | "name" | "age"`를 작성해줍니다.
`"id" | "name" | "age"`는 `User` 객체의 모든 `key`들입니다.
`value` 타입을 보면 인덱스드 엑세스를 사용해줍니다.
인덱스로 사용된 `key`는 `in` 연산자 우측에 있는 `"id" | "name" | "age"` 타입들이 하나씩 할당됩니다.

추가로 `?`를 붙여주면 맵드 타입이 정의하는 모든 속성이 선택적 프로퍼티가 됩니다.

```ts
type BooleanUser = {
  [key in keyof User]: boolean;
};
```

만약 위와 같이 작성하면 모든 속성이 `boolean` 타입을 갖는 객체 타입을 만들 수 있습니다.
또한 `in` 연산자 우측에 모든 객체의 속성을 유니온으로 작성하기 힘들다면 keyof 연산자를 통해서 해결할 수 있습니다.

```ts
type ReadonlyUser = [
  readonly [key in keyof User]: User[key];
]
```

만약 `readonly`를 붙여주면 모든 속성에 읽기 전용 속성이 부여됩니다.

## 템플릿 리터럴 타입

```ts
type Color = "red" | "black" | "green";
type Animal = "dog" | "cat" | "chicken";
type ColoredAnimal = "red-dog" | "red-cat" | "red-chicken" | ...
```

`Color` 타입과 `Animal` 타입이 조합된 `ColoredAnimal` 타입을 작성하려면 작성해야할 코드도 많고 유지 보수성도 좋지 않습니다.

```ts
type Color = "red" | "black" | "green";
type Animal = "dog" | "cat" | "chicken";
type ColoredAnimal = `${Color}-${Animal}`;
```

이럴 때 템플릿 리터럴 타입을 사용하여 `${Color}-${Animal}` 이렇게 작성해주면 `Color`에 올 수 있는 타입들과 `Animal`로 올 수 있는 모든 타입들이 조합이된 타입이 만들어집니다.
