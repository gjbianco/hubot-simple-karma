const KARMA_PREFIX = process.env.HUBOT_KARMA_PREFIX || 'hubot-karma'

(function init () {
  if (!robot.brain.get(KARMA_PREFIX)) {
    robot.brain.set(KARMA_PREFIX, JSON.stringify({}))
  }
})()

function openKarmas () {
  return JSON.parse(robot.brain.get(KARMA_PREFIX))
}

function closeKarmas (karmas) {
  robot.brain.set(KARMA_PREFIX, JSON.stringify(karmas))
}

function formatKarma (name, karma) {
  return `${name} has ${karma} karma`
}

module.exports = (robot) => {

  robot.hear(/^(\w+)(\+\+|--)$/i, (res) => {
    const name = res.match[1]
    const karmas = openKarmas()
    const val = karmas[name] || 0
    val += res.match[1] === '++' ? 1 : -1
    if (val) {
      karmas[name] = val
    } else {
      delete karmas[name]
    }
    closeKarmas(karmas)
    res.send(name, karmas[name])
  })

  robot.hear(/^!karma(?: (\w+))?$/i, (res) => {
    const name = res.match[1]
    const karmas = openKarmas()
    if (name) {
      res.send(formatKarma(name, karmas[name]))
    } else {
      let kTable = 'karmas:\n'
      for (let k in karmas) {
        kTable += `${k}: ${karmas[k]}`
      }
      res.send(kTables)
    }
  })

}
