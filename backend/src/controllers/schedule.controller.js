import Schedule from "../models/schedule.model.js";


export const fetchSchedule = async (req, res) => {
    try {
        const usrId = req.user.usr_id;
        const result = await Schedule.fetchSchedule(usrId);

        if (!result.length) {
            return res.status(200).json({ result: [] });
        }

        res.status(200).json({ result });
        
    } catch (error) {
        console.log("An error popped up in fetchschedule controller: ", error.message);
        res.status(500).json({message:"Can't fetch your schedule, try again later"});
        
    }
    
}