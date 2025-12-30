import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, Heading2, Heading3, Image as ImageIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';

interface EditorProps {
    value: string;
    onChange: (html: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

const MenuBar = ({ editor, onImageUpload }: { editor: any; onImageUpload?: (file: File) => Promise<string> }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        if (onImageUpload) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async () => {
                if (input.files?.length) {
                    const file = input.files[0];
                    try {
                        const url = await onImageUpload(file);
                        editor.chain().focus().setImage({ src: url }).run();
                    } catch (error) {
                        console.error("Error uploading image:", error);
                        alert("Lỗi khi tải ảnh lên.");
                    }
                }
            };
            input.click();
        } else {
            const url = window.prompt('URL hình ảnh:');
            if (url) {
                editor.chain().focus().setImage({ src: url }).run();
            }
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('underline') ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Align Left"
            >
                <AlignLeft className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Align Center"
            >
                <AlignCenter className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Align Right"
            >
                <AlignRight className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Justify"
            >
                <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-brand-600' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
                title="Insert Image"
            >
                <ImageIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

import { ResizableImage } from './ImageExtension';
import { FacebookEmojiExtension } from './FacebookEmojiExtension';

// ... imports

export const Editor = ({ value, onChange, onImageUpload }: EditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            FacebookEmojiExtension, // Add Custom Extension for FB Emojis
            ResizableImage.configure({
                inline: false, // Important for text-align to work on the node
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'], // Add image to types
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4 max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update editor content when value prop changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all bg-white">
            <MenuBar editor={editor} onImageUpload={onImageUpload} />
            <EditorContent editor={editor} />
        </div>
    );
};
