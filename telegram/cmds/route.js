const { activeRoutes, STEPS } = require("../utils/routeControl");

module.exports = {
    name: 'route',
    args: false,
    func: async (bot, msg, args) => {
        activeRoutes.set(msg.from.id, {
            user: msg.from.id,
            chat: msg.chat.id,
            from: "",
            to: "",
            step: STEPS.WAIT_FOR_FROM,
            time: Math.floor(new Date().getTime()/1000.0)
        });
        bot.sendMessage(msg.chat.id, `Место отправления:`, {
            reply_to_message_id: msg.message_id
        });
    }
};