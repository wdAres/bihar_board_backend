module.exports = class ErrorController{
    static showError = async (err,req,res,next)=> {

         res.status(err.statusCode || 500).json({
            message:err.message || 'something went wroong!',
            status:err.status,
            stack:err.stack
        })

    }
}