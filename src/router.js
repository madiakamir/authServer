import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import User from './user'
import Token from './token'

const router = new Router();

router.post('/', bodyParser(), async ctx => {
  const isAuthorized = await User.isAuthorized(ctx.request.body);
  ctx.status = 404;

  if (isAuthorized){
    const tokens = await Token.generateTokens(ctx.request.body);
    ctx.status = 200;
    ctx.body = tokens;
  } ;
});

router.get('/', async ctx => {
  const { authorization } = ctx.headers;

  if (!authorization || !authorization.match(/^Bearer\s/)) return;
  const refreshToken = authorization.replace(/^Bearer\s/, '');
  const { username } = await Token.getPayload(refreshToken);
  const hasValidRefreshToken  = await User.hasValidRefreshToken(refreshToken);

  console.log(hasValidRefreshToken);

});


export default router
