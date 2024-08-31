---
title: "실행 컨텍스트 (Execution Context)"
description: "JavaScript의 실행 컨텍스트에 대해서 알아보며 콜스택, 호이스팅, 스코프 체인의 개념을 학습하고 This에 대해 자세하게 알아봅니다."
thumbnail: "/assets/blog/execution-context/cover.png"
tags: ["JavaScript"]
createdAt: "2024년 08월 03일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%B5%EC%8B%AC%EA%B0%9C%EB%85%90-javascript-flow#

인프런의 코어 자바스크립트 강의를 듣고 정리한 내용입니다.

---

Execution Context를 직역하면 execution: 실행 / context: 문맥, 맥락, 환경입니다.
어떤 코드를 봤을 때 이 자리에서 어떤 역할을 수행하는 지를 이해하기 위해서는 코드에 영향을 주는 주변 코드나 변수들을 파악해야 합니다.

실행 컨텍스트는 동일한 조건 또는 환경을 지닌 코드 뭉치를 실행할 때 필요한 환경 정보를 일컫는 말입니다.
JavaScript에서 전역 공간, 함수, eval, module은 동일한 환경을 지닐 수 있습니다.

전역 공간은 JavaScript 코드가 실행되는 순간에 생성되고 전체 코드가 끝날 때 종료되므로 거대한 함수 공간이라 봐도 무방합니다.
모듈 역시 어딘가에서 import되는 순간 컨텍스트가 생성되고 모듈 코드가 전부 끝났을 때에 종료되므로 역시 하나의 함수 공간이라고 간주할 수 있습니다.
그렇게 놓고 보면 결국 JavaScript의 독립된 코드 뭉치라고 할 수 있는 건 곧 함수라고 볼 수 있습니다.
전역 공간, 모듈, 함수로 묶인 내부에서는 같은 환경 안에 있습니다.

조건문이나 반복문 같은 경우, ES6에서 블록 스코프 개념이 추가되면서 let이나 const에 대해 별개의 독립된 공간으로 역할을 하고 있지만 실행 컨텍스트를 생성하진 않습니다.

정의하자면 실행 컨텍스트는 함수를 실행할 때 필요한 환경 정보를 담은 객체입니다.

## 콜 스택 (call stack)

```js
var a = 1;
function outer() {
  console.log(a); // 첫 번째 출력

  function inner() {
    console.log(a); // 두 번째 출력
    var a = 3;
  }

  inner();

  console.log(a); // 세 번째 출력
}
outer();
console.log(a); // 네 번째 출력
```

코드가 먼저 실행되는 순서를 표기했습니다.

1. 전역 컨텍스트가 열리고 전역 공간의 코드를 하나씩 실행합니다.
2. 선언문은 넘어가고 `outer();`라는 실행 코드를 만납니다.
3. outer 함수가 호출되면서 outer 함수의 실행 컨텍스트가 열리고 내부 코드를 하나씩 실행합니다.
4. 첫 번째 a가 출력되고 선언문을 지나 `inner();` 코드가 실행됩니다.
5. inner 함수에 대한 실행 컨텍스트가 열리면서 두 번째 a가 출력됩니다.
6. inner 함수가 종료되고 세 번째 a가 출력됩니다.
7. outer 함수의 실행 컨텍스트가 종료되면 마지막으로 네 번째 a가 출력되고 전역 컨텍스트가 종료됩니다.

JavaScript는 이런 실행 순서를 어떻게 처리한 걸까요?

![JavaScript 콜스택을 표현한 그림 1](/assets/blog/execution-context/1.png)

위 사진이 콜 스택입니다.
처음에는 비어있고 위로만 들어오고 나갈 수 있습니다.

![JavaScript 콜스택을 표현한 그림 2](/assets/blog/execution-context/2.png)

최초에 전역 공간에 대한 컨텍스트가 콜 스택에 쌓입니다.
바깥에서 접근했을 때 가장 위에 있는 컨텍스트가 실행 중인 컨텍스트입니다.

![JavaScript 콜스택을 표현한 그림 3](/assets/blog/execution-context/3.png)

outer 함수가 호출되면 outer 함수의 컨텍스트가 콜 스택에 쌓입니다.

![JavaScript 콜스택을 표현한 그림 4](/assets/blog/execution-context/4.png)

inner 함수가 호출되면 inner 함수의 실행 컨텍스트가 위에 쌓입니다.

![JavaScript 콜스택을 표현한 그림 5](/assets/blog/execution-context/5.png)

inner 함수가 종료되면 콜 스택에서 inner 함수의 컨텍스트를 꺼냅니다.
outer 함수의 실행 컨텍스트가 가장 위에 있으므로 outer 함수의 남은 코드를 실행합니다.

![JavaScript 콜스택을 표현한 그림 6](/assets/blog/execution-context/6.png)

outer 함수가 종료되면 전역 컨텍스트만 남게 됩니다.

![JavaScript 콜스택을 표현한 그림 7](/assets/blog/execution-context/1.png)

전역 컨텍스트가 끝나면 콜 스택에 아무 것도 남지 않아 실행할 내용이 없다고 판단하고 앱을 종료합니다.

## 실행 컨텍스트 내부

실행 컨텍스트에는 세 가지 환경 정보가 담깁니다.
VariableEnvironment, LexicalEnvironment, This Binding 입니다.
VariableEnvironment와 LexicalEnvironment는 현재 환경과 관련된 식별자 정보들을 담습니다.
VariableEnvironment는 오직 식별자 정보를 수집하고 LexicalEnvironment는 각 식별자에 담긴 데이터를 추적합니다.
컨텍스트 내부 코드들을 실행하는 동안에 변수의 값들에 변화가 생기면 LexicalEnvironment에 실시간으로 반영됩니다.
VariableEnvironment와 LexicalEnvironment는 실시간 반영의 차이가 있습니다.
실시간 변화가 반영되는 LexicalEnvironment를 집중적으로 살펴보겠습니다.

## LexicalEnvironment

LexicalEnvironment는 실행 컨텍스트를 구성하는 환경 정보를 모아 사전처럼 구성한 객체를 의미합니다.
예를 들면 어떤 실행 컨텍스트의 '내부 식별자 a의 현재 값은 undefined다.', '내부 식별자 b의 값은 20이다.', '외부 정보 D를 참조한다.' 등 내부 식별자들에 대한 정보와 외부 정보가 담겨 있습니다.

LexicalEnvironment는 environmentRecord와 outerEnvironmentReference로 구성되어 있습니다.
environmentRecord는 현재 컨텍스트 내부의 식별자 정보가 담겨있습니다.
outerEnvironmentReference는 외부 환경을 참조하는 정보들이 담겨있습니다.

## 호이스팅 (Hoisting)

실행 컨텍스트가 실행될 때 가장 먼저 현재 문맥의 식별자 정보를 수집하여 environmentRecord에 담습니다.
이 수집 과정을 호이스팅이라고 합니다.
호이스팅은 실제하는 현상이 아닌 수집 과정을 쉽게 이해하기 위해 만든 허구의 개념입니다.

```js
console.log(a());
console.log(b());
console.log(c());

function a() {
  return "a";
}
var b = function bb() {
  return "bb";
};
var c = function () {
  return "c";
};
```

코드에서 식별자는 function a와 var b, var c입니다.
식별자 정보를 위로 끌어올리면 호이스팅이 완료된 결과를 확인할 수 있습니다.

```js
function a() {
  return "a";
}
var b;
var c;
console.log(a());
console.log(b());
console.log(c());

b = function bb() {
  return "bb";
};
c = function () {
  return "c";
};
```

호이스팅이 완료된 결과입니다.
함수 선언문의 경우는 다른 식별자와 다르게 선언문 전체를 끌어올립니다.

호이스팅으로 끌어올려진 내용 전체가 environmentRecord입니다.
현재 컨텍스트에 선언된 식별자 정보를 코드 순서대로 수집하다보니 호이스팅한 것과 같은 개념이 됩니다.

```js
// 실제로 일어난 일
{
  function a() { ... },
  b: undefined,
  c: undefined,
}

// 호이스팅 (허구의 개념)
function a() {
  return 'a';
}
var b;
var c;
```

호이스팅은 허구의 개념이지만 실제 일어난 일과 동일하게 이해해도 전혀 문제되지 않습니다.

## 스코프 체인 (Scope Chain)

outerEnvironmentReference의 외부 환경에 대한 참조란 외부의 LexicalEnvironment에 대한 참조입니다.

![LexicalEnvironment를 설명한 그림 1](/assets/blog/execution-context/7.png)

앞서 콜 스택에서 보여드렸던 예시로 살펴 보면, inner 컨텍스트가 실행 중인 경우, inner 함수의 outerEnvironmentReference는 바로 밑에 있는 outer 컨텍스트의 LexicalEnvironment 전체를 참조합니다.

동일하게 outer 컨텍스트에 있는 outerEnvironmentReference는 전역 컨텍스트의 LexicalEnvironment를 참조합니다.

스코프는 변수의 유효 범위이며 변수의 유효 범위는 실행 컨텍스트에 의해 결정됩니다.

![LexicalEnvironment를 설명한 그림 2](/assets/blog/execution-context/8.png)

inner 컨텍스트에 선언한 변수는 inner 컨텍스트의 environmentRecord에 의해서 접근할 수 있습니다.
그러나 inner 컨텍스트에서 선언한 변수들은 outer 컨텍스트에서 접근할 수 없습니다.
왜냐하면 outer 컨텍스트에는 inner 컨텍스트의 LexicalEnvironment에 접근할 수 있는 수단이나 참조하고 있는 대상이 없기 때문입니다.
이처럼 스코프는 외부로는 나갈 수 있지만 더 안쪽으로는 들어갈 수 없는 변수의 유효 범위를 의미합니다.

inner 함수에서 선언한 변수는 inner 컨텍스트의 environmentRecord에 담겨있기 때문에 유효 범위는 inner 함수 안으로 국한됩니다.

outer 함수에서 선언한 변수는 전역 컨텍스트에서 접근할 수는 없지만 inner와 outer 컨텍스트에서는 접근할 수 있습니다.
inner 컨텍스트에서 접근할 수 있는 이유는 inner 컨텍스트의 outerEnvironment를 통해 outer 컨텍스트의 environmentRecord에 접근할 수 있기 때문입니다.

전역 공간에 선언한 변수는 모든 컨텍스트에서 접근할 수 있습니다.

inner 컨텍스트에서 어떤 변수를 찾으라고 명령하면 먼저 environmentRecord에서 찾습니다.
없다면 outerEnvironmentReference를 통해 outer 컨텍스트의 environmentRecord에서 찾고 없으면 outer 컨텍스트의 outerEnvironmentReference를 통해 전역 컨텍스트의 environmentRecord에서 찾습니다.
이처럼 변수의 유효 범위를 가장 가까운 자신부터 점점 멀리있는 컨텍스트로 넓혀나가는 것을 스코프 체인이라고 합니다.

## Shadowing

만약 inner, outer, 전역 컨텍스트에서 각각 1, 2, 3으로 변수 a를 선언하고 inner 함수에서 a를 출력하면 1이 나옵니다.
inner 컨텍스트 안에 a가 존재하기 때문에 가장 먼저 찾은 값을 읽어옵니다.
shadowing은 가까운 곳으로 부터 가장 먼저 찾아지는 것만 접근 가능한 개념입니다.

## 정리

```js
var a = 1;
function outer() {
  console.log(a); // 첫 번째 출력: 1

  function inner() {
    console.log(a); // 두 번째 출력: undefined
    var a = 3;
  }

  inner();

  console.log(a); // 세 번째 출력: 1
}
outer();
console.log(a); // 네 번째 출력: 1
```

지금까지의 내용을 바탕으로 다시 한 번 실행 과정을 살펴보겠습니다.

1. 전역 실행 컨텍스트가 활성화되면서 콜 스택에 쌓입니다.
2. 전역 컨텍스트의 environmentRecord가 변수 a와 outer 함수의 식별자 정보를 수집합니다.
3. 코드가 실행되면서 변수 a에 1을 할당합니다.
4. outer 함수가 호출되면서 outer 컨텍스트가 콜 스택에 쌓입니다.
5. outer 컨텍스트의 environmentRecord에서 inner 함수에 대한 식별자 정보를 수집합니다.
6. 코드를 실행하다가 `console.log(a);`를 만나 현재 outer 컨텍스트의 environmentRecord에서 a를 찾습니다.
7. outer 컨텍스트에는 a에 대한 정보가 없으므로 전역 컨텍스트를 탐색하여 1을 출력합니다.
8. inner 함수가 실행되면서 콜 스택에 쌓입니다.
9. inner 컨텍스트 내부에서 선언된 변수 a의 식별자 정보를 담습니다.
10. `console.log(a);`를 만나 컨텍스트 내부에서 변수 a를 찾습니다.
11. 현재 inner 컨텍스트에서 a는 선언만 되었으므로 undefined가 출력됩니다.
12. `var a = 3;`을 만나 inner 컨텍스트의 변수 a에 3이 할당됩니다.
13. inner 함수가 종료되면서 콜 스택에서 빠집니다.
14. outer 컨텍스트로 돌아와 inner 함수가 종료된 위치부터 실행합니다.
15. `console.log(a);`를 만나 a를 탐색하고 전역 컨텍스트에서 찾아 1을 출력합니다.
16. outer 함수가 종료되고 콜 스텍에서 제외됩니다.
17. 실행 컨텍스트로 돌아와 `console.log(a);`가 실행되어 1을 출력합니다.
18. 전역 컨텍스트가 종료되면서 콜 스택이 비워집니다.

## This

![ThisBinding을 설명한 그림1](/assets/blog/execution-context/9.png)

this는 함수가 호출될 때 결정됩니다.
정적으로 코드만 봤을 때 this를 바로 예측할 수 없고 어떤 식으로 호출했느냐에 따라 this는 달라집니다.

### 전역 공간에서 This

전역 공간에서 호출 시 this는 전역 객체(브라우저: window, node.js: global)를 가르킵니다.
전역 컨텍스트를 실행하는 주체가 전역 객체이기 때문입니다.

### 함수에서 This

함수 호출 시에 함수 내부에서 this는 전역 객체를 가르킵니다.
함수를 실행해주는 주체는 전역 객체이기 때문입니다.

```js
function a() {
  console.log(this);
}
a();
```

코드를 보면 a 함수가 호출될 때 전역 공간에서 실행되므로 호출한 대상은 전역 객체입니다.

```js
function b() {
  function c() {
    console.log(this);
  }
  c();
}
b();
```

b라는 함수는 전역 공간에서 호출하지만 c 함수는 b 함수 안에서 호출됩니다.
하지만 `console.log(this);`에는 전역 객체가 출력됩니다.
ES6에서는 ThisBinding을 하지 않는 화살표 함수가 나왔습니다.
화살표 함수는 바로 위 컨텍스트의 this를 상속받아 사용하지만 ES5 혹은 화살표 함수가 아닌 함수로써 호출했을 때 this는 언제나 전역 객체를 가르킵니다.

### 메서드에서 This

메서드로 호출한다면 호출한 주체가 this입니다.

```js
var a = {
  b: function () {
    console.log(this);
  },
};
a.b();
```

b를 메서드로서 a가 호출했으므로 this는 a가 됩니다.

> 메서드는 객체 지향 언어에서 인스턴스와 관련된 동작을 의미합니다.
> 인스턴스는 어떤 클래스에 속하는 객체지만 JavaScript에서는 클래스가 아니더라도 객체와 관련된 동작으로 의미를 확장시켰습니다.
> 클래스의 인스턴스인지와 상관없이 객체와 관련된 동작이면 메서드라고 합니다.

```js
var d = {
  e: function () {
    function f() {
      console.log(this);
    }
    f();
  },
};
d.e();
```

객체 안에 d라는 메서드가 있고 `d.e();`로 메서드로서 호출했습니다.
하지만 f는 함수로서 호출됐기 때문에 여기서 this는 전역 객체가 됩니다.

### 내부 함수에서의 우회법

메서드 안에 내부 함수가 있을 경우 this가 전역 객체를 가르키는 것을 우회할 수 있는 방법이 있습니다.

```js
var a = 10;
var obj = {
  a: 20;
  b: function() {
    console.log(this.a); // 20

    function c() {
      console.log(this.a); // 10
    }
    c();
  }
}
obj.b();
```

obj의 메서드로서 b가 호출됐습니다.
첫 번째 `console.log(this.a);`에서 this는 obj이고 20이 출력됩니다.
c는 함수로서 호출됐습니다.
this는 전역 객체를 가르키고 10이 출력됩니다.

c 함수 내부에서 this가 전역 객체가 아닌 obj를 바라보게 하려면 call, apply 같은 명시적인 This Binding 명령없이는 직접 바꿀 수 없습니다.
하지만 Scope Chain을 이용하여 다른 변수를 이용하여 해결할 수 있습니다.

```js
var a = 10;
var obj = {
  a: 20;
  b: function() {
    var self = this;
    console.log(this.a); // 20

    function c() {
      console.log(self.a); // 20
    }
    c();
  }
}
obj.b();
```

내부 함수 c보다 상위에서 self 변수에 this를 담고 함수 내부에서 self를 사용하면 우회할 수 있습니다.
c 함수는 outerEnvironment를 통해 b 컨텍스트의 self를 찾습니다.
self에는 b 컨텍스트의 this가 담겨있고 obj를 가르킵니다.

```js
var a = 10;
var obj = {
  a: 20;
  b: function() {
    console.log(this.a);
    const c = () => {
      console.log(this.a); // 20
    }
    c();
  }
}
obj.b();
```

ES6에서는 This Binding을 하지 않는 화살표 함수가 등장하면서 이런 우회법을 쓸 필요성이 없어졌습니다.
Thin Binding을 하지 않기 때문에 Scope Chain을 통해 상위 컨텍스트의 this에 접근할 수 있게 됐기 때문입니다.

```js
var a = 10;
var obj = {
  a: 20;
  b: function() {
    console.log(this.a);

    function c() {
      console.log(this.a);
    }
    c.call(this); // c.apply(this);
  }
}
obj.b();
```

물론 ES5에서도 명시적인 This Binding을 통해 간단하게 처리할 수 있습니다.

### call back에서 This

콜백으로 호출 시에 this는 기본적으로 함수와 동일합니다.

```js
function a(x, y, z) {
  console.log(this, x, y, z);
}
var b = {
  bb: "bbb",
};

a.call(b, 1, 2, 3); // {bb: "bbb"} 1 2 3

a.apply(b, [1, 2, 3]); // {bb: "bbb"} 1 2 3

var c = a.bind(b);
c(1, 2, 3); // {bb: "bbb"} 1 2 3

var d = a.bind(b, 1, 2);
d(3); // {bb: "bbb"} 1 2 3
```

출력 결과는 모두 동일합니다.

```js
func.call(thisArg[, arg1[, arg2[, ...]]])
func.apply(thisArg, [argsArray])
func.bind(thisArg[, arg1[, arg2[, ...]]])
```

api 문서에 나와있는 내용입니다.
모두 첫 번째 인자는 thisArg로 필수 인자입니다.
thisArg로 넣은 대상을 this로 인식하기 위해 개발자가 직접 명시해야 합니다.

```js
var callback = function () {
  console.dir(this);
};
var obj = {
  a: 1,
  b: function (cb) {
    cb();
  },
};
obj.b(callback);
```

`obj.b(callback);`에서 b를 메서드로서 호출하면서 callback 함수를 넘겨줍니다.
b 함수 내부에서 함수로서 호출되므로 this는 전역 객체입니다.

```js
var callback = function () {
  console.dir(this);
};
var obj = {
  a: 1,
  b: function (cb) {
    cb.call(this);
  },
};
obj.b(callback);
```

위와 같이 코드를 바꾸면 b 컨텍스트의 this는 obj이므로 obj가 출력됩니다.
콜백 함수 내부에서의 this는 콜백 함수를 넘겨받는 대상이 매개 변수로 받은 콜백 함수를 어떻게 처리하느냐에 따라서 this가 달라질 수 있습니다.

```js
document.body.innerHTML += '<div id="a">클릭하세요</div>';

document.getElementById("a").addEventListener("click", function () {
  console.dir(this);
});
```

이벤트 리스너가 콜백 함수를 실행할 때 별도로 정해놓은 게 없다면 전역 객체가 나와야 하지만 div#a가 출력됩니다.
왜냐하면 addEventListener라는 함수가 콜백 함수를 처리할 때 this는 이벤트 타겟으로 하게끔 정의되어 있기 때문입니다.
이처럼 콜백의 this를 별도로 지정해놓은 경우도 얼마든지 있습니다.

정리하면 콜백 함수의 this는 기본적으로 함수와 같으나 제어권을 가진 함수가 콜백의 this를 지정해둔 경우도 있습니다.
콜백 함수에 명시적인 This Binding을 통해 바꿔줄 수 있습니다.

### 생성자 함수에서 This

생성자 함수로서 호출했다는 의미는 new 연산자를 사용했다는 말과 동일합니다.
new 연산자는 생성자 함수의 내용을 바탕으로 인스턴스 객체를 만드는 명령어를 사용했다는 의미입니다.
new 연산자를 사용하면 새로 만들 인스턴스 객체가 this에 할당됩니다.

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}
var roy = Person("재남", 30);
console.log(window.name, window.age); // 재남 30
```

만약 new 연산자를 사용하지 않는 다면 this는 전역 객체를 가르킵니다.

```js
function Person(n, a) {
  this.name = n;
  this.age = a;
}
var roy = new Person("재남", 30);
console.log(roy);
```

새로 생성될 Person의 인스턴스 객체가 this에 할당됩니다.

![ThisBinding 결과물 사진](/assets/blog/execution-context/10.png)

객체가 새로 만들어지면서 객체 안에 name과 age 프로퍼티가 생성되면서 각각 값이 담겨 roy 변수에 담깁니다.
