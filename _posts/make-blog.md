---
title: "Next 블로그 제작기"
description: "Next를 활용하여 블로그를 제작한 과정을 기록했습니다."
thumbnail: "/assets/blog/make-blog/cover.png"
tags: ["Next.js"]
createdAt: "2024년 09월 13일"
category: "DEV"
---

## 개요

개발자라는 직업을 가지면서 기술 블로그를 운영하는 목표가 있었습니다.
Velog, Tistroy, Naver Blog를 모두 사용해봤지만 조금씩 아쉬운 점이 있었습니다.

블로그를 직접 만든다고 생각하면 이미지 파일을 많이 저장하게 되면 AWS를 써야 하나? Docker로 서버를 띄울까? Docker로 띄우면 서버 컴퓨터는 휴대폰 공기계로 해놔야 할까? 만약 DB가 날라가면 내가 작성한 모든 글이 날라가게 되는 거 아닌가? 등 덜컥 겁이 났습니다.

Next를 이용한 블로그 제작 사례를 구글에서 찾아봤습니다. 많은 경우 vscode에서 직접 마크다운 파일을 작성하는 방식이었습니다.
글들을 읽고 나서 '이런 방법이면 어렵지 않게 구현할 것 같은데?!'라는 자신감이 생겼습니다.
'일단 이 방법으로 사용하고 조금씩 개선해나가자'라는 생각으로 블로그를 제작하게 됐습니다.

## UI

<div style={{display: 'flex', jsutifyContent: 'space-between', aligItems: 'center'}}>
    <img src="/assets/blog/make-blog/1.png" alt="토스 기술 블로그 화면1" style={{width: '65%'}}/>
    <img src="/assets/blog/make-blog/2.png" alt="토스 기술 블로그 화면2" style={{width: '35%'}}/>
</div>
<div style={{display: 'flex', jsutifyContent: 'space-between', aligItems: 'center'}}>
    <img src="/assets/blog/make-blog/3.png" alt="내 기술 블로그 화면1" style={{width: '65%'}}/>
    <img src="/assets/blog/make-blog/4.png" alt="내 기술 블로그 화면2" style={{width: '35%'}}/>
</div>

언젠가 꼭 한 번 일해보고 싶은 토스의 기술 블로그를 참고하여 화면을 구성했습니다.

## 포스팅 기능

블로그 포스팅 기능을 제작을 위해 요구 사항을 정리했습니다.

- 마크다운을 지원할 것.
- 댓글 시스템 필요.

### 마크다운

https://github.com/vercel/next.js/tree/canary/examples/blog-starter

위의 예시 레파지토리에서 많은 도움을 받았습니다. 전체적인 프로젝트 구조는 동일하고 필요한 부분만 변경해서 사용했습니다.

![마크 다운 파일의 상단 부분](/assets/blog/make-blog/5.png)

`_posts` 폴더에 마크다운 파일 최상단에 포스팅에 대한 정보를 적고 아래에 포스팅 내용을 적습니다.

```js
export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  return { ...data, path: realSlug, content } as Post;
}
```

`getPostBySlug` 함수는 `_posts` 폴더 아래의 마크다운 파일을 읽어와 `gray-matter` 라이브러리를 사용하여 포스팅 정보(data)와 포스팅 내용(content)을 나누어 데이터를 추출합니다.

![data 출력 로그](/assets/blog/make-blog/6.png)

추출된 포스팅 정보입니다.
객체 형태로 포스팅 정보가 들어가 있는 것을 확인할 수 있습니다.

```js
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full mt-8 prose dark:prose-invert">
      <MDXRemote
        source={content}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  theme: "one-dark-pro",
                  keepBackground: true,
                  lineNumbers: true,
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
```

포스팅 내용은 `PostBody` 컴포넌트에서 `MDXRemote` 라이브러리를 통해 마크다운으로 작성된 내용을 JSX 컴포넌트로 변환해줍니다.

변환하는 과정에서 `remarkPlugins`와 `rehypePlugins`에 원하는 라이브러리를 넣어줍니다. 예를 들어 `rehypePrettyCode` 플러그인은 코드 블럭 내의 코드를 이쁘고 읽기 쉽게 렌더링 해줍니다.

![이미지 파일을 저장하는 폴더 경로](/assets/blog/make-blog/7.png)

이미지는 `./public/assets/blog` 폴더 아래에 마크다운 파일과 동일한 이름의 폴더를 만들어서 저장했습니다.
커버 사진은 `cover.png`로 넣어주고 보여지는 순서에 따라서 이름을 변경하여 넣어줬습니다.

### 댓글 시스템

댓글 기능은 `giscus`를 활용했습니다.

https://giscus.app/ko

위 링크로 접속하시면 자세한 정보와 사용법을 알려줍니다.
따라만 하면 쉽게 댓글 시스템을 적용할 수 있습니다.

## SEO
