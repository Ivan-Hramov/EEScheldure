const { DiscordBot } = require('./discord/DiscordBot.js');
const { TelegramBotClient } = require('./telegram/TelegramBot.js');
const discord = new DiscordBot()
const tg = new TelegramBotClient()

discord.login();
tg.start();