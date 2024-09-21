module.exports = {
    name: 'chatid',
    args: false,
    func: async (bot, msg, args) => {
        bot.sendMessage(msg.chat.id, msg.chat.id);
    }
};