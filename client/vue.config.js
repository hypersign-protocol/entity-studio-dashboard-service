module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/login/'
    : '/',
  devServer: {
      port: 9001
    }
}
