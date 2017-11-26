var {polishCalc, sillyCalc} = require('../index');

const Perf = require('performance-node');

const timeline = new Perf();
const N = 100000;

function test(string, name, method) {

    timeline.mark(`start${name}`);

    for (var i = 0; i < N; i++) {
        method(string);
    }
    timeline.mark(`end${name}`);
    timeline.measure(`measure${name}`, `start${name}`, `end${name}`);

    const myMeasure = timeline.getEntriesByName(`measure${name}`)[0];
    console.log(name, myMeasure.duration);
}

function testBoth(string, name) {
    test(string, 'silly ' + name, sillyCalc);
    test(string, 'polish ' + name, polishCalc);

    console.log('---');
}

testBoth('2+2', 'simple');
testBoth('0-(2+2*4+4*(2+8/4))^(-1+3)-(2+2*4+4*(2+8/4))^(-1+3)', 'hard');
testBoth('-(2+2*4*(2+-8/4)^(-8+6)', 'invalid');
testBoth('(2^((2^(1^4))^(-4+5)^0)^4^12)^1', 'power');
