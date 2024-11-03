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

### CommonJS와 ECMAScript Modules 모두 지원하기

Node.js 12부터 ECMAScript Modules(이하 ESM)라는 새로운 모듈 시스템이 추가되면서 기존의 CJS 모듈 시스템과 ESM 모두 지원해해야 한다.

**왜 둘 다 지원해야 하는가?**

- ESM은 트리 쉐이킹(tree-shaking)을 통해 번들의 사이즈를 줄여 크기를 가볍게 만듬.
- CJS는 `require/module.exports`를 동적으로 사용하는 것에 아무런 제약이 없어서 정적 분석이 어려움. 따라서 런타임에서만 모듈 관계를 파악할 수 있음.
- ESM은 정적인 구조로 모듈끼리 의존하도록 강제화함. 따라서 빌드 단계에서 정적 분석을 통해 모듈 간의 의존 관계를 파악할 수 있고, 트리 쉐이킹을 쉽게 할 수 있음.

**ESM이 더 좋은데 그럼 ESM만 지원하면 되는 거 아닌가?**

- Node.js 12 전에 작성된 프로젝트와 라이브러리들은 CJS로 작성되어 있음. 따라서 두 가지 방식을 모두 지원하면 호환성을 유지하면서 새로운 ESM 기반 프로젝트에서도 최적화된 사용이 가능.

CJS와 ESM을 모두 지원하기 위해서 .mjs, .cjs을 각각 작성해야 한다.

```json
{
  "name": "tazoal-mark",
  "version": "0.0.2",
  "type": "module",
  "main": "./dist/index.cjs",
  "exports": {
    ".": {
      "import": "./esm/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "license": "MIT"
}
```

파일을 구분하기 위해 ESM으로 작성된 index.mjs 파일은 esm 폴더에 넣고 CJS로 작성된 파일은 dist 폴더에 넣는다.
사용하는 쪽에서 `"type": "module"` 설정을 넣지 않으면 기본적으로 CJS로 처리되기 때문에 `"main"`의 값을 `"./dist/index.cjs"`로 작성한다.

다시 `npm publish`로 npm에 배포한 뒤 tazoal-mark-test 프로젝트에서 CJS 문법과 ESM 문법으로 작성한 뒤 `node index.js`를 하면 같은 결과를 얻을 수 있다.

### TypeScript 지원하기

타입스크립트 프로젝트에서도 사용하기 위해서는

```ts
export function markdownToHeadingTag(str: string): string;
```

## 참조

- https://junghyeonsu.com/posts/deploy-simple-util-npm-library/
- https://toss.tech/article/commonjs-esm-exports-field
