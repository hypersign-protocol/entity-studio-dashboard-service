module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/studio'
    : '/',
  devServer: {
      port: 9001
    }
}
