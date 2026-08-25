import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const { fetchfromTMDB } = await import('../services/tmdbService.js');
const Media = (await import('../models/media.model.js')).default;
const { pool } = await import('../db/connectToPostgres.js');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const seedMassiveCatalog = async () => {
    await pool.query('SELECT 1');

    const startYear = 1980; 
    const currentYear = new Date().getFullYear(); 
    const maxPagesPerYear = 10; 
    const mediaTypes = ['movie', 'tv'];

    for (const type of mediaTypes) {
        for (let year = startYear; year <= currentYear; year++) {
            console.log(`\nfetching ${type.toUpperCase()}s from ${year}...`);

            for (let page = 1; page <= maxPagesPerYear; page++) {
                try {
                    
                    const yearFilter = type === 'movie' 
                        ? `primary_release_year=${year}` 
                        : `first_air_date_year=${year}`;

                    const endpoint = `/discover/${type}?${yearFilter}&sort_by=popularity.desc&page=${page}`;
                    const data = await fetchfromTMDB(endpoint);

                    if (!data.results || data.results.length === 0) break;

                    for (const item of data.results) {
                        item.media_type = type; 
                        
                        await Media.syncFromTMDB(item);
                    }

                    console.log(`Saved ${type} page ${page}/${data.total_pages} (${year})`);

                    if (page >= data.total_pages) break; 

                    await sleep(100); // 100ms delay between requests
                } catch (error) {
                    console.error(`Error on ${type} page ${page} (${year}):`, error.message);
                }
            }
        }
    }

    console.log("\nMassive catalog seeding complete!");
    process.exit(0);
};

seedMassiveCatalog();