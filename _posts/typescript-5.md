---
title: "TypeScript 인터페이스와 클래스"
description: "TypeScript의 인터페이스와 클래스에 대해서 정리한 내용입니다."
thumbnail: "/assets/blog/typescript-5/cover.png"
tags: ["TypeScript"]
createdAt: "2024년 10월 10일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 인터페이스

인터페이스란 타입 별칭과 동일하게 타입에 이름을 지어주는 또 다른 문법입니다.
인터페이스는 타입 별칭에서는 제공하지 않는 상속이나 합침등의 특수한 기능을 제공하여 객체 타입을 정의하는 데 특화된 문법입니다.

```ts
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "장원정",
  age: 32,
};
```

인터페이스는 타입 별칭과 타입을 정의하는 문법만 조금 다를 뿐 기본적인 기능은 같습니다.
그렇기 때문에 `readonly`와 `?` 키워드 모두 사용할 수 있습니다.

```ts
interface Person {
  name: string;
  age?: number;
  sayHi(): void;
}

type Func = {
  (): void;
};
```

메서드를 정의할 때는 함수 표현식과 호출 시그니처를 모두 이용할 수 있습니다.
호출 시그니처를 이용할 때 기본적인 호출 시그니처와 다르게 메서드의 이름이 소괄호 앞에 붙습니다.
함수에 대해서 얘기할 때 `Func`처럼 객체에 타입을 정의하는 것처럼 정의하고 호출 시그니처를 사용하면 함수 타입을 정의하는 타입이 되는 거라 배웠는데 만약 인터페이스에도 호출 시그니처만 정의해주면 타입 자체가 함수 타입이 되기 때문에 메서드 이름을 꼭 붙여야 합니다.

```ts
interface Person {
  name: string;
  age?: number;
  sayHi: () => void; // 오류!
  sayHi: (a: number, b: number) => void; // 오류!
}

const person: Person = {
  name: "장원정",
  sayHi: function () {
    cosnole.log("Hi");
  },
};

person.sayHi();
person.sayHi(1, 2);
```

만약 메서드에 오버로딩을 적용하고 싶어서 함수 타입 표현식으로 작성하면 오류가 발생합니다.

```ts
interface Person {
  name: string;
  age?: number;
  sayHi(): void;
  sayHi(a: number, b: number): void;
}
```

따라서 메서드에 오버로딩을 적용하고 싶으면 호출 시그니처를 사용해야 합니다.

### 타입 별칭과의 차이점

```ts
type Type1 = number | string;
type Type2 = number & string;
```

타입 별칭은 유니온 타입과 인터섹션 타입을 만들 수 있지만 인터페이스는 만들 수 없습니다.

```ts
type Type1 = number | string | Person;
type Type2 = number & string & Person;

const person: Person | number = {
  name: "장원정",
  sayHi: function () {
    cosnole.log("Hi");
  },
};
```

인터페이스로 만든 객체 타입을 인터섹션이나 유니온에 이용하려면 타입 별칭에 활용을 하던가, 타입 주석에 활용을 해야 합니다.

### 인터페이스 확장

```ts
interface Animal {
  name: string;
  age: number;
}

interface Dog {
  name: string;
  age: number;
  isBark: boolean;
}

interface Cat {
  name: string;
  age: number;
  isScratch: boolean;
}

interface Chicken {
  name: string;
  age: number;
  isFly: boolean;
}
```

위와 같이 코드를 작성하면 `name`과 `age` 속성처럼 중복된 속성이 많습니다.
만약 `age` 속성이 없어지고 `color` 속성을 추가하라는 요구 사항이 있으면 모든 타입의 속성을 바꿔줘야 합니다.

```ts
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  isBark: boolean;
}

const dog: Dog = {
  name: "",
  color: "",
  isBark: true,
};
```

중복되는 속성을 제거하고 `extends Animal`을 추가하면 인터페이스의 확장 기능을 사용할 수 있습니다.
`extends`는 확장하다라는 의미로 인터페이스 `Dog`는 `Animal`을 확장하는 타입이다라고 정의해줍니다.
인터페이스 확장을 사용하여 정의하면 `Dog` 타입은 `Animal` 타입의 `name`과 `age` 속성을 모두 갖고 추가로 `isBark` 속성도 갖는 타입으로 정의됩니다.

확장은 다른 말로 상속이라고도 합니다.

```ts
interface Dog extends Animal {
  name: "hello";
  isBark: boolean;
}
```

상속을 받는 인터페이스에서 부모의 속성의 타입을 다시 정의할 수 있습니다.
하지만 원본 타입의 서브 타입이어야만 합니다.
만약 `number` 타입으로 정의한다면 오류가 발생합니다.

```ts
type Animal = {
  name: string;
  age: number;
};

interface Dog extends Animal {
  isBark: boolean;
}
```

인터페이스는 타입 별칭으로 만든 객체 타입도 확장할 수 있습니다.
즉 인터페이스는 객체 타입이면 다 확장할 수 있다라고 이해할 수 있습니다.

```ts
interface DogCat extends Dog, Cat {}

const dogCat: DogCat = {
  name: "",
  color: "",
  isBark: true,
  isScratch: true,
};
```

인터페이스는 여러 인터페이스를 확장하는 다중 확장이 가능합니다.

인터페이스는 유연하게 타입을 확장해서 사용할 수 있는 문법을 제공하는 등 객체 타입을 다룰 때 유용합니다.
그래서 객체 타입을 정의할 때는 타입 별칭보다는 유용한 기능을 이용할 수 있는 인터페이스를 사용하는 것이 좋을 것 같습니다.

### 인터페이스 선언 합치기

```ts
type Person = {
  name: string;
}; // 오류!

type Person = {
  age: number;
}; // 오류!
```

타입 별칭을 사용할 때 동일한 타입을 두 번 적용하려 하면 오류가 발생합니다.

```ts
interface Person {
  name: string;
}

interface Person {
  age: number;
}
```

하지만 인터페이스는 타입 별칭과는 달리 오류가 발생하지 않습니다.
동일한 이름으로 정의한 인터페이스는 결국에 다 합쳐지게 되는데 이 현상을 선언 합침이라 부릅니다.

```ts
const person: Person = {
  name: "",
  age: 32,
};
```

인터페이스를 두 번 선언하고 변수를 만들어서 `Person` 타입을 갖게 하면 각 인터페이스에 정의된 속성들이 다 합쳐진 객체 타입으로 정의됩니다.

```ts
interface Person {
  name: string;
}

interface Person {
  name: number; // 오류!
  age: number;
}
```

만약 두번째 인터페이스에 `name` 속성을 다시 쓰고 `number`로 정의하면 오류가 발생합니다.
이렇게 동일한 속성을 중복 정의하는데 타입을 다르게 정의하는 경우를 충돌이라고 표현합니다.
인터페이스의 선언 합침에서는 충돌을 허용하지 않습니다.
같은 속성을 중복 적용하기 위해서는 타입도 동일하게 정의해줘야 합니다.

```ts
interface Developer extends Person {
  name: "hello";
}
```

인터페이스의 확장을 이용할 때에는 속성을 재정의할 때 꼭 타입이 똑같을 필요없이 서브 타입이면 허용이 됐었습니다.
하지만 선언 합침에서는 서브 타입으로 선언하면 오류가 발생하고 반드시 동일한 타입으로 정의해줘야 합니다.

선언 합침은 보통 간단한 프로그래밍을 할 때에는 사용하지 않고 라이브러리의 타입 정의가 조금 부실하여 타입을 좀 더 추가해주고 정확하게 만들어주는 모듈 보강이라는 작업을 할 때 사용합니다.

## 클래스

```ts
class Employee {
  name: string;
  age: number;
  position: string;

  constructor(name: string, age: number, position: string) {
    this.name = name;
    this.age = age;
    this.position = position;
  }

  work() {
    console.log("일함");
  }
}

const employeeA = new Employee("장원정", 32, "개발자");
```

타입스크립트에서 클래스를 작성할 때 자바스크립트와 동일하게 작성하되 필드값에 타입을 정의하고 초기값이 들어가도록 해주면 됩니다.
타입스크립트의 클래스는 자바스크립트의 클래스로 취급되면서 동시에 타입으로도 취급됩니다.
따라서 `employeeA` 변수의 타입을 보면 `Employee`로 추론됩니다.

```ts
const employeeB: Employee = {
  name: "",
  age: 0,
  position: "",
  work() {},
};
```

그렇기 때문에 `employeeB`라는 변수를 만들고 타입을 `Employee` 클래스로 정의해주면 `Employee`의 필드와 메서드까지 갖고 있어야하는 객체 타입으로 정의됩니다.

```ts
class ExecutiveOfficer extends Employee {
  officeNumber: number;

  constructor(
    name: string,
    age: number,
    position: string,
    officeNumber: number
  ) {
    super(name, age, position);
    this.officeNumber = officeNumber;
  }
}
```

자바스크립트의 클래스에서는 상속 받는 클래스를 만들 때 `super`를 생략할 수 있었지만 타입스크립트에서는 오류가 발생합니다.
추가로 `super`의 인수를 빼먹어도 오류가 발생합니다.

### 접근 제어자

접근 제어자는 타입스크립트의 클래스에서만 제공되는 기능으로 클래스를 만들 때 특정 필드나 메서드에 접근할 수 있는 범위를 설정하는 기능입니다.

`public`, `private`, `protected` 세 가지를 제공하고 접근 허용 범위는 자바와 동일합니다.

`public`은 가장 기본적인 접근 제어자로 아무것도 제한하지 않고 생략 가능합니다.
`private`는 가장 제한적인 접근 제어자로 해당 클래스 안에서만 접근할 수 있고 자식 클래스에서도 접근할 수 없습니다.
`protected`는 외부에서는 접근을 제어하지만 자식 클래스에서는 접근할 수 있습니다.

```ts
constructor(
    private name: string,
    protected age: number,
    public position: string,
  ) {}
```

접근 제어자는 생정자 함수의 매개변수에 작성할 수 있습니다.
생성자의 매개변수에 접근 제어자를 사용하면 자동으로 필드값에 접근 제어자를 붙여서 만들어줌으로 필드에 중복으로 접근 제어자를 명시했다면 오류가 발생합니다.
따라서 생성자 함수에 접근 제어자를 명시하면 필드값을 생략할 수 있습니다.

추가로 생성자 함수의 매개변수에 접근 제어자를 사용하면 필드값을 자동으로 초기화까지 해줍니다.
따라서 `this.name = name;`으로 했던 작업을 삭제해도 오류가 발생하지 않습니다.

### 인터페이스와 클래스

```ts
interface CharacterInterface {
  name: string;
  moveSpeed: number;
  move(): void;
}

class Charater implements CharacterInterface {
  constructor(public name: string, public moveSpeed: number) {}

  move(): void {
    console.log(`${this.moveSpeed} 속도로 이동!`);
  }
}
```

`CharacterInterface` 인터페이스가 정의한 객체를 `Charater` 클래스가 생성하도록 하려면 `implements` 키워드를 사용하면 됩니다.
`implements`는 구현하다라는 뜻으로 `Charactor` 클래스는 `CharactorInterface`를 구현한다라고 해석할 수 있습니다.
여기서 인터페이스는 클래스의 설계도 역할을 합니다.

```ts
constructor(private name: string, protected moveSpeed: number) {} // 오류!
```

인터페이스는 무조건 `public` 필드만 정의할 수 있습니다.
따라서 `private`나 `protected`를 사용하면 오류가 발생합니다.

```ts
constructor(public name: string, public moveSpeed: number, private extra: string) {}
```

따라서 `private` 필드가 필요하다면 인터페이스에 정의하지 말고 따로 정의해주면 됩니다.
