---
title: "Prototype"
description: "JavaScript의 프로토타입과 프로토타입 체이닝에 대해서 알아봅니다."
thumbnail: "/assets/blog/prototype/cover.png"
tags: ["JavaScript"]
createdAt: "2024-08-07 10:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%B5%EC%8B%AC%EA%B0%9C%EB%85%90-javascript-flow#

인프런의 코어 자바스크립트 강의를 듣고 정리한 내용입니다.

---

### 참조형 데이터

![JavaScript 프로토타입에 대한 사진 1](/assets/blog/prototype/1.png)

new 연산자로 인스턴스를 만들면 constructor의 prototype은 인스턴스의 [[Prototype]]를 통해 참조됩니다.

![JavaScript 프로토타입에 대한 사진 2](/assets/blog/prototype/2.png)

리터럴 방식으로 배열을 생성해도 내부 구조는 모두 Array 생성자 함수로 생성한 것과 동일합니다.

![JavaScript 프로토타입에 대한 사진 3](/assets/blog/prototype/3.png)

생성자 함수 Array의 프로퍼티 중에 prototype이 생성된 배열의 [[Prototype]]과 연결되어 있습니다.
porotype 프로퍼티는 concat, filter, forEach 등 모든 배열 메서드가 들어가 있는 객체입니다.

![JavaScript 프로토타입에 대한 사진 4](/assets/blog/prototype/4.png)

`Array.prototype.constructor`는 Array 생성자 함수, 자기 자신을 가르킵니다.

`[1, 2, 3].constructor`으로 접근한다면 `[1, 2, 3].[[Prototype]].constructor` 요청과 동일하게 인식하고 `Array.prototype.constructor`와 같습니다.

실제로 `[ 1, 2, 3 ].[[Prototype]].constructor` 이렇게 접근할 수는 없지만 내부적으로 이들이 모두 같다라는 의미입니다.

배열은 Array 생성자 함수와 prototype으로 이뤄져 있고 prototype에는 배열과 관련한 메서드들이 모두 들어있음을 확인했습니다.

### 기본형 데이터

기본형 데이터는 객체가 아니므로 [[Prototype]]가 있을 수 없습니다.

```js
(10).toFixed(2); // '10.00'
```

하지만 개발자가 리터럴을 인스턴스인 것처럼 메서드를 사용하려고 하면 JavaScript가 임시로 Number 생성자 함수의 인스턴스를 만들어서 Number.prototype에 있는 메서드를 적용해서 원하는 결과를 얻게 한 다음에 다시 인스턴스를 제거하는 식으로 동작합니다.

```js
"abc".repeat(2); // 'abcabc'
```

문자열도 마찬가지로 어떤 메서드를 호출하는 순간에 임시로 문자열의 인스턴스를 만들어서 메서드를 실행하고 결과를 얻음과 동시에 폐기합니다.
기본형 데이터들은 모두 같은 방식에 의해 메서드를 호출할 수 있습니다.

### 정리

`null`과 `undifined`를 제외한 모든 데이터 타입은 자신에게 메서드가 없지만 생성자 함수의 prototype에 있는 메서드를 [[Prototype]]라는 연결 통로에 의해 자신의 것처럼 쓸 수 있습니다.

### prototype과 constructor 직접 접근

```js
instance.__proto__;
Object.getPrototypeOf(instance);
```

인스턴스에서 생성자 함수의 prototype에 직접 접근할 수 있는 두 가지 방법이 있습니다.
`__proto__`라고 하는 프로퍼티는 콘솔에 보이진 않지만 접근하고자 하면 접근할 수 있습니다.
하지만 이 접근법은 ES5에서 기본 브라우저들이 마음대로 제공하고 있는 기능을 호환성 차원에서 문서화 해준 것이기 때문에 가급적이면 공식적인 방법인 `Object.getPrototypeOf`라고 하는 메서드를 사용하는 것이 좋습니다.

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}
var roy = new Person("로이", 30);

var royClone1 = new roy.__proto__.cosntructor("로이_클론1", 10);

var royClone2 = new roy.constructor("로이_클론2", 25);

var royClone3 = new Object.getPrototypeOf(roy).constructor("로이_클론3", 20);

var royClone4 = new Person.prototype.constructor("로이_클론4", 15);
```

roy라는 원본과 royColone 1, 2, 3, 4들은 모두 Person의 인스턴스입니다.
모두 동일한 프로퍼티에 접근할 수 있고 생성자 함수 Person을 가르키고 있습니다.

## 메서드 상속 및 동작 원리

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}

var roy = new Person("로이", 30);
var jay = new Person("제이", 25);

roy.setOlder = function () {
  this.age += 1;
};
roy.getAge = function () {
  return this.age;
};
jay.setOlder = function () {
  this.age += 1;
};
jay.getAge = function () {
  return this.age;
};
```

roy와 jay의 setOlder, getAge 메서드가 동일한 내용으로 만들어져 있습니다.
이럴 때 흔히 DRY(Don't Repeat Yourself)하지 말라고 말합니다.
매번 직접 반족하지 말고, 복붙하지 말고, 최대한 반복을 줄이라는 의미입니다.

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}
Person.prototype.setOlder = function () {
  this.age += 1;
};
Person.prototype.getAge = function () {
  this.age;
};
var roy = new Person("로이", 30);
var jay = new Person("제이", 25);
var kay = new Person("케이", 40);
var ray = new Person("레이", 37);
```

prototype으로 메서드를 이동시키면 여러 인스턴스를 찍어내도 딱 한 번 만들어놓은 코드를 여러 인스턴스에서 참조할 뿐입니다.
인스턴스들은 저마다 고유한 정보들만 가지고 있으면 되고 동일하게 가지고 있는 정보들은 prototype으로 보내면 됩니다.
그럼에도 각 인스턴스들은 자신의 메서드인 것처럼 다양한 명령을 수행할 수 있습니다.

이 방법은 메모리 사용 효율을 끌어올리고 객체 지향적 관점에서 보면 객체의 일반화 시켜진 특징들은 모두 prototype으로 설명할 수 있습니다.

## Prototype Chaing

![JavaScript 프로토타입에 대한 사진 5](/assets/blog/prototype/5.png)

prototype은 객체입니다.
객체는 Object 생성자 함수의 new 연산으로 생성된 인스턴스라는 의미입니다.
따라서 Object의 prototype과 연결되어 있습니다.
인스턴스는 Object.prototype에 있는 메서드도 자신의 것처럼 사용할 수 있습니다.
이렇게 연결된 것을 '프로토타입 체인'이라고 합니다.
프로토타입은 모두 객체이므로 모든 데이터 타입은 동일한 구조를 따릅니다.
모든 데이터 타입에 대해 [[Prototype]]로 연결된 Object.prototype에는 JavaScript 전체를 통괄하는 공통된 메서드들(hasOwnProperty, toString, valueOf, isPrototypeOf 등)이 정의되어 있습니다.

하지만 `Object.prototype`에 있는 메서드는 모든 데이터 타입에 적용되기 때문에 객체 전용 메서드를 정의해둘 수 없습니다.
그렇기 때문에 `Object.prototype`에 정의하지 않고 객체 생성자 함수에 직접 메서드를 정의할 수밖에 없었습니다.
유독 객체 관련한 명령어들은 객체로 부터 직접 호출하지 않고 `Object.명령어(자기 자신)`으로 호출하는 경우가 많습니다.

![JavaScript 프로토타입에 대한 사진 6](/assets/blog/prototype/6.png)

Array.prototype에는 toString 메서드가 있기 때문에 배열에서 toString을 호출하면 각 요소들을 콤마로 나열한 문자열이 출력됩니다.

```js
delete Array.prototype.toString;
```

Array.prototype에서 toString 메서드를 지웁니다.

![JavaScript 프로토타입에 대한 사진 7](/assets/blog/prototype/7.png)

다시 toString을 호출하면 Object.prototype에 toString 메서드가 있기 때문에 프로토 타입 체인을 통해 호출됩니다.

![JavaScript 프로토타입에 대한 사진 8](/assets/blog/prototype/8.png)

Object.prototype의 toString 메서드가 호출되었음을 `Object.prototype.toString.call([1, 2, 3])`을 출력해보면 알 수 있습니다.

```js
delete Object.prototype.toString;
```

Object.prototype에 있는 toString도 지워줍니다.

![JavaScript 프로토타입에 대한 사진 9](/assets/blog/prototype/9.png)

이제는 toString 메서드가 없다는 오류가 나옵니다.

이를 통해 toString 메서드를 호출하면 자기 자신에게서 찾고 없으면 Array.prototype, 또 없으면 Object.prototype에서 메서드를 찾습니다.
Object.prototype까지 가서 있으면 호출하고 없다면 더 이상 올라갈 수 없으니 에러를 던집니다.
스코프 체인과 동일하게 자기 자신부터 찾아서 먼저 발견된 메서드를 실행하게 됩니다.
