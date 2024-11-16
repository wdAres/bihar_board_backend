const userModel = require("../models/userModel")
const handleAsync = require("../utils/handleAsync")

module.exports  = class CenterController{
    static getAllCenters = handleAsync(async(req,res,next)=>{
        const centers = await userModel.findAll({where:{role:'center'}})

        res.status(200).json({
            message:'List of all centers',
            data:{
                docs : centers
            },
            status:'success'
        })
    })
}