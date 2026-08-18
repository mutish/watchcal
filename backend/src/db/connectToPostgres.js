import pg from "pg";

const { Pool } = pg;

console.log("DB Config:", {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? "***" : "undefined",
    database: process.env.DB_NAME,
});

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,

});

const connectToPostgres = async () => {
    try {
        const client = await pool.connect()
        console.log("Postgres says things are looking good");
        client.release()
    } catch (error) {
        console.log("Check postgres connection:(", error.message);
    }   
};

export { pool };
export default connectToPostgres;