---
title: "App Router[스트리밍과 에러 핸들링]"
description: "App Router의 스트리밍과 에러 핸들링에 대해 알아봅니다."
thumbnail: "/assets/blog/app-router-3/cover.png"
tags: ["Next.js"]
createdAt: "2024년 10월 01일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard

인프런의 한 입 크기로 잘라먹는 Next.js 강의를 듣고 정리한 내용입니다.

---

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

![loading.tsx가 보이는 폴더 구조](/assets/blog/app-router-3/16.png)

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

![스켈레톤 UI](/assets/blog/app-router-3/17.png)

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

![error.tsx가 보이는 폴더 구조](/assets/blog/app-router-3/16.png)

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

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error }) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
    </div>
  );
}
```

현재 발생하는 에러의 원인이나 에러 메세지를 출력하고 싶은 경우 `Error` 컴포넌트에 `props`로 전달되는 `error`를 이용하시면 됩니다.
Next는 `error`라는 이름의 `props`로 현재 발생한 오류의 정보를 `Error` 컴포넌트에게 자동으로 보내줍니다.

```js
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error,
  reset: () => void,
}) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button
        onClick={() => {
          reset();
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
```

`Error` 컴포넌트에게는 `reset`이라는 하나의 `props`가 더 제공됩니다.
`reset`은 에러가 발생한 페이지를 복구하기 위해서 다시 한 번 컴포넌트들을 렌더링 시키는 기능을 갖는 함수입니다.

하지만 `reset`은 브라우저 측에서만 화면을 다시 렌더링하는 함수이기 때문에 서버 컴포넌트는 다시 실행하지 않아서 데이터 패칭을 수행하지 않습니다.
따라서 `reset` 함수만으로는 클라이언트 컴포넌트 내부에서 발생한 오류만 복구할 수 있습니다.

```js
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error,
  reset: () => void,
}) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);
  return (
    <div>
      <h3>오류가 발생했습니다.</h3>
      <button onClick={() => window.location.reload()}>다시 시도</button>
    </div>
  );
}
```

서버 컴포넌트에서 발생한 오류를 복구하기 위해서 새로고침을 통해 해결할 수 있는 방법이 있습니다.
하지만 새로고침을 하면 브라우저에 보관한 `state`나 클라이언트 컴포넌트의 데이터들이 사라지고 에러가 발생하지 않는 레이아웃이나 다른 컴포넌트들까지 새롭게 렌더링되어야 하기 때문에 우아한 방법은 아닙니다.

```js
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
          router.refresh();
          reset();
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
```

우아하게 처리하기 위해서는 `router.refresh()`메서드를 활용하여 Next 서버에게 서버 컴포넌트만 새롭게 렌더링 요청을 한 다음에 `reset`함수를 실행시켜 `refresh`를 통해 새롭게 전달받은 서버 컴포넌트 데이터를 화면에 렌더링하도록 해야 합니다.

`refresh` 메서드는 현재 페이지에 필요한 서버 컴포넌트들을 다시 불러오는 메서드입니다.
하지만 서버 컴포넌트들을 다시 렌더링한다고 해도 클라이언트 컴포넌트인 `Error` 컴포넌트가 사라지진 않습니다.
`reset` 함수를 `refresh` 메서드 이후에 실행하는 이유는 `reset` 함수가 에러 상태를 초기화하고 컴포넌트들을 다시 렌더링하기 때문입니다.

하지만 `refresh` 메서드는 비동기로 동작하기 때문에 `onClick={()=>{router.refresh(); reset();}}`으로 실행하면 `refresh` 메서드가 끝나기 전에 `reset` 메서드가 실행되어 새로운 서버 컴포넌트 없이 화면을 새로 그리기 때문에 오류가 해결되지 않습니다.
추가로 `refresh` 메서드는 `void`를 반환 타입으로 갖기 때문에 `await`를 통해 동기적으로 작동하게 할 수 없습니다.

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

React 18 버전부터 추가된 `startTransition` 메서드를 활용하면 이 문제를 해결할 수 있습니다.
`startTransition` 메서드는 콜백 함수를 인수로 받아서 콜백 함수 안에 들어있는 UI를 변경시키는 작업들을 일괄적으로 처리해줍니다.
따라서 `startTransition`의 인자로 넘겨주는 콜백 함수 안에서 `refresh`와 `reset`을 실행시켜 주면 일괄적으로 처리하여 해결할 수 있습니다.

`error.tsx`가 `layout.tsx`와 다른 점은 `error.tsx` 경로 아래에서 `error.tsx` 파일을 추가로 작성하면 중첩되지 않고 경로 위에 있는 `error.tsx`를 대체하게 됩니다.

`error.tsx`는 같은 경로의 `layout.tsx`까지만 렌더링을 시켜주기 때문에 아래 경로에서 오류가 발생해도 해당 경로에만 있는 레이아웃 컴포넌트를 렌더링하기 위해서는 `error.tsx`를 따로 생성하여 같은 경로에 위치시켜야 합니다.
