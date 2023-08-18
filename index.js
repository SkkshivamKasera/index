import { Telegraf } from 'telegraf';
import axios from 'axios';
import express from 'express'

// Initialize the Telegram bot
const bot = new Telegraf("6418563359:AAEO4WdB-ksRAfFlX9GC-d9bzrG6HnrYbBc");
const app = express()
// Global object to store the new caption text provided by users for each video
const videoReplacementTexts = {};

// Handler function to handle incoming video messages
bot.on('video', async (ctx) => {
    try {
        const message = ctx.message;

        // Check if the original message is a video and has a caption
        if (message.caption) {
            const currentCaption = message.caption;

            // Check if the caption contains "@" or "#" symbols
            if (/@|#/.test(currentCaption)) {
                // Replace words starting with '@' and '#' with '@captain_moviess' in the current caption
                const updatedCaption = currentCaption.replace(/@(\w+)|#(\w+)/g, '@captain_moviess');
                videoReplacementTexts[message.video.file_id] = updatedCaption;

                // Send the video with the updated caption
                await sendVideoWithCaption(ctx, message.video.file_id, updatedCaption);
            } else {
                // Add '[@captain_moviess]' to the beginning of the caption
                const updatedCaption = `[@captain_moviess] ${currentCaption}`;
                videoReplacementTexts[message.video.file_id] = updatedCaption;

                // Send the video with the updated caption
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

// Function to send video with caption
async function sendVideoWithCaption(ctx, videoId, caption) {
    try {
        await ctx.replyWithVideo(videoId, {
            caption: caption,
        });
    } catch (error) {
        console.error(`Error sending video: ${error}`);
    }
}

async function handleUpdates() {
    try {
        const updates = await bot.telegram.getUpdates();
        // Process the updates here
        console.log('Received updates:', updates);
    } catch (error) {
        console.error('Error fetching updates:', error);
    }
}

let updateInterval;

// Function to start the bot and fetch updates
async function startBot() {
    if (!bot.isPolling()) {
        // Start the bot
        bot.launch();
        console.log('Bot is starting...');

        // Start fetching updates at regular intervals
        updateInterval = setInterval(handleUpdates, 5000); // Fetch updates every 5 seconds
    } else {
        console.log('Bot is already running.');
    }
}

// Function to stop the bot and polling
function stopBot() {
    if (bot.isPolling()) {
        bot.stop();
        clearInterval(updateInterval); // Clear the interval
        console.log('Bot and polling stopped.');
    } else {
        console.log('Bot is not running.');
    }
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