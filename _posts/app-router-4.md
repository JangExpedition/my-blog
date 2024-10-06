---
title: "App Router[고급 라우팅 패턴, 이미지 최적화, SEO]"
description: "App Router의 고급 라우팅 패턴, 이미지 최적화 SEO에 대해 알아봅니다."
thumbnail: "/assets/blog/app-router-4/cover.png"
tags: ["Next.js"]
createdAt: "2024년 10월 06일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard

인프런의 한 입 크기로 잘라먹는 Next.js 강의를 듣고 정리한 내용입니다.

---

## 고급 라우팅 패턴

### Parallel Route (병렬 라우트)

패럴렐 라우트는 하나의 화면 안에 여러 페이지를 병렬로 렌더링 시켜주는 패턴입니다.

![parallel 실습 환경 폴더 구조](/assets/blog/app-router-4/1.png)

먼저 패럴렐 라우트를 적용할 경로를 생성하여 페이지와 레이아웃을 생성해줍니다.
추가로 이름앞에 `@`기호가 붙은 `Slot`을 만들어줍니다.
슬롯은 `()`를 사용한 라우트 그룹처럼 URL 경로에는 아무런 영향을 미치지 않습니다.
또한 갯수 제한이 없기 때문에 여러 슬롯을 만들 수 있습니다.

```js
import { ReactNode } from "react";

export default function Layout({
  children,
  sidebar,
}: {
  children: ReactNode,
  sidebar: ReactNode,
}) {
  return (
    <div>
      {sidebar}
      {children}
    </div>
  );
}
```

슬롯은 병렬로 렌더링될 페이지 컴포넌트를 보관하는 폴더로 슬롯 안에 보관된 페이지 컴포넌트는 부모의 레이아웃 컴포넌트의 `props`로 자동으로 전달됩니다.

![패럴렐 라우트 적용 결과](/assets/blog/app-router-4/2.png)

`npm run dev`로 프로젝트를 실행시키면 두 개의 페이지 컴포넌트가 한 페이지에 적용됨으로써 패럴렐 라우트가 잘 적용된 걸 확인할 수 있습니다.

![패럴렐 라우트 슬롯에 새로운 페이지를 추가한 폴더 구조](/assets/blog/app-router-4/3.png)

슬롯 안에 새로운 페이지를 추가하는 것도 가능합니다.
`@sidebar` 슬롯 안에 `setting` 폴더를 만들고 페이지 컴포넌트를 만들면 페이지의 경로는 `/parallel/setting`이 됩니다.

```js
export default function Layout({
  children,
  sidebar,
}: {
  children: ReactNode,
  sidebar: ReactNode,
}) {
  return (
    <div>
      <div>
        <Link href={"/parallel"}>parallel</Link>
        &nbsp;
        <Link href={"/parallel/setting"}>parallel/setting</Link>
      </div>
      <br />
      {sidebar}
      {children}
    </div>
  );
}
```

확인해보기 위해 레이아웃 컴포넌트에 `/parallel`과 `/parallel/setting` 경로로 이동하는 `Link` 태그를 만들어줍니다.

![패럴렐 라우트 슬롯에 새로운 페이지를 추가한 결과 1](/assets/blog/app-router-4/4.png)

`/parallel` 경로로 접속하면 `Link`태그만 추가되고 두 개의 페이지 컴포넌트가 병렬로 나와있는 걸 확인할 수 있습니다.

![패럴렐 라우트 슬롯에 새로운 페이지를 추가한 결과 2](/assets/blog/app-router-4/5.png)

`/parallel/setting` 경로로 이동하면 기존의 `Parallel` 페이지 컴포넌트는 그대로 유지한 채로 `@sidebar` 슬롯의 페이지만 `@sidebar/setting`로 페이지가 이동한 걸 확인할 수 있습니다.

`/parallel/setting` 경로로 이동하면 레이아웃에 전달되는 `@sidebar` 슬롯은 아래에 `setting` 폴더가 존재하기 때문에 `setting` 폴더 아래에 있는 페이지 컴포넌트가 `props`로 전달됩니다.

`children`같은 경우는 `parallel` 폴더 아래에 `setting`이라는 폴더가 존재하지 않습니다. 이러면 없는 페이지기 때문에 `404`와 같은 상황이지만 Next에서 이전의 페이지를 유지하도록 처리합니다. 따라서 이전 페이지인 `parallel` 폴더 아래에 있는 페이지 컴포넌트가 유지됩니다.

![패럴렐 라우트 슬롯에 새로운 페이지를 추가한 결과 3](/assets/blog/app-router-4/6.png)

하지만 이전의 페이지를 유지하게 되는 건 오직 `Link` 컴포넌트를 이용하여 브라우저 측에서 CSR 방식으로 페이지를 이동할 때만 한정된 이야기입니다.
그렇기 때문에 브라우저에서 새로고침을 하게 되면 404 페이지로 리다이렉션이 되는 걸 확인할 수 있습니다.
새로 고침을 해서 `/parallel/setting` 경로에 처음 접속하는 경우에는 레이아웃 컴포넌트에서 `children`의 페이지를 렌더링할 때 이전의 페이지를 모르기 때문입니다.
새로 고침을 했다는 것은 초기 접속을 의미함으로 이전 값을 찾을 수 없기 때문에 404 페이지가 반환됩니다.

![default 페이지를 추가한 폴더 구조](/assets/blog/app-router-4/7.png)

```js
export default function Default() {
  return <div>Parallel Default</div>;
}
```

이런 문제를 해결하기 위해 현재 렌더링할 페이지가 없을 때 대신 렌더링할 `default` 페이지를 만들어주면 됩니다.
`default.tsx`라는 약속된 이름의 파일을 만들어주고 내용을 작성해줍니다.

![default 페이지를 추가한 결과](/assets/blog/app-router-4/7.png)

브라우저에서 새로고침을 하면 404 페이지로 보내지지 않고 default 페이지를 렌더링하는 걸 확인할 수 있습니다.

따라서 특정 슬롯 밑에 특정 페이지를 추가하는 경우에는 404 페이지로 보내지는 문제를 방지하기 위해 default 페이지를 추가하는 것이 좋습니다.

### Intercepting Route (인터셉팅 라우트)

인터셉팅 라우트란 사용자가 동일한 페이지에 접속하게 되더라도 특정 조건을 만족하게 되면 요청을 가로채서 원래 렌더링될 페이지가 아닌 원하는 페이지를 대신 렌더링하도록 설정하는 라우팅 패턴을 의미합니다.
인터셉팅 라우트를 동작시키는 특정 조건이란 직접 설정하는 것이 아닌 초기 접속 요청이 아닐 경우에만 만족하도록 Next에서 정해뒀습니다.
즉 `Link` 컴포넌트나 `Router` 객체의 `push` 메서드를 이용하여 경로를 이동한 경우에만 인터셉팅 라우트가 동작합니다.

인터셉팅 라우트의 대표적인 예시가 인스타그램입니다.

![인터셉팅 라우트의 대표적인 예시인 인스타그램 캡쳐 1](/assets/blog/app-router-4/9.png)

인스타그램에서 특정 게시물을 클릭하면 원래 보고 있었던 피드 페이지 위로 게시글의 상세페이지를 띄워줌으로써 뒤로 갔을 때 탐색하던 피드로 돌아오도록 만들어줍니다.

![인터셉팅 라우트의 대표적인 예시인 인스타그램 캡쳐 2](/assets/blog/app-router-4/10.png)

브라우저에서 새로 고침을 하여 초기 접속 요청으로 접속하게 되면 게시글의 상세 페이지로 완전히 이동합니다.

CSR 방식으로 접속하였을 때는 인터셉팅 라우트가 동작하여 화면에 모달 형태로 페이지가 렌더링되지만 초기 접속 요청으로 페이지에 접속할 경우에는 인터셉팅 라우트가 동작하지 않기 때문에 원래 게시글의 상세 페이지가 렌더링되는 걸 확인할 수 있는 방식이 인터셉팅 라우트를 이용하면 구현할 수 있는 패턴입니다.

![인터셉팅 라우트를 적용하기 위한 폴더 구조](/assets/blog/app-router-4/11.png)

인터셉팅 라우트를 적용하기 위해서 `app` 폴더 아래에 `book/[id]`를 가로채는 폴더를 만들어주기 위해 `(.)book/[id]` 폴더를 만들어줍니다.
이때 `(.)`의 의미는 `(.)` 뒤에 나오는 `book/[id]` 경로를 가로채라는 의미입니다.
추가로 소괄호 안에 `.`이 하나만 찍히게 된다면 동일한 경로에 있는 `book/[id]`라는 페이지를 인터셉팅하겠다는 의미입니다.
만약 부모 폴더에 가로챌 경로가 있다면 `(..)`, 두 단계 위에 있는 경로면 `(..)(..)`, `app` 폴더 바로 밑에 있는 폴더를 인터셉팅하겠다는 의미로 `(...)`로 작성해야 합니다.

```js
export default function Page(props: any) {
  return <div>가로채기 성공!</div>;
}
```

인터셉팅 라우트를 확인하기 위해 페이지 컴포넌트를 작성합니다.

![인터셉팅 라우트를 적용 결과](/assets/blog/app-router-4/12.png)

프로젝트를 실행시키고 CSR 방식으로 페이지로 이동하게 되면 인터셉팅 라우트가 잘 적용된 걸 확인할 수 있습니다.

```js
import BookPage from "@/app/book/[id]/page";
import Modal from "@/components/modal";

export default function Page(props: any) {
  return (
    <Modal>
      <BookPage {...props} />
    </Modal>
  );
}
```

인터셉팅 라우트에 대해 집중적으로 다루기 위해 `Modal` 컴포넌트를 작성하고 적용하는 부분은 생략했습니다.

![인터셉팅 라우트를 적용 결과2](/assets/blog/app-router-4/13.png)

인스타그램처럼 모달창으로 띄워주기 위해 기존의 `book/[id]` 페이지 컴포넌트를 불러와서 인자를 그대로 넘겨주고 모달창에 띄워주도록 수정합니다.
다시 브라우저에서 CSR방식으로 페이지에 접속하면 모달창으로 띄워지는 것을 확인할 수 있습니다.

### 패럴렐 & 인터셉팅 라우트

인터셉팅 라우트를 통해 기존 페이지를 모달창으로 띄워주긴 했지만 모달의 뒷 배경으로 나오는 페이지는 인덱스 페이지가 아닌 인터셉팅 페이지가 나오고 있습니다.
모달창이 열려있을 때 뒷 배경에 인덱스 페이지가 병렬로 나오도록 수정하기 위해 패럴렐 라우트를 이용해야 합니다.

![인터셉팅 라우트를 적용 결과3](/assets/blog/app-router-4/14.png)

패럴렐 라우트를 적용하기 위해 `@modal` 슬롯을 만들어주고 기존의 `(.)book/[id]` 폴더를 슬롯 안으로 옮겨줍니다.
`(.)book/[id]` 폴더에 있는 페이지 컴포넌트는 `@modal` 슬롯 아래에 있기 때문에 부모 레이아웃인 루트 레이아웃의 `props`로 전달됩니다.

```js
export default function Default() {
  return null;
}
```

추가로 `@modal` 슬롯에 `/` 경로에 대한 페이지가 존재하지 않기 때문에 404 페이지로 리다이렉션을 막기 위해서 `default.tsx`를 만들어 줍니다.

```js
export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode,
  modal: ReactNode,
}>) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header>
            <Link href={"/"}>📚 ONEBITE BOOKS</Link>
          </header>
          <main>{children}</main>
          <Footer />
        </div>
        {modal}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
```

루트 레이아웃을 위와 같이 작성하고 사용자가 `/` 경로로 접속하게 되면 `children`은 인덱스 페이지 컴포넌트가 들어오고 `@modal` 슬롯 안에 인덱스 페이지에 대한 컴포넌트가 없기 때문에 `default` 컴포넌트가 나타나는데 `null`을 반환하므로 `children`의 페이지 컴포넌트만 렌더링됩니다.

![인터셉팅 라우트를 적용 결과4](/assets/blog/app-router-4/15.png)

사용자가 `book/[id]` 페이지로 접속하면 원래는 `children`에 `book/[id]`의 페이지 컴포넌트가 들어왔겠지만 인터셉팅이 동작하여 경로를 가로챘기 때문에 기존의 인덱스 페이지를 유지하게 되고 `modal`이라는 값으로 인터셉팅된 `(.)book/[id]`의 페이지 컴포넌트가 들어와서 인덱스 페이지와 모달로서 `(.)book/[id]` 페이지가 함께 병렬로 렌더링됩니다.

## 이미지 최적화

웹 페이지에서 평균적으로 가장 많은 용량을 차지하는 요소는 이미지입니다.
그렇기 때문에 이미지를 최적화하는 일은 중요한 일이 되었습니다.
그래서 webp, AVIF 등의 차세대 형식으로 변환하기, 디바이스 사이즈에 맞는 이미지 불러오기, 레이지 로딩 적용하기, 블러 이미지 활용하기 등 많은 이미지 최적화 기법들이 생겨났습니다.
원래라면 이러한 이미지 최적화 기법들을 공부하여 적용시켜야 했지만 Next에서는 `Image`라는 내장 컴포넌트 하나만 사용하면 대부분의 이미지 최적화 기법을 제공합니다.

![이미지 최적화 전 상황1](/assets/blog/app-router-4/16.png)

기존 `img` 태그를 사용하여 네트워크 탭을 확인하면 이미지의 형식이 `jpeg`로 불러오고 있습니다. `jpeg` 형식보단 `webp`나 `AVIF` 등의 경량화된 이미지 포맷을 많이 활용하는 추세입니다.
추가로 현재 화면에 나오지 않는 렌더링될 필요가 없는 이미지까지 페이지에 포함만 되고 있다면 모두 불러오고 있습니다.

![이미지 최적화 전 상황1](/assets/blog/app-router-4/17.png)

또한 불러온 이미지의 사이즈가 실제 화면에 나타날 사이즈보다 큽니다.
네트워크 탭의 하단을 보면 실제로 보여지는 `80x105` 픽셀보다 `458x583` 픽셀이라는 거대한 사이즈로 불러오는 걸 확인할 수 있습니다.

```js
<Image
  src={coverImgUrl}
  width={80}
  height={105}
  alt={`도서 ${title}의 표지 이미지`}
/>
```

`Image` 컴포넌트를 활용하여 코드를 작성하고 다시 한 번 브라우저를 확인해봅니다.

![이미지 최적화 후 상황1](/assets/blog/app-router-4/17-1.png)

이미지의 형식이 `webp`로 변환되어 경량화된 형태로 이미지를 불러오고 작은 용량으로 불러와지는 것을 확인할 수 있습니다.
추가로 현재 화면에 보이지 않는 이미지는 뒤늦게 불러오는 기능까지 더해져 스크롤을 아래로 내리면 그제서야 이미지를 추가로 불러옵니다.

## 검색 엔진 최적화 (SEO)

검색 엔진 최적화란 구글이나 네이버 등의 검색 엔진을 가지고 있는 포털 사이트들에서 제작한 서비스의 페이지 정보를 수집해갈 수 있도록 설정하여 결과적으로 서비스가 검색 결과에 잘 노출이 되도록 설정하는 기술입니다.

검색 엔진을 설정하는 방법에는 Sitemap 설정, RSS 발행, 시멘틱 태그 설정, 메타 데이터 설정 등 여러 방법이 존재합니다.

여기서는 페이지별 메타 데이터를 적용하는 방법을 적용하려 합니다.

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

페이지의 메타 데이터를 설정하기 위해서는 페이지 컴포넌트 위에 `metadata`라는 약속된 이름의 변수를 선언하여 `export`로 내보내주면 `metadata`에 설정된 값이 자동으로 페이지의 메타 데이터로 설정됩니다.

![메타 데이터가 설정된 결과](/assets/blog/app-router-4/18.png)

브라우저를 확인하면 `meatadata` 변수에 설정한 값들이 잘 설정된 것을 확인할 수 있습니다.
또한 `twitter`만을 위한 메타 태그들도 Next에서 자동으로 설정해줍니다.

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

만약 동적인 값을 통해서 메타 데이터를 설정해야 한다면 `generateMeatadata`라는 약속된 이름의 함수를 선언하고 메타 데이터를 반환하도록 하여 `export`로 내보내주면 됩니다.
`generateMetadata` 함수는 현재 페이지에 필요한 메타 데이터를 동적으로 생성해주는 함수입니다.
그렇기 때문에 매개 변수로 페이지 컴포넌트에게 전달되는 `props`를 똑같이 전달받게 됩니다.

![메타 데이터가 설정된 결과2](/assets/blog/app-router-4/19.png)

검색창에 `자바`라고 검색하고 메타 태그를 확인하면 잘 설정된 걸 확인할 수 있습니다.

```js
export async function generateMetadata({
  params,
}: {
  params: {
    id: string,
  },
}): Promise<Metadata | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${params.id}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    throw Error(response.statusText);
  }

  const book: BookData = await response.json();
  return {
    title: `${book.title} - 한입북스`,
    description: `${book.description}`,
    openGraph: {
      title: `${book.title} - 한입북스`,
      description: `${book.description}`,
      images: [book.coverImgUrl],
    },
  };
}
```

`generateMetadata` 함수에서 `async-await`를 활용하여 데이터 패칭을 할 수 있습니다.
대신에 반환 타입을 `Metadata`가 아니라 `Promise<Metadata | null>`로 설정해줘야 합니다.

![메타 데이터가 설정된 결과3](/assets/blog/app-router-4/20.png)

다시 한 번 브라우저에서 확인하면 메타 데이터가 잘 설정된 걸 확인할 수 있습니다.
하지만 인터셉팅 라우트 환경에서는 메타 데이터가 적용되지 않습니다.
메타 데이터들은 클라이언트 사이드에서 페이지를 이동할 때 필요한 것이 아니라 페이지의 주소를 사람들과 공유하거나 초기 접속을 할 때 중요하게 사용되는 태그기 때문에 인터셉팅 라우트 환경에서는 중요하지 않기 때문에 이 부분은 감안하셔도 괜찮다고 합니다.
