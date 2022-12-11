const express = require('express');
var cors = require('cors')
const app = express();
const fs = require('fs');
const path = require('path')
const { v4 : uuid } = require('uuid')

const dirCodes = path.join(__dirname, "codes");


if(!fs.existsSync(dirCodes)){
  fs.mkdirSync(dirCodes, {recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

const {exec} = require("child_process")
const { spawn } = require('node:child_process');
app.get('/', (req, res)=>{
    return res.json("home");
});

app.post("/run", (req,res) =>{
  const {code,input} = req.body;
  if (code === undefined) {
    return res.status(400).json({success: false, error:"empty code"});
  }

  //generate file
  const jobId = uuid(); 
  const filename = `${jobId}.py`;
  const filepath = path.join(dirCodes, filename);
  fs.writeFileSync(filepath, code);
  //compile
  
  const ls = spawn('python3',[`${filepath}`]);

  if(input != "" && input != null){
    ls.stdin.write(input);
  }
  
  ls.stdin.end();
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    return res.json(data.toString())
  });
  
  ls.stderr.on('data', (data) => {
    
    console.error(`stderr: ${data}`);
    return res.json(data.toString())
  });
  
  ls.on('close', (code) => {
    exec(`rm ${filepath}`);
    exec(`rm ${jobId}`);
    console.log(`child process exited with code ${code}`);
  });

})
app.listen(3004, () => {
    console.log(`listen`);
});

