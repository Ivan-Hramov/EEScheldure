const { blocked } = require("../utils/blocked.js");

module.exports = {
    name: 'санкции',
    args: true,
    func: async (bot, msg, args) => {
        if (msg.from.id !== 1130069986) {
            bot.sendMessage(msg.chat.id, `Вам недоступна данная команда!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }

        bot.getChatMember(msg.chat.id, args[0])
        .then((user) => {
            let name = "";
            if (user.user.first_name) {
                name += user.user.first_name;
            }
            if (user.user.last_name) {
                name += " " + user.user.last_name
            }
            bot.sendMessage(msg.chat.id, `Пользователю ${name} заблокировано использование медиа-данных!`);
            blocked.push(parseInt(args[0]));
        })
        .catch((err) => {
            console.log(err);
            bot.sendMessage(msg.chat.id, `Произошла ошибка!`);
        });
    }
};