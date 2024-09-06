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
