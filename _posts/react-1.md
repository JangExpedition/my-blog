---
title: "[React 완전 정복] 리액트란 무엇이며, 왜 사용해야 할까?"
description: "리액트와 바닐라 자바스크립트를 비교하면서 리액트의 이점에 대해 알아보자"
thumbnail: "/assets/blog/react-1/cover.png"
tags: ["TypeScript", "React"]
createdAt: "2024-11-05 10:00:00"
category: "DEV"
---

## 리액트란 무엇이며, 왜 사용해야 할까?

![react.dev에 나와있는 리액트의 정의](/assets/blog/react-1/1.png)

리액트는 웹 및 네이티브 사용자 인터페이스를 위한 라이브러리이다.
다시 말해 리액트는 사용자 인터페이스 구축을 위한 자바스크립트 라이브러리다.

**왜 리액트를 사용해야 할까?**

리액트는 화면 전환이 부드럽고 즉각적이다.
서버에서 새 페이지를 받을 때까지 기다릴 필요가 없기 때문에 마치 모바일 앱과 같다.
웹 페이지에서 메뉴를 선택하면 자바스크립트는 페이지를 재로딩하거나 나가지 않고 백그라운드의 데이터를 가져와 화면을 업데이트하고 페이지끼리 부드럽게 전환되도록 한다.

**이 모든게 자바스크립트로 동작하면 리액트는 왜 필요할까?**

바닐라 자바스크립보다는 리액트 같은 라이브러리를 쓰는 게 더 좋은 이유는 복잡한 UI를 더 쉽게 구축하도록 도와주기 때문이다.
바닐라 자바스크립트와 리액트로 만든 코드를 살펴보자.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>바닐라 자바스크립트</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="styles.css" />
    <script src="index.js" defer></script>
  </head>
  <body>
    <header>
      <div>
        <h1>바닐라 자바스크립트</h1>
        <p>바닐라 자바스크립트로 만든 페이지</p>
      </div>
    </header>
    <div id="tabs">
      <menu>
        <button id="btn-why-react" class="active">Tab1</button>
        <button id="btn-core-features">Tab2</button>
        <button id="btn-resources">Tab3</button>
      </menu>
      <div id="tab-content"></div>
    </div>
  </body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>리액트</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

먼저 index.html을 보면 리액트로 만든 웹앱은 body 태그에 div#root 하나만 있다.

**index.html이 단순해져서 오는 이점이 있을까?**

하지만 단순하게 index.html의 내용이 적어지는 것만으로는 좋은 점만 있다고 보기 애매하다.

리액트는 초기 HTML이 단순해도 라이브러리와 번들링된 JavaScript 파일을 로드해야 하므로 최초 로딩 시에는 큰 차이가 없을 수도 있다.
하지만 사용자에게 빠르게 빈 화면이나 로딩 중임을 보여줄 수 있어 초기 사용자 경험을 개선할 수 있다.

리액트는 애플리케이션의 규모가 커질 수록 빛을 바란다.
리액트의 가상돔과 컴포넌트 기반 구조는 리렌더링을 최적화하고 화면 업데이트 시 필요한 DOM만 수정하기 때문에 초기 파일 크기에서는 다소 불리할 수 있지만 이후 페이지 안에서 상태 변경 및 렌더링 시 효율적으로 동작하기 때문이다.

```js
const content = [...];

const btnWhyReact = document.getElementById("btn-why-react");
const btnCoreFeature = document.getElementById("btn-core-features");
const btnResources = document.getElementById("btn-resources");
const tabContent = document.getElementById("tab-content");

function displayContent(items) {
  let listContent = "";
  for (const item of items) {
    listContent += `<li>${item}</li>`;
  }
  const list = document.createElement("ul");
  tabContent.innerHTML = "";
  list.innerHTML = listContent;
  tabContent.append(list);
}

function highlightButton(btn) {
  btnWhyReact.className = "";
  btnCoreFeature.className = "";
  btnResources.className = "";
  btn.className = "active";
}

function handleClick(event) {
  const btnId = event.target.id;
  highlightButton(event.target);
  if (btnId === "btn-why-react") {
    displayContent(content[0]);
  } else if (btnId === "btn-core-features") {
    displayContent(content[1]);
  } else {
    displayContent(content[2]);
  }
}

displayContent(content[0]);

btnWhyReact.addEventListener("click", handleClick);
btnCoreFeature.addEventListener("click", handleClick);
btnResources.addEventListener("click", handleClick);
```

바닐라 자바스크립트로 작성된 코드는 각 탭을 누를 때마다 클릭 이벤트 핸들러를 설정하여 스타일을 변경하고, 내용을 업데이트한다.

```js
// index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// App.js
import { useState } from "react";
import "./styles.css";

const content = [...];

export default function App() {
  const [activeContentIndex, setActiveContentIndex] = useState(0);

  return (
    <div>
      <header>
        <div>
          <h1>리액트</h1>
          <p>사용자 인터페이스 구축을 위한 자바스크립트 라이브러리</p>
        </div>
      </header>

      <div id="tabs">
        <menu>
          <button
            className={activeContentIndex === 0 ? "active" : ""}
            onClick={() => setActiveContentIndex(0)}
          >
            Tab1
          </button>
          <button
            className={activeContentIndex === 1 ? "active" : ""}
            onClick={() => setActiveContentIndex(1)}
          >
            Tab2
          </button>
          <button
            className={activeContentIndex === 2 ? "active" : ""}
            onClick={() => setActiveContentIndex(2)}
          >
            Tab3
          </button>
        </menu>
        <div id="tab-content">
          <ul>
            {content[activeContentIndex].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

반면 리액트 코드에서는 이벤트 리스너, 스타일 변경 함수, 내용 변경 함수가 필요 없으며 대신 `activeContentIndex`라는 상태를 통해 UI를 간단하게 관리할 수 있다.

```js
<ul>
  {content[activeContentIndex].map((item) => (
    <li key={item}>{item}</li>
  ))}
</ul>
```

`activeContentIndex`를 변경함으로써 문자열 배열인 `content`의 내용을 손쉽게 가져와 사용할 수 있다.

리액트에서는 상태가 변경되면 UI가 자동으로 갱신된다.
선언형 프로그래밍 스타일 덕분으로 리액트는 상태 변화를 감지하고 필요한 부분만 업데이트하여 효율적인 렌더링을 수행한다.

### 선언형 프로그래밍(Declarative Programming)

- 무엇을 해야 하는지 목표에 중점을 둔다. 구체적으로 어떻게 해야 하는지 명시하지 않는다.
- 장점
  - 코드가 목적에 집중되어 있어 직관적이고 이해하기 쉽다.
  - 코드의 양이 줄고 구조가 간단해진다.
  - 비지니스 로직이나 목적을 파악하기 쉬워, 모드 수정 시 영향 파악이 용이하다.
- 단점
  - 어떻게 작동하는지에 대한 명확한 제어가 어려워서 최적화가 필요한 경우 추가적인 작업이 필요할 수 있다.
  - 내부 동작을 깊이 이해해야 할 때 코드 실행 순서나 메커니즘을 파악하기 어렵다.

### 명령형 프로그래밍(Imperative Programming)

- 목표가 아닌 거쳐야할 단계가 중요하고 프로세스가 명확히 정의된다.
- 장점
  - 모든 단계와 과정에 대해 명확한 제어가 가능해 성능을 최적화하거나 맞춤화할 때 유리하다.
  - 각 단계가 명확하게 정의되어 있어 코드 디버깅에 용이하다.
- 단점
  - 각 단계를 상세히 작성해야 하므로 코드가 길어진다.
  - 단계가 많아지면 코드가 이해하기 어렵고 수정 시 영향 파악이 힘들어질 수 있다.
  - 프로세스 중심으로 작성되어 코드 목적이 복잡해질수록 가독성이 떨어진다.

### 리액트 vs 바닐라 자바스크립트 비교

리액트는 목표로 하는 UI 상태를 정의하면 된다.
UI가 변경될 때 어떤 과정이 필요한지 고민하지 않고 알아서 필요한 단계를 수행한다.
이를 통해 코드가 간결해지고 가독성이 높아지며 유지보수도 쉬워진다.

반면 바닐라 자바스크립트에서는 모든 동작을 명령형으로 작성해야한다.
앞선 예제 또한 탭의 내용을 변경하려면 이벤트 리스너를 설정하고, 스타일 변경, DOM 업데이트 등의 작업을 일일히 수행해야 한다.
이러한 단계가 많아지면 오류 발생 위험이 커지고 코드 복잡도가 증가한다.
또한 새로운 탭이 추가된다면 코드 수정이 많이 필요할 수도 있다.

리액트에서는 선언형 스타일 덕분에 상태 관리가 쉬워지고 UI 업데이트도 자동으로 해준다.
우리는 목표 상태와 그 상태가 어떻게 변해야 하는지 정의하면 되고 나머지는 리액트가 처리해준다.
이러한 차이점은 특히 UI 요소가 많아지고 복잡해질 수록 더 큰 이점을 제공한다.

### JSX(JavaScript Syntax Extension)

앞선 예제에서 가장 눈에 띄는 점은 자바스크립트 코드에서 HTML 코드를 같이 사용하고 있다는 점이다.
JSX는 자바스크립트의 확장 문법으로 자바스크립트 파일 내에 HTML 마크업 코드를 작성할 수 있다.
개발자는 JSX 문법 덕분에 UI 요소를 정의할 때 훨씬 직관적으로 작성할 수 있다.

하지만 JSX는 브라우저에서 동작하지 않는다.
JSX 코드는 브라우저에 도달하기 전에 Babel과 같은 트랜스 파일러를 사용하여 자바스크립트 코드로 변환된다.
따라서 직접 프로젝트를 설정해야 할 때는 추가적으로 컴파일러 설정이 필요하다.

리액트가 선언형 프로그래밍으로 여겨지는 이유는 JSX를 통해 어떤 상태에 어떤 UI가 나타나야 하는지를 직관적으로 표현할 수 있기 때문이다.
