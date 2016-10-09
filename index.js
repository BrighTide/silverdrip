var fs = require('fs');
var os = require('os');
var express = require('express');
var _ = require('lodash');
var cron = require('cron');
var uuid = require('node-uuid');

var app = express();


var path = process.env.SILVER_DRIP_FILE_PATH || `${__dirname}/test`;

var rate_per_day = 2;

var items = [];
function refresh_items () {
	items = fs.readFileSync(path).toString().split('-');
}
refresh_items();

fs.watch(path, refresh_items);

var RSS = require('rss');

var feed = new RSS({
	title:'Silver Drip',
	feed_url: 'http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000',
	site_url: 'http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000'
});


new cron.CronJob('0 7,22 * * *', function() {
	var index = _.random(0, items.length - 1);
	var item = items[index].trim();
	console.log(item)

	var title = (new RegExp(`.*${os.EOL}`, 'gm')).exec(item)[0];
	item = item.replace(title, '');


	feed.item({
		title: title.trim(),
		description: item.trim(),
		url: `http://ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000/${index}`,
		guid:uuid.v4(),
		date: new Date().toISOString()
	});
}, null, true, 'America/Los_Angeles', null, true)



app.all('/', function handler(req, res) {
	res.send(feed.xml());
})

app.all('/:index', function handler(req, res) {
	res.send(items[req.params.index]);
})

app.listen(8000);
