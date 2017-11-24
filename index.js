function calc(str) {
    if (/([\+\-\*\/]){2}/.test(str)) {
        return null
    }

    try {
        str = str.replace(',', '.');
        str = str.replace(/^([\+\-\*\/])/, '');
        str = str.replace(/([\+\-\*\/])$/, '');

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
        var base = calc(result[1]);
        var pow = calc(result[3]);
        return extractPower(str.replace(reg, Math.pow(base, pow)));
    }
    return str;

}

module.exports = calc;
