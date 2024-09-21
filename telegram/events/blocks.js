const { blocked } = require("../utils/blocked.js");

module.exports = {
    event: 'message',
    func: async (bot, handler) => {
        if (blocked.includes(handler.from.id)) {
            if (handler.sticker || handler.photo || handler.document || handler.voice || handler.poll || handler.video) {
                bot.deleteMessage(handler.chat.id, handler.message_id);
            }
        }
    }
};