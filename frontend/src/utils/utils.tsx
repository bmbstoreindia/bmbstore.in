
function shuffleArray<T>(input: T[]): T[] {
    const array = [...input]; // clone to avoid mutation

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

const truncateText = (text: string, limit: number) => {
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

export {
    shuffleArray,
    truncateText,
}