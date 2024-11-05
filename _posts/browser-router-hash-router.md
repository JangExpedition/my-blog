---
title: "브라우저 라우터와 해시 라우터"
description: "클라이언트 사이드 라우팅에서 브라우저 라우터와 해시 라우터가 어떻게 동작하는지 살펴본다."
thumbnail: "/assets/blog/browser-router-hash-router/cover.png"
tags: ["Web"]
createdAt: "2024-11-04 10:00:00"
category: "DEV"
---

최근에 바닐라 자바스크립트로 SPA를 만들고 있다.
클라이언트 사이드 라우팅을 직접 구현하다가 브라우저 라우터와 해시 라우터의 차이점을 알게 됐다.
이 글은 브라우저 라우터와 해시 라우터가 어떻게 동작하는지, 장단점은 무엇인지 등에 대해 이야기한다.

## 브라우저 라우터 (Browser Router)

브라우저 라우터는 사용자가 페이지를 이동할 때 History API 메서드를 사용하여 브라우저의 URL을 바꾸지만 페이지가 다시 로드되지는 않는다.

> History API는 전역 객체의 history를 통해 브라우저 세션 히스토리에 대한 접근을 제공한다.
>
> 브라우저 세션 히스토리는 현재 브라우저에서 사용자가 방문한 웹 페이지들의 기록을 의미한다.
> 브라우저 히스토리와 비슷하게 볼 수 있으나 세션 히스토리는 특정 탭이나 창에 국한된다는 점에 차이가 있다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <nav>
      <a href="/" data-link>Home</a>
      <a href="/about" data-link>About</a>
    </nav>
  </head>
  <body>
    <script>
      // 페이지 렌더 함수
      function renderPage(path) {
        const routes = {
          "/": () => console.log("Home"),
          "/about": () => console.log("About"),
        };
        routes[path]();
      }

      // History API 메서드를 통해 브라우저 조작
      function navigate(path) {
        window.history.pushState({}, path, window.location.origin + path);
        renderPage(path);
      }

      // a 태그 클릭 이벤트 발생 시 렌더링
      document.querySelectorAll("a[data-link]").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          navigate(e.target.getAttribute("href"));
        });
      });

      // 뒤로 가기/앞으로 가기 시 페이지 렌더링
      window.addEventListener("popstate", () => {
        renderPage(window.location.pathname);
      });

      // 초기 렌더링 시 현재 경로에 맞는 페이지 렌더링
      renderPage(window.location.pathname);
    </script>
  </body>
</html>
```

코드를 살펴보면 이해하기 수월하다.
`a[data-link]` 태그를 클릭하면 `e.prevetDefault`로 실제 페이지 이동을 막는다.
`pushState` 메서드를 사용해서 세션 히스토리에 페이지 이동 이력을 넣고 렌더링할 페이지를 보여준다.

![브라우저 라우터 실행 결과](/assets/blog/browser-router-hash-router/1.gif)

실행 결과를 보면 `a[data-link]` 태그를 누르면 브라우저의 주소창에 URL이 바뀌고 뒤로 가기, 앞으로 가기가 모두 정상적으로 동작한다.

![브라우저 라우터에서 페이지 이동 후 새로고침 시 404 오류](/assets/blog/browser-router-hash-router/2.png)

하지만 /about 경로에서 새로고침을 하면 404에러가 발생한다.
왜냐하면 서버는 /about 경로를 알지 못하기 때문이다.

## 해시 라우터 (Hash Router)

해시 라우터는 URL의 해시(#)를 사용하여 라우팅한다.
해시 부분은 브라우저가 서버에 전달하지 않기 때문에 새로고침 시에도 404 에러가 발생하지 않는다.
해시 라우터는 `hashchange` 이벤트를 통해 해시 변경을 감지하여 렌더링한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <nav>
      <a href="#/" data-link>Home</a>
      <a href="#about" data-link>About</a>
    </nav>
  </head>
  <body>
    <script>
      // 페이지 렌더 함수
      function renderPage(hash) {
        const routes = {
          "#/": () => console.log("Home"),
          "#about": () => console.log("About"),
        };
        routes[hash]();
      }

      // 해시 태그에
      function navigate() {
        const hash = window.location.hash || "#/";
        renderPage(hash);
      }

      // a 태그 클릭 시 해시 변경으로 페이지 렌더링
      document.querySelectorAll("a[data-link]").forEach((link) => {
        link.onclick = (e) => {
          e.preventDefault();
          window.location.hash = e.target.getAttribute("href");
        };
      });

      // 해시 변경 이벤트 감지
      window.addEventListener("hashchange", navigate);

      navigate();
    </script>
  </body>
</html>
```

해시 라우터도 코드를 통해 살펴보면 `a[data-link]` 태그가 클릭되면 `e.preventDefault` 메서드를 통해 페이지 이동을 막고 브라우저의 해시값을 변경해준다.
`hashchange` 이벤트가 발생하면 이벤트 리스터가 `navigate` 함수를 통해 해시값에 맞는 페이지를 렌더링한다.

![해시 라우터 동작 예시](/assets/blog/browser-router-hash-router/3.gif)

동작 화면을 보면 새로고침 시에도 에러를 반환하지 않는다.
해시 부분은 클라이언트 사이드에서만 사용되고 서버에 영향을 주지 않기 때문이다.

따라서 새로고침을 하면 서버는 해시 이후의 경로를 무시하고 기본 페이지를 반환한다.
그 이후에 해시 라우터가 실행되어 해시 값에 따라 클라이언트 측에서 다시 라우팅하게 된다.

하지만 URL에 #이 생겨 지저분해진다는 단점이 있다.

## 브라우저 라우터와 SEO

브라우저 라우터는 History API를 사용하여 URL을 조작하기 때문에 URL은 클라이언트와 서버에서 모두 일관되게 표시된다.

브라우저 라우터를 사용하면 페이지 이동 시 URL이 그대로 변경되고 검색 엔진 크롤러는 URL을 인식하여 해당 경로를 크롤링할 수 있어 검색 결과에 잘 노출될 가능성이 높아진다.

SSR을 사용할 경우 브라우저 라우터를 통해 각 페이지에 대한 고유한 URL을 크롤러에게 제공할 수 있다. 검색 엔진 크롤러는 렌더링된 페이지의 콘텐츠를 읽고 색인할 수 있다.

예를 들어 `https://example.com/about` 같은 URL을 검색 엔진은 개별 페이지로 인식하여 크롤링하고 사용자 검색 결과에 반영할 수 있다.

## 해시 라우터와 SEO

해시 라우터는 URL의 해시부분을 사용해 라우팅하기 때문에 서버와 무관하게 동작한다.
검색 엔진 크롤러는 해시 이후의 경로를 인식하지 못하므로 SEO에 불리하다.

해시 라우터로 관리되는 URL은 클라이언트 사이드에서만 렌더링되기 때문에 검색 엔진이 해당 경로를 크롤링하지 못하고 페이지 내용을 색인하지 못할 가능성이 높다.

예를 들어 `https://example.com/#/about` 같은 URL을 개별 페이지로 인식하지 않고 `https://example.com`만 인식한다.

## 브라우저 라우터의 서버 설정

해시 라우터는 URL이 깔끔하지 못하고 SEO에 불리하다는 단점이 존재한다.
하지만 브라우저 라우터는 새로고침 시에 404 에러를 반환한다는 치명적인 단점이 있다.

브라우저 라우터의 새로고침 시 발생하는 문제를 해결하려면 서버 설정이 필요하다.
서버 설정은 여러 방법으로 할 수 있지만 결국 모든 URL 요청에 대해 index.html 파일을 반환하도록 설정하면 해결할 수 있다.

루트 경로에 server.js 파일을 생성한다.

```js
const express = require("express");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "/")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/index.html")));
app.listen(port);
```

위와 같이 코드를 작성하면 모든 URL 요청에 index.html 파일만 반환하게 할 수 있다.
