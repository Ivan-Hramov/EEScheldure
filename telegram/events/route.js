const axios = require("axios");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { activeRoutes, STEPS } = require("../utils/routeControl");

let tg;

const MAX_CONCURRENT_BROWSERS = 1;
let currentBrowsers = 0;
const queue = [];
const processing = new Set();

async function processRoute(el) {
    if (currentBrowsers >= MAX_CONCURRENT_BROWSERS) {
        queue.push(el);
        return;
    }

    currentBrowsers++;
    processing.add(el.user);

    try {
        if (Math.floor(new Date().getTime() / 1000.0) - el.time > 15 && el.step !== STEPS.WAIT_FOR_RESULT) {
            tg.sendMessage(el.chat, `Время ожидания истекло. Пожалуйста, начните сначала, используя команду /route.`);
            activeRoutes.delete(el.user);
            return;
        }

        if (el.step === STEPS.WAIT_FOR_RESULT) {
            let query = {
                from: { name: "", city: "", maakond: "", geo: { lat: 0, lon: 0 } },
                to: { name: "", city: "", maakond: "", geo: { lat: 0, lon: 0 } }
            };

            let res = await axios.get(`https://api.peatus.ee/geocoding/v1/search/structured?venue=${el.from}&size=40&lang=ru&sources=oa%2Cosm`);
            if (res.data.features.length > 0) {
                query.from.name = res.data.features[0].properties.name;
                query.from.city = res.data.features[0].properties.localadmin + ", " + res.data.features[0].properties.locality;
                query.from.maakond = res.data.features[0].properties.county;
                query.from.geo.lat = res.data.features[0].geometry.coordinates[0];
                query.from.geo.lon = res.data.features[0].geometry.coordinates[1];
            } else {
                res = await axios.get(`https://api.peatus.ee/geocoding/v1/autocomplete?text=${el.from}&size=40&lang=ru&sources=oa%2Cosm`);
                if (res.data.features.length > 0) {
                    query.from.name = res.data.features[0].properties.name;
                    query.from.city = res.data.features[0].properties.county;
                    query.from.maakond = res.data.features[0].properties.region;
                    query.from.geo.lat = res.data.features[0].geometry.coordinates[0];
                    query.from.geo.lon = res.data.features[0].geometry.coordinates[1];
                } else {
                    tg.sendMessage(el.chat, `Не найдено указанное место отправления. Пожалуйста, начните сначала, используя команду /route.`);
                    activeRoutes.delete(el.user);
                    return;
                }
            }

            res = await axios.get(`https://api.peatus.ee/geocoding/v1/search/structured?venue=${el.to}&size=40&lang=ru&sources=oa%2Cosm`);
            if (res.data.features.length > 0) {
                query.to.name = res.data.features[0].properties.name;
                query.to.city = res.data.features[0].properties.localadmin + ", " + res.data.features[0].properties.locality;
                query.to.maakond = res.data.features[0].properties.county;
                query.to.geo.lat = res.data.features[0].geometry.coordinates[0];
                query.to.geo.lon = res.data.features[0].geometry.coordinates[1];
            } else {
                res = await axios.get(`https://api.peatus.ee/geocoding/v1/autocomplete?text=${el.to}&size=40&lang=ru&sources=oa%2Cosm`);
                if (res.data.features.length > 0) {
                    query.to.name = res.data.features[0].properties.name;
                    query.to.city = res.data.features[0].properties.county;
                    query.to.maakond = res.data.features[0].properties.region;
                    query.to.geo.lat = res.data.features[0].geometry.coordinates[0];
                    query.to.geo.lon = res.data.features[0].geometry.coordinates[1];
                } else {
                    tg.sendMessage(el.chat, `Не найдено указанное место назначения. Пожалуйста, начните сначала, используя команду /route.`);
                    activeRoutes.delete(el.user);
                    return;
                }
            }

            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setViewport({ width: 1280, height: 800 });
            await page.goto(encodeURI(`https://web.peatus.ee/reitti/${query.from.name}, ${query.from.city}, ${query.from.maakond}::${query.from.geo.lon},${query.from.geo.lat}/${query.to.name}, ${query.to.city}, ${query.to.maakond}::${query.to.geo.lon},${query.to.geo.lat}/0?locale=ru&time=${el.time}`), {
                waitUntil: 'networkidle0',
            });
            const client = await page.target().createCDPSession();
            await client.send('Emulation.setScrollbarsHidden', { hidden: true });
            await page.emulateMediaType('print');
            const contentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
            await page.setViewport({ width: 1280, height: contentHeight - 1100 });
            await page.screenshot({ path: "./telegram/temp/route1.png" });
            await browser.close();

            tg.sendPhoto(el.chat, './telegram/temp/route1.png', {
                contentType: 'image/png'
            })
            .then(() => {
                fs.unlink('./telegram/temp/route1.png', (err) => {
                    if (err) console.log(err);
                });
            });

            activeRoutes.delete(el.user);
        }
    } catch (error) {
        console.error(error);
    } finally {
        currentBrowsers--;
        processing.delete(el.user);
        if (queue.length > 0) {
            const next = queue.shift();
            processRoute(next);
        }
    }
}

async function processAllRoutes() {
    for (const el of activeRoutes.values()) {
        if (!processing.has(el.user)) {
            await processRoute(el);
        }
    }
}

setInterval(() => {
    processAllRoutes();
}, 500);

module.exports = {
    event: 'message',
    func: async (bot, handler) => {
        tg = bot;
        if (activeRoutes.has(handler.from.id) && activeRoutes.get(handler.from.id).chat === handler.chat.id) {
            switch (activeRoutes.get(handler.from.id).step) {
                case STEPS.WAIT_FOR_FROM:
                    activeRoutes.get(handler.from.id).from = handler.text;
                    activeRoutes.get(handler.from.id).time = Math.floor(new Date().getTime()/1000.0);
                    activeRoutes.get(handler.from.id).step = STEPS.WAIT_FOR_TO;
                    bot.sendMessage(activeRoutes.get(handler.from.id).chat, `Место назначения:`, {
                        reply_to_message_id: handler.message_id
                    });
                    break;
                case STEPS.WAIT_FOR_TO:
                    activeRoutes.get(handler.from.id).to = handler.text;
                    activeRoutes.get(handler.from.id).step = STEPS.WAIT_FOR_RESULT;
                    activeRoutes.get(handler.from.id).time = Math.floor(new Date().getTime()/1000.0);
                    bot.sendMessage(activeRoutes.get(handler.from.id).chat, `Получение данных...`, {
                        reply_to_message_id: handler.message_id
                    })
                    break;
            }
        }
    }
};