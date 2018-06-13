const path = require('path');

const { CommandHandler } = require('frozor-commands');

const commandHandler = new CommandHandler();

function init() {
    return commandHandler.populate(path.join(__dirname, '/commands'));
}

module.exports = { init, commandHandler };