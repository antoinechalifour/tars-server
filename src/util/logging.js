const chalk = require('chalk')

const configuration = {
  debug: {
    crit: 0,
    color: 'gray',
    bgColor: 'bgWhite'
  },
  info: {
    crit: 1,
    color: 'green',
    bgColor: 'bgGreen'
  },
  notice: {
    crit: 2,
    color: 'blue',
    bgColor: 'bgBlue'
  },
  warning: {
    crit: 3,
    color: 'yellow',
    bgColor: 'bgYellow'
  },
  error: {
    crit: 4,
    color: 'red',
    bgColor: 'bgRed'
  },
  critical: {
    crit: 5,
    color: 'redBright',
    bgColor: 'bgRedBright'
  }
}

class Logger {
  constructor ({ name, level }) {
    this._name = name
    this._level = level

    Object.keys(configuration).forEach(critLevel => {
      this[critLevel] = (message, ...args) =>
        this.log(critLevel, message, ...args)
    })
  }

  log (level, message, ...args) {
    const currentConfig = configuration[level]
    const logLevel = currentConfig.crit
    const minLogLevel = configuration[this._level].crit

    if (logLevel < minLogLevel) {
      return
    }

    const logArgs = [
      chalk[currentConfig.bgColor](`[ ${level} ]`) +
        ' ' +
        this._name +
        ' > ' +
        chalk[currentConfig.color](message)
    ]

    if (args.length) {
      logArgs.push(args)
    }

    console.log(...logArgs)
  }
}

module.exports = function logging ({ level }) {
  return {
    getLogger: name => new Logger({ name, level })
  }
}
