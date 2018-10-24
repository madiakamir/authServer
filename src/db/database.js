import db from 'oracledb';
import bluebird from 'bluebird';
import PromiseModule from 'es6-promise';
import env from 'dotenv';

env.config();
const Promise = PromiseModule.Promise;
let pool;

let dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  connectString: process.env.DB_URL,
  poolMax: process.env.POOL_MAX,
  poolMin: process.env.POOL_MIN,
  poolIncrement: process.env.POOL_INC
}

//create pool async
async function createPool(dbConfig){
  let orclDbPool = new Promise(function(resolve, reject){
    db.createPool(dbConfig, (err,p) => {

      if(err){
        reject(err);
      } else {
        resolve(p);
        pool = p;
      }
      });
  });

  try{
    return await orclDbPool;
  } catch(err){
    console.log(err);
  }

}

async function getConnection(query,params){
  let cooncetion;
  let resultSet;
  cooncetion =  new Promise((resolve, reject) => {
    pool.getConnection((err, conn)=>{
      if(err){
        reject(err);
      } else {
        resultSet = doExecute(conn,query,params);
        resolve(resultSet);
      }
    });
  });


  try {
     return await cooncetion;
  } catch(err){
    console.log(err);
  }

}

async function doExecute(connection, sql, params){
   let isCommit = (/^update|insert|delete\s/i).test(sql)
   let promise = new Promise((resolve, reject) => {
     connection.execute(sql, params, { autoCommit: isCommit, outFormat: db.OBJECT, maxRows:1000 }, (err, result) => {
       if(err){
         reject(err);
       } else {
         resolve(result);
       }
     });
   });


  try {
     return await promise;
  } catch (err) {
       console.log(err);
  } finally {
     connection.release(function(err){
       if(err){
         console.log(err);
       }
       return;
     });

  }

}


export {createPool, dbConfig, getConnection};
