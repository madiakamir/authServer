import Joi from 'joi';
import schema from './schema';
import {getConnection} from './../db/database';
import Token from './../token'

async function isAuthorized(request){

  const {error, value} = Joi.validate(request, schema);
  let result = false;
  if (error) return false;


   const authParamFromDb = await getConnection('select id, get_hash(:password) providedPassword,  p_password ' +
                                                'from ref_users ' +
                                                'where p_password  = get_hash(:password)', [value.password]);
  if  (authParamFromDb != '' && authParamFromDb.rows.length != 0){
    const providedPassword = authParamFromDb.rows[0].PROVIDEDPASSWORD;
    const correcPassword = authParamFromDb.rows[0].P_PASSWORD;
    result = providedPassword.toString('ascii') == correcPassword.toString('ascii') ;
  }

  return result;
}

async function hasValidRefreshToken(token){
    const { username } = await Token.getPayload(token);
    const refreshToken = await getConnection('select refresh_token ' +
                                                ' from ref_users '+
                                                ' where p_username = :username ', [username.username]);
    return refreshToken.rows[0].REFRESH_TOKEN;
}



export default {isAuthorized, hasValidRefreshToken}
