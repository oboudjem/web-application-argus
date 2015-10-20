var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
	
	url = 'http://www.leboncoin.fr/voitures/852693116.htm?ca=12_s';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var brand, model, year, price, city;
			var json = { brand : "", model : "", year : "", price : "", city : "", km : ""};			
			
						
			var brand = $('[itemprop=brand]').text();
			var model = $('[itemprop=model]').text();
			var year = $('[itemprop=releaseDate]').text().trim();
			var price = $('[itemprop=price]').attr("content");	
			var city = $('[itemprop=addressLocality]').text();	
			var km;
			
			$('.criterias').filter(function(){
               var data = $(this);			  
			   
               var kmTemp = data.children().children().eq(4).children().last().text().trim();     
			   var kmTemp2 = kmTemp.replace(" ", "");
			   km = kmTemp2.replace(" KM", "");
			   
            })
			
			
			
			json.brand = brand;	
			json.model = model;	
			json.year = year;	
			json.price = price;	
			json.city = city;	
			json.km = km;				
								
			
		}

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        console.log('File successfully written!');
		
        })
		
        res.send('Fichier JSON créé !')
	})
})

app.listen('8081')
console.log('Refresh port 8081');
exports = module.exports = app; 	