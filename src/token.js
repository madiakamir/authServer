import jwt from 'jsonwebtoken';
import bluebird from 'bluebird';
import env from 'dotenv';
import user from './user';
import {getConnection} from './db/database';

env.config();
const key = process.env.KEY;

bluebird.promisifyAll(jwt);

async function generateTokens(username){
  const accessToken = jwt.sign({username}, key, {expiresIn : '10m'});
  const refreshToken = jwt.sign({username}, key, {expiresIn : '30d'});
  getConnection('update ref_users ' +
                'set access_token = :accessToken, ' +
                    'refresh_token = :refreshToken ' +
                'where p_username =:username ', [accessToken,refreshToken, username.username]);
  const tokens ={
    accessToken,
    refreshToken,
    expiresIn: jwt.decode(accessToken).exp,
  }

  return tokens;
}

async function getPayload(token){
  try {
    const payload = await jwt.verifyAsync(token, key);
    return payload;
  } catch (e) {
    console.log('Token is invalid ' + token);
  }
  return {}
}


export default { generateTokens, getPayload }
