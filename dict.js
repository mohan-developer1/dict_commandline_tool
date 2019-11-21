  
"use strict";
const program = require('commander');
var router = require('./routing/router.js')
// var data = async function(options){
//   try{
//     let wordDict = await apiResponse(options);
//     console.log(wordDict);
//   }catch(error){
//     console.log(error);
//   }
// }

program
  .option('def <word>', 'Shows the definition of a word')
  .option('syn <word>', 'Shows the synonyms of a word')
  .option('ant <word>', 'Shows the antonyms of a word')
  .option('ex  <word>', 'Shows the examples of a word')
  .option('[word]',  'Shows all the details of a word')
  .option('play')
  .action(function(word){
    let options = {};
    if (program.def){
      options.opt = 'def';
      options.word = program.def;
      options.cmdType = 'normal';
    }
    else if (program.syn){
      options.opt = 'syn';
      options.word = program.syn;
      options.cmdType = 'normal';
    }
    else if (program.ant){
      options.opt = 'ant';
      options.word = program.ant;
      options.cmdType = 'normal';

    } 
    else if (program.ex) {
      options.opt = 'ex';
      options.word = program.ex;
      options.cmdType = 'normal';
    }
    else if(program.play){
      options.opt = 'game';
      options.word = '';
      options.cmdType = 'game';
    }
    else if(process.argv.length < 4)
    {
      if(typeof(word) === 'string'){
        options.opt = 'word';
        options.word = word ;
        options.cmdType = 'normal';
      }
      else{
        options.opt = 'random';
        options.word = '';
        options.cmdType = 'normal';
      }
    }
    else {
      console.log('Command not found');
      return;
    }
    // console.log(options);
    if (options.cmdType == 'normal'){
        var router_obj = new router();
        router_obj.process_word(options);
    }
    else{
      console.log("On process");
    }
  })
  .parse(process.argv);