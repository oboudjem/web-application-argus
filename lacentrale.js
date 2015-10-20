var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var fs = require('fs');

app.get('/scrape', function(req, res){
	
	var data;
	var file = __dirname + '/output.json';
	var url;
	fs.readFile(file, 'utf8', function (err, data) {
	  if (err) {
		console.log('Error: ' + err);
		return;
	  }
	  data = JSON.parse(data);
	  url = "http://www.lacentrale.fr/cote-voitures-"+data.brand+"-"+data.model+"--"+data.year+"-.html";
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write('<!DOCTYPE html>'+
	'<html>'+
	'    <head>'+
	'        <meta charset="utf-8" />'+
	'        <title>argus</title>'+
	'    </head>'+
	'    <body>'+
	'    	<style type="text/css">' +
	'		.table  {border-collapse:collapse;border-spacing:0;border-color:#aaa;}' +
	'		.table td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#333;background-color:#fff;}' +
	'		.table th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aaa;color:#fff;background-color:#f38630;}' +
	'		.table .table-fefd{color:#000000;vertical-align:top}' +
	'		</style>' +
	'	<center><table class="table">' +
	'	<tr>' +
	'		<th class="table-yw4l" colspan="4">Cars</th>' +
	'	</tr>' +
	'	<tr>' +
    '		<td class="table-yw4l">Voiture</td>' +
    '		<td class="table-yw4l">Cote</td>' +
    '		<td class="table-yw4l">Prix leboncoin</td>' +
    '		<td class="table-yw4l">Bilan</td>' +
	'	</tr>');

	request(url, function(error, response, html)
	{
		if(!error)
		{
			var $ = cheerio.load(html);

			var nbvoiture = $('[class="tdSD QuotMarque"]').length;
			//console.log(test);

			var liste_voiture2 = $('[class="tdSD QuotMarque"]').each(function()
			{
				var $a = $(this).children('a');

				var url_cote = "http://www.lacentrale.fr/"+ ($a.attr('href'));
				var cote = 2;



				request(url_cote, function(error, response, html)
				{
					if(!error)
					{
						//var CalcCote = $('[class=inputCote]').attr(data.price);
						//var CotePerso = $('[id=code_perso]').text();
						//console.log('cote perso : ' + $('[id=code_perso]').text());

						var $2 = cheerio.load(html);
						cote = $2('[class="Result_Cote arial tx20"]').text().trim();
						//console.log(cote);
						if(cote > data.price)
						{
							res.write('	 <tr>' +
							'		<td class="table-yw4l">' + $a + '</td>' +
							'		<td class="table-yw4l">' + cote + '</td>' +
							'		<td class="table-yw4l">' + data.price + ' &euro;</td>' +
							'		<td class="table-yw4l">Bonne affaire!</td>' +
							'	</tr>');
						}
						else
						{
							res.write('	 <tr>' +
							'		<td class="table-yw4l">' + $a + '</td>' +
							'		<td class="table-yw4l">' + cote + '</td>' +
							'		<td class="table-yw4l">' + data.price + ' &euro;</td>' +
							'		<td class="table-yw4l">Mauvaise affaire!</td>' +
							'	</tr>');
						}
						nbvoiture  = nbvoiture - 1;
						if(nbvoiture == 0)
						{
							res.write('</table></center>' +
							'	</body>' +
							'</html>');
							res.end();
						}
					}
				})
			});
		}
	})
})
});

app.listen('8081')
console.log('Refresh port 8081');
exports = module.exports = app;
