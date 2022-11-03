const express = require('express')
const http = require('http');
const axios = require('axios')
const port = 3000;
const app = express();
const server = http.createServer(app);
const cors = require('cors');
app.use(cors())
app.use(express.static('public'));
app.use(express.json());
app.get('/cred', async (req, res) => {
    try {
        res.sendFile('./public/cred.html', { root: __dirname });  
    } catch (e) {
        res.send(`Error: ${e}`);
    }
})
app.get('/data', async (req, res) => {
    try {
        const { accesstoken } = req.headers
        if (accesstoken == '' || accesstoken == null || accesstoken== undefined) {
            return res.send ('Please send accesstoken')
        }
        const url = "http://localhost:9000/api/v1/presentation/request/info";
        let data = await axios.get(url, {
            headers: {
                accesstoken
            },
        })
        return res.send(data.data)          
    } catch (e) {
       return  res.send(`Error: ${e.response.data}`)
    }
})
server.listen(port, () => {
    console.log('Server is running on port ', port)
})