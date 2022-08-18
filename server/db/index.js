const pool = require('../db');

class DataBase {
    async findUserById(userId){
        const {rows: users} = await pool.query('SELECT * FROM users WHERE id=$1',[userId]);
        return users[0];
    };
    
    async findUserByEmail(email) {
        const {rows: users} = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
        return users[0];
    };

    async findUserByLink(activationLink) {
        const {rows: users} = await pool.query('SELECT * FROM users WHERE activationlink=$1',[activationLink]);
        return users[0];
    };

    async createUser(email,password,activationLink) {
        const {rows:users} = await pool.query('INSERT INTO users (email,password,activationlink) VALUES ($1,$2,$3) RETURNING *',[email,password,activationLink]);
        return users[0];
    };

    async activateUser(user_id){
        const {rows:users} = pool.query('UPDATE users SET isactivated=true WHERE id=$1',[user_id]);
    }

    async findTokenByUserId(userId){
        const{rows:tokens} = await pool.query('SELECT * FROM tokens WHERE user_id=$1',[userId]);
        return tokens[0];
    };

    async createRefreshToken(userId,refreshToken){
        const {rows:tokens} = await pool.query('INSERT INTO tokens (user_id,refreshtoken) VALUES ($1,$2) RETURNING *',[userId,refreshToken]);
        return tokens[0];
    };

    async updateRefreshToken(userId,refreshToken){
        const {rows:tokens} = await pool.query('UPDATE tokens SET refreshtoken=$1 WHERE user_id=$2 RETURNING *',[refreshToken,userId]);
        return tokens[0]; 
    };

    async deleteRefreshToken(refreshToken){
        const {rows:tokens} = await pool.query('DELETE FROM tokens WHERE refreshtoken=$1 RETURNING *',[refreshToken]);
        return tokens[0];
    }

    async findRefreshToken(refreshToken){
        const {rows:tokens} = await pool.query('SELECT * FROM tokens WHERE refreshtoken=$1',[refreshToken]);
        return tokens[0];
    }

    async getAllUsers(){
        const {rows: users} = await pool.query('SELECT * FROM users');
        return users;
    }
};

module.exports = new DataBase();