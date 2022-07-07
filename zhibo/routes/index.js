const router = require('koa-router')()
const mock = require('../mock/CURD/controllers')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/mock/add' ,mock.add)



module.exports = router
