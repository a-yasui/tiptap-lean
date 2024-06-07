import {
    Mark,
    markInputRule,
    markPasteRule,
    mergeAttributes,
} from '@tiptap/core'

export interface Tate2YokoOptions {
    /**
     * HTML attributes to add to the italic element.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        tate2yoko: {
            /**
             * Set an italic mark
             * @example editor.commands.setTate2Yoko()
             */
            setTate2Yoko: () => ReturnType,
            /**
             * Toggle an italic mark
             * @example editor.commands.toggleTate2Yoko()
             */
            toggleTate2Yoko: () => ReturnType,
            /**
             * Unset an italic mark
             * @example editor.commands.unsetTate2Yoko()
             */
            unsetTate2Yoko: () => ReturnType,
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
export const Tate2Yoko = Mark.create<Tate2YokoOptions>({
    name: 'tate2yoko',

    addOptions() {
        return {
            HTMLAttributes: { class: 'tate2yoko' },
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
            setTate2Yoko: () => ({ commands }) => {
                return commands.setMark(this.name)
            },
            toggleTate2Yoko: () => ({ commands }) => {
                return commands.toggleMark(this.name)
            },
            unsetTate2Yoko: () => ({ commands }) => {
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