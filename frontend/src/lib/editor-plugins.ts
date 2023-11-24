/*
        EDITOR SECTION
    */
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight-ssr";
import math from "@bytemd/plugin-math-ssr";
import gemoji from "@bytemd/plugin-gemoji";
import breaks from "@bytemd/plugin-breaks";
import mermaid from "@bytemd/plugin-mermaid";
import frontmatter from "@bytemd/plugin-frontmatter";
import "bytemd/dist/index.css"; // styles for bytemd editor
import "github-markdown-css/github-markdown-light.css"; // styles for markdown preview
import "highlight.js/styles/atom-one-dark.css"; // styles for code highlighting
import "katex/dist/katex.css"; // styles for math rendering

// strip prefixes from object keys
function stripPrefixes(obj: Record<string, any>) {
  return Object.entries(obj).reduce((p, [key, value]) => {
    p[key.split("/").slice(-1)[0].replace(".json", "")] = value;
    // console.log(p)
    return p;
  }, {} as Record<string, any>);
}

let localeKey = "en";
// gfm locals for bytemd
const gfmLocales = stripPrefixes(
  import.meta.glob("/node_modules/@bytemd/plugin-gfm/locales/*.json", {
    eager: true,
  })
);

// math locals for bytemd
const mathLocales = stripPrefixes(
  import.meta.glob("/node_modules/@bytemd/plugin-math/locales/*.json", {
    eager: true,
  })
);

const plugins = [
  gfm({
    locale: gfmLocales[localeKey],
  }),
  highlight(),
  math({
    locale: mathLocales[localeKey],
    katexOptions: { output: "html" }, // https://github.com/KaTeX/KaTeX/issues/2796
  }),
  gemoji(),
  breaks(),
  frontmatter(),
  mermaid(),
];

export { plugins };
