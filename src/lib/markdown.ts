import { marked } from 'marked';

// 配置 marked 语法选项
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * 将 Markdown 字符串解析为带美化排版样式的 HTML
 * 对基础中小学公式符号进行美化（如 $2 \times 5$ -> 2 × 5）
 */
export function parseMarkdown(content: string): string {
  if (!content) return '';

  // 1. 规范化中文引号与加粗混合（解决 CommonMark 中文标点紧随汉字时的右边界解析异常）
  let processed = content.replace(/\*\*“([^”]+)”\*\*/g, '“**$1**”');

  // 2. 预处理行内简单数学公式 $...$
  processed = processed.replace(/\$([^\$\n]+)\$/g, (_, math) => {

    const formatted = math
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\approx/g, '≈')
      .replace(/\\pi/g, 'π')
      .trim();
    return `<code class="math-inline">${formatted}</code>`;
  });

  const rawHtml = marked.parse(processed, { async: false });
  return typeof rawHtml === 'string' ? rawHtml : '';
}
