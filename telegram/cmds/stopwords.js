const { game } = require("../utils/words.js")

module.exports = {
    name: 'stopwords',
    args: false,
    func: async (bot, msg, args) => {
        if (msg.from.id !== 1130069986) {
            bot.sendMessage(msg.chat.id, `Вам недоступна данная команда!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }
        if (game.size > 0) {
            game.forEach(async (el) => {
                bot.editMessageText(el.msg_text, {
                    message_id: el.msg_id,
                    chat_id: el.chat_id
                });
                game.delete(el.user_id);
            });
            bot.sendMessage(msg.chat.id, `Все игры принудительно завершены!`, {
                reply_to_message_id: msg.message_id
            });
        } else {
            bot.sendMessage(msg.chat.id, `Не найдено запущенных игр!`, {
                reply_to_message_id: msg.message_id
            });
        }
    }
};