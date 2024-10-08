---
title: "TypeScript 개론"
description: "TypeScript의 탄생 배경과 동작원리 대해서 정리한 내용입니다."
thumbnail: "/assets/blog/typescript-1/cover.png"
tags: ["TypeScript"]
createdAt: "2024-10-07 11:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 탄생 배경

![TypeScript 안에 JavaScript가 들어있는 그림](/assets/blog/typescript-1/1.png)

타입스크립트는 2012년에 마이크로소프트의 개발자이자, C#의 창시자로 알려진 에너스 하일스버그에 의해 처음으로 탄생했습니다.
타입스크립트는 기존의 자바스크립트를 더 안전하게 사용할 수 있도록 타입에 관련된 여러 기능을 추가한 언어입니다.
쉽게 말해서 자바스크립트의 확장판이라 볼 수 있습니다.
그렇기 때문에 자바스크립트의 기본 문법들은 다 사용할 수 있습니다.

자바스크립트는 원래 웹 브라우저 안에서만 동작하도록 만들어지고 아주 간단한 사용자 상호작용을 처리하기 위해 만들어졌습니다.
그래서 엄격한 문법을 가질 필요없이 유연하게 설계되었고 버그로 부터 안정성이나 경고하는 일을 포기하는 대신에 프로그래머가 쉽고 빠르고 간결하게 코드를 작성하는 데에 중점을 두고 만들어졌습니다.
실제로 이런 유연함 덕분에 많은 사람들이 잘 사용하고 있었습니다.

Node.js가 등장하면서 웹 브라우저에서만 실행할 수 있었던 자바 스크립트를 어디서든 구동할 수 있게 됐습니다.
이로 인해 어떤 프로그램이든 자바스크립트로 만들 수 있게 됐고 기존에 자바스크립트를 사용하던 프로그래머들이 자바스크립트를 이용하여 웹 서버, 모바일 앱, 데스크탑 앱 등 다양한 프로그램을 만들기 시작했습니다.

하지만 이러한 대규모 어플리케이션을 자바스크립트로 개발하다보니 자바스크립트가 엄격하지 않은 문제가 있었습니다. 자바스크립트의 장점이었던 유연함이 활용도가 높아지고 복잡한 프로그램을 만드는 데에 활용되다보니 오히려 버그 발생 가능성을 높여서 프로그램의 전체적인 안정성을 떨어트리는 단점이 됐습니다.

이러한 자바스크립트의 문제점을 극복하기 위해서 자바스크립트의 문법들과 매력은 그대로 유지한채 안정성만 추가로 확보한 새로운 언어가 필요해졌습니다.

결론적으로 타입스크립트는 더 복잡한 상황에서 더 대규모 프로그램을 자바스크립트로 만들기위해 더 안정적으로 타입이라는 안전장치를 추가한 확장판 자바스크립트라고 이해할 수 있습니다.

## 타입 시스템

![타입 시스템의 정의를 나타낸 그림](/assets/blog/typescript-1/2.png)

모든 프로그래밍 언어에는 타입 시스템이 존재합니다.
타입 시스템이란 언어에서 사용할 수 있는 여러 값들을 어떤 기준으로 묶어 타입으로 정할지 결정하고 코드의 타입을 언제, 어떻게 검사할지 등의 프로그래밍 언어를 사용할 때 타입과 관련해서 지켜야할 규칙들을 모아둔 체계입니다.
쉽게 말해서 언어의 타입과 관련된 문법 체계라고 볼 수 있습니다.

![타입 시스템의 정적 타입 시스템과 동적 타입 시스템을 나타낸 그림](/assets/blog/typescript-1/3.png)

타입 시스템은 크게 정적 타입 시스템과 동적 타입 시스템 두 가지로 나뉩니다.
정적 타입 시스템은 코드 실행 이전에 모든 변수의 타입을 고정적으로 결정합니다.
동적 타입 시스템은 코드를 실행하고 나서 유동적으로 변수의 타입을 결정합니다.

```js
let a = "hello";
```

자바스크립트와 같은 동적 타입 시스템은 변수의 타입들을 코드가 실행되는 도중에 결정하기 때문에 코드에 변수의 타입을 직접 정의하지 않습니다.

```js
let a = "hello"; // 문자열
a = 19930803; // 숫자
```

또한 변수의 타입이 하나로 고정되지 않고 현재 변수에 담긴 값에 따라서 동적으로 달라지는 유연하다는 장점을 갖고 있습니다.

```js
let a = "hello"; // 문자열
a = 19930803; // 숫자

a.toUpperCase();
```

하지만 변수 `a`에서 문자열 전용 메서드인 `toUpperCase` 메서드를 사용하는 코드를 작성하고 실행하면 실행은 되지만 오류가 발생되고 프로그램이 비정상적으로 종료됩니다.
`toUpperCase`는 문자열에서만 사용할 수 있는 메서드인데 `a`에는 숫자가 들어있기 때문입니다.
중요한 문제는 오류가 발생하지만 코드가 실행이 된다는 점입니다.
애초에 오류가 발생할 코드라면 실행 전에 검사를 거쳐 실행하지 못하도록 하는 것이 좋습니다.

대규모의 프로그램을 만들 때 코드도 복잡해지고 양도 많아지면서 이러한 오류들이 당장 발생하지 않고 몇일 뒤에 발생하여 프로그램이 강제 종료되고 서비스가 마비될 수도 있습니다.

```java
String a = "hello";
int b = 123;
```

반면 C 언어나 Java 같은 언어들은 정적 타입 시스템을 가지고 있습니다.
따라서 변수를 선언함과 동시에 타입도 함께 명시해줘야 합니다.
앞서 본 동적 타입 시스템에서 발생하는 문제들은 정적 타입 시스템에서는 잘 발생하지 않습니다.

```java
String a = "hello";
int b = 123;

int c = a * b; // Error
```

Java에서 위와 같이 코드를 작성하면 에디터 상에서 `int c = a * b;` 부분에 오류를 나타내줍니다.
정적 타입 시스템 언어는 타입 관련 오류가 있으면 에디터 상에서 애초에 오류를 알려주고 코드 실행 전에 타입을 잘 못 쓰지 않았는지 검사를 마치고 실행되기 때문에 오류가 있다면 애초에 실행되지 않습니다.
따라서 프로그래머가 의도치 않은 실수를 하더라도 미리 확인해볼 수 있는 기회가 주어집니다.
하지만 정적 타입 시스템은 모든 변수에 타입을 다 지정해야 하기 때문에 타이핑 양이 상당히 늘어납니다.

타입 스크립트는 동적 타입 시스템과 정적 타입 시스템을 혼합한 것 같은 독특한 타입 시스템을 사용합니다.
정적 타입 시스템처럼 변수의 타입을 실행 전에 결정하고 타입 오류가 없는지 프로그램 실행 전에 검사합니다.

```js
let a: number = 1;
a.toUpperCase();
```

따라서 위와 같은 코드를 입력하면 오류를 띄워서 알려줍니다.
타입스크립트는 정적 타입 시스템처럼 안전하면서도 동적 타입 시스템처럼 모든 변수에 일일히 타입을 명시하지 않아도 됩니다.

```js
let a = 1;
a.toUpperCase();
```

변수 `a`의 타입을 정의하지 않아도 변수에 담기는 초기값을 기준으로 자동으로 타입을 숫자 타입으로 추론하여 `a.toUpperCase()`에 오류가 있음을 알려줍니다.

![정적 타입 시스템과 점진적 타입 시스템과 동적 타입 시스템을 나타낸 그림](/assets/blog/typescript-1/4.png)

이렇게 정적 타입 시스템이 갖는 안전성을 채택하면서도 모든 변수의 타입을 선언해야했던 불편함을 동시에 해결하고 이런 시스템을 점진적 타입 시스템이라고 부릅니다.

## 타입스크립트 동작 원리

### 대다수의 프로그래밍 언어의 동작 방식

대다수의 프로그래밍 언어는 컴퓨터보단 인간에게 더 친화적입니다.
컴퓨터는 바이트 코드나 이진수같은 단순한 형태의 언어를 기반으로 동작합니다.
따라서 영어와 비슷한 프로그래밍 언어를 컴퓨터가 바로 이해하고 실행할 수는 없습니다.
컴퓨터가 작성한 코드를 이해하기 위해 해석하기 쉬운 형태로 변환하는 과정을 컴파일이라고 합니다.

![컴파일러의 컴파일 과정1](/assets/blog/typescript-1/5.png)

컴파일러는 프로그래밍으로 작성한 언어를 바로 바이트 코드(기계어)로 변환하기 전에 `AST(추상 문법 트리)`라는 특별한 형태로 변환합니다.
코드의 공백이나 주석, 탭 등의 코드 실행에 관계없는 요소들을 전부 제거하고 트리 형태의 자료구조에 코드를 쪼개서 저장해놓은 형태를 `AST`라고 부릅니다.

![컴파일러의 컴파일 과정2](/assets/blog/typescript-1/6.png)

코드를 `AST`로 변환하고 나면 마지막으로 컴파일러가 바이트 코드로 변환하고 컴파일이 종료됩니다.

### 타입스크립트의 컴파일 과정

![컴파일러의 컴파일 과정2](/assets/blog/typescript-1/7.png)

타입스크립트도 다른 언어와 동일하게 `AST`로 변환합니다.
하지만 `AST`를 바이트 코드로 변환하는 것이 아니라 `AST`를 보고 코드상에 타입 오류가 없는지 검사하는 타입 검사를 수행합니다.

```js
let a = 1;
a.toUpperCase();
```

만약 잘못된 코드를 작성하여 타입 오류가 있었다면 타입 검사 과정에서 실패하게 되고 컴파일이 중단됩니다.
타입 오류가 없는 정상적인 코드라면 검사를 정상적으로 통과하고 `AST`를 바이트 코드가 아닌 자바스크립트 코드로 변환하고 컴파일이 종료됩니다.
대부분의 언어를 컴파일하면 바이트 코드가 만들어지는데 타입스크립트의 코드를 컴파일하면 자바스크립트 코드가 만들어지는 독특한 특징을 갖고 있습니다.

타입스크립트의 컴파일 결과로 만들어진 자바스크립트 코드는 Node.js나 웹 브라우저로 실행하면 다시 다른 언어들과 동일한 컴파일 과정을 거쳐 실행되게 됩니다.

중요하게 봐야할 점은 타입 스크립트 컴파일 과정에 타입 검사가 포함되어 있기 때문에 검사를 성공해서 생성된 자바스크립트 코드는 타입 오류가 발생할 가능성이 낮은 안전한 자바스크립트 코드라는 것입니다.

```js
let a: string = "1";
a.toUpperCase();
```

타입 오류가 없는 타입스크립트 코드는 타입 검사를 통해서

```js
let a = "1";
a.toUpperCase();
```

타입 관련 문법들은 다 삭제된 안전한 자바스크립트 코드로 변환됩니다.
여기서 알 수 있는 사실은 타입 스크립트에 작성한 `: string`같은 타입 관련 코드들은 자바 스크립트로 변환될 때 모두 사라지게 되기 때문에 프로그램 실행 자체에는 영향을 미치지 않습니다.
