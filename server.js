"use strict";
const http = require("http");
const sharp = require("sharp");
const text2png =require("text2png");
const _ =require("lodash");

const server = http.createServer(async(req, res) => {
  // res.writeHead(200, {
  //   "Access-Control-Allow-Methods": "*",
  //   "Access-Control-Allow-Origin": "*",
  //   "Access-Control-Allow-Headers": "*",
  //   "Content-Type": "application/json; charset=UTF-8"
  // });

  if (req.url.startsWith("/bookmark?name=")) {

    let userName = decodeURI(req.url);
    let user = userName.substr(15);
     
    if(user.length > 4 ){
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      res.end('{"msg":"姓名不得超过4个字哦！"}')
      return;
    }

    let newuser='';

    for (let char of user){
      newuser += char + '\n' + '\n';
    }

    newuser = newuser.trim();
    
    let heword =text2png("贺",{
      font: '28px Kaiti',
      localFontPath: './STXINGKA.ttf',
      localFontName: 'Kaiti',
      color: "#f2c490",
    });

    let namePng = text2png(newuser, {
      font: '34px Kaiti',
      localFontPath: './STXINGKA.ttf',
      localFontName: 'Kaiti',
      color: "#f2c490",
      output:'buffer',
      lineSpacing: -5,
    });

    let blesswords=[
      [ '鼠年大吉', '财源广进', '心想事成'],
      [ '合家幸福', '鼠年大吉', '岁岁平安'],
      [ '恭喜发财', '万事胜意', '鼠年大吉'],
    ];
    
    let options = [
      // { top: 50, left: 60 },
      { top: 80, left: 90 },
      { top: 180, left: 90 },
      { top: 280, left: 90 },
    ];
    
    let words = blesswords[_.random(0,blesswords.length - 1)];
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let wordPng = text2png(word,{
         color: "#f2c490",
         font:  '55px Kaiti',
         localFontPath: './STXINGKA.ttf',
         localFontName: 'Kaiti',
      });
      options[i].input = wordPng;
    }
     
    let metadata = await sharp(namePng).metadata();

      options.push({
         input: namePng,
         top: 420 - metadata.height,
         left: 340,
      })
      
      options.push({
        input: heword,
        top: 395,
        left: 380,
      })
    
   
    sharp("icon/heka.png")
      .composite(options)
      .png()
      .toBuffer()
      .then(data => {
        res.setHeader('Content-Type', 'image/png');
        res.end(data);
      });
     
  }
});
server.listen(2020);

 