import Users from '../models/usersModel.js'

export const getNumberOfUsers = async(req, res) => {
    try {
        const users = await Users.find();
        res.json(users.length)
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
}

export const getNumberOfAdresses = async(req, res) => {
    try {
       const address = await Users.find({
            address: { $nin: [null, ""] }
        });
        res.json(address.length)
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error'})
    }
}


