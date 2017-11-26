function prepareString(str) {
    str = str.replace(/\s/, '');
    if (/([\+\-\*\/]){2}/.test(str) || /([^\(^\)^\d^\+^\-^\/^\*^\^\.\,\ ])/.test(str)) {
        return null
    }
    str = str.replace(',', '.');
    str = str.replace(/^([\*\/])/, '');
    str = str.replace(/([\+\-\*\/])$/, '');
    return `(${str})`;
}

function calc(str) {
    var letters = str.split('');
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

    return california;

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
    return /\d/.test(s);
}

function isSign(s) {
    return !!(/[\-\+\/\*\^]/.test(s));
}


calc('(8+2*5)/(1+3*2-4)');
calc('3 + 4 * 2 / (1 - 5)^2');

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

module.exports = calc;
