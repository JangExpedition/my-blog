import markdownToHtml from "@/lib/markdownToHtml";

export default function PostBody({ content }: { content: string }) {
  return (
    <div className="w-full mt-8 prose">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
