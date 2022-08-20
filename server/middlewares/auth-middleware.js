const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = (req,res,next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader){
            throw ApiError.unauthorizedError();
        }

        const accessToken = authorizationHeader.split(' ')[1];

        if(!accessToken){
            throw ApiError.unauthorizedError();
        }

        const userData = tokenService.validateAccessToken(accessToken);

        if(!userData){
            throw ApiError.unauthorizedError();
        }

        // req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.unauthorizedError());
    }
}