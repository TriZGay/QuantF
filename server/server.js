let Koa = require('koa')
let Router = require("koa-router")

let cors = require("koa-cors")

const app = new Koa()
const router = new Router()

router.get("/hello", async ctx => {
    await cors()
    ctx.body = "hello koa"
})


app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)