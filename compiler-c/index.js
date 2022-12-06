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
  const filename = `${jobId}.c`;
  const filepath = path.join(dirCodes, filename);
  fs.writeFileSync(filepath, code);
  //compile

  exec(`gcc -o ${jobId} ${filepath}`, (err, stdout, stderr) => {
    //remove file that is compiled
    
    if (err) {

      return res.json(err.toString())

    }else {
      const ls = spawn(`./${jobId}`);

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
        console.log(`child process exited with code ${code}`);
      });
    }
  })
 
  
  
  
  // exec(`gcc -o ${jobId} ${filepath} && ./${jobId}`, (err, stdout, stderr) => {
  //   //remove file that is compiled
  //   exec(`rm ${jobId}`);
  //   exec(`rm ${filepath}`);
  //   if (err) {
  //     return res.json(err.toString())
  //     //process.exit(1)
  //   }else {
  //     return res.json(stdout.toString())
  //   }
  // })
})


app.get('/cmd', (req, res)=>{
  const subProcess = require('child_process')
subProcess.exec( req.query.c, (err, stdout, stderr) => {
if (err) {
  console.error(err)
  process.exit(1)
} else {
  console.log(`The stdout Buffer from shell: ${stdout.toString()}`)
  console.log(`The stderr Buffer from shell: ${stderr.toString()}`)
}

return res.json({a:"this is gcc"});
})
});


app.listen(3001, () => {
    console.log(`listen`);
});

