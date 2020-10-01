module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/static-studio'
    : '/',
  devServer: {
      port: 9001
    }
}
