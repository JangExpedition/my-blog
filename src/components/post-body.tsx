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
