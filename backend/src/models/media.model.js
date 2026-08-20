import { pool } from "../db/connectToPostgres.js";

class Media {
    static async syncFromTMDB(tmdbData){
        const {
            id:tmdb_id,
            title,  // movies
            name,   // tv shows
            overview:summary,
            poster_path,
            vote_average:official_rating,
            release_date,
            first_air_date,
            media_type: tmdb_media_type,
        } = tmdbData;

        // normalise for consistency
        const display_title = title || name;    
        const date = release_date || first_air_date || null;

        // 
        const cover_url = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}`: null;


        
        const genres = this.mapTmdbGenres(tmdbData.genre_ids);

        const qry = `INSERT INTO media(
                    tmdb_id, title, tmdb_media_type, genre, 
                    cover_img_url,release_date, official_rating, summary )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT(tmdb_id)
                    DO UPDATE SET 
                        tmdb_id = EXCLUDED.tmdb_id,
                        tmdb_media_type = EXCLUDED.tmdb_media_type,
                        genre = EXCLUDED.genre,
                        cover_img_url = EXCLUDED.cover_img_url,
                        release_date = EXCLUDED.release_date,
                        official_rating = EXCLUDED.official_rating,
                        summary = EXCLUDED.summary,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING *;`;
        // NOTES: ON CONFLICT -> handles duplicates and 
        // updates the current data instead of throwing an error
        const values = [
            tmdb_id, display_title, tmdb_media_type, 
            genres, cover_url, date, official_rating, summary];
        
        const { rows } = await pool.query(qry, values);
        return rows[0];
    }
    static async mapTmdbGenres(genre_ids){
        if (!genre_ids || !Array.isArray(genre_ids)) return [];

        const tmdbGenreMap = {
            28: "Action",
            12: "Adventure",
            16: "Animation",
            35: "Comedy",
            80: "Crime",
            99: "Documentary",
            18: "Drama",
            10751: "Family",
            14: "Fantasy",
            36: "History",
            27: "Horror",
            10402: "Music",
            9648: "Mystery",
            10749: "Romance",
            878: "Science Fiction",
            10770: "TV Movie",
            53: "Thriller",
            10752: "War",
            37: "Western",
            
            // TV Genres
            10759: "Action & Adventure",
            10762: "Kids",
            10763: "News",
            10764: "Reality",
            10765: "Sci-Fi & Fantasy",
            10766: "Soap",
            10767: "Talk",
            10768: "War & Politics"
        };
        // 1. Loop through the numbers TMDB sent
        // 2. Look up the matching word in the dictionary
        // 3. Filter out any 'undefined' values
        return genre_ids
            .map(id => tmdbGenreMap[id])
            .filter(genre => genre !== undefined);
    }

    static async getMediaByGenre(genre) {
        const qry = `SELECT * FROM media
                    WHERE genre && $1::text[]
                    LIMIT 20;
                    `;
        const { rows } = await pool.query(qry,[genre])
        return rows[0];
    }

}



export default Media;