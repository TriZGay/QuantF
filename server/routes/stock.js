const Stock = require("../type/stock")

const router = require("koa-router")()

router.prefix("/stocks")

router.post("/", (ctx, next) => {
    let stcoks = [new Stock("test")]
    ctx.body = {
        code: 10000,
        data: stcoks,
        message: "success"
    }
})

module.exports = router