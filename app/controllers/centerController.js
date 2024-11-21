const userModel = require("../models/userModel")
const handleAsync = require("../utils/handleAsync")
const ResponseClass = require('../utils/ResponseClass')
const handlePagination = require('../utils/handlePagination')
module.exports  = class CenterController{
    static getAllCenters = handleAsync(async(req,res,next)=>{
        const centers = await userModel.findAll({where:{role:'center'}})
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        const { docs, pages, total, limit: paginationLimit } = await userModel.paginate({ page, paginate:limit,where: { role: 'center' },order: [['createdAt', 'DESC']],  });


        const paginationData = handlePagination({ page, pages, total, limit: paginationLimit });


        return new ResponseClass('All inquiry data', 200, { docs, ...paginationData }).send(res)
        
    })

    // check kaeo sb kaam ho rakha hai  ye erro


    static getCenterById = handleAsync(async (req, res, next) => {
        const { id } = req.params; 
        const center = await userModel.findOne({ 
            where: { 
                role: 'center',  
                id: id           
            }
        });

        if (!center) {
            return next(new ErrorClass('Center not found!', 404)); 
        }
        return new ResponseClass(`Details of center with ID ${id}`, 200, center).send(res)
       
    });

}