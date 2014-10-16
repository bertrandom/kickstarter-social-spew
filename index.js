var request = require('request'),
	cheerio = require('cheerio'),
	levelup = require('level'),
	config = require('config'),
	db = levelup('./projectsdb'),
	options;

options = {
	url: 'https://www.kickstarter.com/friends/projects',
	headers: {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.101 Safari/537.36',
		'Cookie': config.get('kickstarter_cookies')
	}
};

request(options, function(err, response, body) {

	if (!err && response.statusCode === 200) {

		$ = cheerio.load(body);
		$('a').each(function(index, node) {

			var text;

			var url = $(node).attr('href');
			var projectTitle = $(node).text();

			if (url && url.match(/^\/projects\//) && !url.match(/\?play=/)) {

				db.get(url, function(err, value) {

					if (err && err.notFound) {

						console.log('Pushing ' + projectTitle + ' to Slack...');

						text = 'A wild Kickstarter project appears! <' + 'http://www.kickstarter.com' + url + '/' + '|' + projectTitle + '>';

						request.post(config.get('slack_webhook_url'), {

							body: JSON.stringify({
								username: 'Kickstarter Social Spew',
								icon_emoji: ':money_with_wings:',
								text: text
							})

						}, function(err, response, body) {

							if (!err && response.statusCode === 200) {
								db.put(url, true);
							}

						});

					} else {

						console.log('Skipping ' + projectTitle + '...');

					}

				});

			}

		});

	}

});