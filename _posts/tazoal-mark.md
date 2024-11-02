---
title: "tazoal-mark 라이브러리 제작기(작성 중)"
description: "마크다운 파일을 파싱하여 HTML로 변환하는 라이브러리를 만든 과정을 기록했습니다."
thumbnail: "/assets/blog/tazoal-mark/cover.png"
tags: ["Project"]
createdAt: "2024-11-02 10:00:00"
category: "DEV"
---

## 개요

최근 브라우저 동작원리(https://tazoal.vercel.app/posts/browser)를 공부하면서 html 파일이 `바이트코드 -> 문자열 -> 문자열 토큰 -> DOM`으로 파싱된다는 걸 알게 됐다.
블로그를 직접 만들면서 에디터를 직접 만들고 싶다는 생각이 들었는데 '직접 파싱을 하면 가능할지도?'라는 생각이 들었다.

![마크다운 파일](/assets/blog/tazoal-mark/1.png)
![gray-matter 결과](/assets/blog/tazoal-mark/2.png)

현재는 마크다운 파일을 gray-matter 라이브러리를 사용해 객체로 반환 받고 MDXRemote 라이브러리를 통해 JSX로 반환받아서 사용한다.

이 과정을 직접 만들어서 npm 라이브러리로 만드는 것을 목표로 잡았다.

## npm 프로젝트 생성

npm 프로젝트를 만들기 위해서는 먼저 npm에 가입해야 한다.
가입은 https://www.npmjs.com/ 을 통해서 할 수 있다.

npm 계정을 생성했다면 `npm login` 명령어를 통해 로그인을 해준다.
`yarn init -y` 명령어를 통해 package.json 파일을 생성해준다.

### 모듈 작성

먼저 index.js 파일을 생성하여 CommonJS(이하 CJS) 형태로 간단한 코드를 작성한다.

```js
function markdownToHeadingTag(str) {
  let i = 0;
  while (str.includes("#")) {
    str = str.slice(str.indexOf("#") + 1);
    i++;
  }
  return `<h${i}>${str.trim()}</h${i}>`;
}

module.exports = {
  markdownToHeadingTag,
};
```

이제 `npm publish` 명령어를 사용하면 npm에 배포가 된다.

![npm publish 명령 및 결과 로그](/assets/blog/tazoal-mark/3.png)

테스트를 위해 프로젝트를 하나 더 생성해줬다.

```zsh
mkdir tazoal-mark-test
cd tazoal-mark-test
yarn init -y
yarn add tazoal-mark
```

프로젝트를 생성하고 package.json 파일을 확인해본다.

```json
{
  "name": "tazoal-mark-test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "tazoal-mark": "^0.0.1"
  }
}
```

node_modules 폴더를 확인해보면 index.js 파일에 작성한 코드가 잘 들어가있는 것을 확인할 수 있다.

![test 프로젝트의 node_modules 폴더의 index.js 파일](/assets/blog/tazoal-mark/4.png)

```js
const { markdownToHeadingTag } = require("tazoal-mark");

const h1 = markdownToHeadingTag("# H1");
const h2 = markdownToHeadingTag("## H2");
console.log("🚀 ~ h1:", h1);
console.log("🚀 ~ h2:", h2);
```

![test 프로젝트의 node_modules 폴더의 index.js 파일 실행 결과](/assets/blog/tazoal-mark/5.png)

tazoal-mark-test 프로젝트에 index.js 파일을 생성하고 테스트할 코드를 작성한 다음 `node index.js`로 실행시키면 결과를 얻을 수 있다.
