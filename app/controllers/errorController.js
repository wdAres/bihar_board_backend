module.exports = class ErrorController{
    static showError = async (err,req,res,next)=> {

        return  res.status(err.statusCode || 500).json({
            message:err.message || 'something went wroong!',
            code:err.statusCode,
            status:err.status,
            stack:err.stack,
            error:err
        })


    }
}