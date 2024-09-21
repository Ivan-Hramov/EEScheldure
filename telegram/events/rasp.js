const moment = require("moment");
const axios = require("axios");
const { activeRasp, groupsKeyBoard } = require("../utils/raspControl.js");

function getDatesOfCurrentWeek() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfWeek = new Date(currentDate);
    const weekDates = [];
    firstDayOfWeek.setDate(currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
}
function getDatesOfNextWeek() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfWeek = new Date(currentDate);
    const weekDates = [];
    firstDayOfWeek.setDate(currentDate.getDate() + 7 - (currentDay === 0 ? 6 : currentDay - 1));
    for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
}
function getCurrentWeekRange() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    const firstDayFormatted = formatDate(firstDayOfWeek);
    const lastDayFormatted = formatDate(lastDayOfWeek);
    return `${firstDayFormatted} - ${lastDayFormatted}`;
}
function getNextWeekRange() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfNextWeek = new Date(currentDate);
    firstDayOfNextWeek.setDate(currentDate.getDate() + 7 - (currentDay === 0 ? 6 : currentDay - 1));
    const lastDayOfNextWeek = new Date(firstDayOfNextWeek);
    lastDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 6);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };
    const firstDayFormatted = formatDate(firstDayOfNextWeek);
    const lastDayFormatted = formatDate(lastDayOfNextWeek);
    return `${firstDayFormatted} - ${lastDayFormatted}`;
}

module.exports = {
    event: 'callback_query',
    func: async (bot, handler) => {
        if (handler.data.includes("raspselect")) {
            const selected = handler.data.split('_')[1];
            activeRasp.get(handler.message.message_id).callback = selected;
            bot.editMessageText(`Valige rühm:`, {
                message_id: handler.message.message_id,
                chat_id: handler.message.chat.id,
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: groupsKeyBoard
                }
            })
        }

        if (handler.data.includes("rasp_")) {
            const selected = handler.data.split('_')[1];
            const res = await axios.get(`https://tahvel.edu.ee/hois_back/schoolBoard/14/timetableByGroup?lang=ET&studentGroups=${selected}`);
            const scheldure = res.data.timetableEvents;

            let items = [];
            const time_zone = activeRasp.get(handler.message.message_id).callback;

            scheldure.forEach(el => {
                let number = 0;
                switch (el.timeStart) {
                    case '08:15':
                        number = 1;
                        break;
                    case '09:10':
                        number = 2;
                        break;
                    case '10:05':
                        number = 3;
                        break;
                    case '11:00':
                        number = 4;
                        break;
                    case '12:30':
                        number = 5;
                        break;
                    case '13:25':
                        number = 6;
                        break;
                    case '14:20':
                        number = 7;
                        break;
                    case '15:15':
                        number = 8;
                        break;
                    case '16:10':
                        number = 9;
                        break;
                    case '17:05':
                        number = 10;
                        break;
                    case '18:00':
                        number = 11;
                        break;
                    case '18:55':
                        number = 12;
                        break;
                }

                if (time_zone === 'week') {
                    const week_dates = getDatesOfCurrentWeek();
                    const date = new Date(el.date);
                    const sch_date = date.toISOString().split('T')[0];
                    for (let i = 0; i < week_dates.length; i++) {
                        if (week_dates[i].toISOString().split('T')[0].includes(sch_date)) {
                            items.push({ date: sch_date, name: el.nameEt, timeStart: el.timeStart, timeEnd: el.timeEnd, room: el.rooms.length > 0 && el.rooms[0].roomCode || "Täpsustamata", number: number, teacher: el.teachers.length > 0 && el.teachers[0].name || "Täpsustamata" })
                            break;
                        }
                    }
                } else if (time_zone === 'nextweek') {
                    const week_dates = getDatesOfNextWeek();
                    const date = new Date(el.date);
                    const sch_date = date.toISOString().split('T')[0];
                    for (let i = 0; i < week_dates.length; i++) {
                        if (week_dates[i].toISOString().split('T')[0].includes(sch_date)) {
                            items.push({ date: sch_date, name: el.nameEt, timeStart: el.timeStart, timeEnd: el.timeEnd, room: el.rooms.length > 0 && el.rooms[0].roomCode || "Täpsustamata", number: number, teacher: el.teachers.length > 0 && el.teachers[0].name || "Täpsustamata" })
                            break;
                        }
                    }
                } else if (time_zone === 'day') {
                    const currentDay = moment().format('YYYY-MM-DD');
                    const sdate = new Date(el.date);
                    const sch_date = sdate.toISOString().split('T')[0];
                    
                    if (currentDay === sch_date) {
                        items.push({ date: sch_date, name: el.nameEt, timeStart: el.timeStart, timeEnd: el.timeEnd, room: el.rooms.length > 0 && el.rooms[0].roomCode || "Täpsustamata", number: number, teacher: el.teachers.length > 0 && el.teachers[0].name || "Täpsustamata" })
                    }
                } else if (time_zone === 'nextday') {
                    const currentDay = moment().add(1, 'days').format('YYYY-MM-DD');
                    const sdate = new Date(el.date);
                    const sch_date = sdate.toISOString().split('T')[0];
                    
                    if (currentDay === sch_date) {
                        items.push({ date: sch_date, name: el.nameEt, timeStart: el.timeStart, timeEnd: el.timeEnd, room: el.rooms.length > 0 && el.rooms[0].roomCode || "Täpsustamata", number: number, teacher: el.teachers.length > 0 && el.teachers[0].name || "Täpsustamata" })
                    }
                }
            });

            const compareDateTime = (a, b) => {
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
                if (a.timeStart < b.timeStart) return -1;
                if (a.timeStart > b.timeStart) return 1;
                return 0;
            };
            items.sort(compareDateTime);
    
            const daysOfWeek = {
                0: 'Pühapäev',
                1: 'Esmaspäev',
                2: 'Teisipäev',
                3: 'Kolmapäev',
                4: 'Neljapäev',
                5: 'Reede',
                6: 'Laupäev'
            };
    
            items = items.filter(el => el.number !== 0);

            if (time_zone === 'week') {
                const groupedByDay = items.reduce((acc, item) => {
                    const day = moment(item.date).day();
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(item);
                    return acc;
                }, {});
                let messageText = `🗓 | Nädalane tunniplaan (${getCurrentWeekRange()}):\n`;
                for (let day = 1; day <= 5; day++) {
                    messageText += `${daysOfWeek[day]}:\n`;
                    if (groupedByDay[day]) {
                        groupedByDay[day].sort((a, b) => a.number - b.number).forEach((el, index) => {
                            messageText += `${el.number}. ${el.name} | ${el.room} | ${el.timeStart} - ${el.timeEnd} | ${el.teacher}\n`;
                        });
                    } else {
                        messageText += `Tundi pole\n`;
                    }
                    messageText += '\n';
                }
                bot.editMessageText(messageText, {
                    message_id: handler.message.message_id,
                    chat_id: handler.message.chat.id
                });
            } else if (time_zone === 'day') {
                const todayDate = moment().format('YYYY-MM-DD');
                const todayItems = items.filter(el => el.date === todayDate);
                todayItems.sort((a, b) => a.number - b.number);
                let messageText = `🗓 | Tänane tunniplaan (${moment().format('DD.MM.YYYY')}):\n`;
                if (todayItems.length > 0) {
                    todayItems.forEach((el, index) => {
                        messageText += `${el.number}. ${el.name} | ${el.room} | ${el.timeStart} - ${el.timeEnd} | ${el.teacher}\n`;
                    });
                } else {
                    messageText += `Tundi pole\n`;
                }
                bot.editMessageText(messageText, {
                    message_id: handler.message.message_id,
                    chat_id: handler.message.chat.id
                });
            } else if (time_zone === 'nextday') {
                const todayDate = moment().add(1, 'days').format('YYYY-MM-DD');
                const todayItems = items.filter(el => el.date === todayDate);
                todayItems.sort((a, b) => a.number - b.number);
                let messageText = `🗓 | Homne tunniplaan (${moment().add(1,'days').format('DD.MM.YYYY')}):\n`;
                if (todayItems.length > 0) {
                    todayItems.forEach((el, index) => {
                        messageText += `${el.number}. ${el.name} | ${el.room} | ${el.timeStart} - ${el.timeEnd} | ${el.teacher}\n`;
                    });
                } else {
                    messageText += `Tundi pole\n`;
                }
                bot.editMessageText(messageText, {
                    message_id: handler.message.message_id,
                    chat_id: handler.message.chat.id
                });
            } else if (time_zone === 'nextweek') {
                const groupedByDay = items.reduce((acc, item) => {
                    const day = moment(item.date).day();
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(item);
                    return acc;
                }, {});
                let messageText = `🗓 | Nädalane tunniplaan (${getNextWeekRange()}):\n`;
                for (let day = 1; day <= 5; day++) {
                    messageText += `${daysOfWeek[day]}:\n`;
                    if (groupedByDay[day]) {
                        groupedByDay[day].sort((a, b) => a.number - b.number).forEach((el, index) => {
                            messageText += `${el.number}. ${el.name} | ${el.room} | ${el.timeStart} - ${el.timeEnd} | ${el.teacher}\n`;
                        });
                    } else {
                        messageText += `Tundi pole\n`;
                    }
                    messageText += '\n';
                }
                bot.editMessageText(messageText, {
                    message_id: handler.message.message_id,
                    chat_id: handler.message.chat.id
                });
            }

            activeRasp.delete(handler.message.message_id);
        }
    }
};