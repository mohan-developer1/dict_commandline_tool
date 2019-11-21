// {apihost}/words/randomWord?api_key={api_key}
// {apihost}/word/{word}/definitions?api_key={api_key}
// {apihost}/word/{word}/examples?api_key={api_key}
// {apihost}/word/{word}/relatedWords?api_key={api_key}
const request = require('request');
module.exports = class router{
	constructor()
	{
		this.apihost = 'https://fourtytwowords.herokuapp.com';
		this.api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164'
	}
	getting_from_api(api){
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
	async word_definitions(word){
		var def_apihost = `${this.apihost}/word/${word}/definitions?api_key=${this.api_key}`;
		var result =await this.getting_from_api(def_apihost);
		return result;
	}
	async word_synonyms(word){
		var syn_apihost = `${this.apihost}/word/${word}/relatedWords?api_key=${this.api_key}`;
		console.log(def_apihost);
		var result = await getting_from_api(syn_apihost);
		return result;
	}
	async word_antonyms(word){
		// var def_apihost = `${this.apihost}/word/${word}/definitions?api_key=${this.api_key}`;
		// console.log(def_apihost);
		// var result = await getting_from_api(def_apihost);
		// return result;
	}
	async word_examples(word){
		var exmp_apihost = `${this.apihost}/word/${word}/examples?api_key=${this.api_key}`;
		console.log(def_apihost);
		var result = await getting_from_api(exmp_apihost);
		return result;
	}
	async word_full_dict(word){

	}
	async word_of_the_day_full_dict(){
		var random_apihost = `${this.apihost}/words/${word}/randomWord?api_key=${this.api_key}`;
		console.log(def_apihost);
		var result = await getting_from_api(random_apihost);
		return result;
	}
	process_word(options){
		var _this = this;
		switch(options["opt"])
		{
			case 'def':{
				_this.word_definitions(options["word"]);
				break;
			}
			case 'syn':{
				_this.word_synonyms(options["word"]);
				break;
			}
			case 'ant':{
				_this.word_antonyms(options["word"]);
				break;
			}
			case 'ex':{
				_this.word_examples(options["word"]);
				break;
			}
			case 'word':{
				_this.word_full_dict(options["word"]);
				break;
			}
			case 'random':{
				_this.word_of_the_day_full_dict();
				break;
			}
			default:{
				console.log("please check option")
			}
		}
	}
}