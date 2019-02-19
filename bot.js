const token = process.env.TOKEN;
const base_url = process.env.BASE_URL;

const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, {
    polling: true
});

const showDayCommand = "show day";
const startDayCommand = "start day";

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const command = msg.text.toLowerCase();

    if (command.includes(showDayCommand)) {

        var day = Number.parseInt(command.replace(showDayCommand, ''));
        request(base_url + 'levels/day/' + day, {
            json: true
        }, (err, res, body) => {
            bot.sendMessage(chatId, 'Repasa los días: ' + body.levels.join(', '));
        });
    } else {
        bot.sendMessage(chatId, 'para que quieres saber eso jaja salu2');
    }
});