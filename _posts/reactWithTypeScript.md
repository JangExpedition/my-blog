---
title: "리액트와 타입스크립트"
description: "타입스크립트 환경에서 리액트를 개발하는 방법에 대해 정리한 내용입니다."
thumbnail: "/assets/blog/reactWithTypeScript/cover.png"
tags: ["TypeScript", "React"]
createdAt: "2024-10-19 12:00:00"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8

인프런의 한 입 크기로 잘라먹는 타입스크립트 강의를 듣고 정리한 내용입니다.

---

## 자바스크립트 프로젝트를 타입스크립트 프로젝트로 마이그레이션하기

먼저 `create-react-app`을 통해서 프로젝트를 생성하고 불필요한 파일들을 제거한 뒤 `npm i @types/node @types/react @types/react-dom @types/jest` 명령어를 입력하여 타입 선언 패키지들을 추가해줍니다.

![package.json에 추가된 타입 선언 패키지들](/assets/blog/reactWithTypeScript/1.png)

![node_modules/@types에 추가된 타입 선언 패키지들](/assets/blog/reactWithTypeScript/2.png)

`package.json` 파일과 `node_modules/@types` 폴더를 확인하면 설치가 완료된 것을 확인할 수 있습니다.

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "strict": true,
    "allowJs": true
  },
  "include": ["src"]
}
```

다음으로 루트 경로에 `tsconfig.json` 파일을 생성하여 기본적인 옵션들을 설정해줍니다.

![index.js를 index.tsx로 변경했을 때 나는 오류1](/assets/blog/reactWithTypeScript/3.png)

`index.js` 파일을 `index.tsx`로 확장자를 변경해주면 오류가 발생합니다.
오류 메세지를 살펴보면 `기본 내보내기가 없습니다.`라고 나오는데 `ReactDOM`을 내보내는 파일에서 `export default`로 내보내지 않는 것이 원인입니다.
`default`로 내보낸 값이 없을 때에도 모듈을 불러올 수 있도록 컴파일 옵션을 추가해줘야 합니다.
`tsconfig.json`의 `compilerOptions`에 `"esModuleInterop": true` 옵션을 추가해주면 `default`로 내보낸 값이 없을 때에도 `import ReactDOM from "react-dom/client";`로 값을 불러올 수 있도록 허용해주는 옵션입니다.

![index.js를 index.tsx로 변경했을 때 나는 오류2](/assets/blog/reactWithTypeScript/4.png)

이 오류가 발생하는 이유는 타입스크립트 컴파일러는 기본적으로 JSX 문법을 해석할 수 없기 때문입니다.
`tsconfig.json`의 `compilerOptions`에 `"jsx": "react-jsx"` 옵션을 추가해주면 JSX 문법을 해석할 수 있게 되어 오류를 해결할 수 있습니다.

![index.js를 index.tsx로 변경했을 때 나는 오류3](/assets/blog/reactWithTypeScript/5.png)

마지막으로 발생하는 오류의 원인은 `document.getElementById`가 `null` 타입의 값을 반환할 수도 있는데 `createRoot` 메서드는 `null` 타입의 인수를 받지 않기 때문에 발생하는 오류입니다.
`document.getElementById("root") as HTMLElement`와 같이 타입 단언을 사용해서 오류를 해결할 수 있습니다.

### 타입스크립트 템플릿

마이그레이션 작업이 아닌 타입스크립트로 리액트 프로젝트를 시작할 때 직접 설정하지 않고 빠르게 시작할 수 있는 방법이 있습니다.

![Create React App 사이트에 나와있는 TypeScript 템플릿 설치 명령어](/assets/blog/reactWithTypeScript/11.png)

`CreateReactApp`의 공식 문서를 보면 자동으로 타입스크립트 템플릿으로 시작하도록 만들 수 있는 기능이 있습니다.

## 상태관리와 Props

### useState

```tsx
const [text, setText] = useState("");
```

`useState`는 초기값으로 전달한 인수의 타입에 따라서 state 변수와 state 변화 함수의 타입을 자동으로 추론해줍니다.
이런 특징을 갖는 함수를 제네릭 함수라고 부릅니다.

![useState 함수의 타입 정의](/assets/blog/reactWithTypeScript/6.png)

실제로 `useState` 함수의 타입이 정의되어 있는 파일을 보면 하나의 타입 변수를 갖는 제네릭 함수라는 것과 초기값 인수의 타입이 타입 변수로 설정되어 있는 것을 알 수 있습니다.
`useState` 함수에 초기값으로 아무것도 넣지 않는다면 `undefined`로 자동 추론되는데 타입 변수의 기본값이 `undefined` 타입으로 설정되어 있기 때문입니다.
따라서 `setText` 함수에 인수로 전달할 수 있는 타입이 `undefined` 타입의 값밖에 없기 때문에 타입스크립트에서는 `useState()`와 같이 사용하면 안됩니다.
초기값으로 설정할 값이 없을 때 `useState<string>()`으로 선언해주면 state 변수의 타입이 `string | undefined` 유니온 타입으로 추론됩니다.
유니온 타입으로 추론되는 이유는 `string`으로 타입 변수를 넣긴 했지만 초기값이 없어서 `undefined` 값을 갖을 수도 있기 때문입니다.
이런 이유로 `undefined` 타입과 유니온된 타입으로 추론되게 하기 보단 `useState("")`으로 선언하여 초기값으로 뭐라도 전달하는 것이 좋다고 합니다.

### 이벤트 핸들러

```tsx
import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="App">
      <h1>Todo</h1>
      <input value={text} onChange={onChangeInput} />
    </div>
  );
}

export default App;
```

이벤트 핸들러 함수의 매개변수 타입으로 미리 정의된 이벤트 객체의 타입을 사용합니다.
리액트에서는 기본적으로 제공되는 기능들에 대한 타입 정보가 제공됩니다.

![리액트 이벤트 객체의 타입](/assets/blog/reactWithTypeScript/7.png)

만약 이벤트 객체의 타입 정보를 잘 모르겠다면 위와 같이 작성하여 이벤트 객체 `e`에 커서를 올리면 이벤트 객체의 타입이 나옵니다.

### Props

```ts
export interface Todo {
  id: number;
  content: string;
}
```

여러 컴포넌트에서 사용하는 타입은 `src` 폴더 하위에 `types` 폴더를 만들어서 관리해주면 좋습니다.

```tsx
import { Todo } from "../types";

interface Props extends Todo {
  onClickDelete: (id: number) => void;
}

export default function TodoItem(props: Props) {
  const onClickButton = () => {
    props.onClickDelete(props.id);
  };
  return (
    <div>
      {props.id}번: {props.content}
      <button onClick={onClickButton}>삭제</button>
    </div>
  );
}
```

한 컴포넌트에서 `Todo` 객체 타입을 props로 받고 추가적으로 다른 props도 받아야 한다면 `extends`를 사용할 수 있습니다.

### useState를 useReducer로 변경

```ts
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import { Todo } from "./types";
import TodoItem from "./components/TodoItem";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const idRef = useRef(0);

  const onClickAdd = (text: string) => {
    setTodos([
      ...todos,
      {
        id: idRef.current++,
        content: text,
      },
    ]);
  };

  const onClickDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <div className="App">
      <h1>Todo</h1>
      <Editor onClickAdd={onClickAdd} />
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} onClickDelete={onClickDelete} />
      ))}
    </div>
  );
}

export default App;
```

useState를 사용하여 작성한 `App.tsx` 파일에 `useState`로 작성한 부분을 `useReducer`를 사용하도록 코드를 변경해보겠습니다.

```tsx
import { useEffect, useReducer, useRef } from "react";
import "./App.css";
import Editor from "./components/Editor";
import { Todo } from "./types";
import TodoItem from "./components/TodoItem";

type Action =
  | {
      type: "CREATE";
      data: Todo;
    }
  | { type: "DELETE"; id: number };

function reducer(state: Todo[], action: Action) {
  switch (action.type) {
    case "CREATE": {
      return [...state, action.data];
    }
    case "DELETE": {
      return state.filter((it) => it.id !== action.id);
    }
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  const onClickAdd = (text: string) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        content: text,
      },
    });
  };

  const onClickDelete = (id: number) => {
    dispatch({
      type: "DELETE",
      id: id,
    });
  };

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  return (
    <div className="App">
      <h1>Todo</h1>
      <Editor onClickAdd={onClickAdd} />
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} onClickDelete={onClickDelete} />
      ))}
    </div>
  );
}

export default App;
```

변경이 완료된 코드입니다.
타입스크립트에서 `userReducer`를 이용할 때 `Action` 객체의 타입을 서로소 유니온 타입으로 정의하여 `dispatch`를 호출할 때 하는 실수를 방지할 수 있습니다.
예를 들어 `type`에 CREATE 또는 DELETE를 입력할 때 오타가 나거나 잘못된 액션 객체를 전달하여 발생할 수 있는 오류를 방지해줍니다.

## ContextAPI

```tsx
// 선언부 코드
export const TodoDispatchContext = React.createContext<{
  onClickAdd: (text: string) => void;
  onClickDelete: (id: number) => void;
} | null>(null);

const onClickAdd = (text: string) => {
  dispatch({
    type: "CREATE",
    data: {
      id: idRef.current++,
      content: text,
    },
  });
};

const onClickDelete = (id: number) => {
  dispatch({
    type: "DELETE",
    id: id,
  });
};

// 사용하는 쪽 코드
const dispatch = useContext(TodoDispatchContext);

const onClickButton = () => {
  dispatch?.onClickAdd(text);
  setText("");
};
```

위와 같이 `TodoDispatchContext`를 정의하고 사용하려면 `dispatch`의 값이 `Provider`로 공급한 두 함수를 담고 있는 객체일 수도 있지만 `null` 타입일 수도 있습니다.
따라서 `dispatch.onClickAdd`처럼 바로 사용할 수 없고 `dispatch?.onClickAdd`와 같이 옵셔널 체이닝으로 써줘야합니다.

프로젝트가 크고 복잡해지면 매번 옵셔널 체이닝을 써줘야 한다면 문제가 될 수 있기 때문에 커스텀 훅을 만들어서 처리해주면 좋습니다.

```tsx
// 선언부 코드
export function useTodoDispatch() {
  const dispatch = useContext(TodoDispatchContext);
  if (!dispatch) {
    throw new Error("TodoDispatchContext에 문제가 있다!");
  }
  return dispatch;
}

// 사용하는 쪽 코드
const dispatch = useTodoDispatch();

const onClickButton = () => {
  dispatch.onClickAdd(text);
  setText("");
};
```

`dispatch`가 `null`인 경우 에러를 던지고 아닐 경우 반환하는 `useTodoDispatch` 커스텀 훅을 작성해줍니다.
사용하는 쪽에서는 커스텀 훅을 불러와서 사용하면 `null`을 반환할 일이 없기 때문에 옵셔널 체이닝을 사용할 일이 없어집니다.

## 외부 라이브러리

타입스크립트 프로젝트에서 npm에서 다운받을 수 있는 외부 패키지들을 설치하고 타입 오류없이 사용할 수 있는 방법을 살펴보겠습니다.

자바스크립트만으로 개발을 진행할 때에는 외부 패키지를 명령어로 설치만 하면 됐지만 타입스크립트 환경에서는 설치만 한다고 바로 이용할 수 없습니다.
왜냐하면 타입스크립트는 기본적으로 코드를 실행하기 전에 타입 검사 기능을 수행하기 때문에 라이브러리 코드들도 타입 검사를 수행합니다.
그렇기 때문에 라이브러리 코드들에 대한 타입 정보가 제공되지 않는 상황에서는 타입 검사가 제대로 이뤄지지 않기 때문에 오류가 발생합니다.

![npm 사이트에 나와있는 react-router-dom](/assets/blog/reactWithTypeScript/8.png)

`react-router-dom`을 살펴보면 애초에 타입스크립트로 작성된 라이브러리기 때문에 설치하자마자 바로 이용할 수 있습니다.
타입스크립트로 제작된 라이브러리들의 이름에는 오른쪽에 `TS` 마크를 붙여줍니다.
따라서 `TS` 마크가 붙어있는 라이브러리들은 설치 명령어만 입력하여 사용할 수 있습니다.

하지만 모든 라이브러리들이 타입스크립트를 기본적으로 제공하지 않습니다.
`TS` 마크가 붙어있지 않은 라이브러리들은 기본적으로 타입 정보가 제공되지 않습니다.
즉 자바스크립트로 작성된 라이브러리라서 설치해도 이용할 수 없습니다.

![npm 사이트에 나와있는 lodash](/assets/blog/reactWithTypeScript/9.png)

이럴 때는 `TS` 마크 대신 `DT` 마크가 붙어있는지 확인해야 합니다.

![npm 사이트에 나와있는 @types/lodash](/assets/blog/reactWithTypeScript/10.png)

`DT` 마크를 클릭하면 `@types/lodash`라는 라이브러리 페이지로 이동합니다.
`@types/lodash`는 `lodash` 라이브러리의 타입 정보를 갖고 있는 패키지입니다.
따라서 `lodash`라는 라이브러리를 타입스크립트에서 사용하려면 `@types/lodash`를 추가로 설치해야 합니다.
