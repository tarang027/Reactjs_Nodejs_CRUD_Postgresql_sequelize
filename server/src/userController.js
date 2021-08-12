//#region Module import
const userRoute = require('express').Router();
const { User } = require('../models')
//#endregion


//#region Get Methods
userRoute.get('/api/user/getAll', async (req, res) => {
    try {
        let data = await User.findAll();
        return (data && data.length > 0 ? res.send({ status: true, data }) : res.send({ status: false, message: 'No data found' }))
    }
    catch (e) {
        console.log(e)
        res.send({ status: false, message: 'Something went wrong.' })
    }
});


userRoute.get('/api/user/getUserById/:_id', async (req, res) => {
    try {
        let { _id } = req.params;
        let data = await User.findOne({
            where: { _id },
        });
        return (data ? res.send({ status: true, data }) : res.send({ status: false, message: 'No data found' }))
    }
    catch (e) {
        console.log(e);
        res.send({ status: false, message: 'Something went wrong.' })
    }
})
//#endregion


//#region Post Methods
userRoute.post('/api/user/addEditUser', async (req, res) => {
    try {
        let { actionType, _id, UserName, Bio, DateOfBirth, Hobbies ,Role , ProfilePic } = req.body;

        if (actionType === 'edit') {

            let data = await User.update({ UserName, Bio, DateOfBirth, Hobbies ,Role , ProfilePic },{ where: { _id } });
            res.send({ status: true, message: 'User  updated successfully' })
        }
        else {
            let data = await User.create({ UserName, Bio, DateOfBirth, Hobbies ,Role , ProfilePic })
            res.send({ status: true, message: 'User  inserted successfully' })
        }
    }
    catch (e) {
        console.log(e)
        res.send({ status: false, message: 'Something went wrong.' })
    }
})

userRoute.post('/api/user/deleteUser', async (req, res) => {
    try {
        let { _id } = req.body

        if (_id) {
            const data = await User.findOne({ where: { _id } })
            if (data) {
                await data.destroy()
                res.send({ status: true, message: 'User  deleted successfully' })
            }
            else {
                res.send({ status: false, message: "User  doesn't exists." })
            }
        }
        else {
            res.send({ status: false, message: "User  id is required." })
        }
    }
    catch (e) {
        console.log(e)
        res.send({ status: false, message: 'Something went wrong.' })
    }
})
//#endregion

module.exports = userRoute;