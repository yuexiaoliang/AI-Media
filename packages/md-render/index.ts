import MarkdownIt from 'markdown-it';
import mdHighlight from 'markdown-it-highlightjs';
import juice from 'juice';
import { decode } from 'html-entities';

import theme from './styles/theme.css';
import hljs from './styles/hljs.css';

export interface MetaYamlOptions {
  cb?(yamlJSON: Record<string, any>, yamlRaw: string): void;
}

export const mdToHtml = (val: string, title?: string) => {
  const md = new MarkdownIt({ html: true });

  // 代码高亮
  md.use(mdHighlight);

  // 删除匹配的 H1 标签
  md.use(removeMatchingH1Plugin, { title });

  const result = md.render(val);

  return juice.inlineContent(decode(result), theme + hljs);
};

function removeMatchingH1Plugin(md: MarkdownIt, { title }: { title?: string }) {
  if (!title) return;

  md.core.ruler.push('remove_matching_h1', function (state) {
    let tokens = state.tokens;
    let targetIndex = -1;

    // 遍历tokens查找第一个H1标签
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open' && tokens[i].tag === 'h1') {
        // 查找到H1标签后，检查其后的inline token内容是否与title匹配
        if (i + 1 < tokens.length && tokens[i + 1].type === 'inline') {
          let inlineContent = tokens[i + 1].content;
          if (inlineContent === title) {
            targetIndex = i;
            break;
          }
        }
      }
    }

    // 如果找到匹配的H1标签，删除它和相关的tokens
    if (targetIndex !== -1) {
      // 删除heading_open, inline 和 heading_close tokens
      tokens.splice(targetIndex, 3);
    }
  });
}
