import { load } from 'js-yaml';
import juice from 'juice';
import MarkdownIt from 'markdown-it';
import filenamify from 'filenamify';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';
import mdHighlight from 'markdown-it-highlightjs';
import { decode } from 'html-entities';
import theme from './styles/theme.css';
import hljs from './styles/hljs.css';

export interface MetaYamlOptions {
  cb?(yamlJSON: Record<string, any>, yamlRaw: string): void;
}

export const mdToWeixin = <T>(val: string) => {
  const md = new MarkdownIt({ html: true });

  let _meta: T;

  // 解析 yaml meta
  md.use(metaYaml, {
    cb(json) {
      json.title = filenamify(json.title, { replacement: ' ' });
      _meta = json as T;
    }
  } as MetaYamlOptions);

  // 代码高亮
  md.use(mdHighlight);

  // 删除匹配的 H1 标签
  md.use(removeMatchingH1Plugin);

  const result = md.render(val);

  const html = juice.inlineContent(decode(result), theme + hljs);

  return [{ meta: _meta!, html }, md] as [{ meta: T; html: string }, MarkdownIt];
};

function removeMatchingH1Plugin(md: MarkdownIt) {
  md.core.ruler.push('remove_matching_h1', function (state) {
    // @ts-ignore
    const title = md?.metaJson?.title;
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

export function metaYaml(md: MarkdownIt, options: MetaYamlOptions) {
  md.block.ruler.before('code', 'yaml', createYamlRuleBlock(options));

  function createYamlRuleBlock(options: MetaYamlOptions = {}) {
    const YAML_BLOCK_REG = /^---$/;

    return function yamlRuleBlock(state: StateBlock, start: number, end: number, silent: boolean) {
      if (start !== 0 || state.blkIndent !== 0 || state.tShift[start] < 0 || !YAML_BLOCK_REG.test(getStr(state, start))) {
        return false;
      }
      let yamlEnd = -1;
      let next = start;
      while (next < end) {
        next++;
        if (YAML_BLOCK_REG.test(getStr(state, next))) {
          yamlEnd = next;
          break;
        }
      }
      if (yamlEnd === -1) {
        return false;
      }
      const content = state.src.slice(state.bMarks[start + 1], state.bMarks[yamlEnd]);
      const meta = (load(content, { json: true }) as Record<string, unknown>) || {};
      // @ts-ignore
      md.metaJson = meta;

      options.cb?.(meta, content);
      state.line = yamlEnd + 1;
      return true;
    };
  }

  function getStr(state: any, line: number) {
    const pos = state.bMarks[line];
    const max = state.eMarks[line];
    return state.src.slice(pos, max);
  }
}
