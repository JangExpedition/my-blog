---
title: "TypeScript 유틸리티 타입"
description: "TypeScript의 유틸리티 타입에 대해서 알아봅니다."
thumbnail: "/assets/blog/typescript-8/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-17 12:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 유틸리티 타입

유틸리티 타입은 타입스크립트가 자체적으로 제공하는 제네릭, 맵드 타입, 조건부 타입 등의 타입 조작 기능을 이용해 실무에서 사용되는 타입을 미리 만들어 놓은 것입니다.

```ts
interface Person {
  name: string;
  age: number;
}

const person1: Readonly<Person> = {
  name: "장원정",
  age: 32,
};

person1.name = ""; // 오류!

const person2: Partial<Person> = {
  name: "장원정",
};
```

예를 들어 `Person` 객체 타입을 정의되어 있을 때 `Readonly`라는 유틸리티 타입을 사용하면 타입 변수로 전달한 객체 타입에 모든 속성을 `readonly` 속성으로 바꿔주는 동작이 가능합니다.
그래서 `person1.name`을 수정하려고 하면 오류가 발생합니다.

또한 `Partial`이라는 유틸리티 타입을 이용하여 모든 속성을 선택적 속성으로 바꾸는 변형도 가능합니다.

![TypeScript 공식문서에 나와있는 유틸리티 타입](/assets/blog/typescript-9/1.png)

타입스크립트의 공식 문서에 다양한 유틸리티 타입에 대한 정보를 확인할 수 있습니다.

![자주 사용되는 유틸리티 타입](/assets/blog/typescript-9/2.png)

하지만 자주 사용되지 않는 타입들도 존재하기 때문에 가장 자주 활용되는 유틸리티 타입들을 직접 만들어보면서 살펴보겠습니다.

## 맵드 타입 기반의 유틸리티 타입들 (`Partial<T>`, `Required<T>`, `Readonly<T>`)

### `Partial<T>`

Partial을 직역하면 '부분적인', '일부분의'라는 뜻을 갖고 있습니다.
Partial은 특정 객체 타입의 모든 속성을 선택적 속성으로 바꿔주는 타입입니다.

```ts
interface Post {
  title: string;
  tags: string[];
  content: string;
  thumbnailURL?: string;
}

const draft: Post = {
  title: "제목 나중에",
  content: "초안 ...",
}; // 오류!
```

게시글을 임시 저장된 게시글을 표현한 변수 `draft`을 `Post` 타입을 정의하면 오류가 발생합니다.

```ts
const draft: Partial<Post> = {
  title: "제목 나중에",
  content: "초안 ...",
};
```

이럴 때 `Partial<Post>`로 정의해주면 타입 변수로 전달한 `Post` 타입에 모든 속성을 선택적 속성으로 만드는 유틸리티 타입이 되어 오류가 사라집니다.

```ts
type Partial<T> = any;
```

직접 만들어보면 `Partial` 타입은 하나의 타입 변수를 받는 제네릭 타입으로 정의해줍니다.
타입 변수에는 객체 타입이 들어오고 들어온 객체 타입에 모든 속성을 선택적 속성으로 만들어야 합니다.
즉 특정 객체 타입을 새로운 객체 타입으로 변환하는 작업이 필요하므로 맵드 타입을 이용할 수 있습니다.

```ts
type Partial<T> = {
  [key in keyof T]?: T[key];
};
```

코드를 하나씩 살펴보면 `keyof 연산자`는 특정 객체 타입으로 부터 모든 `key`를 유니온 타입으로 추출하는 연산자이므로 `keyof T`는 `title | tags | content | thumbnailURL`이 됩니다.
다음으로 `in` 연산자는 맵드 타입에서 제공되는 연산자로 좌항의 `key`가 우항의 유니온 타입에 하나씩 맵핑이 됩니다.
따라서 타입 변수 `T`에 들어온 객체 타입의 `key`를 모두 갖게 됩니다.

`T[key]`는 인덱스드 엑세스 타입으로 특정 객체나 배열로 부터 특정 속성의 타입을 추출하는 타입입니다.
따라서 타입 변수 `T`에 들어오는 객체 타입으로 부터 `key`에 해당하는 `value` 타입을 추출합니다.

이렇게 `Partial<T>` 타입을 직접 구현했습니다.

### `Required<T>`

Required 특정 객체 타입의 모든 속성을 필수 속성으로 바꿔주는 타입입니다.

```ts
const withThumbnailPost: Required<Post> = {
  title: "TypeScript 유틸리티 타입",
  tags: ["TypeScript"],
  content: "",
}; // 오류!
```

`thumbnailURL` 속성은 `Post` 타입을 정의할 때 선택적 속성으로 정의했기 때문에 존재하지 않더라도 오류가 발생하지 않습니다.
하지만 `thumbnailURL` 속성을 반드시 추가해야 하는 상황이라면 `Required<Post>`를 추가하여 필수 속성으로 만들 수 있습니다.

```ts
type Required<T> = {
  [key in keyof T]-?: T[key];
};
```

`Partial`과 반대로 모든 타입을 필수 속성으로 바꿔줘야 합니다.
이럴 때 선택적 속성이 속성명 뒤에 `?`가 붙는 건데 `?`를 없앤다는 의미로 `-?`를 붙여주면 됩니다.

### `Readonly<T>`

Readonly는 특정 객체 타입에서 모든 속성을 읽기 전용 속성으로 바꿔주는 타입입니다.

```ts
type Readonly<T> = {
  readonly [key in keyof T]: T[key];
};
```

`Partial`과 `Required`와 마찬가지로 타입 변수로 만든 객체 타입을 모두 정의해준 뒤 `readonly`를 추가하면 완성됩니다.

## 맵드 타입 기반의 유틸리티 타입들 2 (`Pick<T, K>`, `Omit<T, K>`, `Record<V, K>`)

### `Pick<T, K>`

Pick은 객체 타입으로 부터 특정 속성만 골라내는 타입입니다.

```ts
interface Post {
  title: string;
  tags: string[];
  content: string;
  thumbnailURL?: string;
}

const legacyPost: Post = {
  title: "옛날 글",
  content: "옛날 컨텐츠",
}; // 오류!
```

예전에 작성된 게시글을 표현하는 `legacyPost` 변수는 `tags`나 `thumbnailURL` 속성이 없었다고 가정하고 `Post` 타입을 정의하면 오류가 발생합니다.

```ts
const legacyPost: Pick<Post, "title" | "content"> = {
  title: "옛날 글",
  content: "옛날 컨텐츠",
};
```

이럴 때 `Pick` 타입을 활용하여 `Pick<Post, "title" | "content">`라고 작성해주면 `Post` 타입으로 부터 `title`, `content` 속성만 있는 객체 타입으로 새롭게 정의해줘서 오류가 사라집니다.

```ts
type Pick<T, K> = {
  [key in K]: T[key]; // 오류!
};
```

타입 변수 `K`로 들어온 유니온 타입을 `in` 연산자를 통해 좌항의 `key`에 하나씩 매핑해주고 `T[key]`를 통해서 각 `key`의 `value` 타입을 추출하여 정의했습니다.
하지만 오류가 발생합니다.
오류 메세지를 보면 `'K' 형식은 'string | number | symbol' 형식에 할당할 수 없습니다`라는 내용이 나옵니다.
`in` 연산자 우항에는 스트링 리터럴로 만든 유니온 타입이 들어오는데 타입 변수 `K`에 아무런 제한이 걸려있지 않아서 `K`에는 함수, 객체, never 타입 등 모든 타입이 들어올 수 있기 때문입니다.

```ts
type Pick<T, K extends keyof T> = {
  [key in K]: T[key]; // 오류!
};
```

`K`에 들어올 타입을 제한해주기 위해 `extends keyof T`를 작성하면 타입 변수 `K`에 할당할 수 있는 타입은 `T`로 들어오는 객체 타입에 `key`값들을 추출한 유니온 타입의 서브 타입만 들어올 수 있게 됩니다.

따라서 조건식이 `'title' | 'content' extends 'title' | 'tags' | 'content' | 'thumbnailURL'`이 되므로 참이 되고 `K`에 `number`를 넣으면 조건식이 일치하지 않아 오류가 발생합니다.

### `Omit<T, K>`

Omit을 직역하면 생략하다, 빼다라는 의미로 객체 타입으로 부터 특정 속성을 제거하는 타입입니다.

```ts
const noTitlePost: Pick<Post, "content" | "tags" | "thumbnailURL"> = {
  content: "",
  tags: [],
  thumbnailURL: "",
};
```

제목이 없는 `noTitlePost`의 타입을 정의할 때 `Pick`을 활용할 수도 있지만 만약 `Post`의 속성과 골라내야할 속성이 많아지면 사용성이 좋지 않습니다.

```ts
const noTitlePost: Omit<Post, "title"> = {
  content: "",
  tags: [],
  thumbnailURL: "",
};
```

이럴 때 `Omit` 타입을 이용하면 `Post` 타입으로부터 `title` 속성만 제거한 타입을 만들어 줍니다.

```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

`Omit` 타입은 `Pick` 타입을 이용하여 직접 정의할 수 있습니다.
자세히 살펴보면 타입 변수 `T`에는 `Post` 타입이 들어오고 `K`에는 `title` 타입이 들어옵니다.
이를 토대로 우항을 바꾸면 `Pick<Post, Exclude<keyof Post, "title">>`이 되고 `keyof Post`까지 펼치면 `Pick<Post, Exclude<"title" | "tags" | "content" | "thumbnailURL", "title">>`이 됩니다.

`Exclude` 타입은 분산적인 조건부 타입에서 본 내용으로 두 개의 타입 변수를 받고 첫 번째로 전달한 타입 변수에서 두 번째로 전달한 타입 변수를 제거하는 타입을 반환합니다.
`Exclude`의 결과로 `Pick<Post, "tags" | "content" | "thumbnailURL", "title">`이 되어서 `Post` 타입에서 `tags`, `content`, `thumbnailURL`만 있는 객체 타입을 반환해줍니다.
