const token = process.env.TOKEN;

const TelegramBot = require('node-telegram-bot-api');
let bot;

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new TelegramBot(token, {
        polling: true
    });
}

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Received your message');
});