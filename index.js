const express = require('express')
const app = express()
const googleTrends = require('google-trends-api')
require('dotenv').config()

var api_key = process.env.API_KEY;
var domain = process.env.DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var collectData = [];
searchResults = googleTrendsSearch('bitcoin');
searchResults.then(function(results){
	parsedAndOneLayerIn = parseJson(results);
	atArray = parsedAndOneLayerIn.timelineData;
	for(var dataPoint in atArray){
		collectData.push(atArray[dataPoint].value[0]);
	}
	sendEmail(collectData);
}).catch(function(err){
	console.log(err)
})

function sendEmail(collectData){
var data = {
  from: 'Google Trend Results <google@trend.results.org>',
  to: process.env.LEE,
  subject: 'Todays Google Trend Results',
  text: collectData
};
 
	mailgun.messages().send(data, function (error, body) {
		if(error){
			console.error(error)
		} else {
			console.log(body);
		}
	});
}

function googleTrendsSearch(search){
	return googleTrends.interestOverTime({keyword: search, startTime: new Date(1483257600000), endTime: new Date(Date.now())});
}

function parseJson(json){
	return JSON.parse(json).default;
}

app.get('/', function (req, res) {
  res.send('Reset service, you should recieve an email shortly')
})

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 3000!');
});