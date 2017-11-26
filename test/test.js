var test = require('tape');

var {calc} = require('../index');

test('calc', function (t) {

    function test(str, res) {
        var c = calc(str);
        t.equal(c, res);
    }

    test('0.1+1', 1.1);
    test('0,1+1', 1.1);

    test('2+2', 4);
    test('(2+2)', 4);
    test('2+(2)', 4);
    test('2+(-2)', 0);

    test('+2+2', 4);

    test('+2+2+', 4);
    test('-2+2', 0);

    test('(2+2)*3', 12);
    test('2+2*3', 8);
    test('10/2', 5);
    test('10-2', 8);

    test('+2++2', null);
    test('+2+-2+', null);

    test('10^2', 100);
    test('1 + (2+3)^2', 26);
    test('1 + (.5)^(-2)', 5);
    test('1 + (2+3)^(1+1)', 26);

    t.end();
});
