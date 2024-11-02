---
title: "바닐라 자바스크립트로 SPA 프로젝트 만들기(작성 중)"
description: "바닐라 자바스크립트로 간단한 SPA을 개발합니다."
thumbnail: "/assets/blog/vanilla-javascript-spa/cover.png"
tags: ["JavaScript"]
createdAt: "2024-10-30 13:00:00"
category: "DEV"
---

최근에 바닐라 자바스크립트로 프로젝트를 만들어야겠다는 생각을 했다.
바닐라 자바스크립트로 프로젝트를 구현하면 `React.js`와 `Next.js`라는 프레임워크가 어느 부분을 편리하게 도와주는지, 프레임워크 전용 함수를 사용하면 내부에서 어떻게 동작할지 알 수 있을 것 같았다.

회사에서 간단한 홈페이지를 만들 일이 있었는데, 평소에 `React.js`로 하고 싶다는 어필을 많이 했지만, 매번 `jsp`로 만들라는 답변을 받았다.
그래서 이번에는 `HTML`, `CSS`, `JavaScript`로 만들어보겠다고 얘기했더니 다행히 동의를 해줬다.

하지만 막상 시작하려니 어디서 부터 어떻게 시작해야 할지 막막했다.
`npx` 명령어로 쉽게 프로젝트 환경을 만들다 보니 `npm init`을 하고 뭘 설정해야 할지 부터 막혔다.

다행히 `ChatGPT`, `개발자 황준일님의 블로그`(https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/), NaverD2블로그(https://d2.naver.com/helloworld/2564557)의 도움을 받아 제작할 수 있게 됐다. 다들 감사합니다!

## 개발 환경 구축하기

먼저 프로젝트 폴더를 만들고 `git init`을 통해 Git 저장소를 만들었다.
GitHub 페이지로 들어가서 새로은 저장소를 생성한 뒤 `git remote` 명령어로 원격 저장소를 추가했다.

![Node.js 버전 확인](/assets/blog/vanilla-javascript-spa/1.png)

`Node.js`는 이미 깔려있기 때문에 따로 설치하지 않았다.
패키지는 어떤 걸 설치할지 고민하다가 개발 환경을 위해 `live-server`와 `node-fetch`를 설치했다.

```json
"scripts": {
    "start": "live-server"
},
```

```html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>타이틀</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

`package.json`에 `script`를 추가하고 `index.html`을 작성해준 뒤 `main.js` 파일을 불러왔다.

```js
document.querySelector("#root").innerHTML = `<h1>HELLO WORLD!</h1>`;
```

`main.js`에 위와 같은 내용을 작성하고 `npm run start`로 실행해주면?

![개발 환경 세팅 테스트](/assets/blog/vanilla-javascript-spa/2.png)

홈페이지가 정상적으로 뜨는 것을 확인할 수 있다.

## 컴포넌트 만들기

개발자 황인욱님께서 작성하신 글을 읽고 직접 코드를 작성하면서 동작 원리를 이해해봤다.
하지만 원하는 대로 커스텀해서 사용하려니 어디를 어떻게 고쳐야할지 막연했다.
나에게 필요한 건 컴포넌트, 레이아웃, 라우트 기능이었으나 한 번에 생각하려니 자꾸 막혔다.
그래서 '일단 페이지를 만들고 천천히 분리하자!' 라는 생각으로 `index.html`을 작성했다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>타이틀</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <header id="main_header">... 헤더 내용</header>
    <div id="root">...메인 페이지에 들어갈 내용</div>
    <footer id="main_footer">...footer 내용</footer>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

우선 `header`와 `footer`를 만들었다.
`header`와 `footer`는 나중에 레이아웃으로 분리하겠지만 먼저 고려하려니 생각이 자꾸만 어지러져서 `#root` 바깥에 작성했다.

```js
function scrollYHandler() {
  // 스크롤에 따라 변경되야할 사항들
}

document.addEventListener("DOMContentLoaded", (e) => {
  scrollYHandler();
  window.addEventListener("scroll", scrollYHandler);
});
```

메인 페이지를 작성하다보니 스크롤을 내릴 때 효과를 줘야하는 부분이 있었다.
`DOM`이 로드됐을 때 실행한 이유는 스크롤을 내리다가 중간에 새로고침을 하면 다시 스크롤을 발생하기 전에 레이아웃이 깨지는 현상이 있었기 때문이다.

아무튼 이렇게 메인 페이지를 모두 작성했기 때문에 메인 페이지의 내용을 컴포넌트로 분리했다.

```js
document.querySelector("#root").innerHTML = `메인 페이지 내용`;
```

'`main.js`에 메인 페이지 내용을 `innerHTML`을 통해 넣는 것을 클래스에서 처리하면 그 클래스가 컴포넌트가 되겠다!'고 생각하고 `App.js`를 작성했다.

```js
import App from "./App.js";

new App(document.querySelector("#root"));
```

```js
export default class App {
  $target;

  constructor(target) {
    this.$target = target;

    this.$target.innerHTML = `메인 페이지 내용`;

    this.scrollYHandler();
    window.addEventListener("scroll", this.scrollYHandler.bind(this));
  }

  scrollYHandler() {
    // 스크롤에 따라 변경되야할 사항들
  }
}
```

`App` 객체의 인스턴스를 생성할 때 렌더링할 타겟을 넘겨주고 렌더링 한 뒤 스크롤 이벤트 처리를 해줬다.
`window` 객체에 이벤트 리스너를 추가하는 거라서 `App.js`에서 처리하는 게 맞을지 모르겠다.
하지만 스크롤에 따라 메인 페이지에 들어갈 내용이 변경되기 때문에 남겨줬다.
'이제 `App` 클래스를 추상화하면 `extends`를 통해 컴포넌트를 만들 수 있겠다' 생각하여 추상화를 진행했다.

```js
export default class Component {
  $target;
  $state;

  constructor(target) {
    this.$target = target;
    this.setup();
    this.setEvent();
    this.render();
  }
  setup() {}
  setEvent() {}
  render() {
    this.$target.innerHTML = this.template();
  }
  template() {
    return "";
  }
}
```

```js
import Component from "./core/Component.js";

export default class App extends Component {
  scrollYHandler() {
    // 스크롤에 따라 변경되야할 사항들
  }

  template() {
    return `메인 페이지 내용`;
  }

  setEvent() {
    window.addEventListener("scroll", this.scrollYHandler.bind(this));
  }
}
```

### `setEvent` 함수를 `render` 함수보다 먼저 호출하는 것이 맞을까?

이런 의문이 들 수 있는 이유는 `DOM`에 렌더링하는 `render` 함수가 실행되기 전에 추가하려는 `DOM`을 조작하는 코드가 이벤트리스너의 콜백 함수에 있기 때문이다.

이를 위해서는 자바스크립트의 비동기 방식이 어떻게 동작하는지 알아야 한다.

```js
console.log(1 + 1);
console.log(2 + 2);
```

위 코드의 결과는 2, 4 순서대로 출력된다.

```js
console.log(1 + 1);
setTimeout(() => console.log(2 + 2), 3000);
console.log(3 + 3);
```

만약 중간에 `setTimeout` 함수를 넣으면 어떨까?
결과는 2, 6 먼저 출력되고 3초 뒤에 4가 출력된다.

자바스크립트는 싱글 스레드로 동작하기 때문에 한 번에 하나의 작업만 처리할 수 있다.
보통은 코드가 위에서 아래로 순차적으로 실행되므로 위 코드는 2가 출력되고 3초 뒤에 4가 출력된 뒤 6이 출력될 거라 생각할 수 있다.

> 콜 스택(call stack): 소스코드 평가 과정에서 생성된 실행 컨텍스트가 추가되고 제거되는 스택으로 자바스크립트 엔진은 단 하나의 콜 스택을 사용한다.
>
> 태스크 큐(task queue/event queue/callback queue): setTimeout, setInterval과 같은 비동기 함수의 콜백 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역이다.
>
> 이벤트 루프(event loop): 콜 스택에 현재 실행 중인 컨텍스트가 있는지, 태스크 큐에 대기 중인 함수가 있는지 반복해서 확인한 뒤 콜 스택이 비어있고 태스크 큐에 대기 중인 함수가 있다면 순차적으로 콜 스택으로 이동시킨다.
>
> WEB API: 브라우저에서 제공하는 API로 DOM API와 타이머 함수, HTTP 요청 등을 비동기로 처리한다.

![자바스크립트의 비동기 함수처리 과정](/assets/blog/vanilla-javascript-spa/3.png)

코드가 실행되는 과정을 살펴보자(전역 컨텍스트가 실행되고 종료되는 과정은 생략했다).

1. 콜스택에서 1+1 연산을 처리하여 2가 출력되고 콜스택에서 제거.
2. setTimeout 함수가 호출되면 WEB API에게 처리를 맡긴 후 콜스택에서 제거.
3. 3+3을 연산해서 6을 출력하고 콜스택에서 제거.
4. WEB API가 3초 후 태스크 큐에 콜백 함수를 넣음.
5. 이벤트 루프가 콜 스택이 비어있고 태스크 큐에 대기 중인 함수가 있는 것을 확인하고 콜 스택으로 대기 중인 함수를 콜 스택으로 이동시킴.
6. 2+2 연산이 처리되어 4가 출력된 뒤 모든 작업이 종료됨.

**자바스크립트는 싱글 스레드인데도 비동기 함수의 처리 과정을 보면 멀티 스레드 방식아닌가?**

자바스크립트는 싱글 스레드 방식으로 동작하지만 비동기 함수를 처리할 수 있는 이유는 브라우저에서 제공하는 WEB API가 있기 때문이다.
즉 자바스크립트는 싱글 스레드로 동작하지만 브라우저는 멀티 스레드로 동작하여 비동기 처리가 가능한 것이다.
따라서 자바스크립트 엔진만으로는 비동기 처리를 할 수 없다.

추가로 `setTimeout(() => console.log(2 + 2), 0)`으로 입력해도 동일하다.
브라우저는 지연 시간이 4ms 이하인 경우 최소 지연 시간 4ms가 지정되기 때문이다.

이제 이벤트 리스너의 콜백 함수가 동작하는 방식으로 돌아가 보자. 이벤트 리서너의 콜백 함수는 WEB API가 이벤트를 감시하다가 이벤트가 발생하면 콜백 함수가 태스크 큐로 이동해 실행 준비 상태가 된다.
이벤트 루프가 콜 스택이 비어있음을 확인하고 태스크 큐에서 첫 번째 콜백 함수를 꺼내 콜 스택으로 올려준다.

따라서 콜 스택에서 render 함수가 먼저 실행되고 이벤트 발생 시에 콜백 함수가 실행되기 때문에 오류가 발생하지 않는다.

> 콜백 함수에 꼭 `bind(this)`를 해줘야 한다.
> `bind(thid)`에서 `this`는 `App` 인스턴스를 가르킨다.
> `bind`를 하지 않으면 콜백 함수 내부에서 `this.$target`을 사용할 때 `this`가 `window`를 가르키기 때문에 오류가 발생한다.

이로써 하나의 컴포넌트를 완성했다.

## 레이아웃과 라우트
