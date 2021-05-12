/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const getSmallPostsInfo = (elements: Element[]) => {
    const posts = [];

    for (const el of elements) {
        const date = (el.querySelector('.post_link>.rel_date') as HTMLElement)?.innerText;
        const postId = el.getAttribute('data-post-id');
        if (date && postId) posts.push({ postId, date });
    }
    return posts;
};
