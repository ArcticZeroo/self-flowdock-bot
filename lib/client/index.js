const { Client, MessageType } = require('flowdock-ex');
const Logger = require('frozor-logger');

const log = new Logger('CLIENT');

const { flowdock: sessionToken } = require('../../config/tokens');
const clientConfig = require('../../config/client');

const CommandMessage = require('../structures/CommandMessage');
const client = new Client({ session });

function registerEvents(commandHandler) {
    client.on(MessageType.CHAT_MESSAGE, (message, data) => {
        // We only want regular chat messages
        // We shouldn't get any others based on the event, but...
        if (!message.isChat) {
            return;
        }

        // If the sender is not myself, ignore it
        if (message.user.id !== client.self.id) {
            return;
        }

        message.content = message.content.trim();

        if (!message.content.startsWith(clientConfig.prefix)) {
            return;
        }

        // We know it starts with the prefix, so if its only content
        // is the prefix... ignore it.
        if (message.content.length === clientConfig.prefix.length) {
            return;
        }

        data.content = message.content.substr(clientConfig.prefix.length);
        data.args = message.content.split(/\s+/).filter(v => !!v);
        data.commandName = data.args.shift().toLowerCase();

        const commandMessage = new CommandMessage(client, data);

        client.emit('command', commandMessage);
    });

    client.on('command', (commandMessage) => {
        commandHandler.process(commandMessage, {}, client)
            .catch(e => commandMessage.reply(`Could not process command: ${e}`));
    });
}

async function init(commandHandler) {
    try {
        await client.init();
    } catch (e) {
        log.error('Could not start client:');
        log.error(e);

        log.warning('Attempting to re-run init in 2.5s...');
        setTimeout(init, 2500);
        return;
    }

    registerEvents(commandHandler);
}

module.exports = { client, init };