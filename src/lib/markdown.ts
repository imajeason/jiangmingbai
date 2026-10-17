import { marked } from 'marked';
import katex from 'katex';

// 配置 marked 语法选项
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * 将 Markdown 字符串解析为带专业 KaTeX 数学公式与排版样式的 HTML
 * 支持行内公式 $...$ 与独立块级公式 $$...$$
 */
export function parseMarkdown(content: string): string {
  if (!content) return '';

  // 1. 规范化中文引号与加粗混合（解决 CommonMark 中文标点紧随汉字时的右边界解析异常）
  let processed = content.replace(/\*\*“([^”]+)”\*\*/g, '“**$1**”');

  const mathBlocks: string[] = [];
  const mathInlines: string[] = [];

  // 2. 提取并暂存独立块级公式 $$ ... $$
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    const id = mathBlocks.length;
    mathBlocks.push(math.trim());
    return `\n\nKATEXBLOCK${id}END\n\n`;
  });

  // 3. 提取并暂存行内公式 $ ... $
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    const id = mathInlines.length;
    mathInlines.push(math.trim());
    return `KATEXINLINE${id}END`;
  });

  // 4. 解析 Markdown
  let rawHtml = marked.parse(processed, { async: false }) as string;

  // 5. 将块级公式占位符替换为真正的 KaTeX 显示级公式
  rawHtml = rawHtml.replace(/<p>KATEXBLOCK(\d+)END<\/p>|KATEXBLOCK(\d+)END/g, (_, id1, id2) => {
    const idx = Number(id1 !== undefined ? id1 : id2);
    const tex = mathBlocks[idx] || '';
    try {
      const rendered = katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
      return `<div class="math-display">${rendered}</div>`;
    } catch {
      return `<pre class="math-display"><code>${tex}</code></pre>`;
    }
  });

  // 6. 将行内公式占位符替换为真正的 KaTeX 行内公式
  rawHtml = rawHtml.replace(/KATEXINLINE(\d+)END/g, (_, id) => {
    const idx = Number(id);
    const tex = mathInlines[idx] || '';
    try {
      return katex.renderToString(tex, {
        displayMode: false,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<code>${tex}</code>`;
    }
  });


  return rawHtml;
}
