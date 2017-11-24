var test = require('tape');

var calc = require('../index');

test('calc', function (t) {

    function test(str, res) {
        t.equal(calc(str), res);
    }

    test('2+2', 4);
    test('(2+2)', 4);
    test('2+(2)', 4);

    test('+2+2', 4);
    test('+2+2+', 4);

    test('(2+2)*3', 12);
    test('10/2', 5);
    test('10-2', 8);



    t.end();
});