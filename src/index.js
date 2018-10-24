import Koa from 'Koa';
import logger from 'koa-morgan';
import env from 'dotenv';
import bluebird from 'bluebird';
import {createPool, dbConfig, getConnection} from './db/database';
import router from './router';


env.config();

const server = new Koa();
const port = process.env.PORT;

let pool = createPool(dbConfig);
let queryResult;
pool.then(() => {
    server
          .use(logger('tiny'))
          .use(router.routes())
          .use(router.allowedMethods())
          .listen(port, () =>  {
              console.log(`Authintication server listen port:  ${port}`);
          });

}).catch(err => {console.log(err)});
