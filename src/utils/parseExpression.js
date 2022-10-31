const OPERATORS = [
    ['&','|'],
    ['>', '<', '='],
    ['+','-'],
    ['*', '/'],
];
const NOT = '!';
const FUNCTIONS = {
    '&': (a, b) => a && b,
    '|': (a, b) => a || b,
    '>': (a, b) => Number(a) > Number(b),
    '<': (a, b) => Number(a) < Number(b),
    '=': (a, b) => {
        const buildRegExp = (str) => {
            if (typeof str !== 'string'){
                return '';
            }
            return new RegExp(`${str.startsWith('%') ? '' : '^'}${str.replace(/\%/g,'')}${str.endsWith('%') ? '' : '$'}`);
        }

        if ((typeof a == 'string' && a.match('%')) || (typeof a == 'string' && b.match('%'))) {
            return a.match(buildRegExp(b)) || b.match(buildRegExp(a));
        }
        return a == b;
    },
    '+': (a, b) => (Number(a) + Number(b)).toFixed(2),
    '-': (a, b) => (Number(a) - Number(b)).toFixed(2),
    '*': (a, b) => (Number(a) * Number(b)).toFixed(2),
    '/': (a, b) => (Number(a) / Number(b)).toFixed(2),
}


const parseExpression = (filterString, nested = false) => {
    const filterArr = filterString.split('');
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < filterArr.length - 2; i++) {
            if (OPERATORS[j].includes(filterArr[i+1])) {
                const negated = filterArr[i] == NOT;
                const operator = filterArr[i+1];
                const leftSide = negated ? filterArr.slice(0, i) : filterArr.slice(0, i + 1);
                const rightSide = filterArr.slice(i + 2, filterArr.length);

                const left = parseExpression(leftSide.join(''), true);
                const right = parseExpression(rightSide.join(''), true);

                return (item) => { 
                    let a, b;
                    if (typeof left === 'function') {
                        a = left(item);
                    } else {
                        a = !!item[left] ? item[left]: left;
                    }

                    if (typeof right === 'function') {
                        b = right(item);
                    } else {
                        b = !!item[right] ? item[right]: right;
                    }
                    return negated ? !FUNCTIONS[operator](a, b) : FUNCTIONS[operator](a, b);
                }
            }
        }
    }

    return nested ? filterString : (item) => true;
}

export default parseExpression;