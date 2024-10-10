---
title: "TypeScript 기본"
description: "TypeScript의 기본 타입에 대해서 정리한 내용입니다."
thumbnail: "/assets/blog/typescript-2/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-07 11:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

### 인덱스 시그니처

```ts
type CountryCodes = {
  [key: string]: string;
};

let contryCodes: CountryCodes = {
  Korea: "ko",
  UnitedState: "us",
  UnitedKingdom: "uk",
};

let contryCodes1: CountryCodes = {};
```

만약 `contryCodes`를 타입 별칭으로 타입을 지정한다면 `contryCodes`에 세계 모든 국가의 코드를 모두 넣어야 한다면 타입 별칭에도 모든 요소의 `key`를 넣어줘야 합니다.
이때 객체의 `key`와 `value`의 규칙을 기준으로 객체의 타입을 정의할 수 있는 문법이 인덱스 시그니처입니다.
인덱스 시그니처를 이용하면 `key`와 `value`의 타입이 규칙을 가지고 움직이는 타입을 정의할 때 유용하게 사용할 수 있습니다.

하지만 `contryCodes1`처럼 빈 객체를 넣어도 아무런 오류가 발생하지 않습니다.
인덱스 시그니처는 규칙을 위반하지 않으면 모든 객체를 허용하는 타입인데 아무런 속성이 없는 객체이기 때문에 규칙을 위반할 속성이 없기 때문입니다.

```ts
type CountryCodes = {
  [key: string]: string;
  Korea: string;
};

let contryCodes: CountryCodes = {}; // 오류!
```

빈 객체가 들어가는 문제를 방지하기 위해 반드시 `Korea`라는 `string` 타입의 속성이 있어야 한다고 적어주면 빈 객체를 넣었을 경우 오류가 발생합니다.

```ts
type CountryCodes = {
  [key: string]: string;
  Korea: number;
}; // 오류!

let contryNumberAndStringCodes: CountryCodes = {
  Korea: 410,
}; // 오류!
```

추가로 `contryNumberAndStringCodes`로 바꿔서 `number` 타입과 `string` 타입을 모두 받도록 수정하기 위해 위와 같이 코드를 입력하면 오류가 발생합니다.
인덱스 시그니처를 사용하는 객체 타입에서 추가적인 속성을 정의하려면 추가적인 속성의 `value` 타입이 반드시 인덱스 시그니처와 일치하거나 호환해야 합니다.

### Enum

```ts
enum Role {
  ADMIN,
  USER,
  GUEST,
}

enum Language {
  korean = "ko",
  english = "en",
}

const user1 = {
  name: "장원정",
  role: Role.ADMIN,
  language: Language.korean,
};
const user2 = {
  name: "홍길동",
  role: Role.USER,
  langauge: Language.english,
};
const user3 = {
  name: "아무개",
  role: Role.GUEST,
};

console.log(user1, user2, user3);
```

위와 같은 코드를 작성하고 실행하면

![enum 코드 출력 결과](/assets/blog/typescript-2/1.png)

잘 출력되는 걸 확인할 수 있습니다.
하지만 타입스크립트의 타입 관련 코드들은 컴파일 결과로 다 사라진다고 했는데 `role`과 `language` 속성에 `Role.ADMIN`처럼 값을 쓰는 것처럼 사용하고 있습니다.
컴파일이 되면 사라진다고 했는데 오류를 발생하지 않고 실행이 되는 이유는 `Enum`은 컴파일 결과로 사라지지 않습니다.

![enum 코드 컴파일 결과](/assets/blog/typescript-2/2.png)

실제로 컴파일된 자바스크립트 파일을 살펴보면 복잡하지만 자바스크립트의 객체로 변환되는 걸 확인할 수 있습니다.
결론적으로 타입스크립트의 `Enum`은 컴파일 결과 사라지지 않고 자바스크립트의 객체로 변환되기 때문에 코드상에서 값을 사용하듯이 사용할 수 있습니다.
