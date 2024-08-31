---
title: "콜백 함수 (Callback Function)"
description: "JavaScript 콜백 함수에 대해 알아봅니다."
thumbnail: "/assets/blog/callback-function/cover.png"
tags: ["JavaScript"]
createdAt: "2024년 08월 05일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%B5%EC%8B%AC%EA%B0%9C%EB%85%90-javascript-flow#

인프런의 코어 자바스크립트 강의를 듣고 정리한 내용입니다.

---

콜백 함수는 회신되는 함수입니다.
누군가에게 함수에 대한 제어권을 넘기고 처리가 끝나면 알려줍니다.
넘겨주게 되는 제어권에는 실행 시점, 매개 변수, this가 있습니다.

## 실행 시점

```js
var cb = function () {
  console.log("1초마다 실행됩니다.");
};

setInterval(cb, 1000);
```

setInterval에게 함수를 넘겨주면 자동으로 두 번째 인자로 넘겨준 milliseconds마다 한 번씩 함수를 실행해줍니다.
setInterval이 콜백 함수의 실행 시점을 제어합니다.

## 매개 변수

```js
var arr = [1, 2, 3, 4, 5];
var entries = [];
arr.forEach(
  function (v, i) {
    entries.push([i, v, this[i]]);
  },
  [10, 20, 30, 40, 50]
);
console.log(entries);
```

forEach 함수의 첫 번째 인자로 콜백 함수, 두 번째 인자로 this로 인식할 대상을 넘겨줍니다.
두 번째 인자는 생략할 수 있습니다.
만약 개발자가 제이쿼리에 있는 each 메서드처럼 첫 번째 인자를 index, 두 번째 인자를 value로 넘겨준다고 해도 index라는 이름을 갖는 value, value라는 이름은 갖는 index가 될 뿐입니다.
개발자의 편의에 맞게 하려고 해도 forEach가 정의된 규칙에 따라야 합니다.
즉 매개 변수를 사용자가 정하는 것이 아닌 콜백 함수를 넘겨주는 대상이 정하게 됩니다.

## this

```js
document.body.innerHTML = '<div id="a">abc</div>';
function cbFunc(x) {
  console.log(this, x);
}

document.getElementById("a").addEventListener("click", cbFunc);
```

지난 실행 [실행 컨텍스트](https://tazoal.vercel.app/posts/execution-context)에서 본 이벤트 리스너입니다.
div#a를 클릭하면 this에 이벤트 타겟인 div#a, x에는 PointEvent라는 click event에 대한 이벤트 객체가 할당됩니다.
addEventListener가 콜백 함수를 받을 때 this는 eventTarget, 콜백 함수의 첫 번째 인자에는 event 객체를 넘겨 주도록 정해놨기 때문입니다.
이처럼 콜백 함수의 this 또한 넘겨주는 대상에게 제어를 받습니다.

## 정리

A 함수의 인자로 콜백 함수 B를 전달하면 A가 B의 제어권을 갖습니다.
명시적 바인딩을 하지 않으면 A에 미리 정해놓은 방식에 따라 B를 호출합니다.
미리 정해놓은 방식이란 어떤 시점에서 콜백을 호출할지, 인자에 어떤 값들을 지정할지, this에 무엇을 바인딩할지 등입니다.

앞서 본 setInterval, addEventListener와 같이 콜백 함수를 어떻게 처리할지 미리 정해놓은 방식이 정의되어 있고 규칙에 따라 호출하지 않으면 원하는 결과를 얻을 수 없습니다.

## 주의

콜백 함수는 메서드가 아닌 함수입니다.

```js
var arr = [1, 2, 3, 4, 5];
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    if (this.vals) {
      console.log(this.vals, v, i);
    } else {
      console.log(this, v, i);
    }
  },
};
obj.logValues(1, 2);
arr.forEach(obj.logValues);
```

logValues 함수는 메서드로서 호출되어 this에 obj가 바인딩됩니다.
obj에ㅔ vals 프로퍼티가 있기 때문에 `console.log(this.vals, v, i);`의 출력 결과는 `[1, 2, 3] 1 2`가 됩니다.

하지만 `arr.forEach(obj.logValues);`은 메서드 형태로 넘겼지만 콜백 '함수'로 넘어간 것입니다.
콜백 함수로 전달했기 때문에 this에 전역 객체가 담기게 됩니다.
