---
title: "Closure"
description: "JavaScript의 클로저에 대해 알아봅니다."
thumbnail: "/assets/blog/closure/cover.png"
tags: ["JavaScript"]
createdAt: "2024-08-16 10:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%B5%EC%8B%AC%EA%B0%9C%EB%85%90-javascript-flow#

인프런의 코어 자바스크립트 강의를 듣고 정리한 내용입니다.

---

![MDN에 나와있는 Closuer 정의 1](/assets/blog/closure/1.png)

MDN을 살펴보면 클로저는 주변 상태(Lexical Environment)에 대한 참조와 함께 번들링된 함수의 조합이라고 나와있습니다.
번들링된 함수란 내부 함수를 의미합니다.
즉 클로저란 내부 함수와 LexicalEnvironment의 조합이라고 정의할 수 있습니다.
예를 들면 실행 컨텍스트 A에서 함수 B를 선언하면 A의 LexicalEnvironment와 내부 함수 B의 조합이 클로저입니다.

![MDN에 나와있는 Closuer 정의 2](/assets/blog/closure/2.png)

MDN 내용을 더 살펴보면 클로저란 함수가 생성될 때 매번 같이 발생한다고 나와있습니다.
클로저란 특별한 개념이 아닌 함수의 생성과 함께 무조건 생기는 당연한 개념입니다.
하지만 실제로 클로저라는 단어를 보편적인 상황에 모두 적용하지 않습니다.
흔히 클로저를 활용한 `... using closure, ...with closure` 등으로 표현되는 내용에는 클로저 환경에서만 발생하는 '특별한 현상'을 표현하기 위해 사용합니다.
다시 정의하면 A의 LexicalEnvironment와 내부 함수 B의 조합에서 나타나는 특별한 현상입니다.

![컨텍스트 A위에 컨텍스트 B가 쌓인 콜 스택 그림](/assets/blog/closure/3.png)

각각의 LexicalEnvironment를 보면 둘 사이 조합이라고 말할 수 있는 부분은 B 컨텍스트의 outerEnvironmentReference와 A 컨텍스트의 environmentRecord입니다.
여기서 나타날 수 있는 특별한 현상은 A 컨텍스트에 선언한 변수를 내부 함수 B에서 참조할 경우에 발생합니다.

```js
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
};
var outer2 = outer();
console.log(outer2());
console.log(outer2());
```

코드의 실행 순서를 그림과 함께 살펴보겠습니다.

![전역 컨텍스트가 쌓인 콜 스택 그림](/assets/blog/closure/4.png)

먼저 전역 컨텍스트가 실행되면서 environmentRecord에 outer 함수가 담기고 outer2는 아직 정의되지 않았으므로 undefined가 담깁니다.

![전역 컨텍스트위에 outer 컨텍스트가 쌓인 그림 1](/assets/blog/closure/5.png)

outer 함수가 종료되고 outer2에 inner 함수가 할당됩니다.
inner 함수에서 a를 참조하고 있기 때문에 참조 카운트가 0이 아니므로 outer 컨텍스트는 종료되지 않습니다.

![전역 컨텍스트위에 outer 컨텍스트가 쌓인 그림 2](/assets/blog/closure/6.png)

inner 컨텍스트가 실행되고 a를 1에서 2로 바꾼 뒤 한 번 더 실행되면서 3으로 바꾸고 종료합니다.

outer 컨텍스트는 종료되지 않고 전역 컨텍스트가 종료되기 전까지 살아남습니다.
outer2에 inner 함수가 들어있고 inner 함수의 outerEnvironmentReference를 통해 a를 참조하기 때문입니다.
outer2 변수에 다른 값을 넣게 되면 inner 함수의 참조 카운트가 0이 되면서 Garbage Collector의 대상이 되고 연쇄적으로 a도 참조 카운트가 0이 되어 사라집니다.

outer 함수의 지역 변수가 함수 종료 후에도 사라지지 않게 할 수 현상이 클로저가 의미하는 특별한 현상입니다.
할 수 있다라는 뜻은 안 해도 된다라는 뜻과 같습니다.
사용자가 지역 변수 중에서 선택적으로 사라지지 않게 할 수 있습니다.
함수 종료 후에도 사라지지 않는 변수를 만들 수 있는 점이 클로저를 통해 얻을 수 있는 가장 큰 이점입니다.

```js
function user(_name) {
  var _logged = true;
  return {
    get name() {
      return _name;
    },
    set name(v) {
      _name = v;
    },
    login() {
      _logged = true;
    },
    logout() {
      _logged = false;
    },
    get status() {
      return _logged ? "login" : "logout";
    },
  };
}
var roy = user("재남");

console.log(roy.name); // '재남'
```

roy.name을 출력하면 roy 객체에 name 프로퍼티가 없지만 getter를 통해 출력됩니다.
\_name은 user 함수의 실행 컨텍스트가 종료됨과 동시에 사라질 예정이었으나 return 객체 안에 해당 변수를 참조하고 있기 때문에 나중에 쓸 변수라고 판단하여 살려둡니다.
그렇기 때문에 함수는 종료되었지만 변수는 살아서 roy.name이 출려될 수 있습니다.

```js
roy.name = "제이";
console.log(roy.name); // '제이'
```

setter로 인해 \_name의 값이 "제이"로 바뀝니다.

```js
roy._name = "로이";
console.log(roy.name); // '제이'
```

하지만 roy.\_name에 값을 직접 할당하게 되면 \_name이라는 프로퍼티가 없기 때문에 새로 만들게 되고 roy.name에는 어떠한 영향도 줄 수 없습니다.

```js
console.log(roy.status); // 'login'
```

status를 호출하면 user 함수에 선언된 \_logged 변수 값에 따라 문자열을 반환합니다.
\_logged 변수도 클로저에 의해 살아있습니다.

```js
roy.logout();
console.log(roy.status); // 'logout'
```

logout 메서드를 호출하면 \_logged 변수의 값이 false로 바뀝니다.

```js
roy.status = true;
console.log(roy.status); // 'logout'
```

status는 getter는 있지만 setter가 없기 때문에 roy.status에 값을 직접 할당하면 무시됩니다.

위 예제를 통해 확인할 수 있는 점은 두 가지 입니다.

1. 변수 \_name, \_logged는 함수 종료 후에도 사라지지 않고 값을 유지합니다.
2. 외부에 노출된 status 프로퍼티는 getter로서만 역할하며 실제 \_logged 값과는 별개의 문자열을 반환합니다. \_logged 변수에 영향을 주는 것은 login, logout 메서드에 의해서만 가능합니다. 즉 함수 외부로 부터 내부 변수를 보호할 수 있습니다. 이를 캡슐화라고 하며 객체 지향 언어의 중요한 개념 중에 하나입니다.
