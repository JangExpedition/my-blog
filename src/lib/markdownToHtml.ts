import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeClassNames from "rehype-class-names";

export default async function markdownToHtml(markdown: string) {
  try {
    const file = await unified()
      // Markdown을 AST로 파싱
      .use(remarkParse)
      // GFM 지원 추가
      .use(remarkGfm)
      // Markdown에서 HTML로 변환
      .use(remarkRehype, { allowDangerousHtml: true })
      // HTML AST를 다시 처리
      .use(rehypeRaw) // 원본 HTML 처리를 위한 rehype-raw 사용
      .use(rehypeSlug) // 슬러그 추가
      .use(rehypeAutolinkHeadings) // 헤딩에 자동 링크 추가
      .use(rehypeExternalLinks, {
        target: "_blank",
        rel: ["noopener", "noreferrer"],
      }) // 외부 링크 처리
      .use(rehypeHighlight) // 코드 하이라이팅
      .use(rehypeKatex) // LaTeX 수식 렌더링
      .use(rehypeClassNames, {
        h1: "custom-h1-class",
        p: "custom-p-class",
      }) // 여기에 각 태그에 클래스 추가
      .use(rehypeStringify) // HTML 문자열로 변환
      .process(markdown);

    return String(file);
  } catch (error) {
    console.error("Error processing markdown:", error);
    return "";
  }
}
