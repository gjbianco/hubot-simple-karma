const _ = require('lodash')
const Table = require('cli-table')

const KARMA_PREFIX = process.env.HUBOT_KARMA_PREFIX || 'hubot-simple-karma'

module.exports = (robot) => {

  // chat hooks -------------------------------

  robot.hear(/^(.+)(\+\+|--)$/i, (res) => {
    const name = res.match[1].trim()
    const karmas = openKarmas()
    let val = karmas[name] || 0
    val += res.match[2] === '++' ? 1 : -1
    if (val) {
      karmas[name] = val
    } else {
      delete karmas[name]
    }
    closeKarmas(karmas)
    res.send(formatKarma(name, karmas[name]))
  })

  robot.hear(/^!karma(?: (.+))?$/i, (res) => {
    const name = res.match[1]
    const karmas = openKarmas()
    if (name) {
      res.send(formatKarma(name, karmas[name]))
    } else {
      let kTable = createTable()
      let topList = _.chain(karmas)
                     .toPairs()
                     .orderBy('1', 'desc')
                     .slice(0, 10)
                     .value()
      _.each(topList, (row) => {
        kTable.push(row)
      })
      res.send('top ten:\n' + kTable.toString())
    }
  })

  // utility functions ---------------------------

  function openKarmas () {
    return robot.brain.get(KARMA_PREFIX)
  }

  function closeKarmas (karmas) {
    robot.brain.set(KARMA_PREFIX, karmas)
  }

  function formatKarma (name, karma) {
    return `${name} has ${karma || 'no'} karma`
  }

  function createTable() {
    return new Table({
      chars: {
        'top': '-',
        'top-mid': '-',
        'top-left': '+',
        'top-right': '+',
        'bottom': '-',
        'bottom-mid': '-',
        'bottom-left': '+',
        'bottom-right': '+',
        'left': '|',
        'left-mid': '|',
        'mid': '-',
        'mid-mid': '+',
        'right': '|',
        'right-mid': '|',
        'middle': '|'
      }
    })
  }

  // initialize data, if necessary
  if (!openKarmas()) {
    closeKarmas({
      nobody: 1
    })
  }

}
