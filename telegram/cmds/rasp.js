const { activeRasp } = require("../utils/raspControl.js");

module.exports = {
    name: 'rasp',
    args: false,
    func: async (bot, msg, args) => {
        bot.sendMessage(msg.chat.id, `Valige, millise ajavahemiku jaoks ajakava näidatakse:`, {
            reply_to_message_id: msg.message_id,
            reply_markup: {
                resize_keyboard: true,
                inline_keyboard: [[{text:'Täna',callback_data:'raspselect_day'}],[{text:'Homme',callback_data:'raspselect_nextday'}],[{text:'Praegune nädal',callback_data:'raspselect_week'}],[{text:'Järgmine nädal',callback_data:'raspselect_nextweek'}]]
            }
        }).then((msg) => {
            activeRasp.set(msg.message_id, {
                callback: ""
            });
        });
    }
};