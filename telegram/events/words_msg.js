const { game } = require("../utils/words.js")
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    event: 'message',
    func: async (bot, handler) => {
        if (game.size > 0) {
            game.forEach(async (el) => {
                if (el.chat_id === handler.chat.id && el.user_id !== handler.from.id) {
                    if (handler.text.toLowerCase() === el.word.toLowerCase()) {
                        const emoji = await axios.get(`https://emoji-api.com/emojis?access_key=${process.env.API_EMOJI}`);
                        bot.sendMessage(el.chat_id, `${el.user_name} объяснил слово ${el.word} ${emoji.data[getRandomInt(1859)].character}`);
                        bot.editMessageText(el.msg_text, {
                            message_id: el.msg_id,
                            chat_id: el.chat_id
                        });
                        game.delete(el.user_id);
                    }
                }
            });
        }
        
    }
};