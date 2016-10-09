var express = require('express');

var path = process.env.SILVER_DRIP_FILE_PATH;

var rate_per_day = 2;

var RSS = require('rss');

var feed = new RSS({
	title:'Silver Drip',
	feed_url: 'ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8000',
	site_url: 'ec2-52-62-223-45.ap-southeast-2.compute.amazonaws.com:8001'
});

feed.item({
	title:'Silver Drip Item',
	description:'test',
	url:'test.com',
	guid:1,
	date: new Date().toISOString()
});

express.all('*', function handler(req, res) {
	res.send(feed.xml());
})

console.log(feed.xml())