const express = require('express')
const http = require('http');
const axios = require('axios')
const port = 1234;
const app = express();
const server = http.createServer(app);
const cors = require('cors');
app.use(express.static('../js-sdk/public'));
app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
    try {
        res.sendFile('../js-sdk/public/index.html', { root: __dirname });   
    } catch (e) {
        res.send(e)
    }
})
app.get('/auth', async (req, res) => {
    try {
        console.log('auth')
        const { accesstoken } = req.headers
        console.log(accesstoken)

        if (accesstoken == '' || accesstoken == null || accesstoken== undefined) {
            return res.send ('Please send accesstoken')
        }
        const url = "http://localhost:9000/api/v1/presentation/request/info";
        const response=  await axios(url, {
            headers: {
                accesstoken
            },
        })
        const data = response.data.data.userDetail     
        res.send(data)
       // res.sendFile(`../js-sdk/public/home.html?data=${data}`, { root: __dirname });  

    } catch (e) {
       return  res.send(`Error: ${e.response.data}`)
    }
})
server.listen(port, () => {
    console.log('Server is running on port ', port)
})