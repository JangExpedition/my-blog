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

    const maxWidth = 720;
    const maxHeight = 420;
    const ratioWidth = height / width;
    const ratioHeight = width / height;

    let adjustedWidth;
    let adjustedHeight;

    if (height > maxHeight) {
      adjustedWidth = maxHeight * ratioHeight;
      adjustedHeight = maxHeight;
    } else if (height <= maxHeight && width > maxWidth) {
      adjustedWidth = maxWidth;
      adjustedHeight = maxWidth * ratioWidth;
    } else {
      adjustedWidth = width;
      adjustedHeight = height;
    }

    return (
      <Image
        {...props}
        src={props.src}
        alt={props.alt}
        width={adjustedWidth}
        height={adjustedHeight}
        style={{
          margin: "20px auto",
          borderRadius: "4px",
        }}
      />
    );
  },
  a: (props: any) => {
    return (
      <a
        {...props}
        style={{
          color: "#ff540f",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          wordBreak: "break-all",
        }}
      />
    );
  },
  h1: (props: any) => {
    return (
      <h1
        {...props}
        style={{
          fontSize: "60px",
          fontWeight: 700,
          marginTop: "60px",
          marginBottom: "10px",
        }}
      />
    );
  },
  h2: (props: any) => {
    return (
      <h2
        {...props}
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginTop: "60px",
          marginBottom: "10px",
        }}
      />
    );
  },
  h3: (props: any) => {
    return (
      <h3
        {...props}
        style={{
          fontSize: "22px",
          fontWeight: 700,
          marginTop: "40px",
          marginBottom: "10px",
        }}
      />
    );
  },
  p: (props: any) => {
    return (
      <p
        {...props}
        style={{
          fontSize: "17px",
          margin: "20px 0px",
        }}
      />
    );
  },
  strong: (props: any) => {
    return (
      <strong
        {...props}
        style={{ backgroundColor: "#fff7e0", color: "black" }}
      />
    );
  },
};

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full mt-8 prose dark:prose-invert p-2">
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
                  theme: "github-dark",
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
