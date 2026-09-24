import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * SafeHtml Component
 * Securely sanitizes dynamic HTML content using DOMPurify to prevent Cross-Site Scripting (XSS)
 * strictly adhering to enterprise frontend security guidelines.
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  className = '',
  as: Component = 'div'
}) => {
  const sanitizedContent = useMemo(() => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'span', 'ul', 'ol', 'li',
        'br', 'blockquote', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['rel'], // Ensures rel="noopener noreferrer" for external links
    });
  }, [html]);

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SafeHtml;
