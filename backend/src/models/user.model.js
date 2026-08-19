import { pool } from "../db/connectToPostgres.js";

class User {
  // new user
  static async create({fullname, username, email, pass_hash, gender, pfp_url=""}) {
    const qry = `INSERT INTO users(fullname, username, email, pass_hash, gender, pfp_url)
                 VALUES($1, $2, $3, $4, $5, $6)
                 RETURNING *; 
                 `;
    const values = [fullname, username, email, pass_hash, gender, pfp_url]
    const { rows } = await pool.query(qry, values)
    return rows[0];
  }

  // finding by email
  static async findOneByEmail(email){
    const qry = `SELECT * FROM users WHERE email=$1;`;
    const { rows } = await pool.query(qry, [email]);
    return rows[0];
  }

  static async updateProfile(usr_id,username, pfp_url){
    const findCurrentUser = await this.findOneById(usr_id);
    if (!findCurrentUser) {
      console.error("no such user with a username exists");
      return null;
    }
    const qry = `UPDATE users
                 SET username=$1, pfp_url=$2
                 WHERE usr_id=$3 RETURNING *;`;
    const { rows } = await pool.query(qry,[username,pfp_url,usr_id]);
    return rows[0];

  }
    // find by id
  static async findOneById(usr_id){
    const qry=`SELECT * FROM users WHERE usr_id=$1;`;
    const { rows }=await pool.query(qry, [usr_id]);
    return rows[0];
  }

  // finding by username
  static async findOneByUsername(username){
    const qry=`SELECT * FROM users WHERE username=$1;`;
    const { rows }=await pool.query(qry, [username]);
    return rows[0];
  }



}
export default User;