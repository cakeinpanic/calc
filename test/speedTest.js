var calc = require('../index');
const Perf = require('performance-node');

const timeline = new Perf();
const N = 100000;

function test(string, name) {

    timeline.mark(`start${name}`);

    for (var i = 0; i < N; i++) {
        calc(string);
    }
    timeline.mark(`end${name}`);
    timeline.measure(`measure${name}`, `start${name}`, `end${name}`);

    const myMeasure = timeline.getEntriesByName(`measure${name}`)[0];
    console.log(name, myMeasure.duration);
}


test('2+2', 'simple');
test('-(2+2*4*(2+8/4))^(-1+3)', 'hard');
test('-(2+2*4*(2+-8/4)^(-8+6)', 'invalid');