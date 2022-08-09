
type AverageType = {
    avg: number;
    total: number;
}

let averageRecord: Record<string, AverageType> = {};

const BLACK_LIST = [
    'SQUARE-RENDER'
]

export const performanceUtils = () => {

    const a = Date.now();

    const end = (text: string = '') => {
        if(BLACK_LIST.includes(text)) return;

        const b = Date.now();
        const c = b - a;

        if(!averageRecord[text]) {
            averageRecord[text] = { avg: 0, total: 0 }
        }

        averageRecord[text].avg += c;
        averageRecord[text].total++;

        const avg = Math.trunc(averageRecord[text].avg / averageRecord[text].total);

        console.log(`${text} (current: ${c}ms) (average: ${avg}ms)`)
    }

    return {
        end
    }
}