var fs = require('fs');
var express = require('express');
var _ = require('lodash');
var cron = require('cron');
var app = express();

var path = process.env.SILVER_DRIP_FILE_PATH || `${__dirname}/test`;

var rate_per_day = 2;

var items = [];
function refresh_items () {
	items = fs.readFileSync(path).toString().split('\n-\n');
}
refresh_items();


var RSS = require('rss');

var feed = new RSS({
	title:'Silver Drip',
	feed_url: 'http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000',
	site_url: 'http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000'
});

// new cron.CronJob('* * * * * *', function() {
// 	var index = _.random(0, items.length);

feed.item({
	title: 'Silver Drip Item',
	description: 'test',
	url: `http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000/0`,
	// url: `http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000/${index}`,
	guid:2,
	date: new Date().toISOString()
});

feed.item({
	title: 'Silver Drip Item2',
	description: 'test',
	url: `http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000/1`,
	guid: 3,
	date: new Date().toISOString()
});

feed.item({
	title: 'Silver Drip Item3',
	description: 'test',
	url: `http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000/2`,
	guid: 4,
	date: new Date().toISOString()
});

// }, null, true, 'Australia/Brisbane');


app.all('/', function handler(req, res) {
	res.send(feed.xml());
})

app.all('/:index', function handler(req, res) {
	res.send(items[req.params.index]);
})

app.listen(8000);
