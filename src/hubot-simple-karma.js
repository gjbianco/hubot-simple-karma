const KARMA_PREFIX = process.env.HUBOT_KARMA_PREFIX || 'hubot-simple-karma'

module.exports = (robot) => {

  if (!robot.brain.get(KARMA_PREFIX)) {
    robot.brain.set(KARMA_PREFIX, JSON.stringify({}))
  }

  function openKarmas () {
    return JSON.parse(robot.brain.get(KARMA_PREFIX))
  }

  function closeKarmas (karmas) {
    robot.brain.set(KARMA_PREFIX, JSON.stringify(karmas))
  }

  function formatKarma (name, karma) {
    return `${name} has ${karma || 'no'} karma`
  }

  robot.hear(/^(\w+)(\+\+|--)$/i, (res) => {
    const name = res.match[1]
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

  robot.hear(/^!karma(?: (\w+))?$/i, (res) => {
    const name = res.match[1]
    const karmas = openKarmas()
    if (name) {
      res.send(formatKarma(name, karmas[name]))
    } else {
      let kTable = 'karmas:\n'
      for (let k in karmas) {
        kTable += `${k}: ${karmas[k]}\n`
      }
      res.send(kTable)
    }
  })

}
