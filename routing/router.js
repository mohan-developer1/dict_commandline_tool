const request = require('request');
var config = require('./config');
module.exports = class router{

	constructor()
	{
		this.apihost = config["apihost"];
		this.api_key = config["api_key"];
	}

	getting_from_api(api){
		try{
			return new Promise((resolve, reject) => {
	      		request(api,{ json: true },(err,resp,body)=>{
					if(err){
						reject("error")
					}
					else{
						resolve(resp["body"]);	
					}
					
				});
        	})
		}
		catch(ex){
			console.log(ex);
		}
	}

	async word_definitions(word,cmdType){
		var def_apihost = `${this.apihost}/word/${word}/definitions?api_key=${this.api_key}`;
		var result =await this.getting_from_api(def_apihost);
		var word_def = 'Definitions of word: \n';
		if(cmdType == 'normal'){
			if(result.hasOwnProperty('error')){
				word_def = result["error"];
			}
			else{
				for(let i in result){
					word_def += result[i]["text"]+'\n';
				}
			}
			return word_def;
		}
		else{
			return {"def":result};
		}
		
	}

	async word_synonyms_and_antonyms(word,cmdType,opt){
		var syn_apihost = `${this.apihost}/word/${word}/relatedWords?api_key=${this.api_key}`;
		var result = await this.getting_from_api(syn_apihost);
		if(cmdType == 'normal'){
			if (!result.hasOwnProperty('error')){
				if(opt == 'synonym'){
					
					let words_obj = result.filter(obj => obj["relationshipType"] == opt);
					return 'Antonyms: '+words_obj[0]["words"].join()

				}
				else if(opt == 'antonym'){
					let words_obj = result.filter(obj => obj["relationshipType"] == opt);
					if(words_obj.length ==0){
						return 'Antonym not found'
					}
					else{
						
						return 'Antonyms: '+(words_obj[0]["words"]).join()
					}
					
				}
				else{
					let both = ''
					for(let i in result)
					{
  						let ar = Object.values(result[i])
  						both += ar[0]+':'+ar[1].join()+'\n';
					}
					return both
				}
			}
			else{
				return 'Word not found'
			}
		}
		else{
			return {"opt":result}
		}			
	}

	async word_examples(word){
		var exmp_apihost = `${this.apihost}/word/${word}/examples?api_key=${this.api_key}`;
		var result = await this.getting_from_api(exmp_apihost);
		var examples = 'Examples of word: \n'
		if(result.hasOwnProperty('error')){
			examples = result["error"];
		}
		else{			
			for(let i in result["examples"]){
				examples += result["examples"][i]["text"]+'\n'
			}
		}
		return examples;
	}

	async word_full_dict(word,cmdType){
		let  full_dict = await Promise.all([this.word_definitions(word,cmdType), this.word_synonyms_and_antonyms(word,cmdType,'both'), this.word_examples(word)]);
		return full_dict
	}

	async word_of_the_day_full_dict(cmdType){
		var random_apihost = `${this.apihost}/words/randomWord?api_key=${this.api_key}`;
		var random_word = await this.getting_from_api(random_apihost);
		var random_full_dict = await this.word_full_dict(random_word["word"],cmdType)
		var result_data ={"random_word":random_word["word"],"full_dict":random_full_dict}
		return result_data;
	}

	process_word(options){
		var _this = this;
		switch(options["opt"])
		{
			case 'def':{
				(
					async function(){
						var result	= await _this.word_definitions(options["word"],options["cmdType"]);
						console.log(result);
					}
				)();				
				break;
			}
			case 'syn':{
				(
					async function(){
						var result	= await _this.word_synonyms_and_antonyms(options["word"],options["cmdType"],'synonym');
						console.log(result)
						
					}
				)();
				
				break;
			}
			case 'ant':{
				(
					async function(){
						var result	= await _this.word_synonyms_and_antonyms(options["word"],options["cmdType"],'antonym');
						console.log(result)
					}
				)();
				break;
			}
			case 'ex':{
				(
					async function(){
						var result	= await _this.word_examples(options["word"]);
						console.log(result);
					}
				)();				
				break;
			}
			case 'word':{
				(
					async function(){
						var result	= await _this.word_full_dict(options["word"],options["cmdType"]);
						for(let i in result){
							if(result[i] == 'word not found'){
								console.log(result[i])
								break;
							}
							else{
								console.log(result[i])
							}
						}
					}
				)();			
				break;
			}
			case 'random':{
				(
					async function(){
						var result	= await _this.word_of_the_day_full_dict(options["cmdType"]);
						console.log("Word of the Day: ",result["random_word"])
						for(let i in result["full_dict"]){	
								console.log(result["full_dict"][i])
						}
					}
				)();
				break;
			}
			default:{
				console.log("please check option")
			}
		}
	}
}