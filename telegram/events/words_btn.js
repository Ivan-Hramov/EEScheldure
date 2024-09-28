const { game } = require("../utils/words.js")
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'})

module.exports = {
    event: 'callback_query',
    func: async (bot, handler) => {
        if (handler.data.includes("words")) {
            const ctx = handler.data.split("_"); // ctx[0] key, ctx[1] method, ctx[2] userid

            switch (ctx[1]) {
                case "show":
                    bot.answerCallbackQuery(handler.id, `${parseInt(ctx[2]) === handler.from.id ? game.get(parseInt(ctx[2])).word : "Это не ваше слово!"}`, true);
                    break;
                case "skip":
                    const word = await axios.get(`https://calculator888.ru/js/generator-sluchaynyh/gener_razny.php?ee=skivo&aa=1&bb=0&cc=&dd=1&ff=0`, {
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0',
                            'Accept-Encoding': 'gzip, deflate, br, zstd',
                            'Cookie': `__ddg1_=LNQXB4ca1w50rnkxpMl2; PHPSESSID=${process.env.API_WORDS_SESID}; stt_pzv=cf157v1961f0daa055t329ja98a0d4d2; vrem_korr=3*1`
                        }
                    });

                    if (parseInt(ctx[2]) === handler.from.id) {
                        game.get(parseInt(ctx[2])).word = word.data.trim().split(/\s+/)[0];
                    }

                    bot.answerCallbackQuery(handler.id, `${parseInt(ctx[2]) === handler.from.id ? game.get(parseInt(ctx[2])).word : "Это не ваше слово!"}`, true);
                    break;
            }

        }
    }
};