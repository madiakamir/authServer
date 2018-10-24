import db from 'oracledb';
import bluebird from 'bluebird';
import PromiseModule from 'es6-promise';

const Promise = PromiseModule.Promise;
let pool;

let dbConfig = {
  user: 'VTB_PIL',
  password: 'VTB_PIL',
  connectString: '192.168.102.62/NEWALFA2',
  poolMax: 10,
  poolMin: 0,
  poolIncrement: 1
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
