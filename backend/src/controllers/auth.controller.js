export const signup = async (req, res) => {
    try {
        const {fullname, username, email, password} = req.body;

    } catch {

    }
}

export const login = (req, res) => {
    console.log('login says hi');
}

export const logout = (req, res) => {
    console.log('logout says bye');
}