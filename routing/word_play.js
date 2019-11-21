var router = require('./router')
const { prompt } = require('inquirer');
module.exports = class word_play extends router{
	
	constructor(){
		super();
		this.definationArray = []
		this.synonymArray =[]
		this.antonymArray =[]
		this.guessWord = '' 
	}

	//play_game method parse required data and convert into array
	
	async play_game(cmdtype)
	{
		//var rand = myArray[Math.floor(Math.random() * myArray.length)];
		var _this = this;
		var result = await _this.word_of_the_day_full_dict(cmdtype);
		this.guessWord = result["random_word"];
		this.definationArray = result["full_dict"][0]["def"].map(function (obj) {
  					return obj.text;
		});
		var syn_ant = result["full_dict"][1]["opt"];
		syn_ant.forEach(obj => {
				if(obj["relationshipType"] == 'synonym')
				{
					this.synonymArray = obj["words"];	
				}
				else{
					this.antonymArray = obj["words"];	
				}
		});
		_this.validation(0)
	}

	// continue_game method display user options and take input from user
	
	continue_game(){
		 var _this = this;
		 let definationArray = this.definationArray;
		 let guessWord = this.guessWord;
		 let synonymArray = this.synonymArray;
		 let questions = [
    	  {
      		type: "list",
      		name: "nextStep",
      		message: 'Select the choices:(1) Try again (2)Hint (3)Quit',
      		choices: [1,2,3]
    	 }
  		]
		  prompt(questions).then(function(answers){
			    console.log(answers.nextStep);
			    switch(answers.nextStep){
			      case 1:{
			      	 _this.validation(1);
			      	 break;
			      }
			      case 2:{
			      	_this.validation(2);
			      	break;
			      }
			      case 3:{
			      	console.log('Guess Word: ',guessWord)
			      	console.log('Synonyms:',synonymArray.join())
			      	console.log('\nDefinitions:\n',definationArray.join('\n'))
			      	return;
			        break;
			      }
			        
			    }
		  });
	}

	//random_hint mehtod display random hint for guess word

	random_hint(){
		let r_hin =[
			{
				"key":this.definationArray
			},
			{
				"key":this.synonymArray
			},
			{
				"key":this.guessWord
			}
		]
		var rand_val = r_hin[Math.floor(Math.random() * r_hin.length)]["key"];
		if(Array.isArray(rand_val)){
			return rand_val[Math.floor(Math.random() * rand_val.length)]
		}
		else{
			function randomsort(a, b) { 
				return Math.random()>.5 ? -1 : 1;
			}
		return rand_val.split('').sort(randomsort); 
		}
	}

	//validation method validated word is correct or not

	validation(option){
		var _this = this;
		let definationArray = this.definationArray;
		let guessWord = this.guessWord;
		let synonymArray = this.synonymArray;
		if(option ==0){
			var random_def = definationArray[Math.floor(Math.random() * definationArray.length)];
			console.log(`Word defination:${random_def}`);		
		}
		else if(option ==2){
			let hint_val = _this.random_hint();
			console.log(`Hint:${hint_val}`)
		}
		let questions = [
    		{
      			type: "input",
      			name: "wordGuess",
      			message:"Enter the Guess word?",
      		validate: function( value ) {
	        		if (value.length && value.match(/^[A-Za-z -]+$/)) {
	          			return true;
	        		}else{
	          			return 'Please enter the word?';
	        		}
      			}
    		}
  		]

  	  //Prompt to allow user's word guess
	  prompt(questions).then(function(answers){
	    let guess = answers.wordGuess.toLowerCase();
	    if ( guess === guessWord || (synonymArray.indexOf(guess) > -1)){
	      console.log('\nYour guess is correct\n');
	    }
	    else{
	      console.log("\nYou've entered the wrong word.\n" );
	      _this.continue_game();
	    }
	  });
	}
}