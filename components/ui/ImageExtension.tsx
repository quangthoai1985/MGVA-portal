import { mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const ImageNodeView = (props: any) => {
    const { node, updateAttributes, selected, editor } = props;
    const [width, setWidth] = useState(node.attrs.width);
    const [caption, setCaption] = useState(node.attrs.caption || '');
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const resizeStartRef = useRef<{ x: number, width: number } | null>(null);

    useEffect(() => {
        setWidth(node.attrs.width);
        setCaption(node.attrs.caption || '');
    }, [node.attrs]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (imageRef.current) {
            setIsResizing(true);
            resizeStartRef.current = {
                x: e.clientX,
                width: imageRef.current.offsetWidth,
            };

            const handleMouseMove = (event: MouseEvent) => {
                if (resizeStartRef.current) {
                    const diff = event.clientX - resizeStartRef.current.x;
                    const newWidth = Math.max(100, resizeStartRef.current.width + diff);
                    setWidth(`${newWidth}px`);
                }
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                if (resizeStartRef.current && imageRef.current) {
                    updateAttributes({ width: `${imageRef.current.offsetWidth}px` });
                }
                resizeStartRef.current = null;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    }, [updateAttributes]);

    const setAlign = (align: string) => {
        editor.chain().focus().setTextAlign(align).run();
    };

    const setWidthPercentage = (pct: string) => {
        updateAttributes({ width: pct });
        setWidth(pct);
    };

    return (
        <NodeViewWrapper className="relative inline-block leading-none transition-all group my-4" style={{ width: width, maxWidth: '100%' }}>
            <div className={`relative ${selected ? 'ring-2 ring-brand-500' : ''} rounded-lg`}>
                <img
                    ref={imageRef}
                    src={node.attrs.src}
                    alt={node.attrs.alt || caption}
                    className="block max-w-full h-auto rounded-lg"
                    style={{ width: '100%' }}
                />

                {/* Floating Toolbar - Visible when selected */}
                {selected && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-lg px-2 py-1.5 flex items-center gap-1 z-50 border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                        <button type="button" onClick={() => setAlign('left')} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-brand-600" title="Canh trái"><AlignLeft className="w-4 h-4" /></button>
                        <button type="button" onClick={() => setAlign('center')} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-brand-600" title="Canh giữa"><AlignCenter className="w-4 h-4" /></button>
                        <button type="button" onClick={() => setAlign('right')} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 hover:text-brand-600" title="Canh phải"><AlignRight className="w-4 h-4" /></button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button type="button" onClick={() => setWidthPercentage('25%')} className="text-xs font-bold text-gray-500 hover:text-brand-600 px-1.5 py-1 hover:bg-gray-100 rounded">25%</button>
                        <button type="button" onClick={() => setWidthPercentage('50%')} className="text-xs font-bold text-gray-500 hover:text-brand-600 px-1.5 py-1 hover:bg-gray-100 rounded">50%</button>
                        <button type="button" onClick={() => setWidthPercentage('75%')} className="text-xs font-bold text-gray-500 hover:text-brand-600 px-1.5 py-1 hover:bg-gray-100 rounded">75%</button>
                        <button type="button" onClick={() => setWidthPercentage('100%')} className="text-xs font-bold text-gray-500 hover:text-brand-600 px-1.5 py-1 hover:bg-gray-100 rounded">100%</button>
                    </div>
                )}

                {/* Resize Handle */}
                {(selected || isResizing) && (
                    <div
                        className="absolute bottom-2 right-2 w-4 h-4 bg-brand-500 border-2 border-white rounded-full cursor-ew-resize shadow-md z-10 hover:scale-110 transition-transform"
                        onMouseDown={handleMouseDown}
                    />
                )}
            </div>

            {/* Caption Input */}
            <input
                type="text"
                placeholder="Viết chú thích..."
                value={caption}
                onChange={(e) => {
                    setCaption(e.target.value);
                    updateAttributes({ caption: e.target.value, alt: e.target.value });
                }}
                className="w-full text-center text-sm text-gray-500 italic mt-2 bg-transparent border-none focus:ring-0 placeholder-gray-300 focus:placeholder-gray-400"
            />
        </NodeViewWrapper>
    );
};

export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: (attributes) => ({
                    width: attributes.width,
                }),
                parseHTML: (element) => element.getAttribute('width'),
            },
            caption: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-caption'),
            }
        };
    },

    renderHTML({ HTMLAttributes }) {
        const { caption, ...attributes } = HTMLAttributes;

        // Render as a figure-like structure using a div wrapper
        // We use a div because Tiptap's Image is a void node, but we want to output the caption text next to it.
        // However, since this is a void node, we can't really put content *inside* it in the model.
        // But renderHTML controls the output string.

        // Trick: We render the image, and if there is a caption, we render it as a separate element in the string?
        // No, renderHTML must return a single root element representation.

        // Let's stick to standard img tag but add data-caption.
        // The caption input in the editor is mainly for the user's context and setting the ALT text.
        // If we want to display it on the frontend, we would need to parse it.
        // BUT, to make it "work" as requested ("Write description"), updating the ALT text is the most standard way without breaking HTML structure.
        // I will also add `title` attribute which often shows as tooltip.

        return ['img', mergeAttributes(attributes, { 'data-caption': caption, title: caption, alt: caption })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView);
    },
});
