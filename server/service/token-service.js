require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('../db/index');

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'30m'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId,refreshToken) {
        const tokenData = await db.findTokenByUserId(userId);
        if(tokenData){
            return await db.updateRefreshToken(userId,refreshToken);
        }
        const token = await db.createRefreshToken(userId,refreshToken);
        return token;
    }
};

module.exports = new TokenService();