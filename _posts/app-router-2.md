---
title: "App Router[데이터 패칭과 페이지 캐싱]"
description: "App Router의 데이터 패칭과 페이지 캐싱에 대해 알아봅니다."
thumbnail: "/assets/blog/app-router-2/cover.png"
tags: ["Next.js"]
createdAt: "2024년 09월 15일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard

인프런의 한 입 크기로 잘라먹는 Next.js 강의를 듣고 정리한 내용입니다.

---

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

![`{cache: "no-store"}` 옵션의 캐싱 과정](/assets/blog/app-router-2/4.png)

- 데이터 패칭의 결과를 저장하지 않는 옵션입니다.
- 캐싱을 하지 않도록 설정하는 옵션입니다.

```js
const response = await fetch("~/book", {
  cache: "no-store",
});
```

![`{cache: "no-store"}` 옵션의 캐싱 로그](/assets/blog/app-router-2/5.png)

로그를 확인하면 오른쪽에 `(cahe skip)`이 적혀있고 데이터 캐싱이 동작하지 않았음을 알려줍니다.
데이터 캐싱이 동작하지 않은 이유에 대해서 `(cache: no-store)`옵션이 설정되어 있어서라고 알려줍니다.

![캐시 옵션을 주지 않았을 때 캐싱 로그](/assets/blog/app-router-2/6.png)

캐시 옵션을 넣지 않으면 `(auto-nocache)`으로 자동으로 캐싱되지 않았다고 나옵니다.
Next 14 버전까지의 캐시 옵션 기본값은 무조건 캐싱되는 것이었지만 15 버전 이후부터는 캐싱되지 않습니다.

### `{ cache: "force-cache" }`

![`{cache: "force-cache"}` 옵션의 캐싱 과정](/assets/blog/app-router-2/7.png)

- 접속 요청을 받게 되면 데이터 캐시에서 저장된 데이터를 찾습니다.
- 첫 요청일 경우 저장된 데이터가 없기 때문에 `MISS`라는 판정을 내립니다.
- 백엔드 서버에 요청한 뒤 받은 데이터를 저장(`SET`)하게 됩니다.
- 추가로 들어온 요청에 대해서는 데이터 캐시에 저장된 데이터를 찾아(`HIT`) 반환하고 백엔드 서버에 요청을 보내지 않습니다.

![`{cache: "force-cache"}` 옵션의 캐싱 로그](/assets/blog/app-router-2/8.png)

로그를 확인하면 `(cache hit)`로 추가적인 데이터 요청이 발생하지 않았음을 알 수 있습니다.

![Next 서버에 저장된 데이터](/assets/blog/app-router-2/9.png)

캐싱된 데이터는 JSON 형태로 Next 서버에 보관되고 파일 탐색기에서 확인할 수 있습니다.

### `{ next: { revalidate: 3 } }`

![`{next: {revalidate: 3}}` 옵션의 캐싱 과정](/assets/blog/app-router-2/10.png)

- 특정 시간을 주기로 캐시를 업데이트하고 Page Router의 ISR 방식과 유사합니다.
- 접속 요청을 받으면 데이터가 없기 때문에 `MISS`가 되고 백엔드 서버에 요청하여 받은 데이터를 저장(`SET`)합니다.
- 이후 접속 요청에 대해서는 데이터 캐시에 저장된 데이터를 찾아(`HIT`) 반환합니다.
- 설정 시간 이후에 접속 요청이 들어오면 데이터를 `STALE` 상태로 설정한 뒤 반환하고 백엔드 서버로 요청하여 데이터를 최신화 시킵니다.

### `{ next: { tags: ['a'] } }`

- 요청이 들어왔을 때 데이터를 최신화 하며 Page Router의 On-Demand ISR 방식과 유사합니다.
- 이 개념은 서버 액션, 라우터 핸들러 등의 추가적인 개념 학습 이후 다시 설명드리겠습니다.

## Request Memoization

![Request Memoization의 캐싱 과정](/assets/blog/app-router-2/11.png)

하나의 페이지를 이루고 있는 여러 컴포넌트에서 중복으로 발생한 요청을 캐싱해서 한 번만 요청하도록 자동으로 데이터 패칭을 최적화해주는 기능입니다.

접속 요청을 받은 페이지에 동일한 주소의 동일한 데이터를 불러오는 데이터 패칭 요청이 있고 캐싱 옵션이 `no-store`로 되어 있을 경우 리퀘스트 메모이제이션이 자동으로 캐싱하여 한 번만 요청하여 캐싱합니다.

주의할 점은 리퀘스트 메모이제이션은 하나의 페이지를 요청하는 동안에만 존재하는 캐시로서 중복되는 API 요청을 방지하는 데에만 목적을 두고 있습니다.
따라서 렌더링이 종료되면 캐시가 소멸되어 다음 접속 요청에는 데이터를 다시 요청하기 때문에 데이터 캐시와는 다릅니다.

Next가 리퀘스트 메모이제이션을 제공하는 이유는 서버 컴포넌트가 도입되면서 컴포넌트가 각각 필요한 데이터를 직접 패칭하는 방식으로 데이터 패칭이 진행됩니다.
컴포넌트가 직접 패칭하기 때문에 컴포넌트 구조가 복잡해져도 독립적인으로 사용할 수 있습니다.
하지만 이런 패턴을 사용하다보니 다른 컴포넌트에서 동일한 데이터를 필요로 하는 예외적인 경우가 발생합니다.

## 페이지 캐싱

### Full Route Cache

![Full Route Cache의 캐싱 과정](/assets/blog/app-router-2/12.png)

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

![Full Route Cache의 Revalidate 캐싱 과정](/assets/blog/app-router-2/13.png)

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

![generateStaticParams 함수 작성 후 빌드 결과](/assets/blog/app-router-2/14.png)

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

![클라이언트 라우터 캐시 과정](/assets/blog/app-router-2/15.png)

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
