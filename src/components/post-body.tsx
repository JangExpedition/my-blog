import { getImageSize } from "@/lib/api";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const components = {
  img: (props: any) => {
    const { width, height } = getImageSize(props.src) as {
      width: number;
      height: number;
    };

    const maxWidth = 700;
    const ratio = height / width;
    const adjustedWidth = width > maxWidth ? maxWidth : width;
    const adjustedHeight = width > maxWidth ? maxWidth * ratio : height;

    return (
      <Image
        {...props}
        src={props.src}
        alt={props.alt}
        width={adjustedWidth}
        height={adjustedHeight}
      />
    );
  },
};

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full mt-8 prose dark:prose-invert">
      <MDXRemote
        source={content}
        components={components}
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
