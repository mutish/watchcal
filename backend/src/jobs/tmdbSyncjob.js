// TODO: Research on how to background fetching
import cron from 'node-cron';
import { fetchfromTMDB } from '../services/tmdbService.js';
import Media from '../models/media.model.js';

cron.schedule('0, 0, *, *, *,', async () => {
    try {
        console.log("Starting daily sync...");
        const trendingData = await fetchfromTMDB('/trending/all/day');
        for (const item of trendingData.results){
            await Media.syncFromTMDB(item);
        }

        console.log("Sync complete and successful");

    } catch (error) {
        console.log("Error in the scheduler: ",error.message);
    }
});

