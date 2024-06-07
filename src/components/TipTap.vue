<template>
  <bubble-menu
      class="bubble-menu"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
  >
    <button @click="editor.chain().focus().toggleHeading({level: 1}).run()" :class="{ 'is-active': editor.isActive('h1') }">
      header1
    </button>
    <button @click="editor.chain().focus().toggleHeading({level: 2}).run()" :class="{ 'is-active': editor.isActive('h2') }">
      header2
    </button>
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      bold
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      italic
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      strike
    </button>
    <button @click="editor.chain().focus().toggleTate2Yoko().run()" :class="{ 'is-active': editor.isActive('tate2yoko') }">
      縦中横
    </button>
    <button @click="editor.chain().focus().toggleYoko().run()" :class="{ 'is-active': editor.isActive('yoko') }">
      横書き
    </button>
  </bubble-menu>

  <div class="horizon" translate="no">
    <editor-content :editor="editor"/>
  </div>

  <textarea readonly :rows="textarea_rows" v-model="markdown_contents" class="output_textarea" cols="128"></textarea>

</template>

<style>
pre {
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  border: 1px solid #ccc;
}

.bubble-menu{
  /* 横書きにする */
  -webkit-writing-mode: horizontal-tb; /* 実装済 */
  -moz-writing-mode: horizontal-tb; /* 実装済 */
  -ms-writing-mode: horizontal-tb; /* 実装済 */
  -writing-mode: horizontal-tb;

  -webkit-text-orientation: mixed; /* 実装済 */
  -moz-text-orientation: mixed; /* 未実装 */
  -ms-text-orientation: mixed; /* 実装済 */
}

.horizon {
  margin: 2em;
  padding: 1em;
  border: 1px solid #ccc;
  height: 42em;
  width: 44em;
  overflow: auto;

  -webkit-writing-mode: vertical-rl; /* 実装済 */
  -moz-writing-mode: vertical-rl; /* 実装済 */
  -ms-writing-mode: vertical-rl; /* 実装済 */
  -writing-mode: vertical-rl;

  -webkit-text-orientation: upright; /* 実装済 */
  -moz-text-orientation: upright; /* 未実装 */
  -ms-text-orientation: upright; /* 実装済 */
  text-orientation: upright;

  font: 1rem/1.5 gothic;

}

.horizon > div {
  padding: 0;
  height: 39em;
  width: 43em;
}

.tiptap {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 0.75em;

  > * {
    margin-top: 0.75em;
  }

  > h1 {
    margin-top: 12em;
  }

  > h2 {
    margin-top: 8em;
  }

  .tate2yoko {
    text-combine-upright: all;
    -moz-text-combine-upright: all;
    text-orientation: sideways;
  }

  .yoko {
    text-combine-upright: none;
    -moz-text-combine-upright: none;
    text-orientation: sideways;
  }
}

input[type="checkbox"] {
  margin-right: 4px;
}
</style>

<script lang="ts">
import {Editor, EditorContent, BubbleMenu} from '@tiptap/vue-3'
import {StarterKit} from '@tiptap/starter-kit'
import Focus from '@tiptap/extension-focus'
// import BubbleMenu from '@tiptap/extension-bubble-menu'
import {Markdown} from 'tiptap-markdown';

import {Tate2Yoko} from "@/extension-tate2yoko";
import {Yoko} from "@/extension-yoko";

export default {
  components: {
    EditorContent,
    BubbleMenu
  },

  data() {
    return {
      editor: null as Editor | null,
      markdown_contents: ""
    }
  },

  mounted() {
    const init_content =`
<p>こんにちは。</p>
<p>これはテスト文章です。</p>
<p>わざわざ青空文庫から持ってくるような事はしません。面倒ですもの。</p>
<p>「このように日本語は綺麗に表示されます。」</p>
<p>しかし12といった縦中横や、ABCDEFといったアルファベッドの横書きはまだまだっぽい</p>`;

    this.markdown_contents = "";
    this.editor = new Editor({
      content: init_content,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2],
          },
          strike: {
            HTMLAttributes: {
              class: 'strike',
            },
          },
        }),
        Focus.configure({
          className: 'has-focus',
          mode: 'all',
        }),
        Markdown,
        Tate2Yoko,
        Yoko
      ],
      onCreate: ({ editor}) => {
        this.markdown_contents = editor.storage.markdown.getMarkdown()
      },
      // triggered on every change
      onUpdate: ({ editor }) => {
        this.markdown_contents = editor.storage.markdown.getMarkdown()
      },
    })
  },

  computed: {
    textarea_rows () :number {
      const result = this.markdown_contents.split("\n").length + 1
      if( result <= 4){ return 4; }
      return result;
    }
  },

  beforeUnmount() {
    (this.editor) ? this.editor.destroy() : null;
  },
}
</script>
