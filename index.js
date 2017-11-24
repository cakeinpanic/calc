function calc(str) {
    console.log(str);

    if (/([\+\-\*\/]){2}/.test(str)) {
        return null
    }

    try {
        str = str.replace(',', '.');
        str = str.replace(/^([\+\-\*\/])/, '');
        str = str.replace(/([\+\-\*\/])$/, '');
        console.log(str)

        return eval(str);
    } catch (e) {
        return null;
    }
}

module.exports = calc;
