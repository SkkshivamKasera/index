import { Telegraf } from 'telegraf';
import axios from 'axios';

// Initialize the Telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

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

// Start the bot
bot.launch();

console.log("Bot is running...");

// Keep the process running indefinitely
setInterval(() => {}, 86400000); 