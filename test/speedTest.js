var calc = require('../index');
const Perf = require('performance-node');

const timeline = new Perf();

timeline.mark('start');

for (var i = 0; i < 100000; i++) {
    calc('2+2');
}
timeline.mark('end');
timeline.measure('measure', 'start', 'end');

const myMeasure = timeline.getEntriesByName('measure')[0];

console.log(myMeasure);