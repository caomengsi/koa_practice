
const Koa = require('koa');
const route = require('koa-route')
const compose = require('koa-compose');
const koaBody = require('koa-body');
const app = new Koa();

// 使用原生路由
// const main = ctx => {
//     if (ctx.request.path == '/') {
//         ctx.response.body = 'index';
//     } else {
//         ctx.response.body = 'hello world';
//     }

// }

// 使用koa-route
const main = ctx => {
    // ctx.response.status = 404;
    // ctx.response.body = 'Page Not Found'; 
    // ctx.response.body = '啦啦啦';
    ctx.throw(500);
}
const index= ctx => {    
    ctx.response.body = 'index';
}

// 重定向
const redirect = ctx => {
    ctx.response.redirect('/')
}

// 中间件
const logger = (ctx, next) => {
    console.log(`${Date.now()}${ctx.request.url}`)
    next() // 必须有next 交给下一个中间件 或者下一步执行的路由等
    console.log(`final${ctx.response.body}`)
}
// 测试中间件的顺序
const one = (ctx, next) => {
    console.log('>> one');
    next();
    console.log('<< one');
  }
  
  const two = (ctx, next) => {
    console.log('>> two');
    next();   //如果注释掉next执行中段
    console.log('<< two');
  }
  
  const three = (ctx, next) => {
    console.log('>> three');
    next();
    console.log('<< three');
  }

// 中间件错误处理
const hander = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.boy = {
            message: err.message
        }
        ctx.app.emit('error', err, ctx);
    }
}

// app.use(one);
// app.use(two);
// app.use(three);
// app.use(logger)
// 可以使用koa-compose模块可以将多个中间件合成为一个
const middleware = compose([logger, hander])
app.use(middleware)

app.on('error', (err,ctx) => console.error('server error', err));

// cookie
const about = ctx => {
    const n = Number(ctx.cookies.get('views') || 0)+1
    ctx.cookies.set('views', n)
    ctx.response.body = n + 'views'
}

// 表单
const test = ctx => {
    const body = ctx.request.body
    if (!body.name) ctx.throw(400, '.name required')
    console.log(111, body.name)
    ctx.response.body = {name: body.name}
}
app.use(route.get('/', index))
app.use(route.get('/about', test))
app.use(route.get('/redirect', redirect));

app.listen(3000);