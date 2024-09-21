const fs = require('fs');
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'})

class TelegramBotClient {
    constructor() {
        this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
    }

    async start() {
        await this.loadCommands();
        await this.loadEvents();
    }

    getCurrentTime() {
        const date = new Date();
        return date.toLocaleString();
    }

    async loadCommands() {
        const commandFiles = fs.readdirSync(`./telegram/cmds/`).filter(file => file.endsWith('.js'));
        for (const command of commandFiles) {
            const pullCommand = require(`./cmds/${command}`);
            this.bot.onText(new RegExp(`/${pullCommand.name}(\\s+(.+))?`), (msg, match) => {
                this.bot.sendMessage(process.env.CHAT_LOGS,`ℹ | LOGS\n💬 | Used command '/${pullCommand.name}'\n\n${msg.from.id} (${msg.from.username}); ${this.getCurrentTime()}`)
                const args = match[2] ? match[2].trim().split(/\s+/) : [];
                if (pullCommand.args && args.length === 0) {
                    this.bot.sendMessage(msg.chat.id, 'Эта команда требует аргументы.');
                } else {
                    pullCommand.func(this.bot, msg, args);
                }
                // this.bot.sendMessage(msg.chat.id, `Бот на технических доработках!`);
            });
        }
        console.log('[TG Commands]: Все команды успешно загружены!');
    }

    async loadEvents() {
        const eventFiles = fs.readdirSync(`./telegram/events/`).filter(file => file.endsWith('.js'));
        for (const event of eventFiles) {
            const pullEvent = require(`./events/${event}`);

            this.bot.on(pullEvent.event, (handler) => {
                pullEvent.func(this.bot, handler);
            });
        }
        console.log('[TG Events]: Все события успешно загружены!');
    }
}

module.exports = { TelegramBotClient };