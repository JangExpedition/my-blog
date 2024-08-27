import ReactMarkdown from "react-markdown";
import markdownStyles from "./markdown.module.css";

const CustomCuomponents = {
  h1({ ...props }) {
    console.log(props);

    return <h1></h1>;
  },
  h2({ ...props }) {
    console.log(props);
    console.log(props);
    return <h1></h1>;
  },
  h3({ ...props }) {
    console.log(props);
    console.log(props);
    return <h1></h1>;
  },
  code({ ...props }) {
    console.log(props);
    return <h1></h1>;
  },
  img({ ...props }) {
    console.log(props);
    return <h1></h1>;
  },
};

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {/* <ReactMarkdown components={CustomCuomponents}>{content}</ReactMarkdown> */}
    </div>
  );
}
