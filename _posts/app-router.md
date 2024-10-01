---
title: "App Router"
description: "Next.js의 pageRouter와 ApppRouter의 렌더링 방식을 비교하며 어떤 점이 달라졌는지 살펴봅니다."
thumbnail: "/assets/blog/app-router/cover.png"
tags: ["Next.js"]
createdAt: "2024년 09월 06일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard

인프런의 한 입 크기로 잘라먹는 Next.js 강의를 듣고 정리한 내용입니다.

---

App Router는 Next.js 13 버전에 새롭게 추가된 Page Router를 대체한 라우터입니다.
Apo Router를 사용하면 페이지 라우팅 설정 방식, 레이아웃 설정 방식, 데이터 패칭 방식이 변경되고 React 18 버전부터 추가된 React Server Component, Streaming 등 최신 기능들도 함께 사용할 수 있습니다.

## 페이지 라우팅

![Next.js AppRouter의 폴더 구조 1](/assets/blog/app-router/1.png)

App Router는 page라는 이름을 갖는 파일만 페이지 파일로 취급합니다.
`/search`라는 경로에 대응하는 페이지는 search 폴더를 만들어 page 파일을 넣어줘야 합니다.
또한 동적 경로에 대응하는 페이지를 만들 때는 [경로 key]라는 폴더를 만들고 page 파일을 생성해서 넣어줘야 합니다.

## 레이아웃

App Router에서 레이아웃또한 layout이라는 이름을 갖는 파일이 자동으로 해당 경로의 레이아웃 역할을 합니다.
search 폴더 하위에 layout 파일을 생성하게 되면 서치 페이지의 레이아웃으로 자동 설정됩니다.
페이지에 진입하면 레이아웃 컴포넌트가 먼저 렌더링되고 children으로 페이지 컴포넌트가 렌더링됩니다.

레이아웃은 search 페이지 뿐만 아니라 `/search`로 시작하는 모든 페이지의 레이아웃으로 적용됩니다.
search 폴더 아래에 setting 폴더를 만들어서 페이지 컴포넌트를 만든다면 `/search/setting` 경로로 진입했을 때도 search 폴더에 있는 레이아웃 컴포넌트가 먼저 렌더링되고 children으로 페이지 컴포넌트가 렌더링됩니다.

만약 setting 폴더 아래에도 layout 파일을 만든다면 중첩되어 적용됩니다.
search 폴더에 있는 레이아웃이 먼저 렌더링되고 아래에 setting 폴더에 있는 레이아웃된 뒤 마지막으로 페이지 컴포넌트가 렌더링됩니다.

```js
Page.getLayout = (page: ReactNode) => {
  return <Layout>{page}</Layout>;
};
```

```js
export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout,
}) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

  return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}
```

Page Router는 레이아웃을 적용하기 위해 페이지마다 `getLayout`이라는 메서드를 만들어서 App 컴포넌트에서 분기 처리를 해주는 번거로움이 있었습니다.

```js
import { ReactNode } from "react";
import Searchbar from "../../components/searchbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Searchbar />
      {children}
    </div>
  );
}
```

App Router는 레이아웃 컴포넌트 파일만 작성하면 해당 경로 아래에 모든 페이지는 자동으로 레이아웃이 적용됩니다.

```js
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

App Router는 app 폴더 아래에 자동으로 생성되어 있는 레이아웃 파일이 있습니다.
Next.js 앱의 모든 페이지에 공통 적용되는 Global Layout 또는 Root Layout을 의미하는 파일입니다.
루트 레이아웃은 html 페이지의 기초 틀을 잡아주는 역할을 합니다.

![Next.js AppRouter의 폴더 구조 2](/assets/blog/app-router/2.png)

만약에 특정 페이지들만 동일한 레이아웃을 설정하고 싶다면 App Router의 새로운 기능인 Route Group을 이용할 수 있습니다.
Route Group은 소괄호로 감싼 이름의 폴더를 지칭하고 경로상에는 아무런 영향을 미치지 않습니다.
Route Gruop 아래에 있는 페이지 컴포넌트에게만 동일한 레이아웃을 구성할 수 있고 바깥에 존재하는 페이지에는 레이아웃이 적용되지 않습니다.

## ReactServer Component

기존 컴포넌트와 달리 브라우저에서 실행되지 않고 서버측에서만 실행되는 컴포넌트입니다.

![Next.js AppRouter의 렌더링 과정](/assets/blog/app-router/3.png)

서버에서 브라우저에게 전달하는 JS Bundle에는 페이지에 필요한 모든 컴포넌트들이 들어있고 브라우저에서 Hydration을 위해 한 번 더 실행됩니다.

하지만 JS Bundle에 모든 컴포넌트가 포함될 필요는 없습니다.
리액트 훅이 있거나 이벤트 핸들러가 있어서 상호 작용이 필요한 컴포넌트들을 제외한 정적인 컴포넌트들은 굳이 브라우저에서 한 번 더 실행될 필요가 없습니다.

Page Router는 모든 컴포넌트를 구분하지 않고 JS Bundle로 묶어서 브라우저에게 전달합니다.
JS Bundle의 용량이 불필요하게 커지고 불러오는 시간과 Hydration하는 시간도 늘어나 TTI가 늦어집니다.

App Router는 상호 작용을 하는 컴포넌트와 그렇지 않은 컴포넌트를 분류해줍니다.
상호 작용이 필요하지 않는 컴포넌트를 서버 컴포넌트라고 부르고 JS Bundle에 포함하지 않고 서버측에서 한 번만 실행됩니다.
상호 작용이 필요한 컴포넌트는 클라이언트 컴포넌트라고 부르고 서버에서 한 번, 브라우저에서 한 번 실행됩니다.

App Router는 브라우저에게 JS Bundle을 보낼 때 클라이언트 컴포넌트만 보냄으로써 파일의 용량을 줄여 앞선 문제점들을 해결합니다.
Next.js 공식 문서에서도 페이지의 대부분을 서버 컴포넌트로 구성할 것을 권장합니다.

```js
export default function Page() {
  console.log("서버 컴포넌트!");
  return <div>...</div>;
}
```

App Router는 기본적으로 서버 컴포넌트로 작동하기 때문에 별도의 설정을 하지 않아도 됩니다.
컴포넌트 내부에서 로그를 출력한다면 브라우저에서는 확인할 수 없고 서버 터미널에서 확인할 수 있습니다.

서버에서만 실행되기 때문에 컴포넌트 내부에서 보안 키를 사용해도 브라우저에게 전달되지 않기 때문에 보안적인 문제가 발생하지 않을 뿐더러 직접 데이터를 불러오도록 설정할 수 있습니다.
기존 Page Router에서 `getServerSideProps`, `getStaticProps` 함수가 했던 역할을 컴포넌트가 할 수 있게 설정해줄 수 있습니다.

```js
"use client";

export default function Page() {
  console.log("클라이언트 컴포넌트!");
  return <div>...</div>;
}
```

리액트 훅이나 이벤트 핸들러같은 브라우저에서만 할 수 있는 일들은 클라이언트 컴포넌트를 사용해야 합니다.
파일의 최상단에 "use client"라고 적어주면 클라이언트 컴포넌트로 인식합니다.

클라이언트 컴포넌트와 서버 컴포넌트는 JavaScript의 기능을 활용하여 사용자와 상호 작용을 하냐, 안 하냐로 나눠서 사용할 수 있습니다.
Link 태그를 클릭하여 페이지를 이동하는 건 HTML 고유의 기능이기 때문에 상호 작용에 해당하지 않습니다.

### 서버 컴포넌트 사용 시 주의 사항

1. 서버 컴포넌트에는 브라우저에서 실행될 코드가 포함되면 안 된다.
2. 클라이언트 컴포넌트는 클라이언트에서만 실행되지 않고 서버에서 한 번, 브라우저에서 한 번 실행된다.
3. 클라이언트 컴포넌트에서 서버 컴포넌트를 import할 수 없다.

3번의 내용을 자세히 보면 클라이언트 컴포넌트에서 서버 컴포넌트를 import할 경우 서버 측에서 실행될 때는 문제가 없지만 브라우저에서 Hydration을 할 때 클라이언트 컴포넌트만 존재하기 때문입니다.

```js
"use client";
import ServerComponent from "./ServerComponent";

export default function ClientComponent() {
  return <ServerComponent />;
}
```

프로젝트가 크고 복잡해지면 클라이언트 컴포넌트 안에서 서버 컴포넌트를 사용할 수도 있습니다.
Next.js는 오류를 발생시키는 대신에 서버 컴포넌트를 클라이언트 컴포넌트로 바꿔줍니다.

```js
export default function ServerComponent() {
  return <div>...</div>;
}
```

```js
"use client";

export default function ClientComponent({ children }: { children: ReactNode }) {
  return (
    <div>
      <children />
    </div>
  );
}
```

```js
export default function Page() {
  return (
    <div>
      <ClientComponent>
        <SeverComponent />
      </ClientComponent>
    </div>
  );
}
```

클라이언트 컴포넌트가 많아지면 JS Bundle 용량이 커지는 문제가 발생하기 때문에 어쩔 수 없이 클라이언트 컴포넌트에서 서버 컴포넌트를 사용해야 한다면 직접 import하는 것이 아닌 children props로 받아서 렌더링 시켜주면 됩니다.
클라이언트 컴포넌트는 서버 컴포넌트를 직접 실행할 필요없이 서버 컴포넌트의 결과물만 props로 전달 받으면 되기 때문에 Next.js는 children props로 전달된 서버 컴포넌트는 클라이언트 컴포넌트로 변경하지 않습니다.

4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 Props는 전달할 수 없다.

4번을 좀 더 자세히 살펴보면 직렬화(Serialization)란 객체, 배열, 클래스 등 복잡한 구조의 데이터를 네트워크 상으로 전송하기 위해 아주 단순한 형태(문자열, Byte)로 변환하는 과정을 말합니다.
JavaScript의 함수는 값이 아닌 코드 블럭들을 포함하고 있는 특수한 형태를 갖고 Closure, Lexical Scope 등의 다양한 환경에 의존한 경우가 많기 때문에 모든 정보를 단순한 문자열이나 바이트의 형태로 표현할 수 없어 직렬화 할 수 없습니다.
직렬화되지 않는 함수는 서버 컴포넌트에서 클라이언트 컴포넌트로 향하는 props가 될 수 없습니다.

사전 렌더링 과정에서 클라이언트 컴포넌트와 서버 컴포넌트가 함께 실행하여 HTML 페이지를 생성하지 않습니다.
서버 컴포넌트들이 먼저 실행되고 클라이언트 컴포넌트들이 실행됩니다.
서버 컴포넌트가 실행되면 결과로 `RSC Payload`라는 JSON과 비슷한 문자열을 생성합니다.

RSC란 React Server Component의 줄임말로 `RSC Payload`란 서버 컴포넌트를 직렬화한 결과입니다.
RSC Payload에는 서버 컴포넌트의 렌더링 결과, 연결된 클라이언트 컴포넌트의 위치, 클라이언트 컴포넌트에게 전달하는 props 등 서버 컴포넌트와 관련된 모든 데이터가 들어가 있습니다.

이후에 클라이언트 컴포넌트들도 실행되어 `RSC Payload` 결과와 합쳐져 HTML 페이지가 생성됩니다.
하지만 서버 컴포넌트들을 먼저 실행해서 `RSC Payload`라는 형태로 직렬화하는 과정에서 만약에 특정 서버 컴포넌트가 자식인 클라이언트 컴포넌트에게 함수 형태의 값을 props로 전달한다면 함수 값 또한 함께 직렬화되어 RSC Payload에 포함되어야 합니다.
하지만 함수는 직렬화할 수 없기 때문에 런타임 에러가 발생합니다.

## 데이터 패칭

Page Router는 `getServerSideProps`, `getStaticProps`, `getStaticPaths`와 같은 서버측에서만 실행되는 함수를 이용하여 데이터를 패칭했습니다.
다른 컴포넌트에 데이터를 넘겨줄 때 props나 Context API를 사용하여 넘겨줘야 했습니다.

```js
export default async function Page() {
  const response = await fetch("...");

  return <div>...</div>;
}
```

App Router는 React Server Component가 도입되면서 서버 컴포넌트 함수를 비동기 함수로 만들 수 있습니다.
서버 컴포넌트는 서버에서만 실행되기 때문에 `getServerSideProps`, `getStaticProps`, `getStaticPaths`함수를 따로 이용할 필요가 없이 컴포넌트 내부에서 데이터 패칭 로직을 작성해도 아무런 문제가 발생하지 않습니다.
따라서 props나 Context API를 사용하여 데이터를 넘겨줄 필요없이 데이터가 필요한 컴포넌트에서 직접 데이터를 요청하여 사용할 수 있습니다.

## 데이터 캐시

fetch 메서드를 활용해 불러온 데이터를 Next 서버에 보관하는 기능입니다.
영구적으로 데이터를 보관하거나, 특정 주기로 갱신 시킬 수 있어 불 필요한 데이터 요청을 줄여 웹 서비스 성을을 개선할 수 있습니다.

```js
const response = await (`~/api`, { cache: "force-cache" });
```

fetch 메서드에 두 번째 인수로 객체 형태의 옵션을 설정하여 적용할 수 있습니다.
`cache: "force-cache"`는 요청의 결과를 무조건 캐싱하고 한 번 호출된 이후에는 다시 호출되지 않습니다.

이 밖에도 다양한 캐시 옵션을 제공합니다.
데이터 캐시 옵션은 axios나 다른 request 라이브러리에서는 사용할 수 없습니다.

```js
logging: {
  fetches: {
    fullUrl: true,
  },
},
```

데이터 패칭마다 로그를 출력하고 싶다면 `next.config.mjs`파일에 logging 옵션을 작성해줍니다.

### `{ cache: "no-store" }`

![`{cache: "no-store"}` 옵션의 캐싱 과정](/assets/blog/app-router/4.png)

- 데이터 패칭의 결과를 저장하지 않는 옵션입니다.
- 캐싱을 하지 않도록 설정하는 옵션입니다.

```js
const response = await fetch("~/book", {
  cache: "no-store",
});
```

![`{cache: "no-store"}` 옵션의 캐싱 로그](/assets/blog/app-router/5.png)

로그를 확인하면 오른쪽에 `(cahe skip)`이 적혀있고 데이터 캐싱이 동작하지 않았음을 알려줍니다.
데이터 캐싱이 동작하지 않은 이유에 대해서 `(cache: no-store)`옵션이 설정되어 있어서라고 알려줍니다.

![캐시 옵션을 주지 않았을 때 캐싱 로그](/assets/blog/app-router/6.png)

캐시 옵션을 넣지 않으면 `(auto-nocache)`으로 자동으로 캐싱되지 않았다고 나옵니다.
Next 14 버전까지의 캐시 옵션 기본값은 무조건 캐싱되는 것이었지만 15 버전 이후부터는 캐싱되지 않습니다.

### `{ cache: "force-cache" }`

![`{cache: "force-cache"}` 옵션의 캐싱 과정](/assets/blog/app-router/7.png)

- 접속 요청을 받게 되면 데이터 캐시에서 저장된 데이터를 찾습니다.
- 첫 요청일 경우 저장된 데이터가 없기 때문에 `MISS`라는 판정을 내립니다.
- 백엔드 서버에 요청한 뒤 받은 데이터를 저장(`SET`)하게 됩니다.
- 추가로 들어온 요청에 대해서는 데이터 캐시에 저장된 데이터를 찾아(`HIT`) 반환하고 백엔드 서버에 요청을 보내지 않습니다.

![`{cache: "force-cache"}` 옵션의 캐싱 로그](/assets/blog/app-router/8.png)

로그를 확인하면 `(cache hit)`로 추가적인 데이터 요청이 발생하지 않았음을 알 수 있습니다.

![Next 서버에 저장된 데이터](/assets/blog/app-router/9.png)

캐싱된 데이터는 JSON 형태로 Next 서버에 보관되고 파일 탐색기에서 확인할 수 있습니다.

### `{ next: { revalidate: 3 } }`

![`{next: {revalidate: 3}}` 옵션의 캐싱 과정](/assets/blog/app-router/10.png)

- 특정 시간을 주기로 캐시를 업데이트하고 Page Router의 ISR 방식과 유사합니다.
- 접속 요청을 받으면 데이터가 없기 때문에 `MISS`가 되고 백엔드 서버에 요청하여 받은 데이터를 저장(`SET`)합니다.
- 이후 접속 요청에 대해서는 데이터 캐시에 저장된 데이터를 찾아(`HIT`) 반환합니다.
- 설정 시간 이후에 접속 요청이 들어오면 데이터를 `STALE` 상태로 설정한 뒤 반환하고 백엔드 서버로 요청하여 데이터를 최신화 시킵니다.

### `{ next: { tags: ['a'] } }`

- 요청이 들어왔을 때 데이터를 최신화 하며 Page Router의 On-Demand ISR 방식과 유사합니다.
- 이 개념은 서버 액션, 라우터 핸들러 등의 추가적인 개념 학습 이후 다시 설명드리겠습니다.

## Request Memoization

![Request Memoization의 캐싱 과정](/assets/blog/app-router/11.png)

하나의 페이지를 이루고 있는 여러 컴포넌트에서 중복으로 발생한 요청을 캐싱해서 한 번만 요청하도록 자동으로 데이터 패칭을 최적화해주는 기능입니다.

접속 요청을 받은 페이지에 동일한 주소의 동일한 데이터를 불러오는 데이터 패칭 요청이 있고 캐싱 옵션이 `no-store`로 되어 있을 경우 리퀘스트 메모이제이션이 자동으로 캐싱하여 한 번만 요청하여 캐싱합니다.

주의할 점은 리퀘스트 메모이제이션은 하나의 페이지를 요청하는 동안에만 존재하는 캐시로서 중복되는 API 요청을 방지하는 데에만 목적을 두고 있습니다.
따라서 렌더링이 종료되면 캐시가 소멸되어 다음 접속 요청에는 데이터를 다시 요청하기 때문에 데이터 캐시와는 다릅니다.

Next가 리퀘스트 메모이제이션을 제공하는 이유는 서버 컴포넌트가 도입되면서 컴포넌트가 각각 필요한 데이터를 직접 패칭하는 방식으로 데이터 패칭이 진행됩니다.
컴포넌트가 직접 패칭하기 때문에 컴포넌트 구조가 복잡해져도 독립적인으로 사용할 수 있습니다.
하지만 이런 패턴을 사용하다보니 다른 컴포넌트에서 동일한 데이터를 필요로 하는 예외적인 경우가 발생합니다.

## 페이지 캐싱

### Full Route Cache

![Full Route Cache의 캐싱 과정](/assets/blog/app-router/12.png)

`/a`페이지가 풀 라우트 캐시에 저장되는 페이지로 설정되었다면 빌드 타임에 렌더링을 진행합니다.
페이지에 필요한 데이터를 리퀘스트 메모이제이션이나 데이터 캐시 등의 캐싱 기능을 거쳐서 렌더링이 완료된 결과를 풀 라우트 캐시라는 이름으로 서버 측에 저장합니다.

빌드 타임 이후에 `/a` 페이지로 접속 요청이 들어오면 캐시가 `HIT`되어서 브라우저에 전송하여 빠른 속도로 처리합니다.

풀 라우트 캐시는 SSG 방식과 유사하게 빌드 타임에 정적으로 페이지를 만들어 놓고 캐시에 보관한 다음에 브라우저에서 요청이 오면 캐시에 저장된 페이지를 응답하는 페이지 캐싱 기능입니다.

Next 앱에 만든 모든 페이지는 자동으로 정적 페이지(Static Page)와 동적 페이지(Dynamic Page)로 나뉘고 정적 페이지에만 풀 라우트 캐시가 적용됩니다.

#### 동적 페이지로 구분되는 경우

페이지가 접속 요청을 받을 때 마다 변화가 생기거나 데이터가 달라질 경우(캐시되지 않는 데이터 패칭을 사용할 경우 (`no-store`), 컴포넌트 내부에서 동적 함수(쿠키, 헤더, 쿼리 스트링)를 사용할 경우) 동적 페이지로 구분됩니다.

#### 정적 페이지로 구분되는 경우

기본적으로 동적 페이지가 아니면 모두 정적 페이지가 됩니다.

| 동적 함수 | 데이터 캐시 | 페이지 분류 |
| :-------: | :---------: | :---------: |
|     O     |      X      | 동적 페이지 |
|     O     |      O      | 동적 페이지 |
|     X     |      X      | 동적 페이지 |
|     X     |      O      | 정적 페이지 |

풀 라우트 캐시는 정적 페이지에 대해서만 적용되고 빌드 타임에 생성되기 때문에 빠른 속도로 응답할 수 있습니다.
따라서 대부분의 페이지를 정적 페이지로 작성하는 것이 권장됩니다.

![Full Route Cache의 Revalidate 캐싱 과정](/assets/blog/app-router/13.png)

풀 라우트 캐시된 페이지도 Page Router의 ISR처럼 Revalidate가 가능합니다.
`revalidate: 3`으로 설정한 경우 빌드 타임에 페이지가 캐싱됩니다.
3초 이전에 들어온 접속 요청에 대해서 캐싱된 페이지를 보여줍니다.
3초가 지난 이후에 접속 요청이 들어오면 `STALE` 표시를 한 뒤 캐싱된 페이지를 응답한 다음에 서버 측에서 데이터를 다시 불러와 데이터 캐시를 `SET`한 뒤 페이지를 다시 렌더링하여 풀 라우트 캐시에 저장된 페이지를 최신화합니다.

#### generateStaticParams

정적인 페이지는 빌드 타임에 만들어져서 캐싱되기 때문에 최대한 활용하는 것이 좋습니다.

```js
export default function Page({
  searchParams,
}: {
  searchParams: {
    q?: string;
  };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" }
  );

  ...

  return (
    <div>...</div>
  );
}
```

쿠키, 헤더, 쿼리 스트링을 사용하는 동적 함수를 포함한 컴포넌트는 동적 페이지로 분류됩니다.
동적 페이지로 분류되면 브라우저로부터 접속 요청을 받을 때마다 페이지는 다시 생성이 되겠지만 최대한 데이터 캐시를 활용하여 최적화할 수 있습니다.

동적 경로를 갖는 페이지가 있다면 기본적으로 동적 페이지로 분류됩니다.
`generateStaticParams` 함수는 빌드 타임에 어떠한 URL 파라미터가 존재할 수 있는지 알려줌으로써 동적 경로를 갖는 페이지를 정적 페이지로써 빌드 타임에 생성되도록 설정할 수 있습니다.

```js
export function generateStaticParams(){
  return [{id: "1"}, {id: "2"}, {id: "3"}];
}

export default function Page({
  params,
}: {
  params: {id: string};
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${params.id}`);

  ...

  return (
    <div>...</div>
  );
}
```

`generateStaticParams` 함수를 통해 정적인 URL 파라미터들을 담은 배열을 반환하면 빌드 타임에 Next 서버가 자동으로 읽어서 반환값에 해당하는 페이지를 정적으로 만들어줍니다.

`npm run build`명령어를 통해 빌드 결과를 확인해보면

![generateStaticParams 함수 작성 후 빌드 결과](/assets/blog/app-router/14.png)

반환값으로 내보냈던 1, 2, 3에 해당하는 페이지가 빌드 타임에 생성된 걸 확인할 수 있습니다.

`generateStaticParams` 함수의 URL 파라미터 값은 문자열로만 반환해야 합니다.
또한 페이지 컴포넌트 내부에 데이터 캐싱이 설정되지 않은 데이터 패칭이 존재해도 무조건 해당하는 페이지가 정적 페이지로 설정됩니다.

`generateStaticParams` 함수는 Page Router의 `getStaticPaths` 함수와 동일한 역할을 합니다.

반환값으로 설정하지 않은 URL 파라미터로 접속해도 페이지는 잘 렌더링됩니다.
반환값으로 설정하지 않은 페이지는 동적 페이지로서 실시간으로 만들어지기 때문입니다.

```js
if (!response.ok) {
  if (response.status === 404) {
    return notFound();
  }
  return <div>오류가 발생했습니다...</div>;
}
```

존재하지 않는 데이터일 경우 `notFound()`를 반환하여 404 페이지로 리다이렉트 시킬 수 있습니다.

```js
export const dynamicParams = false;
```

`dynamicParams` 옵션을 `false`로 내보내주면 정적으로 설정한 URL 파라미터가 아닐 경우 모두 404 페이지로 리다이렉트합니다.

### 라우트 세그먼트 옵션

풀 라우트 캐시를 적용하기 위해서 대부분의 페이지를 정적 페이지로 변환하는 과정을 거치면서 페이지에 존재하는 컴포넌트들이 동적 함수를 사용하는지, 캐싱되지 않는 데이터 패칭을 하고 있지 않은지 검사해야 했습니다.
이 과정이 페이지의 컴포넌트 갯수가 많아지면 복잡해질 수 있습니다.
모든 컴포넌트들을 확인하지 않아도 강제로 동적, 정적 페이지로 설정하는 옵션이 라우트 세그먼트 옵션입니다.

`dynamicParams` 옵션도 라우트 세그먼트 옵션 가운데 하나입니다.
라우트 세그먼트 옵션은 많은 옵션을 제공하지만 모두 사용되고 있지 않기 때문에 가장 자주 사용되는 `dynamic` 옵션만 다뤄보도록 하겠습니다.

```js
export const dynamic = "";
```

`dynamic` 옵션은 페이지의 유형을 강제로 동적, 정적으로 설정해주는 옵션으로 `auto`, `force-dynamic`, `force-static`, `error`라는 네 가지 옵션을 제공합니다.

`auto`는 기본값으로 자동으로 동적, 정적인 페이지로 설정해주고 생략 가능합니다.
`force-dynamic`은 강제로 동적 페이지로 설정해줍니다.
`force-static`은 강제로 정적 페이지로 설정해줍니다.

```js
export const dynamic = `force-static`;

export default function Page({
  searchParams,
}: {
  searchParams: {
    q?: string;
  };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" }
  );

  ...

  return (
    <div>...</div>
  );
}
```

만약 동적 페이지에 `force-static` 옵션을 주면 강제로 정적 페이지로 설정됩니다.
이때 페이지 내부에서 사용되는 쿼리 스트링 같은 동적 함수들은 `undefined`를 반환, 데이터 패칭은 `no-store`로 강제로 설정됩니다.
동적 함수를 `undefined`로 빈값을 반환하도록 설정하기 때문에 쿼리 스트링을 사용하는 페이지의 경우 쿼리 스트링의 값을 알 수 없기 때문에 제대로 동작하지 않습니다.

`force-error`는 `force-static`과 동일하게 정적 페이지로 설정해주지만 동적 함수나 캐싱되지 않는 데이터 패칭등의 정적 페이지로 설정하면 안 되는 이유가 있다면 빌드 오류를 발생시킵니다.

App Router는 모든 컴포넌트들이 어떻게 동작하는지에 따라서 동적, 정적 페이지로 자동 설정해주기 때문에 `dynamic` 옵션은 사실 권장되지 않는 옵션입니다.
그렇지만 개발 중에 의도적으로 동적, 정적 페이지로 설정해야 되는 경우 `dynamic` 옵션을 적용한 다음에 나중에 고쳐나가는 식으로 진행할 수 있습니다.

### 클라이언트 라우터 캐시

클라이언트 라우터 캐시는 클라이언트의 브라우저에 저장되는 캐시로 페이지 이동을 효율적으로 진행하기 위해 페이지의 일부 데이터를 보관하는 기능입니다.

![클라이언트 라우터 캐시 과정](/assets/blog/app-router/15.png)

`~/` 경로의 인덱스 페이지는 정적 페이지, `~/search` 경로의 페이지는 동적 페이지이고 루트 레이아웃과 같이 사용하는 공통 레이아웃이 있는 상황입니다.

인덱스 페이지로 요청을 보내면 풀 라우트 캐시에 저장된 페이지를 반환합니다.
`~/search` 경로로 이동하면 동적 페이지이기 때문에 풀 라우트 캐시는 `SKIP`이 되고 실시간으로 페이지를 생성해서 반환합니다.
클라이언트 라우터 캐시가 없다면 인덱스 페이지와 search 페이지에서 공통으로 사용하고 있는 루트 레이아웃과 공통 레이아웃을 중복으로 요청하게 됩니다.

자세하게 얘기하면 Next 서버는 브라우저에게 사전 렌더링된 HTML 파일, 클라이언트 컴포넌트들의 데이터를 포함하고 있는 JS Bundle, 서버 컴포넌트들의 데이터를 포함하고 있는 RSC Payload를 보냅니다.
RSC Payload에는 루트 레이아웃과 공통 레이아웃, 페이지 컴포넌트를 포함한 나머지 서버 컴포넌트들이 담겨있습니다.
브라우저는 인덱스 페이지에서 search 페이지로 이동하는 과정에서 Next 서버로 부터 전달받은 RSC Payload에는 중복된 레이아웃을 받게 되는 문제가 있습니다.

Next는 이러한 비효율을 줄이기 위해 브라우저에 클라이언트 라우터 캐시라는 새로운 캐시 공간을 추가해서 서버로 부터 받게 되는 RSC Payload 값들 중에 레이아웃에 해당하는 데이터만 따로 추출하여 보관합니다.

클라이언트 라우터 캐시는 따로 적용할 필요없이 Next가 자동으로 적용되어 있습니다.
클라이언트 라우터 캐시를 사용해도 새로고침을 하거나 탭을 껐다가 다시 접속하는 경우에는 사라지기 때문에 동작하지 않습니다.

## 스트리밍과 에러 핸들링

### 스트리밍

스트리밍은 서버에서 클라이언트로 데이터를 넘겨줄 때 데이터의 용량이 너무 크거나 서버 측에서 데이터를 준비하는 시간이 오래 걸려서 빠른 전송이 어려울 때 데이터를 여러 조각으로 잘라서 하나씩 전송하는 기술입니다.

스트리밍을 이용하면 클라이언트 입장에서 모든 데이터가 불러와지지 않은 상황에서도 조금씩 받은 데이터에 접근할 수 있기 때문에 사용자에게 긴 로딩없이 좋은 경험을 제공할 수 있습니다.

Next는 스트리밍 기술을 동영상이 아닌 일반적인 웹 서비스에서도 누릴 수 있게 HTML을 스트리밍할 수 있는 기능을 자체적으로 제공합니다.
스트리밍을 이용하면 페이지 내에 렌더링이 오래 걸리는 컴포넌트가 있다고 해도 사용자에게 빠르게 렌더링할 수 있는 컴포넌트를 바로 보여주고 느리게 렌더링되는 컴포넌트는 로딩바와 같은 대체 UI를 보여줄 수 있기 때문에 사용자 경험을 향상 시킬 수 있습니다.

Next의 스트리밍 기술은 동적 페이지에 자주 활용됩니다.
동적 페이지는 빌드 타임에 생성되지 않기 때문에 풀 라우트 캐시에 저장되지 않습니다.
동적 페이지는 브라우저로부터 접속 요청이 있을 때마다 페이지의 모든 컴포넌트들을 실행해서 페이지를 새롭게 렌더링해줘야 하기 때문에 특정 컴포넌트 내부의 데이터 패칭이 오래 걸릴 경우에는 전체 페이지의 응답이 느려져 사용자 경험을 헤치게 됩니다.
스트리밍을 사용하게 되면 접속 요청이 들어왔을 때 빠르게 렌더링할 수 있는 컴포넌트들을 응답하여 보여주고 느리게 렌더링되는 컴포넌트는 로딩바와 같은 대체 UI를 보여주다가 서버측에서 데이터 패칭이 완료되어 렌더링이 완료되면 후속으로 보내줌으로써 사용자 경험을 향상 시킵니다.

#### 페이지 컴포넌트 스트리밍 적용하기

![loading.tsx가 보이는 폴더 구조](/assets/blog/app-router/16.png)

페이지 컴포넌트에 스트리밍을 적용하기 위해 페이지 컴포넌트와 동일한 위치에 `loading.tsx` 파일에 대체 UI 역할을 할 컴포넌트를 작성하면 자동으로 적용됩니다.

페이지 컴포넌트에 스트리밍 사용 시 주의사항이 있습니다.

1. `loading.tsx` 파일은 `layout.tsx` 파일처럼 해당하는 경로 아래에 있는 모든 페이지 컴포넌트들에 적용됩니다.
2. `loading.tsx` 파일이 스트리밍하도록 설정하는 페이지 컴포넌트는 모든 페이지 컴포넌트가 아닌 `async`가 붙은 비동기로 동작하는 페이지 컴포넌트에만 적용됩니다.
3. `loading.tsx` 파일은 무조건 페이지 컴포넌트에만 적용할 수 있습니다. 따라서 레이아웃이나 페이지 컴포넌트 내부의 일반적인 컴포넌트들은 적용되지 않습니다.
4. `loading.tsx` 파일로 설정된 스트리밍은 브라우저에서 쿼리 스트링이 변경될 때에는 트리거링되지 않습니다.

#### 컴포넌트 스트리밍 적용하기

React의 `Suspense`를 이용하면 페이지 단위가 아닌 컴포넌트 단위로 스트리밍을 적용할 수 있습니다.

```js
export default function Page({
  searchParams,
}: {
  searchParams: {
    q?: string,
  },
}) {
  return (
    <Suspense
      key={searchParams.q || ""}
      fallback={<BookListSkeleton count={3} />}
    >
      <SearchResult q={searchParams.q || ""} />
    </Suspense>
  );
}
```

비동기 작업을 하고 있는 컴포넌트를 `Suspense` 태그로 감싸주고 대체 UI는 `fallback`이라는 속성으로 넘겨주면 스트리밍이 적용됩니다.

![스켈레톤 UI](/assets/blog/app-router/17.png)

`fallback` 속성에 컴포넌트를 넘겨줄 수 있는데 주로 스켈레톤 UI를 넘겨줍니다.
스켈레톤 UI란 페이지의 컴포넌트가 로딩되는 동안 실제 렌더링될 컴포넌트의 뼈대를 보여주는 UI로 사용자에게 어떤 컨텐츠가 나타날지 예상할 수 있도록 하여 사용자 경험을 향상시킬 수 있습니다.

하지만 `fallback` 속성만으로는 쿼리 스트링이 변경됐을 경우에는 대체 UI가 표시되지 않는 문제가 있습니다.
`loading.tsx`는 이를 해결할 수 있는 방법이 없었지만 `Suspense`는 `key`라는 속성을 전달하여 key값이 변경될 때마다 다시 로딩 상태로 돌아가게 할 수 있습니다.
따라서 `key` 속성에 쿼리 스트링을 넣어주게 되면 쿼리 스트링이 변경될 때마다 대체 UI를 보여줄 수 있습니다.

```js
export default async function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        <Suspense fallback={<BookListSkeleton count={3} />}>
          <RecoBooks />
        </Suspense>
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        <Suspense fallback={<BookListSkeleton count={10} />}>
          <AllBooks />
        </Suspense>
      </section>
    </div>
  );
}
```

`Suspense`는 하나의 페이지 내에서 여러 비동기 컴포넌트를 동시에 스트리밍할 때 적용할 수 있습니다.
`RecoBooks`와 `AllBooks` 컴포넌트가 불러와지는 시간이 달라도 완료되는 순서대로 렌더링 시킬 수 있습니다.
이러한 장점 덕분에 `loading.tsx`를 활용하기 보다 `Suspense`를 사용하는 방식이 선호됩니다.

### 에러 핸들링

```js
try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`,
    { next: { revalidate: 3 } }
  );
  if (!response.ok) {
    return <div>오류가 발생했습니다 ...</div>;
  }
  const recoBooks: BookData[] = await response.json();

  return (
    <div>
      {recoBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
} catch (err) {
  cosnole.error(err);
  return <div>오류가 발생했습니다...</div>;
}
```

기존에 에러를 처리하기 위해서는 `Try-Catch` 블록을 통해 에러를 처리해야 했습니다.
하지만 이런 방식은 데이터 패칭같이 오류가 발생할 수 있는 모든 코드 블록마다 `Try-Catch`문을 넣어줘야 하는 문제가 있습니다.
추가로 예상하지 못한 부분에서 에러가 발생할 수 있기 때문에 신경을 써야하는 점도 많아집니다.

Next는 특정 경로에서 발생하는 모든 오류를 한 번에 처리할 수 있는 편리한 에러 핸들링 기능을 제공합니다.

![error.tsx가 보이는 폴더 구조](/assets/blog/app-router/16.png)

`Try-Catch`를 사용하는 대신에 페이지 컴포넌트와 같은 위치에 `error.tsx` 파일을 생성해줍니다.

```js
"use client";

export default function Error() {
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
    </div>
  );
}
```

`error.tsx`의 최상단에 `use client` 지시자를 추가해줌으로써 클라이언트 컴포넌트로 설정해줍니다.
클라이언트 컴포넌트로 설정하는 이유는 클라이언트측과 서버측에서 발생하는 모든 오류를 대응하기 위해서 입니다.
`layout.tsx`나 `loading.tsx`처럼 해당하는 경로 아래에 페이지에서 오류가 발생하면 `error.tsx` 컴포넌트가 페이지 컴포넌트 대신에 출력됩니다.

```js
"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error,
  reset: () => void,
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error.message);
  }, [error]);
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh();
            reset();
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
```

현재 발생하는 에러의 원인이나 에러 메세지를 출력하고 싶은 경우 `Error` 컴포넌트에 `props`로 전달되는 `error`를 이용하시면 됩니다.
Next는 `error`라는 이름의 `props`로 현재 발생한 오류의 정보를 `Error` 컴포넌트에게 자동으로 보내줍니다.

`Error` 컴포넌트에게는 `reset`이라는 하나의 `props`가 더 제공됩니다.
`reset`은 에러가 발생한 페이지를 복구하기 위해서 다시 한 번 컴포넌트들을 렌더링 시키는 기능을 갖는 함수입니다.

하지만 `reset`은 브라우저 측에서만 화면을 다시 렌더링하는 함수이기 때문에 서버 컴포넌트는 다시 실행하지 않아서 데이터 패칭을 수행하지 않습니다.
따라서 `reset` 함수만으로는 클라이언트 컴포넌트 내부에서 발생한 오류만 복구할 수 있습니다.

서버 컴포넌트에서 발생한 오류를 복구하기 위해서는 `button`태그의 `onClick` 속성에 `onClick={()=>window.location.reload()}`과 같이 설정하여 새로고침을 통해 해결할 수 있는 방법이 있습니다.
하지만 새로고침을 하면 브라우저에 보관한 `state`나 클라이언트 컴포넌트의 데이터들이 사라지고 에러가 발생하지 않는 레이아웃이나 다른 컴포넌트들까지 새롭게 렌더링되어야 하기 때문에 우아한 방법은 아닙니다.

우아하게 처리하기 위해서는 `router.refresh()`메서드를 활용하여 Next 서버에게 서버 컴포넌트만 새롭게 렌더링 요청을 한 다음에 `reset`함수를 실행시켜 `refresh`를 통해 새롭게 전달받은 서버 컴포넌트 데이터를 화면에 렌더링하도록 해야 합니다.

`refresh` 메서드는 현재 페이지에 필요한 서버 컴포넌트들을 다시 불러오는 메서드입니다.
하지만 서버 컴포넌트들을 다시 렌더링한다고 해도 클라이언트 컴포넌트인 `Error` 컴포넌트가 사라지진 않습니다.
`reset` 함수를 `refresh` 메서드 이후에 실행하는 이유는 `reset` 함수가 에러 상태를 초기화하고 컴포넌트들을 다시 렌더링하기 때문입니다.

하지만 `refresh` 메서드는 비동기로 동작하기 때문에 `onClick={()=>{router.refresh(); reset();}}`으로 실행하면 `refresh` 메서드가 끝나기 전에 `reset` 메서드가 실행되어 새로운 서버 컴포넌트 없이 화면을 새로 그리기 때문에 오류가 해결되지 않습니다.
추가로 `refresh` 메서드는 `void`를 반환 타입으로 갖기 때문에 `await`를 통해 동기적으로 작동하게 할 수 없습니다.

React 18 버전부터 추가된 `startTransition` 메서드를 활용하면 이 문제를 해결할 수 있습니다.
`startTransition` 메서드는 콜백 함수를 인수로 받아서 콜백 함수 안에 들어있는 UI를 변경시키는 작업들을 일괄적으로 처리해줍니다.
따라서 `startTransition`의 인자로 넘겨주는 콜백 함수 안에서 `refresh`와 `reset`을 실행시켜 주면 일괄적으로 처리하여 해결할 수 있습니다.

`error.tsx`가 `layout.tsx`와 다른 점은 `error.tsx` 경로 아래에서 `error.tsx` 파일을 추가로 작성하면 중첩되지 않고 경로 위에 있는 `error.tsx`를 대체하게 됩니다.

`error.tsx`는 같은 경로의 `layout.tsx`까지만 렌더링을 시켜주기 때문에 아래 경로에서 오류가 발생해도 해당 경로에만 있는 레이아웃 컴포넌트를 렌더링하기 위해서는 `error.tsx`를 따로 생성하여 같은 경로에 위치시켜야 합니다.
