import ReactMarkdown from "react-markdown";
import Image from "next/image";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CustomComponents = {
  h1({ ...props }) {
    return (
      <h1 className="text-4xl mt-16 mb-4 leading-snug">{props.children}</h1>
    );
  },
  h2({ ...props }) {
    return (
      <h2 className="text-3xl mt-12 mb-4 leading-snug">{props.children}</h2>
    );
  },
  h3({ ...props }) {
    return (
      <h3 className="text-2xl mt-8 mb-4 leading-snug">{props.children}</h3>
    );
  },
  code({ ...props }) {
    return (
      <SyntaxHighlighter
        style={dark}
        PreTag="div"
        {...props}
        className="my-4 rounded-lg"
      >
        {String(props.children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  },
  img({ ...props }) {
    const { src, alt } = props.node.properties;
    if (!src) return;
    return (
      <Image
        src={src}
        alt={alt}
        width={900}
        height={100}
        className="my-4 w-full rounded-xl"
      />
    );
  },
  ul({ ...props }) {
    return (
      <ul className="list-disc list-inside my-4 ml-4">{props.children}</ul>
    );
  },
  ol({ ...props }) {
    return (
      <ol className="list-decimal list-inside my-4 ml-4">{props.children}</ol>
    );
  },
  li({ ...props }) {
    return <li className="my-2">{props.children}</li>;
  },
};

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full mt-[54px]">
      <ReactMarkdown components={CustomComponents}>{content}</ReactMarkdown>
    </div>
  );
}
