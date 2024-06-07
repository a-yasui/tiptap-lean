import {
    Mark,
    markInputRule,
    markPasteRule,
    mergeAttributes,
} from '@tiptap/core'

export interface YokoOptions {
    /**
     * HTML attributes to add to the italic element.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        yoko: {
            /**
             * Set an italic mark
             * @example editor.commands.setYoko()
             */
            setYoko: () => ReturnType,
            /**
             * Toggle an italic mark
             * @example editor.commands.toggleYoko()
             */
            toggleYoko: () => ReturnType,
            /**
             * Unset an italic mark
             * @example editor.commands.unsetYoko()
             */
            unsetYoko: () => ReturnType,
        }
    }
}

// テキトーな正規表現
const inputRegex = /^$/ // 何もマッチしない
const pasteRegex = /^$/ // 何もマッチしない

/**
 * This extension allows you to create italic text.
 * @see https://www.tiptap.dev/api/marks/italic
 */
export const Yoko = Mark.create<YokoOptions>({
    name: 'yoko',

    addOptions() {
        return {
            HTMLAttributes: { class: 'yoko' },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span',
                style: ''
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    },

    addCommands() {
        return {
            setYoko: () => ({ commands }) => {
                return commands.setMark(this.name)
            },
            toggleYoko: () => ({ commands }) => {
                return commands.toggleMark(this.name)
            },
            unsetYoko: () => ({ commands }) => {
                return commands.unsetMark(this.name)
            },
        }
    },

    addInputRules() {
        return [
            markInputRule({
                find: inputRegex,
                type: this.type,
            }),
        ]
    },

    addPasteRules() {
        return [
            markPasteRule({
                find: pasteRegex,
                type: this.type,
            }),
        ]
    },
})