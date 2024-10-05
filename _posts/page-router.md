---
title: "Page Router"
description: "React와 Next.js의 pageRouter의 렌더링 방식을 비교하며 어떤 점이 달라졌는지 살펴봅니다."
thumbnail: "/assets/blog/page-router/cover.png"
tags: ["Next.js"]
createdAt: "2024년 08월 25일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard

인프런의 한 입 크기로 잘라먹는 Next.js 강의를 듣고 정리한 내용입니다.

---

# 페이지 렌더링

## 기존 React 렌더링 과정(CSR)의 장단점

![React의 렌더링 과정을 표현한 그림](/assets/blog/page-router/1.png)

사용자가 접속 요청을 서버로 보내면 서버는 빈 HTML 껍데기(index.html)를 줍니다.
브라우저는 사용자에게 빈 화면을 렌더링하기 때문에 아무것도 나오지 않습니다.

서버는 HTML을 보낸 뒤 JS Bundle 파일을 브라우저에게 보냅니다.
JS Bundle 파일에는 해당 사이트에서 접근 가능한 모든 컴포넌트가 존재하는 사실상 React App입니다.
브라우저는 파일을 실행하여 컨텐츠를 렌더링하여 사용자에게 보여줍니다.

그 후에 사용자가 페이지를 이동할 경우 서버까지 가지 않고 브라우저에서 JS 파일을 실행하여 렌더링하기 때문에 초기 접속 수의 페이지 이동이 빠르다는 장점을 갖고 있습니다.

하지만 초기 요청으로 부터 사용자가 컨텐츠가 렌더링된 화면을 보기까지의 시간이 오래 걸립니다.
이 시간을 First Contentful Paint(FCP)라고 합니다.
FCP는 웹페이지의 성능을 대표할 정도로 중요한 지표입니다.

> FCP에 따른 이탈률
>
> - 3초 이상: 32% 증가
> - 5초 이상: 90% 증가
> - 6초 이상: 105% 증가
> - 10초 이상: 123% 증가

정리하면 React 앱들은 CSR을 사용하여 초기 접속 이후에 일어나는 페이지 이동은 빠르고 쾌적한 반면 초기 접속 요청이 처리되는 속도인 FCP가 늦어지게 된다는 치명적인 단점이 존재합니다.

## Next.js 사전 렌더링

![Next.js의 렌더링 과정을 표현한 그림](/assets/blog/page-router/2.png)

사용자가 접속 요청을 서버로 보내면 서버에서 JS 렌더링하여 렌더링된 HTML을 브라우저에게 줍니다.
브라우저는 렌더링된 HTML을 화면에 보여줌으로써 사용자는 렌더링된 화면을 볼 수 있습니다.
하지만 JS 파일이 있진 않기 때문에 사용자와 상호 작용을 할 수는 없습니다.

서버는 React와 동일하게 JS Bundle 파일을 후속으로 보내줍니다.
브라우저는 JS Bundle 파일을 실행하여 HTML과 연결해줍니다.
이 과정을 Hydration이라 부릅니다.
JS Bundle 파일이 연결된 뒤부터 사용자와 상호 작용할 수 있습니다.
사용자와 상호 작용할 수 있게 되는 시간까지를 Time To Interactive(TTI)라고 부릅니다.
초기 접속 이후에 페이지 이동을 하게 되면 서버까지 갈 필요없이 브라우저에서 JS 파일을 실행하여 페이지를 교체해줍니다.

정리하면 서버에서 렌더링된 HTML 파일을 보냄으로써 FCP 시간을 줄이고 초기 접속 이후에 일어나는 페이지 이동에는 CSR 방식과 동일하게 효율적으로 페이지를 이동합니다.

## Pre-fetching

Next.js는 사용자가 보고 있는 페이지에서 이동할 가능성이 있는 모든 페이지들을 미리 불러옵니다.
Next.js가 이런 기능을 제공하는 이유는 페이지를 미리 불러옴으로써 빠른 속도로 페이지 이동을 처리하기 위해서 입니다.

![Next.js의 렌더링 과정을 표현한 그림](/assets/blog/page-router/2.png)

Next.js는 앱에 작성된 모든 컴포넌트들을 자동으로 페이지별로 분리해서 미리 저장합니다.
초기 접속 요청할 때 받는 JS Bundle 파일은 React처럼 app 내의 모든 컴포넌트 코드가 전달되지 않고 현재 페이지에 해당하는 컴포넌트 코드들만 전달합니다.
왜냐하면 초기 접속 요청이 있을 때마다 모든 페이지에 해당하는 코드들을 매번 번들링해서 전달하게 되면 파일의 용량이 커져서 다운로드 속도도 느려지고 Hydration 과정도 오래 걸려 TTI가 늦어지는 문제가 발생하기 때문입니다.

하지만 현재 페이지에 해당하는 코드들만 보내주면 초기 접속 이후에 발생한 페이지 이동을 CSR 방식으로 처리할 수 없습니다.
현재 페이지에 대한 코드들만 존재하기 때문에 다른 페이지를 이동할 때 페이지 코드를 추가로 불러와야 하는 상황이 생기기 때문입니다.

![Next.js의 렌더링 과정을 표현한 그림](/assets/blog/page-router/2-1.png)

프리패칭은 페이지 이동이 느려지는 문제를 방지합니다.
초기 접속이 완료된 이후 페이지 이동이 이뤄지기 전에 프리패칭이 발생하여 현재 페이지와 연결된 모든 페이지들의 코드를 미리 불러옵니다.
따라서 추가적인 데이터를 서버에 요청할 필요없이 CSR 방식의 장점인 빠른 페이지 이동이 가능합니다.

# 데이터 패칭

## 기존 React의 데이터 패칭

```js
export default function Page() {
  const [state, setState] = useState();

  const fetchData = async () => {
    const response = await fetch("...");
    const data = await response.json();

    setState(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!state) return "Loading ...";

  return <div>...</div>;
}
```

1. `const [state, setState] = useState();` 데이터를 저장하기 위한 state를 만들어줍니다.
2. `fetchData`를 실행하여 서버로 부터 받아온 데이터로 state를 업데이트 시켜줍니다.
3. `useEffect`를 호출해서 컴포넌트가 마운트 됐을 때 한 번만 `fetchData` 함수를 호출합니다.
4. `if(!state) return "Loading ...";` 데이터 패칭이 완료되지 않았을 경우의 예외 처리를 해줍니다.

기존 React의 처리 방식은 서버로 부터 불러온 데이터가 화면에 나타나기까지 오랜 시간이 걸린다는 단점이 있습니다.
데이터 요청 자체가 컴포넌트가 마운트된 이후에 실행되기 때문입니다.

![React의 데이터 패칭을 표현한 그림](/assets/blog/page-router/3.png)

사용자는 느린 FCP를 거치고 백엔드 서버에게 데이터를 요청하기 때문에 데이터 로딩이 완료되기까지 추가적인 시간이 필요합니다.

## Next.js의 데이터 패칭

![Next.js의 데이터 패칭을 표현한 그림](/assets/blog/page-router/4.png)

Next.js는 서버에서 사전 렌더링을 진행하는 과정에서 백엔드 서버로부터 현재 페이지에 필요한 데이터를 미리 불러오도록 설정해줄 수 있습니다.
사전 렌더링 과정에서 React의 데이터 패칭보다 빠른 타이밍에 백엔드 서버로 부터 데이터를 요청하여 받은 데이터를 HTML에 렌더링해주기 때문에 사용자는 FCP가 끝나고 추가적으로 기다릴 필요가 없습니다.

하지만 사전 렌더링 과정에서 백엔드 서버로 부터 데이터를 불러올 때 데이터의 용량이 크거나 백엔드 서버의 상태가 좋지 못해 데이터를 받기까지 오래걸리면 사용자는 아무런 화면도 볼 수 없는 문제가 있습니다.
Next.js는 사전 렌더링이 오래 걸릴 것으로 예상되는 페이지의 경우 빌드 타임에 사전 렌더링을 마쳐두도록 설정할 수도 있습니다.

Next.js의 사전 렌더링 방식으로 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), 증분 정적 재생성(ISR)을 제공합니다.

### 서버 사이드 렌더링(SSR)

```js
export default async function fetchData(): Promise<Data[]> {
  let url = "...";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const getServerSideProps = async (q?: string) => {
  // 서버 사이드에서 실행되는 코드기 때문에 브라우저에서 조회 불가, 터미널에서 확인 가능
  console.log("서버사이드프롭스!!!");

  const data = await fetchData();

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

SSR 방식은 가장 기본적인 사전 렌더링 방식으로 앞서 얘기한 요청이 들어왔을 때 사전 렌더링을 진행하는 방식입니다.

컴포넌트 바깥에 약속된 이름인 `getServerSideProps`함수를 만들고 export로 내보내주면 SSR이 동작하도록 자동 설정됩니다.
`getServerSideProps`함수는 사전 렌더링할 때 컴포넌트 보다 먼저 실행돼서 필요한 데이터를 백엔드 서버로 부터 불러오는 기능을 합니다.
반환 데이터는 반드시 `props`라는 객체를 요소로 갖고 있는 하나의 객체여야만 합니다.
반환 객체의 props를 읽어와서 페이지 컴포넌트에 전달하기 때문에 프레임 워크의 사용법이므로 꼭 준수해야 합니다.

![터미널에 찍힌 getServerSideProps의 콘솔 출력 결과](/assets/blog/page-router/5.png)

`getServerSideProps`함수는 서버 측에서만 실행되기 때문에 콘솔에 출력한 내용은 브라우저의 개발자 도구가 아닌 서버 터미널에서 확인할 수 있습니다.

![getServerSideProps에서 window 객체 사용 시 나오는 오류 화면](/assets/blog/page-router/6.png)

같은 이유로 `getServerSideProps`함수 내부에서 브라우저 환경에서만 사용할 수 있는 window 객체를 사용하면 오류가 발생합니다.

페이지 컴포넌트에서도 서버에서 한 번, 브라우저에서 한 번 실행되기 때문에 아무런 조건없이 window 객체를 사용하면 오류가 발생합니다.
만약 페이지 컴포넌트에서 window 객체를 사용하고 싶으면 가장 쉬운 방법은 `useEffect`를 사용하는 방법입니다.
`useEffect`는 컴포넌트가 마운트된 이후에 실행되기 때문에 서버에서 실행되지 않습니다.

`InferGetServerSidePropsType`는 getServerSideProps의 반환값 타입을 자동으로 추론해주는 기능입니다.
컴포넌트에서 매개 변수 타입은 `InferGetServerSidePropsType<typeof getServerSideProps>`을 통해 정의할 수 있습니다.

```js
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const q = context.query.q;
  const books = await fetchData(q as string);

  return {
    props: { books },
  };
};
```

만약 쿼리 스트링을 사용해야 한다면 `context: GetServerSidePropsContext`를 매개 인자로 받아서 `context.query.쿼리 스트링 이름`과 같은 방식으로 사용할 수 있습니다.

### 정적 사이트 생성 (SSG)

![SSG로 사전 렌더링을 하는 과정을 표현한 그림](/assets/blog/page-router/7.png)

SSG 방식은 SSR의 단점을 해결하는 사전 렌더링 방식으로 빌드 타임에 실행됩니다.
사용자가 접속 요청을 보내면 빌드 타임 에 만들어둔 페이지를 지체없이 응답할 수 있습니다.
SSG 방식은 사전 렌더링 과정에서 백엔드 서버에게 데이터를 불러오는 과정이 오래 걸려도 사용자의 경험에는 아무런 영향을 미치지 않습니다.
사전 렌더링에 많은 시간이 소요되는 페이지라도 사용자의 요청에 빠른 속도로 응답하는 장점을 갖고 있습니다.

하지만 빌드 타임 이후에는 새롭게 페이지를 생성하지 않기 때문에 사용자가 언제 접속 요청을 보내더라도 매번 같은 페이지만 응답합니다.
따라서 최신 데이터 반영이 어려워 최신 데이터가 빠르게 반영되어야 하는 페이지보다는 데이터가 자주 업데이트 되지 않는 정적 페이지에 적합한 사전 렌더링 방식입니다.

```js
export const getStaticProps = async () => {
  console.log("인덱스 페이지");

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

`getStaticProps`라는 이름을 갖는 함수를 만들고 반환값은 동일하게 props를 요소로 갖고 있는 단일 객체를 반환해줍니다.
SSG 방식으로 동작하기 때문에 `getStaticProps`함수 내부에 콘솔을 출력하게 되면 빌드 시에 터미널에 한 번만 로그가 찍힙니다.

![npm run build 명령어 실행 후 터미널에 찍힌 로그](/assets/blog/page-router/8.png)

- `npm run build`명령어를 실행해보면 정적 페이지를 위한 데이터를 수집하고 `Generating static pages` 메세지가 나오면서 SSG로 동작하도록 설정한 페이지들이 생성되고 있다고 나옵니다.
- 이 과정에서 `인덱스 페이지`라는 메세지가 출력되면서 `getStaticProps`함수가 실행된 걸 확인할 수 있습니다.
- `Route (pages)` 아래쪽을 보면 SSG 방식으로 사전 렌더링한 페이지는 흰색 동그라미가 앞에 붙어있습니다.
- 다른 페이지들은 f라는 function 기호가 붙어있습니다.
- 페이지 앞에 있는 기호의 의미는 메세지 최하단에서 확인할 수 있습니다.
- 빈 동그라미는 prerendered as static content라고 나와있고 기본값으로 설정된 SSG 페이지라는 뜻입니다.
- Next.js는 `getServerSideProps`, `getStaticProps`와 같은 메서드를 사용하지 않고 아무런 설정도 안 했을 경우 정적 페이지로 빌드 타임에 사전 렌더링하도록 설정해줍니다.

```js
export const getStaticProps = async (
  context: GetStaticPropsContext
) => {
  const q = context.query.q;
  const books = await fetchData(q as string);

  return {
    props: { books },
  };
};
```

쿼리 스트링을 사용하기 위해 SSR 방식과 같은 방법으로 사용한다면 오류가 발생합니다.

![SSG에서 쿼리 스트링 사용 시 발생하는 오류](/assets/blog/page-router/9.png)

`getStaticProps`함수에 전달되는 context에는 `query`속성이 존재하지 않는 이유는 빌드 타임에 한 번 실행되는 함수이기 때문에 사용자의 동작에 의해 전달되는 쿼리 스트링을 알 수 없기 때문입니다.

![동적 경로로 수정한 폴더 구조](/assets/blog/page-router/10.png)

동적 경로를 갖는 페이지 컴포넌트에 SSG를 적용시켜 보겠습니다.

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

페이지 컴포넌트 바깥에 `getStaticPaths`라는 이름으로 함수를 만들고 export로 내보내 줍니다.
`getStaticPaths`는 `paths`와 `fallback` 속성을 갖는 객체로 반환해줘야 합니다.
`paths`는 어떤 경로들이 존재할 수 있는지를 객체 배열로 반환해줘야 하며 URL Parameter를 의미하는 params라는 값으로 설정해줍니다.
`fallback`은 만약 브라우저에서 `paths`의 값으로 설정한 URL에 해당하지 않는 경로로 접속 요청을 할 경우 대비책을 설정하는 역할로 세 가지 옵션이 존재합니다.
`false`로 설정할 경우 존재하지 않는 경로의 요청은 Not Found 페이지를 반환합니다.

![getStaticPaths 설정 후 npm build 시 생성되는 결과](/assets/blog/page-router/11.png)

`npm run build` 명령어를 실행하면 빌드된 산출물 안에서 직접 확인할 수 있습니다.
만약 브라우저가 /book/1로 요청하게 되면 지체없이 html 파일을 보여줄 수 있습니다.

```js
return {
  paths,
  fallback: "blocking",
};
```

`fallback` 옵션에 `blocking`을 넣어주면 존재하지 않는 경로의 요청에 대해서 SSR 방식으로 사전 렌더링하여 보여줍니다.
빌드 타임 이후에 생성된 페이지는 Next 서버에 자동으로 저장되기 때문에 처음 요청 시에 SSR 방식으로 동작하여 조금 느릴 수 있으나 이후의 요청에서는 새롭게 생성할 필요가 없어 기존의 SSG 페이지처럼 빠른 속도로 렌더링됩니다.
따라서 `blocking` 옵션을 주게 되면 SSR과 SSG가 결합된 형태로 동작합니다.
동적인 페이지를 구현할 때 빌드 타임에 모든 데이터를 불러오기 어려울 상황이거나 새로운 데이터가 추가되어야 하는 상황에서 사용할 수 있습니다.

하지만 `blocking` 옵션에도 단점이 있습니다.
존재하지 않았던 페이지를 SSR 방식으로 생성할 때 사전 렌더링 시간이 길어지면 브라우저에게 서버가 아무런 응답도 하지 않기 때문에 페이지 크기에 따라 오랜 시간을 기다려야 하는 문제가 있습니다.

```js
return {
  paths,
  fallback: true,
};
```

`fallback`의 세 번째 옵션인 `true`를 통해 문제를 해결할 수 있습니다.
`true`로 설정할 경우 존재하지 않는 페이지 요청을 받았을 때 `getStaticProps`의 반환값인 props가 없는 페이지를 먼저 반환합니다.
즉 `getStaticProps`로 부터 받은 데이터가 없는 페이지가 먼저 반환되고 페이지에 필요한 데이터인 props만 따로 계산하여 완료되면 브라우저에게 후속으로 보내주게 됩니다.
UI만 먼저 렌더링하고 데이터는 나중에 전달하게 되는 것입니다.
페이지 컴포넌트가 아직 `getStaticProps`의 계산 결과를 props로 받지 못한 상황을 fallback 상태라고 부릅니다.

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

useRouter를 사용하여 isFallback 요소가 true면 fallback 상태라는 뜻이기 때문에 분기 처리를 할 수 있습니다.

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

추가적으로 만약 존재하지 않는 데이터를 요청하는 페이지로 들어왔을 경우 NotFound 페이지를 보여주고 싶다면 `getStaticProps` 함수에서 데이터가 존재하지 않을 경우 notFound 요소를 true로 설정한 객체를 반환해주면 됩니다.

### 증분 정적 재생성 (ISR)

증분 정적 재생성이란 말이 어려워보이지만 단순히 SSG 방식으로 생성된 정적 페이지를 일정 시간을 주기로 다시 재생성하는 방식입니다.
앞서 SSG 사전 렌더링 방식은 빌드 타임 이후에는 다시 생성하지 않기 때문에 해당 페이지를 언제 요청하더라도 매번 같은 페이지만 보여주기 때문에 속도는 빠르지만 최신 데이터를 반영하기에는 어렵다는 단점이 있었습니다.
하지만 ISR 방식을 이용하면 SSG 방식으로 빌드 타임에 생성된 정적 페이지에 유통기한을 설정할 수 있습니다.

만약 60초로 설정했다면 60초 이전에는 빌드 타임에 생성한 페이지를, 60초 이후에 발생한 요청에 대해서는 원래 갖고 있는 페이지를 반환하고 새로운 페이지를 생성합니다.

ISR 방식은 기본적으로 이미 만들어진 페이지를 반환하기 때문에 빠른 속도로 응답한다는 SSG 방식의 장점과 주기적으로 페이지를 업데이트 해줌으로써 최신 데이터를 반영해줄 수 있는 SSR 방식의 장점까지 갖고 있는 강력한 렌더링 전략입니다.

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

SSG 방식으로 데이터를 받아오기 위한 `getStaticPRops`의 반환값에 `revalidate`라는 요소에 초 단위로 유통기한을 설정해주면 ISR 방식이 적용됩니다.

### On-Demand ISR

ISR 방식은 SSG와 SSR 방식의 장점을 모두 갖고 있기 때문에 ISR 방식을 최대한 이용하는 것이 좋습니다.
하지만 시간과 관계없이 사용자의 행동으로 업데이트된 페이지는 ISR 방식을 적용하기 어렵습니다.

게시글 페이지의 경우 게시글 수정이나 삭제 등의 사용자 행동에 따라서 즉각적으로 업데이트가 필요합니다.
만약 게시글 페이지를 ISR 방식으로 렌더링한다면 유통기한 이전에 수정한 경우 유통기한 전에 접속한 수정 전 페이지를 보게 됩니다.
추가로 60초로 설정했지만 24시간 이후에 게시글을 수정한다면 불필요하게 페이지를 재생성하는 과정이 발생합니다.

이러한 경우 SSR로 설정하게 된다면 요청마다 새롭게 렌더링하므로 응답 시간이 느려진다는 단점을 해결할 수 없고 동시에 접속자가 많이 몰리게 되면 서버 부하가 커집니다.
Next.js는 기존의 ISR 방식이 아닌 요청을 기반으로 페이지를 업데이트 시킬 수 있는 새로운 ISR 방식을 제공합니다.
요청을 받을 때마다 페이지를 다시 생성하는 방식을 On-Demand ISR 방식이라고 합니다.

이 방식을 사용하면 사용자가 게시글을 수정할 때마다 페이지 Revalidate 요청을 보내서 페이지를 다시 생성할 수 있습니다.
On-Demand ISR 방식을 이용하면 대부분의 페이지를 최신 데이터로 유지하면서 정적 페이지로서 처리할 수 있습니다.

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

기존 SSG 방식과 동일하게 `getStaticProps` 함수를 작성하고 Revalidate 요청을 처리할 새로운 API Routes handler를 만들어 줍니다.
handler 함수 내부에서 response 객체의 revalidate 메서드의 인자로 어떤 페이지를 재생성하려고 하는지 전달해줍니다.
요청이 성공하면 revalidate를 true로 설정하여 페이지 재생성이 완료되었음을 알려줍니다.

API Routes로 요청을 보내면 정상적으로 반환되는 걸 확인할 수 있습니다.

On-Demand ISR 방식은 거의 대부분의 케이스를 커버할 수 있는 사전 렌더링 방식이기 때문에 Next.js로 구축된 웹 서비스들에서 활발히 사용되고 있다고 합니다.
