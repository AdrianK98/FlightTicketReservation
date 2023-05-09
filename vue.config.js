// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

// module.exports = {
//   publicPath: '/flight_seat_reservation/'

// }

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/flight_seat_reservation/'
    : '/',
  transpileDependencies: true
})