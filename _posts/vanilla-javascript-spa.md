---
title: "바닐라 자바스크립트로 SPA 프로젝트 만들기"
description: "바닐라 자바스크립트로 간단한 SPA을 개발합니다."
thumbnail: "/assets/blog/vanilla-javascript-spa/cover.png"
tags: ["JavaScript"]
createdAt: "2024-10-30 13:00:00"
category: "DEV"
---

최근에 바닐라 자바스크립트로 프로젝트를 만들고 싶은 마음이 들었습니다.
바닐라 자바스크립트로 프로젝트를 구현해봐야 `React.js`와 `Next.js`라는 프레임워크가 어느 부분을 편리하게 도와주는지, 프레임워크 전용 함수를 사용하면 내부에서 어떻게 동작할지 알 수 있을 것 같기 때문입니다.

회사에서 간단한 홈페이지를 만들 일이 있었는데, 평소에 `React.js`로 하고 싶다는 어필을 많이 하였으나, `jsp`로 만들라는 답변을 받았었어서 이번에는 `HTML`, `CSS`, `JavaScript`로 만들어보겠다고 얘기했더니 다행히 동의를 해줬습니다.

하지만 막상 시작하려니 어디서 부터 어떻게 시작해야 할지 막막했습니다.
`npx` 명령어로 쉽게 프로젝트 환경을 만든 프레임워크가 아니다 보니 `npm init`을 하고 뭘 설정해야 할지 부터 막혔습니다.

다행히 `ChatGPT`, `개발자 황준일님의 블로그`(https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Component/), NaverD2블로그(https://d2.naver.com/helloworld/2564557)의 도움을 받아 제작할 수 있게 됐습니다. 감사합니다!

## 개발 환경 구축하기

Node.js 기반의 JavaScript 개발 환경으로 설정하는 방법입니다.
먼저 프로젝트 폴더를 만들고 `git init`을 통해 Git 저장소를 만들었습니다.
GitHub 페이지로 들어가서 새로은 저장ㅅ소를 생성한 뒤 `git remote` 명령어로 원격 저장소를 추가했습니다.

![Node.js 버전 확인](/assets/blog/vanilla-javascript-spa/1.png)

먼저 `Node.js`를 설치해야 합니다.
저는 이미 깔려있기 때문에 따로 설치하지 않았습니다.

![Yarn 설치](/assets/blog/vanilla-javascript-spa/2.png)

`yarn`은 페이스북이 개발한 패키지 매니저로 `npm`보다 보안이 뛰어나고 속도가 빠르다고 합니다.
패키지 매니저에 대해서는 추후에 자세하게 공부하여 꼭 포스팅하겠습니다.
일단 지금 `yarn`을 쓰는 이유는 매번 따로 설치하지 않아도 되는 `npm`을 사용했었는데 이번에는 왠지 `yarn`을 써보고 싶었습니다...

패키지는 어떤 걸 설치할지 하다가 일단은 개발 환경을 위해 `live-server`와 fetch 함수를 사용하기 위해 `node-fetch`를 설치했습니다.

```json
"scripts": {
    "start": "live-server ./"
},
```

```html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ReserveFlex</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

`package.json`에 `script`를 추가하고 `index.html`을 작성해준 뒤 `index.js` 파일을 불러와줍니다.

```js
document.querySelector("#app").innerHTML = `<h1>HELLO WORLD!</h1>`;
```

`index.js`에 위와 같은 내용을 작성하고 `npm run start`로 실행해주면?

![개발 환경 세팅 테스트](/assets/blog/vanilla-javascript-spa/3.png)

홈페이지가 정상적으로 뜨는 것을 확인할 수 있습니다.
