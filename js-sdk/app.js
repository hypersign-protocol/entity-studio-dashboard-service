//import fetch from "node-fetch";
//const fetch = require('node-fetch');
const  express = require();
const path = require('path');

const port = 1234;
const app = express();
// const server = http.createServer();
app.use(express.static('public'));
app.use(express.json())
const __dirname = path.resolve();

app.get("/", async (req, res) => {
    try {
        res.sendFile("./public/login.html", { root: __dirname });  
    } catch (e) {
        res.send(`Error: ${e}`);
    }
})

app.listen(port, () => {
    console.log('Server is running on port http://localhost:' + port)
})