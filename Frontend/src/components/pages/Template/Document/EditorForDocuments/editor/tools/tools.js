// tools.js
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";


const CustomHeader = ({ data }) => {
  const { text, level } = data;
  const HeadingTag = `h${Math.min(Math.max(1, level), 6)}`;

  return (
    <HeadingTag className="font-bold text-4xl">{text}</HeadingTag>
  );
};

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  paragraph: Paragraph,
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  // image: Image,
  raw: Raw,
  // header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      levels: [1, 2, 3, 4], // Add more levels if needed
      defaultLevel: 2, // Set the default level for headings
    },
    render: ({ data }) => <CustomHeader data={data} />, // Render using your custom component
  },
  // image: {
  //   class: Image,
  //   config: {
  //     uploader: {
  //       uploadByFile: async (file) => {
  //         const formData = new FormData();
  //         formData.append('image', file);

  //         try {
  //           const response = await fetch('http://localhost:8000/v1/template/upload-image/', {
  //             method: 'POST',
  //             body: formData,
  //           });

  //           const data = await response.json();
  //           return { success: 1, file: { url: "http://localhost:8000" + data.image } };
  //         } catch (error) {
  //           console.error('Image upload failed:', error);
  //           return { success: 0, file: { url: '' } };
  //         }
  //       },
  //     },
  //   },
  // },
  // simpleImage: SimpleImage
};
