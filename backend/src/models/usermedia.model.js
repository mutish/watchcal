import { pool } from '../db.js';
class usrMedia {
    static async addFavorite(value) { 
        const qry = `ALTER TABLE user_media
                    ALTER COLUMN is_fav SET DEFAULT $1;`;
        const { rows } = await pool.query(qry, [value]);
        return rows[0];
    }
    
    static async displayFavorites(){
        // TODO: remember to change the query to a 
        // join query to get the media details from the media table
        const qry = `SELECT * FROM user_media
                    WHERE is_fav='true';`;
        const { rows } = await pool.query(qry);
        return rows;
    }
}

export default usrMedia;