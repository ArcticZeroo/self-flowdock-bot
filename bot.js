const { init: initClient } = require('./lib/client');
const { init: initCommandHandler } = require('./lib/command/handler');

async function main() {
    try {
        await initCommandHandler();
    } catch (e) {
        throw e;
    }

    try {
        initClient();
    } catch (e) {
        throw e;
    }
}