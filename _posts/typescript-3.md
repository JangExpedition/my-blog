---
title: "TypeScript 이해하기"
description: "TypeScript의 타입을 이해하기 위해 정리한 내용입니다."
thumbnail: "/assets/blog/typescript-3/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-08 10:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 타입은 집합이다.

타입은 동일한 속성과 특징들을 갖는 여러 값들을 모아둔 집합입니다.

```js
let num: 20 = 20;
```

number 리터럴 타입은 또한 20이라는 값 하나만 포함하는 작은 집합이라고 생각할 수 있습니다.
추가로 number 리터럴 타입 안에 있는 20이라는 값은 number 타입에도 속하는 값입니다.
즉 number 리터럴 타입의 집합은 number 타입의 부분 집합입니다.

값의 집합인 타입들은 서로 포함하거나 다른 타입에 포함되는 관계를 갖습니다. number 타입처럼 number 리터럴 타입과 같은 다른 타입을 포함하는 더 큰 타입을 슈퍼 타입(부모 타입)이라고 부릅니다.
반대로 number 리터럴 타입처럼 다른 타입에 포함되고 있는 타입을 서브 타입(자식 타입)이라고 부릅니다.

타입스크립트에서 말하는 타입이란 값들을 포함하고 있는 집합이며 타입간의 부모-자식 관계를 맺고 모든 타입들의 관계를 놓고 보면 타입 계층도로 만들어서 표현할 수 있습니다.

### 타입 호환성

![타입 호환성을 나타낸 그림](/assets/blog/typescript-3/8.png)

타입들이 계층을 이룬다는 정보를 알고 있으면 타입 호환성에 대해 이해할 수 있습니다.

```js
let num1: number = 10;
let num2: 10 = 10;

num1 = num2;
```

코드를 통해 살펴보면 `num2`를 `num1`에 넣는 것은 number 타입에 number 리터럴 타입을 넣는 것이므로 괜찮습니다.

```js
let num1: number = 10;
let num2: 10 = 10;

num2 = num1; // 오류
```

하지만 반대로 더 큰 타입의 값을 더 작은 타입의 변수에 할당하지는 못합니다.

이렇게 서브 타입의 값을 슈퍼 타입으로 취급하는 걸 업 캐스팅, 반대로 큰 타입을 작은 타입으로 취급하는 건 다운 캐스팅이라고 합니다.
다운 캐스팅은 대부분의 상황에 허용되지 않고 업 캐스팅은 모든 상황에 문제없이 가능합니다.

## 타입 계층도와 함께 기본 타입 살펴보기

![타입 계층도](/assets/blog/typescript-3/9.png)

### Unknown 타입 & Never 타입

Unknown 타입은 타입 계층도의 최상단에 위치하고 있기 때문에 모든 타입의 슈퍼 타입인 전체 집합이라고 볼 수 있습니다.

반대로 Never 타입은 타입 계층도의 가장 아래 위치하고 있기 때문에 모든 타입의 서브 타입인 모든 집합의 부분 집합이라고 볼 수 있습니다.

Unknown 타입은 모든 타입의 슈퍼 타입이기 때문에 변수에 `unknown`이라고 정의되어 있다면 모든 값을 넣을 수 있지만 모든 타입의 변수에 할당할 수 없습니다.

Never 타입은 모든 타입의 서브 타입이기 때문에 변수에 `never`라고 정의되어 있다면 모든 타입의 변수에 할당할 수는 있지만 모든 값을 넣을 수는 없습니다.

### Void

Void 타입은 Undefined의 슈퍼 타입입니다.

```js
let voidVar: void = undefined;
```

따라서 `void`로 정의된 변수에는 `undefined`를 할당할 수 있습니다.

```js
function voidFunc(): void {
  return undefined;
}
```

그렇기 때문에 함수의 반환값을 `void`로 설정해두면 `undefined`를 반환해도 문제가 되지 않습니다.

### Any

Any 타입은 타입 계층도 상에서는 Unknown 타입의 서브 타입으로 위치해 있지만 Any 타입은 타입 계층도를 완벽히 무시합니다.
Any 타입은 모든 타입의 슈퍼 타입으로 위치하기도 하고 Never 타입을 제외한 모든 타입의 서브 타입으로도 위치하기도 합니다.

```js
let unknownVar: unknown;
let anyVar: any;

anyVar = unknownVar;
```

Unknown 타입은 Any 타입의 슈퍼 타입이지만 위와 같이 코드를 작성하면 오류가 발생하지 않고 다운 캐스팅할 수 있습니다.

```js
let undefinedVar: undefined;
let anyVar: any;

undefinedVar = anyVar;
```

반대로 Undefined 타입의 변수에 Any 타입의 값을 할당해도 문제없이 실행됩니다.
따라서 Any 타입은 본인한테 다운 캐스팅하는 것도 가능하고 본인이 다운 캐스팅하는 것도 가능합니다.

```js
let neverVar: never;
let anyVar: any;

neverVar = anyVar; // 오류
```

하지만 치트키 같은 Any 타입도 안 되는 것이 하나 있는데 Never 타입의 변수에 할당할 수 없습니다.
Never 타입은 순수한 공집합이기 때문에 Never 타입에는 어떠한 타입도 다운 캐스팅할 수 없습니다.

## 객체 타입의 호환성

```js
type Animal = {
  name: string,
  color: string,
};

type Dog = {
  name: string,
  color: string,
  breed: string,
};

let animal: Animal = {
  name: "기린",
  color: "yellow",
};

let dog: Dog = {
  name: "돌돌이",
  color: "brown",
  breed: "진도",
};

animal = dog;
dog = animal; // 오류
```

`animal` 변수에 `dog` 값을 할당하면 아무 문제 없지만 `dog` 변수에 `animal` 값을 할당하면 오류가 발생합니다.
이를 통해 알 수 있는 건 `Animal` 타입이 슈퍼 타입이고 `Dog` 타입이 서브 타입입니다.
객체 타입들도 기본 타입들처럼 속성을 기준으로 슈퍼-서브 타입 관계를 갖습니다.
객체는 속성을 기준으로 타입을 정의하는 구조적 타입 시스템을 따릅니다.
`Dog` 타입은 `Animal` 타입의 속성을 모두 갖고 있고`breed` 속성을 추가로 갖고 있지만 객체 타입을 정의할 때는 추가적인 속성가 있는 타입이 슈퍼 타입이 되는 것이 아닌 조건이 더 적은 타입이 슈퍼 타입이 됩니다.

### 초과 프로퍼티 검사

```js
let animal2: Animal = {
  name: "돌돌이",
  color: "brown",
  breed: "진도", // 오류!
};
```

`Animal` 타입의 변수에 `Dog` 타입의 값을 할당하는 것은 가능하지만 `Animal` 타입의 변수를 초기화 할 때 `breed` 속성을 넣으려고 하면 오류가 발생합니다.
오류가 나는 이유는 초과 프로퍼티 검사라는 타입스크립트의 특수한 기능이 발생하기 때문입니다.
초과 프로퍼티 검사란 변수를 초기화할 때 초기화하는 값으로 객체 리터럴을 사용하면 발동하는 검사입니다.
객체 타입을 초기화할 때 객체 리터럴을 사용하면 안 되도록 막는 검사가 초과 프로퍼티 검사입니다.
따라서 객체 타입의 변수를 초기화할 때 객체 리터럴을 사용하면 객체 타입에 정의된 속성만 사용해야 합니다.

```js
let animal3: Animal = dog;
```

초과 프로퍼티 검사를 피하려면 변수를 할당하면 초기화할 때 객체 리터럴을 사용하지 않았기 때문에 초과 프로퍼티 검사가 발동하지 않아서 허용됩니다.

```js
function func(aniaml: Animal) {}

func({
  name: "돌돌이",
  color: "brown",
  breed: "진도",
}); // 오류!
```

만약 함수가 `Animal` 타입의 매개 변수를 받을 때 함수의 인수로 객체 리터럴을 전달하면 초과 프로퍼티 검사가 발동합니다.

```js
func(dog);
```

서브 타입 객체를 전달하려하면 객체 리터럴이 아닌 변수에 저장하여 인수로 전달해야 합니다.

## 타입 추론

타입스크립트는 점진적인 타입 시스템을 채택하였고 점진적인 타입 시스템이라는 것은 변수에 타입이 정의되어 있지 않아도 초기값을 넣어주기만 하면 타입스크립트가 초기값을 기준으로 타입을 추론하는 편리한 시스템입니다.
하지만 타입스크립트가 모든 상황에 타입을 추론해주진 않습니다.

```js
function func(param) {} // 오류
```

만약 매개 변수가 있는 함수를 만들 때 매개 변수의 타입을 직접 정의해주지 않으면 타입스크립트가 추론할 수 없기 때문에 오류가 발생합니다.

```js
let a = 10;
```

일반적으로 변수를 선언하고 초기화하는 상황에서는 변수의 초기값을 기준으로 자동으로 타입을 잘 추론합니다.

```js
let c = {
  id: 1,
  name: "장원정",
  profile: {
    nickname: "Tazoal",
  },
  urls: ["https://tazoal.vercel.app"],
};
```

초기값을 기준으로 타입을 추론하기 때문에 변수에 복잡한 객체를 저장해도 타입을 잘 추론합니다.

```js
let { id, name, profile } = c;
```

객체를 구조 분해 할당할 때에도 변수의 타입을 자동으로 잘 추론합니다.

```js
let [one, two, three] = [1, "hello", ture];
```

마찬가지로 배열을 구조 분해 할당해도 각각의 원소를 잘 추론합니다.

```js
function func(message = "hello") {
  return "hello";
}
```

함수의 반환값을 문자열로 지정해주면 반환값을 기준으로 타입을 추론해줍니다.
매개 변수가 있을 때 기본값이 설정되어 있다면 기본값을 기준으로 타입을 추론해줍니다.

```js
let d;
d = 10;
d.toFixed();
d.toUpperCase(); // 오류

d = "hello";
d.toUpperCase();
d.toFixed(); // 오류
```

변수 `d`를 선언할 때 초기값을 생략하면 `any` 타입으로 추론됩니다.
10이라는 값을 넣어주면 다음 라인에서 `d`는 `number` 타입으로 바뀝니다.
따라서 `number` 타입에서만 사용할 수 있는 메서드는 사용할 수 있지만 `string` 타입의 메서드를 사용하면 오류가 발생합니다.

다시 `"hello"`라는 값을 할당하면 할당한 다음 라인부터는 `string`으로 바뀝니다.
그래서 다음 라인부터는 `string` 타입의 메서드를 사용할 수 있습니다.

이렇게 타입이 계속 바뀌는 상황을 `any 타입의 진화`라고 부릅니다.
변수를 선언하고 초기값을 지정하지 않으면 `암묵적 any 타입`으로 추론됩니다.
`암묵적 any 타입`으로 선언되면 변수에 할당하는 값에 따라서 any이 계속해서 진화하게 됩니다.

```js
let d: any;
d = 10;
d.toFixed();
d.toUpperCase();

d = "hello";
d.toUpperCase();
d.toFixed();
```

`암묵적 any 타입`은 명시적으로 `any` 타입을 정의하는 것과는 다르게 동작합니다.
명시적으로 `any` 타입을 지정하면 모든 라인에서 `any` 타입이기 때문에 아무런 메서드를 어디서나 사용할 수 있습니다.

```js
const num = 10;
```

변수를 `const`로 만들고 초기값을 넣어주면 `let`으로 선언했을 경우에 `number` 타입으로 추론됐지만 `const`로 선언했을 경우에는 `10`으로 `number 리터럴 타입`으로 추론됩니다.
`const`는 상수이기 때문에 10이외의 값을 담을 일이 없기 때문입니다.

## 타입 단언

```js
type Person = {
  name: string,
  age: number,
};

let person = {};
person.name = "장원정"; // 오류!
person.age = 32; // 오류!
```

`person` 변수에 `Person` 타입을 지정하고 빈 객체를 할당하면 오류가 발생합니다.
빈 객체로 초기화를 하고 나중에 속성에 값을 초기화 시켜주기 위해 `Person` 타입으로 정의한 코드를 삭제하면 속성에 값을 할당할 때 오류가 발생합니다.
왜냐하면 `person` 변수의 타입이 초기화 값인 빈 객체를 기준으로 추론되기 때문입니다.

```js
let person = {} as Person;
person.name = "장원정";
person.age = 32;
```

`as Person`을 통해 타입을 단언해주면 오류가 삭제됩니다.
타입을 단언하게 되면 `as` 앞의 값을 뒤의 타입으로 간주하라고 알려줍니다.

```js
let animal2 = {
  name: "돌돌이",
  color: "brown",
  breed: "진도",
} as Animal;
```

초과 프로퍼티로 인해 오류가 발생한 코드에 타입 단언을 사용하면 오류가 발생하지 않습니다.

### 타입 단언의 규칙

타입 단언을 할 때 `값 as 단언` 형식으로 단언식을 작성합니다.
`A as B`로 값의 타입을 `A` 단언하는 타입을 `B`라고 했을 때 `A`가 `B`의 슈퍼 타입이거나 `A`가 `B`의 서브타입이어야 합니다.

```js
let num1 = 10 as never;
let num2 = 10 as unknown;

let num3 = 10 as string; // 오류!
```

10은 `number` 타입이고 `never`는 모든 타입의 서브 타입이기 때문에 `num1`은 오류가 발생하지 않고 `unknown`은 모든 타입의 슈퍼 타입이기 때문에 `num2`도 오류가 발생하지 않습니다.
하지만 `number`와 `string`처럼 겹치는 타입이 없어 교집합이 없는 타입이라서 슈퍼 타입도 아니고 서브 타입도 아니기 때문에 오류가 발생합니다.

```js
let num3 = 10 as unknown as string;
```

만약 다중 단언을 하면 오류가 사라집니다.
하지만 다중 단언은 절대로 좋은 방법은 아닙니다.

### const 단언

```js
let num4 = 10 as const;
```

`as const`를 통해 타입을 단언해주면 num4는 10인 `number 리터럴 타입`으로 추론합니다.
`const 단언`은 const로 선언한 것과 동일한 효과를 냅니다.

```js
let cat = {
    name: "야옹이",
    color: "yellow",
} as const

cat.name = ""; // 오류!
```

`const 단언`은 객체 타입과 함께 사용할 때 활용도가 있습니다.
`as const`를 붙여서 초기화한 객체는 속성값을 수정할 수 없는 객체가 됩니다.
그래서 `const 단언`을 사용하면 속성이 많은 객체를 초기화할 때도 일일히 `readonly`를 붙일 필요없이 마지막에 `as const`만 붙여주면 모든 속성을 `readonly` 속성으로 만들 수 있습니다.

### Non null 단언

```js
type Post = {
  title: string,
  author?: string,
};

let post: Post = {
  title: "게시글1",
  author: "장원정",
};

const len: number = post.author?.lenth; // 오류!
```

`post.author.lenth`으로 작성하고 저장하면 자동으로 `?` 키워드가 추가됩니다.
`?`는 자바스크립트에서 제공하는 옵셔널 체이닝이라는 키워드입니다.
옵셔널 체이닝이란 `null`이거나 `undefined`일 경우에 전체를 `undefined`로 만들어주는 연산자입니다.

하지만 오류가 발생하는 이유는 옵셔널 체이닝으로 인해 값이 `undefined`가 될 수 있기 때문에 `number` 타입으로 정의한 변수에 할당할 수 없습니다.

```js
const len: number = post.author!.lenth;
```

`?`를 `!`로만 바꿔주면 오류가 사라집니다.
`!` 연산이 `Non null 단언` 연산자인데 앞의 값이 `null`이거나 `undefined`이 아닐 것이라고 타입스크립트 컴파일러에게 알려주는 역할을 합니다.

타입 단언은 실제로 값을 단언한 타입으로 바꾸는 것은 아닙니다.
업 캐스팅과 다운 캐스팅과는 다르고 타입스크립트 컴파일러에 눈을 가리고 믿게 만드는 것입니다.
만약 `post.author`가 정말 없는 상황이 되더라도 타입스크립트는 단언을 해놨기 때문에 믿고 넘어가기 때문에 사용 시에 조심해서 확실한 경우에만 사용하는 것이 좋습니다.

## 타입 좁히기

타입 좁히기란 조건문 등을 이용해 넓은 타입에서 좁은 타입으로 상황에 따라 타입을 좁히는 방법입니다.

```js
function func(value: number | string) {
  value.toFixed(); // 오류!
  value.toUpperCase(); // 오류!

  if (typeof value === "number") {
    console.log(value.toFixed());
  } else if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

함수에서 `typeof value === "number"` 조건문 안에서는 `value`의 타입이 `number` 타입으로 추론되고 `typeof value === "string"` 안에서는 `string` 타입으로 추론됩니다.
모든 조건문 바깥에는 `string | number` 타입으로 추론됩니다.

```js
if (value instanceof Date) {
  value.getTime();
}
```

조건문에서 타입 가드를 사용할 때 `Date`가 들어오면 `typeof value === "object"`를 사용하면 `null`이나 `Date`가 아닌 다른 객체들이 들어올 수 있기 때문에 좋은 방법이 아닙니다.
이럴 때에는 `instance of`라는 새로운 타입 가드를 사용하시면 됩니다.

```js
type Person = {
  name: string,
  age: number,
};

if (value && "age" in value) {
  value.age;
}
```

객체 타입을 직접 만들어서 `value instanceof Person`를 사용한다면 오류가 발생합니다.
오류가 발생한 이유는 `instanceof` 우측항에 타입이 들어오면 안 됩니다.
`instanceof`는 좌항의 값이 우항의 클래스의 인스턴스인지 묻는 연산자이기 때문입니다.
이럴 경우 `in` 연산자를 사용하여 `value`에 `age` 속성이 있는지 검사합니다.
하지만 `in` 연산자의 우항에는 `null`이나 `undefiend` 값이 올 수 없기 때문에 오류가 발생합니다.
`value &&`를 붙여 `value`가 있을 경우에만 실행할 수 있도록 하면 오류를 해결할 수 있습니다.

## 서로소 유니온 타입

서로소 유니온 타입은 타입 좁히기를 할 때 더 쉽고 정확하게 직관적으로 타입을 좁힐 수 있도록 객체 타입을 정의하는 특별한 방법입니다.
서로소 유니온 타입이란 교집합이 없는 타입들로만 만든 유니온 타입입니다.
수학에서 교집합이 없는 두 집합의 관계를 서로소 관계에 있다고 합니다.

```js
type Admin = {
  name: string,
  kickCount: number,
};

type Member = {
  name: string,
  point: number,
};

type Guest = {
  name: string,
  visitCount: number,
};

type User = Admin | Member | Guest;

function login(user: User) {
  if ("kickCount" in user) {
    // Admin
  } else if ("point" in user) {
    // User
  } else if ("visitCount" in user) {
    // Guest
  }
}
```

위와 같은 코드를 작성했을 때 조건문만 보고 `Admin`, `User`, `Guest`인지 알기 어렵습니다.

```js
type Admin = {
  tag: "ADMIN",
  name: string,
  kickCount: number,
};

type Member = {
  tag: "MEMBER",
  name: string,
  point: number,
};

type Guest = {
  tag: "GUEST",
  name: string,
  visitCount: number,
};

function login(user: User) {
  switch (user.tag) {
    case "ADMIN": {
      break;
    }
    case "MEMBER": {
      break;
    }
    case "GUEST": {
      break;
    }
  }
}
```

`tag` 속성을 추가하고 위와 같이 코드를 바꾸면 코드가 훨씬 직관적입니다.
`tag` 속성이 없을 때는 `Admin`, `User`, `Guest` 타입이 서로 교집합을 갖고 있지만 `tag` 속성이 추가되면 서로소 관계로 바뀌게 됩니다.
`tag` 속성이 각각 `string 리터럴 타입`으로 정의되어 있기 때문에 교집합이 존재할 수 없습니다.
따라서 `User` 타입은 서로소 관계에 있는 객체 타입들은 유니온 타입으로 묶었기 때문에 서로소 유니온 타입입니다.

객체 타입에 리터럴 타입의 속성을 각각 다르게 정의해주면 서로소 유니온 타입으로 만들 수 있기 때문에 switch-case 문법으로 직관적으로 타입을 좁혀 처리할 수 있게 만들 수 있습니다.
