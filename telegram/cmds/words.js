const { game } = require("../utils/words.js")
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

module.exports = {
    name: 'words',
    args: false,
    func: async (bot, msg, args) => {
        if (game.size > 0) {
            bot.sendMessage(msg.chat.id, `За раз может быть запущена только одна игра!`, {
                reply_to_message_id: msg.message_id
            });
            return;
        }

        let name = "";
        if (msg.from.first_name) {
            name += msg.from.first_name;
        }
        if (msg.from.last_name) {
            name += " " + msg.from.last_name;
        }

        const emoji = await axios.get(`https://emoji-api.com/emojis?access_key=${process.env.API_EMOJI}`);
        const word = await axios.get(`https://calculator888.ru/js/generator-sluchaynyh/gener_razny.php?ee=skivo&aa=1&bb=0&cc=&dd=1&ff=0`, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Cookie': '__ddg1_=LNQXB4ca1w50rnkxpMl2; PHPSESSID=d923902e9d5fa80ebb1978d7a2353e2f; stt_pzv=cf157v1961f0daa055t329ja98a0d4d2; vrem_korr=3*1'
            }
        });
        const msg_text = `${name} объясняет слово ${emoji.data[getRandomInt(1859)].character}`
        bot.sendMessage(msg.chat.id, msg_text, {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Посмотреть слово 👀', callback_data: `words_show_${msg.from.id}` }],
                    [{ text: 'Поменять слово 🔁', callback_data: `words_skip_${msg.from.id}` }]
                ]
            }
        }).then((bmsg) => {
            game.set(msg.from.id, {
                word: word.data.trim().split(/\s+/)[0],
                chat_id: msg.chat.id,
                user_id: msg.from.id,
                user_name: name,
                msg_id: bmsg.message_id,
                msg_text: msg_text
            });
        });
    }
};