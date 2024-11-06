---
title: "MQTT 메세지를 확인하고 저장할 수 있는 exe 파일을 만들어 보자."
description: "React + Express + MongoDB + Electron + TypeScript 모두 처음 써보는 거지만 도전!"
thumbnail: "/assets/blog/mqtt-exe/cover.png"
tags: ["Project"]
createdAt: "2024-11-06 10:00:00"
category: "DEV"
---

회사에서 MQTT 통신으로 장비에서 받은 데이터를 실시간으로 조회하면서 제어하는 홈페이지를 만든 적이 있다.
최근에 고객사에서 추가 발주를 할지 말지에 대해서 고민하면서 사장님(이자 임베디드 개발자)께서 걱정이 많아졌다.

그러던 중 MQTT 토픽을 구독하여 받은 JSON 형식의 데이터를 그대로 저장하고 조회 및 다운로드 할 수 있는 프로그램을 만들면 어떻냐고 제안하셨다.
사장님의 요구 사항은 MongoDB를 사용하고 exe 파일로 만들 것.
최근에 리액트를 쓰고 싶다는 어필을 많이 했기 때문에 나머지 기술 스택에 대한 선택을 나에게 줬다.

React와 TypeScript는 찍먹만 해보고 Express, MongoDB, Electron 모두 처음 사용하지만 자바스크립트 환경으로 한 프로젝트를 만들어보고 싶다는 욕구가 평소에 있었기 때문에 재밌게 할 수 있을 것 같다.

## 환경 설정

먼저 폴더를 생성하고 frontend, backend, main 폴더를 생성했다.
그리고 `yarn init -y` 명령어를 입력하여 Node.js 환경을 구성했다.

```bash
# Electron 설치
yarn add -D electron

# React 및 React-DOM 설치
yarn add react react-dom

# Express 설치 (백엔드)
yarn add express

# MongoDB 및 Mongoose 설치 (데이터베이스)
yarn add mongoose

# TypeScript 설치
yarn add  -D typescript
yarn add -D @types/node @types/react @types/react-dom @types/express

# Vite 설치
yarn add -D vite
yarn add -D @vitejs/plugin-react
```

필요한 패키지를 설치하고 tsconfig 와 package.json 파일을 작성했다.

```json
{
  "compilerOptions": {
    "target": "es6", // 컴파일된 자바스크립트가 ES6(ECMAScript 2015) 문법을 따르도록 설정
    "module": "commonjs", // Node.js 환경에서 사용되는 CommonJS 모듈 시스템을 지정 (Electron, Express와 호환)
    "strict": true, // 엄격한 타입 검사를 활성화하여 타입 안정성을 높임
    "jsx": "react", // React의 JSX 구문을 지원하도록 설정
    "outDir": "./dist", // 컴파일된 자바스크립트 파일을 내보낼 디렉터리 설정 (여기서는 dist 폴더)
    "rootDir": ".", // 소스 파일의 루트 디렉터리를 설정하여 src 폴더 안의 파일들만 컴파일
    "esModuleInterop": true, // ES6 모듈 가져오기 방식과 호환되도록 설정 (import/export를 자유롭게 사용 가능)
    "skipLibCheck": true, // 외부 라이브러리의 타입 검사를 건너뛰어 컴파일 속도 개선
    "forceConsistentCasingInFileNames": true // 대소문자가 일치하지 않는 파일명 오류를 방지
  },
  "include": ["frontend/**/*", "backend/**/*", "main/**/*"] // 컴파일 대상 파일 지정 (여기서는 frontend, backend, main 폴더 안의 모든 파일)
}
```

```json
{
  "name": "j-mqtt",
  "version": "1.0.0",
  "main": "./dist/main/main.js",
  "license": "MIT",
  "scripts": {
    "build:ts": "tsc",
    "build:vite": "vite build",
    "build": "yarn build:ts && yarn build:vite",
    "start": "yarn build && electron .",
    "dev": "vite"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "electron": "^33.1.0",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  },
  "dependencies": {
    "express": "^4.21.1",
    "mongoose": "^8.8.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### 프론트엔드 설정

![프론트엔드 폴더 구조](assets/blog/mqtt-exe/1.png)

frontend 폴더에 테스트를 위한 최소한의 파일만 작성했다.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./frontend",
  base: "",
  build: {
    outDir: "../dist/frontend",
  },
});
```

vite.config.ts 파일에서 `yarn build` 시 ./frontend 폴더 내용을 dist 폴더 아래에 frontend 폴더에 컴파일하고 빌드하도록 설정했다.
먼저 `yarn dev`명령어를 실행해본다.

![프론트엔드 테스트]("assets/blog/mqtt-exe/2.png)

웹 페이지가 정상적으로 동작하는 것을 확인할 수 있다.

### Electron 설정

```ts
const electron = require("electron");
const { app, BrowserWindow } = electron;
const path = require("path");

let win: any;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(`file://${path.join(__dirname, "../frontend/index.html")}`);
  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("active", () => {
  if (win === null) {
    createWindow();
  }
});
```

main 폴더에 main.ts 파일을 생성하여 위와 같이 작성한다.
내용은 정식 문서를 보고 작성했는데 코드를 보면 어떤 동작을 하는지 쉽게 알 수 있다.
`yarn build` 명령어를 입력한 후에 `yarn start` 명령어를 실행해준다.

![Electron.js 실행 후 나온 프로그램 화면](/assets/blog/mqtt-exe/3.png)

앞서 브라우저에서 보던 화면이 별도의 프로그램으로 실행된 걸 확인할 수 있다.
`win.webContents.openDevTools()` 메서드를 사용했기 때문에 개발자 도구 또한 볼 수 있다.
