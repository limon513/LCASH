const {StatusCodes} = require('http-status-codes');

const info = function controller(req,res){
    return res.status(StatusCodes.OK).json({
        succes:"true",
        message:"Api is Live!",
        error:{},
        data:{}
    });
};

module.exports={
    info,
};