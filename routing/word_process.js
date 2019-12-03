const request = require('request');
var config = require('./config');
module.exports = class word_process{

	constructor()
	{
		this.apihost = config["apihost"];
		this.api_key = config["api_key"];
	}

	// fetching result form api 
	
	getting_from_api(api,opt){
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

	async parsing_word(word,opt){
		var def_apihost = `${this.apihost}/word/${word}/${config[opt]}?api_key=${this.api_key}`;
		let obj ={}
		try{
			var result =await this.getting_from_api(def_apihost,opt);		
			if(result.hasOwnProperty('error')){
				return result["error"];
			}
			else{
				if(opt == 'def'){
					obj[opt] = result.map(obj => obj["text"]);
				}
				else if(opt == 'syn' || opt == 'ant' || opt == 'word'){
				 	result.forEach((element)=>{ obj[element["relationshipType"].slice(0,3)]=element["words"] });
				}
				else if(opt == 'ex'){
					obj[opt] = result["examples"].map(obj => obj["text"])
				}
				return obj;
			}
		}
		catch(ex){
			console.log(ex)
		}
	}

	async  word_full_dict (word) {
            var _this = this;
            try{
            	let ar_opt = config["options"];     
            	const promises = ar_opt.map(each_opt => _this.parsing_word(word,each_opt))
            	const result = await Promise.all(promises);
            	if(typeof result[0] == 'string')
            		return result[0]
            	let result_obj={}
            	result.forEach(obj => {
            		let keys = Object.keys(obj)
            		if(keys.length>1){
            			result_obj[keys[0]]=obj[keys[0]]
            			result_obj[keys[1]]=obj[keys[1]]
            		}
            		else{
            			let key = keys.toString()
            			result_obj[key]=obj[key]
            		}  
				})
            	return result_obj;
            }
            catch(ex){
            	console.log(ex)
            }
    }
	// word_of_the_day_full_dict method fetch random word from api and

	async word_of_the_day_full_dict(){
		try{
			var random_apihost = `${this.apihost}/words/randomWord?api_key=${this.api_key}`;
			var random_word = await this.getting_from_api(random_apihost);
			var random_full_dict = await this.word_full_dict(random_word["word"])
			var result_data ={"random_word":random_word["word"],"full_dict":random_full_dict}
			return result_data;
		}
		catch(ex){
			console.log(ex)
		}
	}

	display_result(result,opt){

		if (typeof result == "string")
			console.log(result)
		else if ((Object.keys(result)).includes(opt))
			console.log(opt,':\n',result[opt].join('\n')+'\n')

		else
			console.log(opt,': Not Found')
	}
	
	process_full_dict(result){
		var _this = this;
		let keys = Object.keys(result)
		for(let i=0;i<keys.length;i++){
			_this.display_result(result,keys[i])
		}
	}
	//process_word method call appropriate method and Display result 

	async process_word(options){
		var _this = this;
		var opt = options["opt"]
		try{
			if (opt == 'word'){
				let result = await  _this.word_full_dict(options["word"]);
				if(typeof result == 'string')
					console.log(result)
				else
					_this.process_full_dict(result)		
			}
			else if(opt == 'random'){
				let result = await  _this.word_of_the_day_full_dict();			
				console.log("Word of The Day: ",result["random_word"]+'\n')
				_this.process_full_dict(result["full_dict"])
			}
			else{
				let result = await _this.parsing_word(options["word"],opt);
				_this.display_result(result,opt)	
			}		
		}
		catch(ex){
			console.log(ex)
		}
	}
}

