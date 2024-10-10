---
title: "Class"
description: "JavaScript의 클래스에 대해서 알아봅니다."
thumbnail: "/assets/blog/class/cover.png"
tags: ["JavaScript"]
createdAt: "2024-08-09 10:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%B5%EC%8B%AC%EA%B0%9C%EB%85%90-javascript-flow#

인프런의 코어 자바스크립트 강의를 듣고 정리한 내용입니다.

---

클래스는 공통적인 속성을 묶은 덩어리 또는 명세라고 할 수 있습니다.
클래스와 함께 등장하는 용어로는 인스턴스가 있습니다.
인스턴스는 해당 클래스의 속성을 지닌 구체적인 객체들입니다.

프로그래밍 언어에서는 우리가 실생활에서 상식으로 알고 있는 합의된 규칙이 없습니다.
상위 클래스부터 먼저 정의되어야만 하위의 클래스 및 인스턴스를 생성할 수 있습니다.
음식 클래스가 먼저 정의되어야 음식 클래스의 속성을 지니면서 더 구체적인 특성을 지닌 하위 클래스인 과일 클래스를 정의할 수 있습니다.
그 다음 비로소 배, 사과 등의 구체적인 객체들이 음식이기도 하면서 과일이기도 한 인스턴스가 될 수 있습니다.

음식 클래스는 과일 클래스의 상위 클래스이고 보통 슈퍼 클래스라고 칭합니다.
반대로 과일 클래스는 음식 클래스의 하위 클래스고 보통 서브 클래스라고 칭합니다.

![배열 객체가 만들어지면서 Array 클래스의 요소와 결과물을 표현한 그림](/assets/blog/class/1.png)

[프로토 타입](https://tazoal.vercel.app/posts/execution-context)에서 살펴본 배열 리터럴을 생성하면 Array라고 하는 생성자 함수를 new 연산자와 함께 호출한 결과와 같다고 배웠습니다.
Array 생성자 함수 부분만 분리하면 일반적인 개념상의 클래스 역할을 합니다.
생성자 함수는 그 자체로 특별한 역할을 수행하기 보다는 주로 new 연산자를 통해 생성한 배열 객체들의 기능을 정의하기 때문입니다.

prototype에 할당되지 않고 Array 생성자 함수 객체에 직접 할당되어 있는 프로퍼티들을 static method, static properties라고 합니다.

이들은 Array 생성자 함수를 new 연산자 없이 함수로써 호출할 때만 의미가 있는 값들입니다.
보통 해당 클래스 소속의 인스턴스들의 개별적인 동작이 아닌 소속 여부 확인, 소속 부여 등의 공동체적인 판단을 필요로 하는 경우에 스테틱 메서드를 활용하곤 합니다.

한편 prototype에 정의된 메서드들을 일컬어 prototype method라고 하는데 prototype을 생략하고 mehtod라고 말하는 경우가 많습니다.

클래스에는 인스턴스에서 직접 접근할 수 없고 클래스 자체에서 접근할 수 있는 스테틱 멤버(스테틱 메서드와 프로퍼티)와 인스턴스에서 직접 활용할 수 있는 메서드가 있습니다.
prototype은 인스턴스와 [[Prototype]]로 연결되어 있기 때문에 인스턴스에서 직접 접근할 수 있습니다.
반면 스테틱 멤버는 직접 접근할 방법이 없습니다.
prototype의 constructor를 통해 우회할 수는 있지만 인스턴스를 this로 하기 위해서는 별도의 처리가 필요하고 처리를 해도 정상적인 동작을 기대하기 어렵습니다.

```js
function Person(name, age) {
  this._name = name;
  this._age = age;
}
Person.getInformations = function (instance) {
  return {
    name: instance._name,
    age: instance._age,
  };
};
Person.prototype.getName = function () {
  return this._name;
};
Person.prototype.getAge = function () {
  return this._age;
};

var roy = new Person("로이", 30);

console.log(roy.getName()); // 로이
console.log(roy.getAge()); // 30

console.log(roy.getInformations(roy)); // error 발생!
console.log(Person.getInformations(roy)); // { name: '로이', age: 30 }
```

프로토 타입 체이닝은 상위 생성자 함수의 prototype으로만 검색하기 때문에 스테틱 메서드에서 제대로 된 결과를 얻기 위해서는 인스턴스가 아닌 생성자 함수에 직접 접근해야 제대로 된 결과를 얻을 수 있습니다.

## 클래스 상속

```js
function Person(name, age) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
}
Person.prototype.getName = function () {
  return this.name;
};
Person.prototype.getAge = function () {
  return this.age;
};

function Employee(name, age, position) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
  this.position = position || "직책모름";
}
Employee.prototype.getName = function () {
  return this.name;
};
Employee.prototype.getAge = function () {
  return this.age;
};
Employee.prototype.getPosition = function () {
  return this.position;
};

const roy = new Employee("로이", 30, "CEO");
```

Person 클래스와 Employee 클래스의 `getName`과 `getAge`는 중복됩니다.
만약 Person 클래스 하위에 Employee 클래스가 있다면 중복을 없앨 수 있습니다.

```js
function Person(name, age) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
}

Person.prototype.getName = function () {
  return this.name;
};
Person.prototype.getAge = function () {
  return this.age;
};

function Employee(name, age, position) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
  this.position = position || "직책모름";
}

Employee.prototype = new Person();
Employee.prototype.constructor = Employee;

Employee.prototype.getPosition = function () {
  return this.position;
};

const roy = new Employee("로이", 30, "CEO");
```

겹치는 메서드는 상위 클래스에만 놔두고 Employee에는 겹치지 않는 메서드만 남길 수 있습니다.

Employee.prototype에 Person의 인스턴스를 할당합니다.
여타의 prototype과 동일하게 동작하기 위해서는 본래 갖고 있던 기능을 다시 부여해주기 위해 prototype.constructor에 Employee 생성자 함수를 넣어줍니다.

getPosition을 밑에 둔 이유는 `Employee.prototype = new Person();`보다 먼저 메서드를 정의해봤자 Person 인스턴스로 바뀌기 때문입니다.

![클래스 상속 결과를 콘솔에 출력한 사진](/assets/blog/class/2.png)

Employee 인스턴스인 roy를 출력하면 Employee의 age, name, position 속성에 값이 잘 할당됐습니다.

[[Prototype]]에 Employee의 prototype이자 Person의 인스턴스 객체가 할당된 걸 확인할 수 있습니다.
constructor에 직접 부여한 Employee 생성자 함수와 getPosition 메서드도 확인할 수 있습니다.

Prototype Chaing을 통해 한 단계 더 올라가면 Person의 prototype이자 Object 인스턴스 객체를 확인할 수 있습니다.

상속 관계가 잘 연결되어 있지만 Employee.prototype에 age, name 속성이 할당되지 않아 완전하지 않습니다.
만약 실수로 roy에 name을 지워버린 뒤 getName 메서드를 호출하면 undefined가 나와야 하지만 실제로는 Prototype Chaing을 통해 "이름 없음"이 출력됩니다.

Prototype Chaing 상에는 프로퍼티가 아닌 메서드들만 존재하게 하는 것이 '추상적인 클래스'에 부합합니다.

![Bridge 클래스를 이용한 클래스 상속을 표현한 그림](/assets/blog/class/3.png)

이를 해결하기 위해서는 Employee.prototype에 name, age 속성을 지워야 합니다.
Employee.prototype에 반드시 Person의 인스턴스 객체가 필요한 건 아닙니다.
Employee.prototype에 Person.prototype을 상속받고 아무런 프로퍼티도 존재하지 않으면 된다는 뜻입니다.

```js
function Person(name, age) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
}
Person.prototype.getName = function () {
  return this.name;
};
Person.prototype.getAge = function () {
  return this.age;
};

function Bridge() {}
Bridge.prototype = Person.prototype;

function Employee(name, age, position) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
  this.position = position || "직책모름";
}

Employee.prototype = new Bridge();
Employee.prototype.constructor = Employee;
Employee.prototype.getPosition = function () {
  return this.position;
};

const roy = new Employee("로이", 30, "CEO");
```

비어있는 객체를 생성하는 Bridge 생성자 함수를 만듭니다.
Bridge.prototype에 Person.prototype을 연결하고 인스턴스를 생성하면 아무런 프로퍼티없이 메서드만 상속받습니다.
Employee.prototype에 Bridge의 인스턴스를 넣어주고 Employee.prototype.constructor에 Employee 생성자 함수를 넣어주면 해결됩니다.

![Bridge 클래스를 이용한 클래스 상속 결과를 출력한 사진](/assets/blog/class/4.png)

Bridge라는 매개체를 이용해서 Person의 인스턴스와 연결 관계를 끊음으로써 프로토타입 체인 상에 불필요한 프로퍼티가 등장하지 않게 성공했습니다.

```js
var extendClass = (function () {
  function Bridge() {}
  return function (Parent, Child) {
    Bridge.prototype = Parent.prototype;
    Child.prototype = new Bridge();
    Child.prototype.constructor = Child;
    Child.prototype.superClass = Parent;
  };
})();
```

이 기능은 ES5 시스템에서 클래스 상속을 구현하는 데에 자주 등장하는 패턴이고 Bridge라는 함수는 매개체 역할만 할 뿐 실제 코드에 영향을 주지 않기 때문에 더글라스 크락포드께서는 위와 같이 함수화를 시켜 활용할 것을 추천하고 있습니다.

즉 클로저를 이용해서 Bridge 생성자 함수는 단 한 번만 생성한 뒤 계속 재활용하고, 상위 클래스와 하위 클래스로 쓰일 생성자 함수를 매개 변수로 넘겨주어 자동으로 둘 사이의 상속 구조를 연결해주는 함수입니다.

```js
extendClass(Person, Employee);
Employee.prototype.getPosition = function () {
  return this.position;
};
```

이 함수를 사용하면 간단한 형태로 상속을 구현할 수 있습니다.

```js
function Employee(name, age, position) {
  this.superClass(name, age);
  this.position = position || "직책모름";
}
```

인스턴스의 vlaue들 역시 상속 구조를 활용하면 간단한 구현이 가능합니다.

```js
var extendClass = (function () {
  function Bridge() {}
  return function (Parent, Child) {
    Bridge.prototype = Parent.prototype;
    Child.prototype = new Bridge();
    Child.prototype.constructor = Child;
    Child.prototype.superClass = Parent;
  };
})();

function Person(name, age) {
  this.name = name || "이름없음";
  this.age = age || "나이모름";
}
Person.prototype.getName = function () {
  return this.name;
};
Person.prototype.getAge = function () {
  return this.age;
};

function Employee(name, age, position) {
  this.superClass(name, age);
  this.position = position || "직책모름";
}
extendClass(Person, Employee);

Employee.prototype.getPosition = function () {
  return this.position;
};
```

extendClass 함수를 활용한 최종 코드입니다.
사실 ES6에서는 JavaScript 내장 명령어로 손쉽게 상속을 구현할 수 있습니다.

```js
class Person {
  constructor(name, age) {
    this.name = name || "이름없음";
    this.age = age || "나이모름";
  }
  getName() {
    return this.name;
  }
  getAge() {
    return this.age;
  }
}

class Employee extends Person {
  constructor(name, age, position) {
    super(name, age);
    this.position = position || "직책모름";
  }
  getPosition() {
    return this.position;
  }
}
```

간단한 방법이 있음에도 굳이 상속 과정을 구현한 이유는 프로토 타입, 클로저, this 등의 개념을 한 번에 살펴볼 수 있기 때문입니다.
