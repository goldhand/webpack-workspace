/* eslint-disable no-console */
let options = {
  quiet: false,
};

function createLog(suffix) {
  return message => {
    if (!options.quiet) {
      console.log(`${suffix}\x1b[0m \x1b[2m⌈workspace⌋\x1b[0m: ${message}\x1b[0m`);
    }
  };
}

const log = {
  error: createLog(options, '\x1b[31m⚠︎'),
  info: createLog(options, '\x1b[36mℹ︎'),
  log: createLog(options, '\x1b[36mℹ︎'),
  configure(opts) {
    options = {...options, ...opts};
  },
};

module.exports = log;
