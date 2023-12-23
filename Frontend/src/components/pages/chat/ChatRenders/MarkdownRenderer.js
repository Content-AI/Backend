import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { markdownTable } from 'markdown-table'; // Use correct export
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './table-style.css';

const renderers = {
  code: ({ language, value }) => {
    return (
      <SyntaxHighlighter language={language} style={duotoneDark}>
        {value}
      </SyntaxHighlighter>
    );
  },
};

const MarkdownRenderer = ({ content }) => {
  // Convert Markdown tables to HTML tables
  content = content.replace(/```markdown-table\n([\s\S]*?)\n```/gm, (_, tableContent) =>
    markdownTable(tableContent)
  );

  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]} renderers={renderers}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
