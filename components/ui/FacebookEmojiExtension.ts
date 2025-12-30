import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const FacebookEmojiExtension = Extension.create({
    name: 'facebookEmoji',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('facebookEmoji'),
                props: {
                    transformPastedHTML(html: string) {
                        // Regex to match Facebook emoji images
                        // Typical FB emoji URL: https://static.xx.fbcdn.net/images/emoji.php/...

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const images = doc.querySelectorAll('img');
                        let modified = false;

                        images.forEach((img) => {
                            const src = img.getAttribute('src') || '';
                            const alt = img.getAttribute('alt');

                            // Facebook/Messenger emoji detection
                            // 1. Check for known FB domains/paths
                            const isFbImage = src.includes('emoji.php') ||
                                src.includes('fbcdn.net/images/emoji') ||
                                src.includes('facebook.com/images/emoji') ||
                                img.className.includes('emoji'); // FB sometimes adds class="emoji"

                            // 2. Check if alt text is a valid emoji (single or sequence)
                            // Regex for matching emojis (including composite ones)
                            const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;

                            const isAltEmoji = alt && emojiRegex.test(alt);

                            // Replace if it looks like a FB emoji OR if the alt text is strictly just an emoji
                            if (alt && (isFbImage || isAltEmoji)) {
                                const textNode = doc.createTextNode(alt);
                                img.parentNode?.replaceChild(textNode, img);
                                modified = true;
                            }
                        });

                        return modified ? doc.body.innerHTML : html;
                    },
                },
            }),
        ];
    },

    addGlobalAttributes() {
        return [];
    },

    // Transform pasted HTML to replace Facebook emoji images with their alt text (unicode char)
    // We look for img tags that look like they are from Facebook or Messenger
    // A simple heuristic is checking for 'emoji.php' or specific classes, but mostly relying on the fact they are images with a single unicode-like alt char often.
    // Let's try to match <img> tags and checking their src or just replacing any img that has an alt that looks like an emoji if we want to be broad, 
    // but let's be specific to FB context if possible.
    // Actually, often these images come with style attributes.

    // Less risky approach: Parse HTML, find images with specific src patterns, replace with alt.

    // Double check: if it's a huge image that just happens to have an emoji alt, we might not want to replace it.
    // But usually, user-uploaded images won't have a single Emoji as ALT text unless manually set.
    // And FB pasted emojis definitely do.
});
