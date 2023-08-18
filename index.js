import { Telegraf } from 'telegraf';
import express from 'express'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const app = express()
const videoReplacementTexts = {};
let botStarted = false

bot.on('video', async (ctx) => {
    try {
        const message = ctx.message;
        if (message.caption) {
            const currentCaption = message.caption;
            if (/@|#/.test(currentCaption)) {
                const updatedCaption = currentCaption.replace(/@(\w+)|#(\w+)/g, '@captain_moviess');
                videoReplacementTexts[message.video.file_id] = updatedCaption;
                await sendVideoWithCaption(ctx, message.video.file_id, updatedCaption);
            } else {
                const updatedCaption = `[@captain_moviess] ${currentCaption}`;
                videoReplacementTexts[message.video.file_id] = updatedCaption;
                await sendVideoWithCaption(ctx, message.video.file_id, updatedCaption);
            }
        } else {
            ctx.reply("Sorry, the original message is not a video with a caption, and I cannot proceed.");
        }
    } catch (error) {
        console.error(`Error processing video: ${error}`);
        ctx.reply("Sorry, there was an error processing the video.");
    }
});

async function sendVideoWithCaption(ctx, videoId, caption) {
    try {
        await ctx.replyWithVideo(videoId, {
            caption: caption,
        });
    } catch (error) {
        console.error(`Error sending video: ${error}`);
    }
}

async function startBot() {
    if (!botStarted) {
        bot.launch();
        botStarted = true
        console.log('Bot is starting...');
    } else {
        console.log('Bot is already running...');
    }
}

function stopBot() {
    if (botStarted) {
        bot.stop();
        botStarted = false
        console.log('Bot and polling stopped.');
    } else {
        console.log('Bot is not running.');
    }
}

if(!botStarted){
    bot.launch()
    botStarted=true
}

app.get('/', (req, res) => {
    startBot();
    res.send('Bot starting...');
});

app.get('/stop', (req, res) => {
    stopBot();
    res.send('Bot stopping...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});