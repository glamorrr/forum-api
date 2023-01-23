const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');

const AuthenticationTestHelper = {
  async createAccessToken(userId) {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const accessToken = await jwtTokenManager.createAccessToken({ id: userId });
    return accessToken;
  },
};

module.exports = AuthenticationTestHelper;
