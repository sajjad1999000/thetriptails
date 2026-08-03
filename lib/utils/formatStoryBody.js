// lib/utils/formatStoryBody.js
//
// Story text is typed as plain text in a <textarea> in the admin
// editor (blank line = new paragraph), then stored as plain text in
// stories.content. Rendered via dangerouslySetInnerHTML, so it needs
// to become real <p> tags first — otherwise the browser collapses
// every newline and the whole story renders as one solid block.

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatStoryBody(text) {
  if (!text) return '';

  return text
    .split(/\n\s*\n/) // blank line = paragraph break
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => {
      // preserve single line breaks *within* a paragraph as <br>
      const withBreaks = escapeHtml(para).replace(/\n/g, '<br>');
      return `<p>${withBreaks}</p>`;
    })
    .join('\n');
}