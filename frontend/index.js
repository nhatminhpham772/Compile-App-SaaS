const express = require('express');
var cors = require('cors')
const app = express();

//file
const fs = require('fs');
const fileName = './customConfig.json';



//global varriable
var Languages;

app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.get('/', (req, res)=>{
    res.sendfile(__dirname+ "/index.html");
});

app.get('/admin', (req, res)=>{
    res.sendfile(__dirname+ "/admin.html");
});

app.get('/read-custom-config', (req, res)=>{
    let rawdata = fs.readFileSync('customConfig.json');
    let CustomConfig = JSON.parse(rawdata);
    Languages = CustomConfig.languages
    return res.json(Languages);
});

app.post('/edit-custom-config', (req, res)=>{
    let rawdata = fs.readFileSync('customConfig.json');
    let CustomConfig = JSON.parse(rawdata);
    const {languages} = req.body;
    //let languages = [{"name":"C test","linkContainer":"http://3.91.202.133:3002/run"}]
    CustomConfig.languages = languages;
    fs.writeFileSync(fileName, JSON.stringify(CustomConfig), function writeJSON(err) {
        if (err) return console.log(err);
    });
    return res.json("success");
});

app.listen(3000);