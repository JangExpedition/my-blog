---
title: "Next의 도구들"
description: "Next.js를 학습하면서 얻은 지식들을 사용법 위주로 정리했습니다."
thumbnail: "/assets/blog/next-utils/cover.png"
tags: ["Next.js"]
createdAt: "2024년 10월 07일"
category: "DEV"
---

# Page Router

## 페이지 렌더링

### SSR

#### getServerSideProps

```js
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const q = context.query.q;
  const data = await fetchData(q as string);

  return {
    props: {
      data
    },
  };
};

export default function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>...</div>
  );
}
```

- 컴포넌트 바깥에 `getServerSideProps` 함수를 만들어서 내보내주면 자동으로 SSR 방식으로 처리됨.
- 반환값은 반드시 `props`라는 객체를 요소로 갖고 있는 단일 객체를 반환해야함.
- 반환 객체의 `props` 객체가 페이지의 인수로 들어가고 타입은 `InferGetServerSidePropsType<typeof getServerSideProps>`를 통해 자동으로 `getServerSideProps`의 반환 타입을 자동으로 추론해줌.
- 쿼리 스트링을 사용하고 싶으면 `getServerSideProps` 함수의 인수로 `context: GetServerSideProps`를 받아서 `context.query.쿼리 스트링 이름`으로 쓸 수 있음.
- 서버 측에서만 실행되어 브라우저에서만 쓸 수 있는 window 객체를 쓰면 오류.

### SSG

- 빌드 타입에 생성되기 때문에 최신 데이터 반영 어렵기 때문에 정적 페이지에 적합

#### getStaticProps

```js
export const getStaticProps = async () => {
  const data = await fetchData();

  return {
    props: {
      data,
    },
  };
};

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>...</div>;
}
```

- 컴포넌트 바깥에 `getStaticProps` 함수를 만들어서 내보내주면 자동으로 SSG 방식으로 처리됨.
- 반환값은 `getServerSideProps`와 동일하게 `props`라는 객체를 요소로 갖고 있는 단일 객체를 반환.
- `context`를 인수로 받아도 `context.query`를 사용하면 오류가 발생. 빌드 타임에 한 번 실행되는 함수이기 때문에 사용자의 동작에 의해 전달되는 쿼리 스트링을 알 수 없음.

#### getStaticPaths

```js
export const getStaticPaths = async () => {
  const datas = await fetchDatas();

  const paths = datas
    .map((data) => data.id.toString())
    .reduce(
      (acc: { params: { id: string } }[], cur) => [
        ...acc,
        { params: { id: cur } },
      ],
      []
    );

  return {
    paths,
    fallback: false,
  };
};
```

- 컴포넌트 바깥에 `getStaticPaths` 함수를 추가해서 내보내면 동적 경로 페이지를 SSG 방식으로 처리할 수 있음.
- `paths`와 `fallback`을 속성으로 갖고 있는 단일 객체를 반환해야함.
- `paths`는 어떤 경로들이 존재할 수 있는지 객체 배열로 반환 해줘야 하고 URL Parameter를 의미하는 params라는 값으로 설정해줘야함.
- 반환한 값은 `getStaticProps` 함수에서 `context.params`로 사용할 수 있음.
- `fallback`은 브라우저에서 `paths`로 설정하지 않은 URL로 접속 요청을 할 경우 대비책을 설정하는 역할로 `false`는 404, `blocking`은 SSR 방식으로 페이지를 가져오고 `true`는 `getStaticProps`로 부터 받은 데이터가 없는 페이지가 우선 반환되고 페이지에 필요한 데이터인 `props`만 따로 후속으로 보내줌.

```js
export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) return "로딩중입니다.";
  if (!book) return "문제가 발생했습니다. 다시 시도하세요.";

  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
    data;

  return <div>...</div>;
}
```

- `useRouter`를 사용하여 `fallback`을 기준으로 분기처리 할 수 있음.
- `InferGetStaticPropsType<typeof getStaticProps>`를 사용하면 `getStaticProps` 함수의 반환값을 자동 추론.

```js
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const data = await fetchOneData(Number(id));

  if(!data){
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
  };
};
```

- 존재하지 않는 데이터를 요청할 경우 NotFound 페이지를 보여주고 싶다면 `getStaticProps` 함수에서 `{ notFound: true }`를 반환해주는 방법도 사용할 수 있음.

### ISR

```js
export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const data = await fetchOneData(Number(id));

  if(!data){
    return {
      notFound: true,
    }
  }

  return {
    props: { data },
    revalidate: 3,
  };
};
```

- `getStaticProps` 함수의 반환값에 `revalidate` 요소에 초 단위로 유통기한을 설정하면 ISR 방식이 적용됨.

### On-Demand ISR

```js
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await res.revalidate("/");
    return res.json({ revalidate: true });
  } catch (err) {
    res.status(500).send("Revalidation Faild");
  }
}
```

- SSG 방식과 동일하게 `getStaticProps` 함수 작성 후 Revalidate 요청을 처리할 새로운 API Routes handler를 만들어야 함.
- handler 함수 내부에서 response 객체의 revalidate 메서드의 인수로 재생성할 페이지의 경로를 전달해줌.
- 요청이 성공하면 `revalidate`를 `true`로 설정하여 페이지 재생성이 완료되었음을 알려줌.

# App Router

## App Router가 자동으로 처리해주는 것들

- Page Router는 JS Bundle에 모든 컴포넌트를 보내지만 App Router는 서버 컴포넌트와 클라이언트 컴포넌트를 분류하여 클라이언트 컴포넌트만 보냄.
- 클라이언트 컴포넌트에서 서버 컴포넌트 import 시 오류 발생시키지 않고 자동으로 클라이언트 컴포넌트로 변환.
- 서버 컴포넌트에서 `getServerSideProps`, `getStaticProps`, `getStaticPaths` 함수를 사용할 필요없이 컴포넌트 내부에서 데이터 패칭을 실행할 수 있음.
- `Request Memoization`: 하나의 페이지를 요청하는 동안에 여러 컴포넌트에서 발생한 중복되는 API 요청을 방지하여 한 번만 요청하도록 함.
- 자동으로 정적, 동적 페이지를 나누고 정적 페이지에 대하여 페이지가 `풀 라우트 캐시`에 캐싱됨.
  - `no-store` 옵션으로 캐싱되지 않는 데이터 패칭을 사용하거나 컴포넌트 내부에서 쿠키, 헤더, 쿼리 스트링 등 동적 함수를 사용할 경우 동적 페이지로 분류하고 나머지는 정적 페이지.
- 페이지 이동 시 서버로 부터 받게 되는 RSC Payload 값 중에 레이아웃ㅅ에 해당하는 데이터만 보관하여 중복된 레이아웃을 다시 받아오는 걸 방지해줌.

## 서버 컴포넌트

- `"use client"` 지시자를 사용하지 않는 이상 기본적으로 서버 컴포넌트로 동작.
- 서버 컴포넌트 함수를 비동기 함수로 만들 수 있음.
- 주의 사항
  - 브라우저에서 실행되는 코드가 포함되면 안됨.
  - 클라이언트 컴포넌트에서 서버 컴포넌트를 `import`할 수 없음 (브라우저에서 `Hydration` 시에 서버 컴포넌트가 없음)
  - 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화되지 않는 `props`는 전달할 수 없음
- 어쩔 수 없이 클라이언트 컴포넌트에서 서버 컴포넌트를 `import` 해야 한다면 직접 `import` 하지 않고 `children`으로 받아서 렌더링해줄 수 있음.

## 데이터 캐시

```js
const response = await fetch("~/book", {캐싱 옵션});
```

- axios나 다른 request 라이브러리에서 사용할 수 없고 fetch 메서드를 통해서만 가능.
- `{ cache: "force-cache" }`: 요청의 결과를 무조건 캐싱하고 한 번 호출된 이후에 다시 호출되지 않음.
- `{ cache: "no-store" }`: 데이터 패칭의 결과를 저장하지 않는 옵션.
- `{ next: { revalidate: 3 } }`: 특정 시간을 주기로 캐시를 업데이트, Page Router의 ISR 방식과 유사.
- `{ next: { tags: ['태그명'] } }`: 데이터 패칭에 특정 태그를 붙여서 태그를 통해서 캐시를 초기화하거나 재검증시키도록 설정하는 옵션.

## 페이지 재검증

- `revalidatePath(페이지 경로);`: 인수로 전달한 경로의 페이지를 재검증.
- `revalidatePath(페이지 경로, "page");`: 특정 경로의 모든 동적 페이지를 재검증.
- `revalidatePath("/(with-searchbar)", "layout");`: 특정 레이아웃을 기준으로 모든 페이지들을 재검증하는 방식.
- `revalidatePath("/", "layout");`: 루트 레이아웃을 넣어줌으로써 모든 데이터를 재검증하는 방식.
- `revalidateTag(태그명);`: 태그값을 기준으로 데이터 캐시를 재검증하는 방식.

## 페이지 캐싱

### generateStaticParams

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

- 동적 경로를 갖는 동적 페이지를 빌드 타임에 어떤 URL Parameter가 존재할 수 있는지 알려줌으로써 정적 페이지로서 빌드 타임에 생성되도록 설정
- URL Parameter들을 반드시 문자열로 하여 배열에 담아 반환해야 함.
- 페이지 컴포넌트 내부에 캐싱되지 않는 데이터 패칭이 있어도 정적 페이지로 설정됨.
- Page Router의 `getStaticPaths` 함수와 동일한 역할.
- 반환값으로 설정하지 않은 페이지는 동적 페이지로서 실시간으로 만들어짐.
- `export const dynamicParams = false;` 옵션을 통해 정적으로 설정한 URL Parameter가 아닐 경우 404 페이지로 리다이렉트.

## 라우트 세그먼트 옵션

- `export const dynamic = "auto";`: 자동으로 동적, 정적 페이지로 설정해주고 기본값으로 생략 가능.
- `export const dynamic = "force-dynamic";`: 자동으로 동적 페이지로 설정.
- `export const dynamic = "force-static";`: 강제로 정적 페이지로 설정, 페이지 내부에서 사용되는 쿼리 스트링 같은 동적 함수들은 `undefined`를 반환, 데이터 패칭은 `no-store`로 설정
- `export const dynamic = "force-error";`: 강제로 정적 페이지로 설정하지만 동적 함수나 캐싱되지 않는 데이터 패칭 동의 정적 페이지로서 설정하면 안 되는 이유가 있다면 빌드 오류를 발생.

## 스트리밍

### 페이지 컴포넌트에 적용

- `loading.tsx` 파일을 생하면 해당하는 경로 아래에 있는 모든 페이지 컴포넌트 가운데 `async`가 붙은 비동기 페이지 컴포넌트들에 적용됨.
- 페이지 컴포넌트에만 적용할 수 있고 일반 컴포넌트들은 적용되지 않음.
- 브라우저에서 쿼리 스트링이 변경될 때에는 트리거링 되지 않음.

### 일반 컴포넌트에 적용

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

- 비동기 작업을 하고 있는 컴포넌트를 `Suspense` 태그로 감싸주고 대체 UI는 `fallback` 속성으로 넘겨줌.
- `key` 송성을 전달하여 쿼리 스트링이 변경될 때마다 대체 UI를 보여줄 수 있음.
- 하나의 페이지에서 여러 비동기 컴포넌트에 동시 적용할 수 있음.

## 에러 핸들링

- `error.tsx` 파일을 생성하면 해당하는 경로 아래에 페이지에서 오류 발생 시 페이지 컴포넌트 대신에 출력됨.
- `"user client"` 지시자를 추가해줌으로써 클라이언트 컴포넌트로 설정하여 클라이언트측과 서버측에서 발생하는 모든 오류를 대응하도록 설정.
- `{ error, reset }`가 인수로 전달되고 `error`는 현재 발생한 오류 정보를 담고 있고 브라우저 측에서만 화면을 다시 렌더링 하는 `reset` 함수다.

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

- `refresh` 메서드를 실행하여 서버 컴포넌트들을 다시 렌더링하고 `reset` 함수를 실행하여 에러 컴포넌트를 초기화.
- `startTransition` 메서드를 활용하여 두 메서드를 일괄처리 해줘야함.

## 서버 액션

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

- 코드의 길이가 길어서 별도의 파일로 분류하는 것이 좋음.

### useActionState

```js
const [state, formAction, isPending] = useActionState(createReviewAction, null);
```

- 폼을 사용하는 컴포넌트를 클라이언트 컴포넌트로 전환해야 함.
- 첫 번째 인수로 액션 함수, 두 번째 인수로 폼의 초깃값을 전달.
- `state`: 서버 액션의 반환값이 담김.
- `formAction`: 폼 태그의 `action`에 전달하면 폼 제출 시 인수로 전달한 서버 액션 함수 실행.
- `isPending`: 값이 true면 서버 액션 실행 중, false면 서버 액션 종료.

## 고급 라우팅 패턴

### 패럴렐 라우트

- 하나의 화면 안에 여러 페이지를 병렬로 렌더링.
- `@슬롯명` 폴더를 만들면 URL 경로에는 아무런 영향을 미치지 않고 병렬로 나타낼 페이지 컴포넌트를 생성해주면 부모 레이아웃 컴포넌트의 `props`로 자동 전달.
- 여러 슬롯을 사용할 수도 있고 슬롯 안에 새로운 페이지를 추가하는 것도 가능함.
  - 슬롯 안에 새로운 페이지를 만들고 다른 슬롯에 안 만들었을 경우 CSR 방식으로 페이지 이동 시 이전 페이지를 유지하고 새로고침하여 초기 접속 요청 시에는 404 반환.
  - 이를 방지하기 위해 렌더링할 페이지가 없을 경우 대신 렌더링할 `default.tsx` 페이지 작성.

### 인터셉팅 라우트

- `(.)/경로` 폴더를 생성, `.`은 인터셉팅할 페이지에 따라서 달라짐.
- CSR 방식으로 이동하면 가로채고 아니면 원래 페이지 컴포넌트가 렌더링됨.

## SEO

```js
export const metadata: Metadata = {
  title: "한입 북스",
  description: "한입 북스에 등록된 도서를 만나보세요",
  openGraph: {
    title: "한입 북스",
    description: "한입 북스에 등록된 도서를 만나보세요",
    images: ["/thumbnail.png"],
  },
};
```

- 페이지 컴포넌트 위에 약속된 이름인 `metadata` 변수를 선언하고 메타 데이터를 작성해서 내보내면 자동으로 적용.

```js
export function generateMetadata({ searchParams }: Props): Metadata {
  return {
    title: `${searchParams.q} : 한입북스 검색`,
    description: `${searchParams.q} 검색 결과입니다`,
    openGraph: {
      title: `${searchParams.q} 한입북스 검색`,
      description: `${searchParams.q} 검색 결과입니다`,
      images: ["/thumbnail.png"],
    },
  };
}
```

- 동적인 값을 사용해야 한다면 `generateMetadata` 함수를 사용.
- 페이지 컴포넌트와 동일한 `props`를 전달받음.
- `async-await`를 활용하여 데이터 패칭도 가능.

## 기타

### 데이터 패칭 로그

```js
logging: {
  fetches: {
    fullUrl: true,
  },
},
```

- 데이터 패칭마다 로그를 출력하고 싶다면 `next.config.mjs` 파일에 `logging` 옵션을 제공

```js
images: {
    domains: ["media.themoviedb.org"],
},
```

- `Image` 태그 사용 시 외부에서 이미지 파일을 가져다 쓴다면 `domains`에 추가해야 함.

### 기타의 기타

- 정적 페이지는 빌드 타임에 생성되기 때문에 대부분의 페이지를 정적 페이지로 작성하는 것을 권장.
- `Image` 태그를 사용하면 자동으로 이미지 최적화를 해줌(`webp` 등 경량화된 이미지 포맷 변환, 용량과 사이즈 변환, 현재 화면에 보이지 않는 이미지는 불러오지 않음 등)
- 서버 컴포넌트에서 동적 경로 파라미터를 받을 때는 `params`를 인수로 받고 쿼리 스트링 사용 시 `searchParams`.
