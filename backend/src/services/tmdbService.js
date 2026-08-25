export const fetchfromTMDB = async (endpoint) =>{
    if (!process.env.TMDB_READ_ACCESS_TOKEN) {
        throw new Error('TMDB_READ_ACCESS_TOKEN is missing. Check your .env file.');
    }

    const url = `https://api.themoviedb.org/3${endpoint}`;
    const response = await fetch(url, {
        headers: {
            accept:'application/json',
            Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`
        }
    });

    if(!response.ok){
        throw new Error(`Error fetching: ${response.statusText}`);
    }
    return await response.json();
}