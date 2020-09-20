// When there's only one statement, you can drop the {} and the return
// x => y is equivalent to x => { return y; }
const checkImage = path =>
    new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({img: img, status: 'ok'});
        img.onerror = () => resolve({img: img, status: 'error'});

        img.src = path;
    });

export const loadImages = paths => Promise.all(paths.map(checkImage))