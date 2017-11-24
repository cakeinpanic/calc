var test = require('tape');

var calc = require('../index');

test('calc', function (t) {

    function test(str, res) {
        var c = calc(str);
        console.log(c);
        t.equal(c, res);
    }

    test('0.1+1', 1.1);
    test('0,1+1', 1.1);

    test('2+2', 4);
    test('(2+2)', 4);
    test('2+(2)', 4);

    test('+2+2', 4);

    test('+2+2+', 4);

    test('(2+2)*3', 12);
    test('2+2*3', 8);
    test('10/2', 5);
    test('10-2', 8);

    test('+2++2', null);
    test('+2+-2+', null);

    t.end();
});