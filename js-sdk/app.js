const express = require('express')
const http = require('http');
const axios = require('axios')
const port = 1234;
const app = express();
const server = http.createServer(app);
const cors = require('cors');
app.use(cors())
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    try {
        res.sendFile('./public/index.html', { root: __dirname });   
    } catch (e) {
        res.send(e)
    }
})
app.get('/cred', async (req, res) => {
    try {
        res.sendFile('./public/cred.html', { root: __dirname });  
    } catch (e) {
        res.send(`Error: ${e}`);
    }
})
app.get('/auth', async (req, res) => {
    try {
        const { accesstoken } = req.headers
        if (accesstoken == '' || accesstoken == null || accesstoken== undefined) {
            return res.send ('Please send accesstoken')
        }
        const url = "http://localhost:9000/api/v1/presentation/request/info";
        await axios.get(url, {
            headers: {
                accesstoken
            },
        })
        res.sendFile('./public/cred.html', { root: __dirname });  

       // return res.send(data.data)          
    } catch (e) {
       return  res.send(`Error: ${e.response.data}`)
    }
})
server.listen(port, () => {
    console.log('Server is running on port ', port)
})