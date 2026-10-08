import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";

/**
 * The building blocks a blog post can contain. Shared by the editor (browser)
 * and the server, which turns the saved document into HTML, so both always
 * agree on what is allowed.
 *
 * StarterKit provides paragraphs, headings, bold, italic, underline, strike,
 * links, bullet and numbered lists, blockquotes, code, code blocks,
 * horizontal rules and undo/redo.
 */
export const postContentExtensions = [
  StarterKit.configure({
    // The post title is the page's only <h1>, so content starts at <h2>.
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https", "mailto", "tel"],
    },
  }),
  Image.configure({ inline: false, allowBase64: false }),
  Youtube.configure({
    nocookie: true,
    allowFullscreen: true,
    width: 640,
    height: 360,
  }),
];

/** An empty document, used for new posts. */
export const emptyPostDocument = {
  type: "doc",
  content: [{ type: "paragraph" }],
};
