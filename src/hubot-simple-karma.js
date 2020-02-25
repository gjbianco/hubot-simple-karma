const _ = require('lodash');

const KARMA_PREFIX = process.env.HUBOT_KARMA_PREFIX || 'hubot-simple-karma';

module.exports = robot => {
  // chat hooks -------------------------------

  robot.hear(/^(.+)(\+\+|--)$/i, res => {
    const name = res.match[1];
    const amount = res.match[2] === '++' ? 1 : -1;
    res.send(changeKarma(name, amount));
  });

  robot.hear(/^(.+?)([+-]\d)$/i, res => {
    const name = res.match[1];
    const amount = parseInt(res.match[2], 10);
    res.send(changeKarma(name, amount));
  });

  robot.hear(/^!karma(?: (.+))?$/i, res => {
    const name = res.match[1];
    const karmas = openKarmas();
    if (name) {
      res.send(formatKarma(name, karmas[name]));
    } else {
      let kTable = '';
      const topList = _.chain(karmas)
        .toPairs()
        .orderBy('1', 'desc')
        .slice(0, 10)
        .value();
      _.each(topList, (row, index) => {
        kTable += `\t${index + 1}: (${row[1]})\t${row[0]}\n`;
      });
      res.send('top ten:\n' + kTable);
    }
  });

  // utility functions ---------------------------

  function changeKarma(name, isPositive, amount) {
    const karmas = openKarmas();

    name = name.trim();
    let val = karmas[name] || 0;
    val += amount;
    if (val) {
      karmas[name] = val;
    } else {
      delete karmas[name];
    }

    closeKarmas(karmas);
    return formatKarma(name, karmas[name]);
  }

  function openKarmas() {
    return robot.brain.get(KARMA_PREFIX);
  }

  function closeKarmas(karmas) {
    robot.brain.set(KARMA_PREFIX, karmas);
  }

  function formatKarma(name, karma) {
    return `${name} has ${karma || 'no'} karma`;
  }

  // initialize data, if necessary
  if (!openKarmas()) {
    closeKarmas({
      nobody: 1,
    });
  }
};
