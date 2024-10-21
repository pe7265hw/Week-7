//creates variables for all elements on the page
let randomCountryElement = document.querySelector('#random-country')
let userAnswerElement = document.querySelector('#user-answer')
let submitButton = document.querySelector('#submit-answer')
let resultTextElement = document.querySelector('#result')
let resetButton = document.querySelector('#reset-game')

//sets the max number of conneciton attempts and interval bertwen attempts
connectionLimit = 3
reconnectionWait = 5000

//function of find random country info from the countriesAndCodes array
function findCountryInfo(){
    //finds a random object from the array
    let randomCountry = countriesAndCodes[(Math.floor(Math.random() * countriesAndCodes.length))]
    let countryName = randomCountry.name //pulls just the name
    randomCountryElement.innerHTML = countryName
    let countryCode = randomCountry["alpha-2"] //pulls just the country code
    url = `https://api.worldbank.org/v2/country/` + countryCode + `?format=json`//concatenates with worldband api URL
}

//promise function which uses fetch function to connect to worldbank api
function capitalGame(attempts){

    fetch(url).then((response) => {
        return response.json() //extracts json data
    }).then((countryData)=>{
        let correctAnswer = countryData[1][0].capitalCity //finds the correct capital city
        let guessedAnswer = userAnswerElement.value
        //conditional statement to display answer based on user response
        if(correctAnswer === guessedAnswer){
            resultTextElement.innerHTML = `Thats right! The answer is ${correctAnswer}.`
        }
        else{
            resultTextElement.innerHTML = `Sorry, that's incorrect, the correct answer is ${correctAnswer}.`
        }
    //catch error block that decrements counter if error, logs it and calls function again after timer
    // shows alert after three failure  
    }).catch((err)=>{
        connectionLimit--
        console.log('There was an error, see the log:', err)
        setTimeout(capitalGame, reconnectionWait, connectionLimit)
        if(attempts <= 0){
            alert('Unable to connect to the WorldBank Server. Please try again later.')
            return
        }
    }) // I was unsure if I was supposed to include a .finally clause as I don't think I want it to run
       // whether or not there was a connection as that resets the country which is shown if the connection
       // was correctly made. It also stopped the result element from resetting so I put setTimeout in the
       // .catch block.
}


findCountryInfo() //calls function which shows random country

//click event listener for submit button with connection limit as argument
submitButton.addEventListener('click', function(){ 
capitalGame(connectionLimit)
})

//click event listener for reset button which resets values and calls findCountryInfo() to reset random country 
resetButton.addEventListener('click', function(){
    userAnswerElement.value = null
    resultTextElement.innerHTML = null
    resultTextElement.value = resultTextElement.defaultValue

    findCountryInfo()
    

})


 
