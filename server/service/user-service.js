require('dotenv').config();
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const db = require('../db/index');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email,password) {
        const canditate = await db.findUserByEmail(email);
        if(canditate){
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password,3);
        const activationLink = uuid.v4();
        const user = await db.createUser(email,hashPassword,activationLink);
        await mailService.sendActivationMail(email,`${process.env.API_URL}/api/activation/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return {...tokens,user:userDto};
    }

    async activate(activationLink){
        const user = await db.findUserByLink(activationLink);
        if(!user){
            throw ApiError.badRequest('Неккоректная ссылка активации')
        }
        await db.activateUser(user.id)
    }

    async login(email,password){
        const user = await db.findUserByEmail(email);
        if (!user){
            throw ApiError.badRequest('Пользователь не найден');
        }
        const isPassEquals = await bcrypt.compare(password,user.password);
        if(!isPassEquals){
            throw ApiError.badRequest('Неверный пароль')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return {...tokens,user:userDto};
    }

    async logout(refreshToken){
        const token = tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.unauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDB){
            throw ApiError.unauthorizedError();
        }
        const user = await db.findUserById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return {...tokens,user:userDto};
    }

    async getAllUsers(){
        return await db.getAllUsers();
    }
};

module.exports = new UserService();