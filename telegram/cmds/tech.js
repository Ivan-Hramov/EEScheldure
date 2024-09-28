const { writeFile, readFile } = require('fs');

module.exports = {
    name: 'tech',
    args: false,
    func: async (bot, msg, args) => {
        if (msg.from.id !== 1130069986) {
            bot.sendMessage(msg.chat.id, `Вам недоступна данная команда!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }

        readFile("./config.json", "utf8", (error, data) => {
            if (error) {
                console.log('An error has occurred ', error);
                bot.sendMessage(msg.chat.id, `Произошла ошибка в время чтения конфига!`, {
                    reply_to_message_id: msg.message_id
                });
                return;
            }
            const config = JSON.parse(data);
            const write_conf = { tech: !config.tech };
            writeFile('./config.json', JSON.stringify(write_conf, null, 2), (err) => {
                if (err) {
                    console.log('An error has occurred ', err);
                    bot.sendMessage(msg.chat.id, `Произошла ошибка в время записи конфига!`, {
                        reply_to_message_id: msg.message_id
                    });
                    return;
                }
    
                bot.sendMessage(msg.chat.id, `Бот ${write_conf.tech ? "установлен на технические работы" : "снят с технических работ"}!`, {
                    reply_to_message_id: msg.message_id
                });
            });
        });
    }
};