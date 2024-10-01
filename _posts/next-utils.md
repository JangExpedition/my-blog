---
title: "Next의 도구들"
description: "Next.js에서 상황 별로 사용하는 함수와 옵션을 정리했습니다."
thumbnail: "/assets/blog/next-utils/cover.png"
tags: ["Next.js"]
createdAt: "2024년 09월 26일"
category: "DEV"
---

https://www.inflearn.com/course/%ED%95%9C%EC%9E%85-%ED%81%AC%EA%B8%B0-nextjs/dashboard

인프런의 한 입 크기로 잘라먹는 Next.js 강의를 듣고 정리한 내용입니다.

---

## Query String 가져오기

### Page Router

```js
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { q } = router.query;

  return <div>{q}</div>;
}
```

Page Router에서는 쿼리 스트링을 `userRouter(next/router)`의 query 속성이 갖고 있습니다.

### App Router
