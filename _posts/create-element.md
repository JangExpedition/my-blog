---
title: "createElement 만들기"
description: "React의 createElement 함수를 직접 만들어서 원리를 파악합니다."
thumbnail: "/assets/blog/create-element/cover.png"
tags: ["React"]
createdAt: "2024-08-17 10:00:00"
category: "DEV"
---

```js
function createDOM(vdom) {
  const element = document.createElement(vdom.tag);
  return element;
}

const vdom = {
  tag: "p",
  props: {},
  children: [{ tag: "h1", props: {}, children: ["React 만들기"] }],
};

document.querySelector("#root").appendChild(createDOM(vdom));
```

vdom 객체는 DOM을 객체로 표현한 것입니다.
createDOM 함수가 vdom을 인자로 받아 객체 안의 정보를 갖고 실제 DOM을 만들어서 반환합니다.

### children 처리

![createDOM 함수의 출력 결과 1](/assets/blog/create-element/1.png)

현재 createDOM 함수는 vdom의 children 속성을 사용하지 않기 때문에 p 태그만 출력되는 걸 확인할 수 있습니다.

```js
function createDOM(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  const element = document.createElement(node.tag);

  node.children.map(createDOM).forEach(element.appendChild.bind(element));

  return element;
}
```

children을 map으로 순회하며 createDOM의 인자로 넘겨줍니다.
인자로 들어온 타입을 검사하여 string이면 TextNode를, 아니면 HTML 요소를 만듭니다.
map이 반환한 배열을 forEach로 순회하며 appendChild의 인자로 넘겨줍니다.

![createDOM 함수의 출력 결과 2](/assets/blog/create-element/2.png)

### props 처리

```js
const vdom = {
  tag: "p",
  props: {},
  children: [
    { tag: "h1", props: {}, children: ["React 만들기"] },
    {
      tag: "ul",
      props: {},
      children: [
        {
          tag: "li",
          props: {
            style: "color: red",
          },
          children: ["첫 번째 아이템"],
        },
        {
          tag: "li",
          props: {
            style: "color: blue",
          },
          children: ["두 번째 아이템"],
        },
        {
          tag: "li",
          props: {
            style: "color: green",
          },
          children: ["세 번째 아이템"],
        },
      ],
    },
  ],
};
```

vdom 객체의 구조를 좀 더 복잡하게 하고 props를 추가했습니다.

```js
export function createDOM(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  const element = document.createElement(node.tag);

  Object.entries(node.props).forEach(([name, value]) =>
    element.setAttribute(name, value)
  );

  node.children.map(createDOM).forEach(element.appendChild.bind(element));

  return element;
}
```

props는 객체로 넘어오기 때문에 `entries.forEach`를 통해서 모든 요소를 순회합니다.
순회하며 넘어온 key, value를 setAttributes 메서드를 이용하여 속성으로 추가해줍니다.

![createDOM 함수의 출력 결과 3](/assets/blog/create-element/3.png)

### render 함수 만들기

```js
export function render(vdom, container) {
  container.appendChild(createDOM(vdom));
}
```

추가할 vdom 객체와 최정적으로 감싸줄 container의 자식으로 넣어주는 기능을 함수로 분류했습니다.

```js
render(vdom, document.querySelector("#root"));
```

사용하는 쪽에서는 내부 구조를 신경쓰지 않고 인자에 적절한 값만 넘겨주면 됩니다.

### createElement 만들기

```js
export function createElement(tag, props, ...children) {
  return { tag, props, children };
}
```

vdom 객체는 세 개의 속성을 갖고 있는 객체의 단순 반복이기 때문에 세 개의 속성을 갖는 객체를 생성하는 함수를 만들면 반복 호출하면서 구조를 만들 수 있습니다.

```js
const vdom = createElement(
  "p",
  {},
  createElement("h1", {}, "React 만들기"),
  createElement(
    "ul",
    {},
    createElement("li", { style: "color: red" }, "첫 번째 아이템"),
    createElement("li", { style: "color: blue" }, "두 번째 아이템"),
    createElement("li", { style: "color: green" }, "세 번째 아이템")
  )
);
```

createElement는 최상위에 root라는 하나의 객체가 있는 트리 구조 형식입니다.
createElement 함수는 최상위에서 한 번만 호출되고 자식 요소는 children이라고 하는 배열에 들어가야 합니다.
세 번째 인자를 가변 인자로 받아서 배열로 취급합니다.

### @jsx

```js
const vdom = (
  <p>
    <h1>React 만들기</h1>
    <ul>
      <li style="color: red">첫 번째 아이템</li>
      <li style="color: blue">두 번째 아이템</li>
      <li style="color: green">세 번째 아이템</li>
    </ul>
  </p>
);
```

웹 프론트엔드 개발자에게 가장 익숙한 포맷은 함수 호출 방법과 markup 방법입니다.
createElement 함수를 호출하는 방법을 사용했지만 컴포넌트의 크기가 크고 복잡할 수록 사용성이 좋지 않을 것입니다.
HTML Tagging 하듯이 코딩하면 내부적으로 createElement 함수가 동작하는 방법으로 만든 것이 JSX 문법입니다.

![babel의 jsx 번역 결과](/assets/blog/create-element/4.png)

BABEL 사이트에서 REPL이라는 기능을 제공합니다.
왼쪽에 코드를 입력하면 번역한 결과를 오른쪽에 보여줍니다.
번역한 결과를 보면 React.createElement 함수를 볼 수 있습니다.

React에서 함수형 컴포넌트를 생성할 때 React 패키지를 import하지 않고 JSX를 사용하면 오류가 발생하는 이유입니다.
React 17 버전 이후로는 React.createElement를 호출하지 않고 \_jsx 함수를 호출합니다.

React.createElement를 사용하지 않고 직접 만든 createElement를 사용하기 위해 소스 코드에 주석으로 `/* @jsx createElement */` 구문을 포함시켜줍니다.

![createElement 결과 화면 1](/assets/blog/create-element/4.png)

props가 null이기 때문에 발생한 오류입니다.
props의 내용이 없을 경우 빈 객체로 넘겨줬는데 JSX의 Transpiler가 JSX의 속성이 있으면 객체로 넘겨주지만 없으면 null로 넘겨줍니다.

```js
export function createElement(tag, props, ...children) {
  props = props || {};
  return { tag, props, children };
}
```

props가 null로 넘어올 경우 빈 객체를 넣어 동작하게 만들어줍니다.

![createElement 결과 화면 2](/assets/blog/create-element/3.png)

### 함수형 컴포넌트 만들기

```js
function Title(props) {
  return <h1>{props.children}</h1>;
}

const vdom = (
  <p>
    <Title>React 만들기</Title>
    <ul>
      <li style="color: red">첫 번째 아이템</li>
      <li style="color: blue">두 번째 아이템</li>
      <li style="color: green">세 번째 아이템</li>
    </ul>
  </p>
);
```

이제 JSX 문법을 활용할 수 있습니다.
vdom 객체에서 h1 태그를 따로 분리해서 실행합니다.

h1 태그가 트랜스 파일링 되면 createElement 함수 호출로 바뀝니다.
Title이 호출 시에 createElement 함수가 호출된다면 결과적으로 같은 기능을 하게 될 것입니다.

![createElement 결과 화면 3](/assets/blog/create-element/6.png)

하지만 오류가 발생합니다.
왜냐하면 createElement 함수의 첫 번째 인자는 tag를 문자열로 처리하기 때문입니다.

React의 컴포넌트는 대문자로 시작하도록 되어있습니다.
소문자, 대문자가 기준없이 들어올 경우 문자열로 처리할지 함수로 취급할지 확인할 방법이 없기 때문입니다.
React는 JSX 태그 이름이 대문자로 시작하면 컴포넌트로 취급하고 반드시 JSX를 반환한다는 약속이 있습니다.

```js
export function createElement(tag, props, ...children) {
  props = props || {};

  if (typeof tag === "function") {
    if (children.length > 0) {
      return tag({
        ...props,
        children: children.length === 1 ? children[0] : children,
      });
    } else {
      return tag(props);
    }
  } else {
    return { tag, props, children };
  }
}
```

들어온 tag의 타입을 검사하여 함수라면 호출해줍니다.
props에 children이 있다면 반환값의 인자로 props와 children을 묶어서 보내줍니다.
자식 요소가 문자열 하나만 넘어올 경우 사용하는 쪽에서 `props.children[0]`로 사용해야 하기 때문에 길이가 1인 경우 문자열 자체를 넘겨주도록 처리합니다.
만약 자식요소가 없다면 props를 그대로 넘겨줍니다.
이렇게 하면 컴포넌트를 분리하여 처리할 수 있게 됩니다.

```js
function Title(props) {
  return <h1>{props.children}</h1>;
}

function Item(props) {
  return <li style={`color: ${props.color}`}>{props.children}</li>;
}

const App = () => (
  <p>
    <Title>React 만들기</Title>
    <ul>
      <Item color="red">첫 번째 아이템</Item>
      <Item color="blue">두 번째 아이템</Item>
      <Item color="green">세 번째 아이템</Item>
    </ul>
  </p>
);

render(<App />, document.querySelector("#root"));
```

기존 vdom은 형식적으로 메인 컴포넌트입니다.
이름을 App, JSX를 반환하는 함수로 바꿔줍니다.
render 함수의 첫 번째인자를 `<App/>`으로 넘겨주면 트랜스 파일링 과정에서 createElement의 반환값이 넘어가 이전과 동일하게 동작하게 됩니다.

```js
export function createDOM(node) {
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  const element = document.createElement(node.tag);

  const props = node.props || {};
  Object.entries(props).forEach(([name, value]) => {
    if (name.startsWith("on") && typeof value === "function") {
      const eventType = name.slice(2).toLocaleLowerCase();
      element.addEventListener(eventType, value);
    } else {
      element.setAttribute(name, value);
    }
  });

  const children = node.children || [];
  children.map(createDOM).forEach(element.appendChild.bind(element));

  return element;
}
```

createDOM 함수는 인자로 가상 DOM 객체를 받아서 실제 DOM으로 바꿔주는 역할을 수행합니다.
가상 DOM 객체의 props로 이벤트 리스너의 콜백 함수를 보내고 key값에 규칙을 정하면 DOM에 직접 이벤트 리스너를 걸 수 있습니다.
이벤트 타입 앞에 on을 붙여서 props의 키값으로 넘겨주면 이벤트 함수라는 규칙을 정해줍니다.
만약 들어온 props의 key값이 on으로 시작하고 value의 타입이 함수라면 이벤트 핸들러로 인식하고 생성한 DOM에 이벤트 리스너를 등록합니다.

## 참조

- https://www.inflearn.com/course/%EB%A7%8C%EB%93%A4%EB%A9%B4%EC%84%9C-%ED%95%99%EC%8A%B5%ED%95%98%EB%8A%94-%EB%A6%AC%EC%95%A1%ED%8A%B8/dashboard
- https://fastcampus.co.kr/dev_academy_kmt2
