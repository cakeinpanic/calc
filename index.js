const SIGNS_PRIORITY = ['^', '', '*', '/', '', '-', '+', '', '(', ')'];
const SPLIT_STRING_RG = new RegExp(/([\d\.]+)|[^\d]/, 'g');

class Utils {
    static prepareString(str) {
        str = str.replace(/\s/g, '');

        if (/([\+\-\*\/]){2}/.test(str) || /([^\(^\)^\d^\+^\-^\/^\*^\^\.\,\ ])/.test(str)) {
            throw Error('invalid input');
        }
        return str.replace(',', '.')
            .replace(/(\(|^)([\-\+])/g, '$10$2')
            .replace(/^([\*\/])/, '')
            .replace(/([\+\-\*\/])$/, '');
    }

    static splitString(str) {
        str = this.prepareString(str);
        var letters = [];
        var t = SPLIT_STRING_RG.exec(str);

        while (t) {
            letters.push(t[0]);
            t = SPLIT_STRING_RG.exec(str);
        }

        return letters;
    }
}

function polishCalc(str) {
    try {
        var letters = Utils.splitString(str);
    } catch (e) {
        return null;
    }

    var stack = [letters.shift()];
    var result = [];

    function removeFromStack(callback) {
        var letter = stack[stack.length - 1];
        while (stack.length && callback(letter)) {
            result.push(stack.pop());
            letter = stack[stack.length - 1];
        }
    }

    letters.forEach(parseLetter);

    function parseLetter(letter) {
        if (!isNaN(+letter)) {
            result.push(letter);
            return;
        }

        if (letter === '(') {
            stack.push(letter);
            return;
        }

        if (letter === ')') {
            removeFromStack(function (letter) {
                return letter !== '('
            });
            stack.pop();
            return;
        }

        removeFromStack(function (nextLetter) {
            return SIGNS_PRIORITY.indexOf(letter) >= SIGNS_PRIORITY.indexOf(nextLetter);
        });

        stack.push(letter);
    }

    removeFromStack(function () {
        return true
    });

    return countPolish(result);
}

function countPolish(letters) {
    var stack = [];
    var i = 0;

    while (i < letters.length) {
        var letter = letters.splice(i, 1)[0];

        if (!isNaN(+letter)) {

            stack.push(letter);
            if (stack.length > 2) {
                letters.splice(i, 0, stack.shift());
                i++;
            }
        } else {
            if (!stack.length) {
                stack = letters.splice(0, 2);
            }
            var result = (letter === '^')
                ? Math.pow(stack[0], stack[1])
                : eval(stack[0] + letter + stack[1]);

            stack.length = 0;
            letters.splice(i, 0, result);
            i = Math.max(i - 1, 0);

        }
    }

    return stack[0];
}

function sillyCalc(str) {
    try {
        str = Utils.prepareString(str);
        str = extractPower(str);
        return eval(str);
    } catch (e) {
        return null;
    }


    function extractPower(str) {
        const reg = /(\(([^\(^\)]+)\)|\d+)\^(\(([^\(^\)]+)\)|\d+)/;
        var result = reg.exec(str);
        if (result) {
            var base = sillyCalc(result[1]);
            var pow = sillyCalc(result[3]);
            return extractPower(str.replace(reg, Math.pow(base, pow)));
        }
        return str;

    }
}

module.exports = {
    polishCalc: polishCalc,
    sillyCalc: sillyCalc
};
