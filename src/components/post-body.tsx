import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolink from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full mt-8 prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeHighlight,
          rehypeSlug,
          rehypeAutolink,
          rehypeRaw,
          rehypeKatex,
          rehypeExternalLinks,
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
