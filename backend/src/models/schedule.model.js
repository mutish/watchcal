import { pool } from "../db/connectToPostgres.js";

class Schedule{
    static async fetchSchedule(usr_id) {
        const qry = `SELECT 
                        ps.ps_id,
                        ps.planned_date,
                        m.title,
                        m.cover_image_url,
                        m.genre,
                        um.status
                    FROM planned_schedule ps
                    JOIN user_media um ON ps.um_id = um.um_id
                    JOIN media m ON um.media_id = m.media_id
                    WHERE um.usr_id = $1
                    ORDER BY ps.planned_date ASC;`;
        const { rows } = await pool.query(qry, [usr_id]);
        return rows;
    }

    static async addtoSchedule(){
        const qry = `INSERT INTO planner_schedule(um_id, planned_date) 
                     VALUES ($1, $2);`;
        const { rows } = await pool.query(qry);
        return rows;
    }
    

};

export default Schedule;

// fetch , plan, , 