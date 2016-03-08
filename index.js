var express = require('express'); 

var app = new express(); 

var baseAppUrl = "https://fierce-everglades-29355.herokuapp.com/"; 

app.use(express.static(__dirname + '/view')); 
//html files in here

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
    res.sendFile("index.html"); 
}); 

app.get('/new/*', function (req, res) {
    var providedUrl = req.params[0]; 
    console.log(providedUrl); 
    //console.log(typeof Number(providedUrl) == "number", isNaN(Number(providedUrl)))
    
    //TODO: encode and decode URL to check for appropriate characters and allow for proper format
    if (typeof Number(providedUrl) == "number" && !isNaN(Number(providedUrl))) {

        res.redirect(findAlternative(baseAppUrl+providedUrl));       
    }
    
    else if (!Number(providedUrl) && checkForExisting(providedUrl, alternativeUrls)) {
    
        res.json({
            'requested-url': providedUrl, 
            'message': 'an alternative to the requested url already exists!'
        }); //TODO: add logic to get the existing alternate URL.   
    
        }
    
    else {
    
        addToDictionary(baseAppUrl, decodeURIComponent(providedUrl), alternativeUrls); 
        res.json(alternativeUrls); 
    }
    
}); 


app.listen(app.get('port'), function() {
    console.log('app is running on port', app.get('port')); 
}); 

//0: check if the provided input is a URL, or a number
//if its a number and it exists, go to that URL
//if its a number, and it doesn't exist, respond with an error
//first check if the URL exists in the URL dictionary
//if it does, print out that URL and the shortened URL 
//if it doesn't, create a new URL for it, and respond with the JSON 
//of the supplied URL vs the alternative URL 




//in memory database of URLs

//all of the below should be abstracted into its own module for URL management and brought in as a dependency.

var alternativeUrls = []; 

//looks through the dictionary to see if a URL already exists for the provided url 

function checkForExisting(aSearchTerm, anArray) {
    var exists = false; 
    anArray.forEach(function(value) {
        if (value.providedUrl == aSearchTerm) {
            exists = true; 
        }
    }); 
    return exists; 
}

function findAlternative(searchString) {
    var alternative = ""; 
    alternativeUrls.forEach(function(value) {
        if (value.alternativeUrl == searchString) {
            alternative = value.providedUrl; 
        }
    }); 
    return alternative; 
}


//two functions below are for adding a new URL and generating a new URL 

function addToDictionary(baseUrlString, value, anArray) {
    anArray.push({
        providedUrl: value, 
        alternativeUrl: baseUrlString+getAlternativeUrl()
    }); 
}

var count = 0; 

function getAlternativeUrl () {
    var alternativeUrl = count; 
    count++; 
    return alternativeUrl; 
}

