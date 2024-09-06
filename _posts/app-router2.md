---
title: "App Router 2"
description: "Next.js의 pageRouter와 ApppRouter의 렌더링 방식을 비교하며 어떤 점이 달라졌는지 살펴봅니다."
thumbnail: "/assets/blog/app-router/cover.png"
tags: ["Next.js"]
createdAt: "2024년 09월 06일"
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

### { cache: "no-store" }

![{cache: "no-store"} 옵션의 캐싱 과정](/assets/blog/app-router/4.png)

- 데이터 패칭의 결과를 저장하지 않는 옵션입니다.
- 캐싱을 하지 않도록 설정하는 옵션입니다.

```js
const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`, {
  cache: "no-store",
});
```

![{cache: "no-store"} 옵션의 캐싱 로그](/assets/blog/app-router/5.png)

로그를 확인하면 오른쪽에 `(cahe skip)`이 적혀있고 데이터 캐싱이 동작하지 않았음을 알려줍니다.
데이터 캐싱이 동작하지 않은 이유에 대해서 `(cache: no-store)`옵션이 설정되어 있어서라고 알려줍니다.

![캐시 옵션을 주지 않았을 때 캐싱 로그](/assets/blog/app-router/6.png)

캐시 옵션을 넣지 않으면 `(auto-nocache)`으로 자동으로 캐싱되지 않았다고 나옵니다.
Next 14 버전까지의 캐시 옵션 기본값은 무조건 캐싱되는 것이었지만 15 버전 이후부터는 캐싱되지 않습니다.

### { cache: "force-cache" }

![{cache: "force-cache"} 옵션의 캐싱 과정](/assets/blog/app-router/7.png)

- 접속 요청을 받게 되면 데이터 캐시에서 저장된 데이터를 찾습니다.
- 첫 요청일 경우 저장된 데이터가 없기 때문에 `MISS`라는 판정을 내립니다.
- 백엔드 서버에 요청한 뒤 받은 데이터를 저장(`SET`)하게 됩니다.
- 추가로 들어온 요청에 대해서는 데이터 캐시에 저장된 데이터를 찾아(`HIT`) 반환하고 백엔드 서버에 요청을 보내지 않습니다.

![{cache: "force-cache"} 옵션의 캐싱 로그](/assets/blog/app-router/8.png)

로그를 확인하면 `(cache hit)`로 추가적인 데이터 요청이 발생하지 않았음을 알 수 있습니다.

![Next 서버에 저장된 데이터](/assets/blog/app-router/9.png)

캐싱된 데이터는 JSON 형태로 Next 서버에 보관되고 파일 탐색기에서 확인할 수 있습니다.

### { next: { revalidate: 3 } }

![{next: {revalidate: 3}} 옵션의 캐싱 과정](/assets/blog/app-router/10.png)

- 특정 시간을 주기로 캐시를 업데이트하고 Page Router의 ISR 방식과 유사합니다.
- 접속 요청을 받으면 데이터가 없기 때문에 `MISS`가 되고 백엔드 서버에 요청하여 받은 데이터를 저장(`SET`)합니다.
- 이후 접속 요청에 대해서는 데이터 캐시에 저장된 데이터를 찾아(`HIT`) 반환합니다.
- 설정 시간 이후에 접속 요청이 들어오면 데이터를 `STALE` 상태로 설정한 뒤 반환하고 백엔드 서버로 요청하여 데이터를 최신화 시킵니다.

### { next: { tags: ['a'] } }

- 요청이 들어왔을 때 데이터를 최신화 하며 Page Router의 On-Demand ISR 방식과 유사합니다.
- 이 개념은 서버 액션, 라우터 핸들러 등의 추가적인 개념 학습 이후 다시 설명드리겠습니다.

## Request Memoization

![{Request Memoization의 캐싱 과정](/assets/blog/app-router/11.png)

하나의 페이지를 이루고 있는 여러 컴포넌트에서 중복으로 발생한 요청을 캐싱해서 한 번만 요청하도록 자동으로 데이터 패칭을 최적화해주는 기능입니다.

접속 요청을 받은 페이지에 동일한 주소의 동일한 데이터를 불러오는 데이터 패칭 요청이 있고 캐싱 옵션이 `no-store`로 되어 있을 경우 리퀘스트 메모이제이션이 자동으로 캐싱하여 한 번만 요청하여 캐싱합니다.

주의할 점은 리퀘스트 메모이제이션은 하나의 페이지를 요청하는 동안에만 존재하는 캐시로서 중복되는 API 요청을 방지하는 데에만 목적을 두고 있습니다.
따라서 렌더링이 종료되면 캐시가 소멸되어 다음 접속 요청에는 데이터를 다시 요청하기 때문에 데이터 캐시와는 다릅니다.

Next가 리퀘스트 메모이제이션을 제공하는 이유는 서버 컴포넌트가 도입되면서 컴포넌트가 각각 필요한 데이터를 직접 패칭하는 방식으로 데이터 패칭이 진행됩니다.
컴포넌트가 직접 패칭하기 때문에 컴포넌트 구조가 복잡해져도 독립적인으로 사용할 수 있습니다.
하지만 이런 패턴을 사용하다보니 다른 컴포넌트에서 동일한 데이터를 필요로 하는 예외적인 경우가 발생합니다.

## Full Route Cache

![{Full Route Cache의 캐싱 과정](/assets/blog/app-router/12.png)

`/a`페이지가 풀 라우트 캐시에 저장되는 페이지로 설정되었다면 빌드 타임에 렌더링을 진행합니다.
페이지에 필요한 데이터를 리퀘스트 메모이제이션이나 데이터 캐시 등의 캐싱 기능을 거쳐서 렌더링이 완료된 결과를 풀 라우트 캐시라는 이름으로 서버 측에 저장합니다.

빌드 타임 이후에 `/a` 페이지로 접속 요청이 들어오면 캐시가 `HIT`되어서 브라우저에 전송하여 빠른 속도로 처리합니다.

풀 라우트 캐시는 SSG 방식과 유사하게 빌드 타임에 정적으로 페이지를 만들어 놓고 캐시에 보관한 다음에 브라우저에서 요청이 오면 캐시에 저장된 페이지를 응답하는 페이지 캐싱 기능입니다.

Next 앱에 만든 모든 페이지는 자동으로 정적 페이지(Static Page)와 동적 페이지(Dynamic Page)로 나뉘고 정적 페이지에만 풀 라우트 캐시가 적용됩니다.

동적 페이지로 구분되는 경우

-
