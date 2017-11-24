function calc(str) {
    try {
        return eval(str);
    } catch(e) {
        return null;
    }
}

module.exports = calc;