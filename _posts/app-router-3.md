---
title: "App Router[스트리밍, 에러 핸들링, 서버 액션]"
description: "App Router의 스트리밍, 에러 핸들링, 서버 액션에 대해 알아봅니다."
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

## 서버 액션

서버 액션은 브라우저에서 직접 호출할 수 있는 서버측에서 실행되는 비동기 함수를 말합니다.
서버 액션을 활용하면 별도의 API를 만들 필요없이 간단한 함수 하나만으로 브라우저에서 Next 서버측에서 실행되는 함수를 직접 호출할 수 있습니다.

```js
export default function Page() {
  const saveName = async (formData: FormData) => {
    "use server";

    const name = formData.get("name");
    await saveDB({ name: name });
  };

  return (
    <form action={saveName}>
      <input name="name" placeholder="이름을 알려주세요 ..." />
      <button type="submit">제출</button>
    </form>
  );
}
```

사용자가 `input` 태그에 이름을 입력하고 제출 버튼을 클릭하게 되면 `form` 태그에 `action`으로 설정한 `saveName` 함수가 실행됩니다.

`saveName` 함수에 `"use server"` 지시자가 있으면 Next 서버에서만 실행되는 서버 액션으로 설정됩니다.
`input`태그에 입력된 모든 값들이 `FormData` 형식으로 묶여 `saveName`의 매개변수로 전달됩니다.
`saveName` 함수에서는 전달받은 `formData`로부터 사용자가 입력한 값을 꺼내어 `saveDB`같은 특정 함수를 실행하여 데이터베이스에 데이터를 직접 저장하거나

```js
await sql`INSERT INTO Names (name) VALUES (${name})`;
```

sql문을 직접 실행하여 데이터를 추가하는 등의 서버에서만 실행할 수 있는 다양한 동작을 자유롭게 수행할 수 있습니다.

기존에는 API를 통해서만 진행했어야 하는 브라우저와 서버간의 데이터 통신을 오직 자바스크립트 함수 하나만으로 쉽고 간결하게 설정할 수 있습니다.

결국 서버 액션은 클라이언트인 브라우저에서 특정 폼의 제출 이벤트가 발생했을 때 서버에서만 실행되는 함수를 직접 호출하면서 데이터까지 `FormData` 형식으로 전달할 수 있게 해주는 기능입니다.

```js
export default function ReviewEditor({ movieId }: { movieId: string }) {
  async function createRevieAction(formData: FormData) {
    "use server";
    console.log("server action called");

    const content = formData.get("content");
    const author = formData.get("author");
  }

  return (
    <form action={createRevieAction}>
      <input name="content" placeholder="리뷰 내용" />
      <input name="author" placeholder="작성자" />
      <button type="submit">작성하기</button>
    </form>
  );
}
```

![서버 액션으로 form 제출 시 개발자 도구의 네트워크 탭에서 확인한 RequestHeader](/assets/blog/app-router-3/18.png)

폼을 제출하고 개발자 도구의 네트워크 탭을 확인하면 `request`가 발송되는 것을 볼 수 있습니다.

![서버 액션으로 form 제출 시 터미널에서 확인한 콘솔](/assets/blog/app-router-3/19.png)

서버 터미널에도 콘솔이 잘 출력된 걸 확인할 수 있습니다.
이를 통해 `"use server"` 지시자를 통해 서버 액션을 만든 다음에 폼을 제출하면 자동으로 서버 액션을 호출하는 `HTTPRequest`가 서버로 전송되는 것을 알 수 있습니다.

![서버 액션으로 form 제출 시 개발자 도구의 네트워크 탭에서 확인한 request2](/assets/blog/app-router-3/20.png)

추가로 서버 액션들은 컴파일 결과 자동으로 해시값을 갖는 API로써 설정이 되기 때문에 브라우저 측에서 서버 액션을 호출할 때 `RequestHeader`에 `Next-Action`이라는 이름으로 현재 호출하고자 하는 서버 액션의 해시값까지 함께 명시됩니다.

서버 액션을 만들게 되면 자동으로 API를 만들고 폼 제출 시에 호출됩니다.

![서버 액션으로 form 제출 시 개발자 도구의 네트워크 탭에서 확인한 페이로드](/assets/blog/app-router-3/21.png)

페이로드를 확인하면 request와 함께 전송된 값을 확인할 수 있습니다.
`ACTION_ID`라는 현재 호출하려는 서버 액션의 해시값이 자동으로 설정되고 폼에 입력한 데이터가 `content`와 `author`가 전달이 되는 걸 확인할 수 있습니다.
그리고 이러한 데이터들은 최종적으로 `FormData` 포맷으로 묶여서 전달됩니다.

![FormData 형식으로 제출된 데이터의 타입](/assets/blog/app-router-3/22.png)

`FormData`로 전송된 데이터를 사용할 때 데이터의 타입이 `FormDataEntryValue | null`으로 추론되고 있는데 `FormDataEntryValue`는 `string`이나 `File` 타입을 의미합니다.
지금처럼 `string` 타입을 전달받고 있고 있는 상황에는 적절하지 않습니다.

```js
const content = formData.get("content")?.toString();
const author = formData.get("author")?.toString();
```

따라서 `?.toString()`을 통해 값이 있을 경우 문자열 타입으로 변환하도록 설정해줍니다.

```js
"use server";

import { revalidateTag } from "next/cache";

export async function createReviewAction(_: any, formData: FormData) {
  const movieId = formData.get("movieId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!movieId || !content || !author) {
    return {
      status: false,
      error: "리뷰 내용과 작성자를 입력해주세요",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({ movieId, content, author }),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    revalidateTag(`review-${movieId}`);
    return {
      status: true,
      error: "",
    };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      error: `리뷰 등록에 실패했습니다 : ${error}`,
    };
  }
}
```

최종적으로 작성된 서버 액션 코드입니다.

페이지 컴포넌트에 함께 작성할 경우 파일의 내용이 길어지기 때문에 파일을 따로 분리하는 것이 좋습니다.
서버 액션을 별도의 파일로 분리하면 함수 안에 자리하고 있던 `"use server"` 지시자를 파일의 최상단에 작성할 수 있고 이 방법이 더 일반적입니다.

`revalidateTag` 메서드에 관한 내용은 https://tazoal.vercel.app/posts/app-router-2 에 자세히 설명해놨습니다.
`revalidateTag`를 통해 Next 서버측에 페이지를 다시 생성하도록 요청하여 서버 액션의 결과를 바로 화면에 나타나게 할 수 있습니다.

리턴값에 대해서는 바로 다음 섹션에서 설명드리겠습니다.

### 클라이언트 컴포넌트에서 서버 액션

```js
export default function ReviewEditor({ movieId }: { movieId: string }) {
  return (
    <form action={createRevieAction}>
      <input name="content" placeholder="리뷰 내용" />
      <input name="author" placeholder="작성자" />
      <button type="submit">작성하기</button>
    </form>
  );
}
```

사용자가 작성하기 버튼을 클릭하여 서버 액션이 실행되는 동안에 로딩 상태가 전혀 설정되어 있지 않습니다.
만약 `createRevieAction`이 2초 정도 걸린다면 2초 동안 사용자에게 어떠한 피드백이 제공되지 않기 때문에 사용자 경험이 나빠집니다.
사용자 경험을 넘어서 서버 액션이 실행되는 2초동안 작성하기 버튼을 여러번 클릭하여 폼이 중복 제출되는 문제도 전혀 방지되어 있지 않습니다.

```js
"use client";
import { createReviewAction } from "@/actions/create-review.action";
import { useActionState, useEffect } from "react";

export default function ReviewEditor({ movieId }: { movieId: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-2.5" action={formAction}>
      <input type="hidden" value={movieId} name="movieId" />
      <textarea
        name="content"
        className="resize-none w-full h-20 border-[1px] border-gray-300 p-2"
        placeholder="리뷰 내용"
        disabled={isPending}
        required
      />
      <div className="flex gap-1 justify-end">
        <input
          name="author"
          placeholder="작성자"
          className="border-[1px] border-gray-300 p-1"
          disabled={isPending}
          required
        />
        <button
          type="submit"
          className="bg-white text-black p-1 font-semibold"
          disabled={isPending}
        >
          {isPending ? "..." : "작성하기"}
        </button>
      </div>
    </form>
  );
}
```

이 문제를 해결하기 위해 `RevieEditor` 컴포넌트의 최상단에 `"use client"` 지시자로 클라이언트 컴포넌트로 전환합니다.

`useActionState`는 React 19버전부터 추가된 최신의 React Hook으로 `form` 태그의 상태를 쉽게 핸들링할 수 있도록 도와주는 여러 기능을 갖고 있습니다.
첫 번째 인수로 액션 함수를 전달하고 두 번째 인수로 폼의 상태 초깃값을 넣어줍니다.
그러면 `state`, `formAction`, `isPending`이라는 3개의 값이 배열로 반환됩니다.

`useActionState`로 부터 반환받은 `formAction`을 폼의 `action`으로 설정해주면 폼 제출 시에 `useActionState`의 인수로 전달한 `createReviewAction`이 자동으로 실행하고 액션의 상태를 `state`나 `isPending`으로 관리해줍니다.

서버 액션의 반환값은 `state`에 담기게 됩니다.

```js
return {
  status: false,
  error: "에러 내용",
};
```

서버 액션 함수에서 액션이 실패하게 되었다면 `status`를 `false`로 설정하여 실패했음을 알리고, `error`에 에러 내용을 입력하여 객체로 반환해줍니다.

```js
return {
  status: true,
  error: "",
};
```

서버 액션이 성공했다면 `status`를 `true`로 설정하고 `error`는 에러가 발생하지 않았기 때문에 빈 문자열로 입력하여 객체로 반환해줍니다.

```js
export async function createReviewAction(state: any, formData: FormData) {
  ...
}
```

`useActionState` 사용 시 전달한 서버 액션에게 자동으로 첫번째 인수로 `state`의 값이 전달되기 때문에 서버 액션에서는 첫번째 파라미터로 `formData`가 아닌 `state`를 받도록 추가해줘야 합니다.

`isPending`은 서버 액션이 현재 실행중인지 아닌지를 나타내는 값입니다.
따라서 `isPending`의 값이 `true`라면 서버 액션이 아직 종료되지 않은 것이므로 그때 로딩 UI를 표시하고 중복으로 폼이 제출되는 상황을 방지해줄 수 있습니다.

`createReviewAction`의 반환값인 `state`의 상태에 따라 에러가 발생했는지 알 수 있습니다.
따라서 `useEffect`를 통해 `state`의 값이 바꼈을 때 `state.status`의 값에 따라 사용자에게 에러가 발생했음을 알려줄 수 있습니다.
