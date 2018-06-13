const { Message } = require('flowdock-ex');

class CommandMessage extends Message {
    constructor(client, data) {
        super(client, data);
    }

    setup(data) {
        super.setup(data);

        this.args = data.args || [];
        this.commandName = data.commandName;
    }

    async reply (text, deleteAfter = true) {
        try {
            await this.threadMessage(text);
        } catch (e) {
            throw e;
        }

        if (deleteAfter) {
            try {
                await this.delete();
            } catch (e) {
                throw e;
            }
        }
    }
}

module.exports = CommandMessage;