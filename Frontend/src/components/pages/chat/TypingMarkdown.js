import React, { useState } from 'react';
import Typed from 'react-typed';

import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';


function TypingMarkdown({ markdownText, typeSpeed, onComplete }) {
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const handleTypingDone = () => {
    setIsTypingComplete(true);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div>
      {isTypingComplete ? (
        <ReactMarkdown
          children={markdownText}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        />
      ) : (
        <Typed
          strings={[markdownText]}
          typeSpeed={typeSpeed}
          showCursor={true}
          onComplete={handleTypingDone}
        />
      )}
    </div>
  );
}

export default TypingMarkdown;
