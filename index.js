function prepareString(str) {
    str = str.replace(/\s/g, '');
    if (/([\+\-\*\/]){2}/.test(str) || /([^\(^\)^\d^\+^\-^\/^\*^\^\.\,\ ])/.test(str)) {
        return null
    }
    str = str.replace(',', '.');

    str = str.replace(/\(([\-\+])/g, '(0$1');
    str = str.replace(/^([\-\+])/g, '0$1');

    str = str.replace(/^([\*\/])/g, '');
    str = str.replace(/([\+\-\*\/])$/, '');

    return str;
}

function splitString(str) {
    var rg = new RegExp(/([\d\.]+)|[^\d]/, 'g');
    var letters = [];
    var t = rg.exec(str);

    while (t) {
        letters.push(t[0])
        t = rg.exec(str);
    }

    return letters;
}

function calc(str) {
    var prepared = prepareString(str);

    if (!prepared) {
        return null;
    }
    var letters = splitString(prepared);
    var texas = [];
    var california = [];
    texas.push(letters.shift());

    function removeFromStack(callback) {
        var letter = texas[texas.length - 1];
        while (callback(letter) && texas.length) {
            california.push(texas.pop());
            letter = texas[texas.length - 1];
        }
    }

    for (var i = 0; i < letters.length; i++) {

        var letter = letters[i];
        if (isNumber(letter)) {
            california.push(letter);
        }
        if (letter === '(') {
            texas.push(letter);
        }
        if (letter === ')') {
            removeFromStack(function (letter) {
                return letter !== '('
            });
            texas.pop();
        }
        if (isSign(letter)) {
            removeFromStack(function (l) {
                return checkPriority(letter, l);
            });
            texas.push(letter);
        }
    }

    removeFromStack(function () {
        return true
    });

    var res = runPolish(california);
    return res;

}

function runPolish(letters) {
    var stack = [];
    var i = 0;
    while (i < letters.length) {
        var letter = letters.splice(i, 1)[0];
        var result;
        if (isNumber(letter)) {
            stack.push(letter);
            if (stack.length > 2) {
                letters.splice(i, 0, stack.shift());
                i++;
            }
        }

        if (isSign(letter)) {
            if (!stack.length) {
                stack = letters.splice(0, 2);
                i = 2;
            }
            if (letter === '^') {
                result = Math.pow(+stack[0], +stack[1]);
            } else {
                result = eval(`${stack[0]}${letter}${stack[1]}`);
            }
            stack.length = 0;
            letters.splice(i, 0, result);
            i = Math.max(i - 1, 0);
        }
    }
    return stack[0];
}

function checkPriority(o1, o2) {
    o1 = o1 === '-' ? '+' : o1;
    o1 = o1 === '/' ? '*' : o1;
    o2 = o2 === '-' ? '+' : o2;
    o2 = o2 === '/' ? '*' : o2;
    const pr = ['^', '*', '+', '(', ')'];
    return pr.indexOf(o1) >= pr.indexOf(o2);
}

function isNumber(s) {
    return !isNaN(+s);
}

function isSign(s) {
    return s === '/'
        || s === '+'
        || s === '*'
        || s === '-'
        || s === '^';
}


// calc('(8+2*5)/(1+3*2-4)');
// calc('3 + 4 * 2 / (1 - 5)^2');

function sillyCalc(str) {
    str = prepareString(str);
    if (!str) {
        return null;
    }
    try {

        str = extractPower(str);
        return eval(str);
    } catch (e) {
        return null;
    }
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

module.exports = {
    calc: calc,
    sillyCalc: sillyCalc
};
