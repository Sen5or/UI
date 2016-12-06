/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */


//TODO, store this in DB eventually with updateable fields
var config = {
	port: 8080,
	language: 'en',
	timeFormat: 12,
	units: 'imperial',  //metric,imperial
	location: "la jolla",

	modules: [
		{
			module: 'clock',
			position: 'top_left'
		},
		{
			module: 'currentweather',
			position: 'top_right',
			config: {
				location: 'La jolla',
				locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
				appid: 'ff5b188249eab39338f5d1eb9e28922f'
			}
		},
		{
			module: 'compliments',
			position: 'lower_third'
		},
		{
			module: 'newsfeed',
			position: 'bottom_center',
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					},
					{
						title: "BBC",
						url: "http://feeds.bbci.co.uk/news/video_and_audio/news_front_page/rss.xml?edition=uk",
					}
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		},
		{
			module: 'MMM-twitter',
			position: 'top_left',
			config: {
				maxNumTweets: 5,
				query: {q: "ucsd OR 'computer science'", count: 5 },
				api_keys: {
					consumer_key: 'GCNRascd1LbQMYXr9Se1MpQEB',
					consumer_secret: 'aWtJSOIhZUh3yD4N68pjwPlqhLUAWnW6mC4ktqSggC9uJai3uh',
					access_token_key: '1528289544-7mtiB0PN0cTH07gsfRo6KwHKZisB1wdXdLrAVy0',
					access_token_secret: 'm4yRpvZtXd6mx3gyUZe5O0muz7Fb1sDV2BS6UJgOJBmCl'
				}
			}
		},
		{
			module: 'gesture_control',
			position: 'bottom_right'
		},
		{
			module: 'voice_control',
			position: 'bottom_right'
		}
	]
};




/*
var defaultModules = {

	modules: [

		{
			module: 'clock',
			position: 'top_left'
		},
		{
			module: 'MMM-twitter',
			position: 'top_left',
			config: {
				maxNumTweets: 5,
				keywords: {track: 'science, ucsd'},
				api_keys: {
					consumer_key: 'GCNRascd1LbQMYXr9Se1MpQEB',
					consumer_secret: 'aWtJSOIhZUh3yD4N68pjwPlqhLUAWnW6mC4ktqSggC9uJai3uh',
					access_token_key: '1528289544-7mtiB0PN0cTH07gsfRo6KwHKZisB1wdXdLrAVy0',
					access_token_secret: 'm4yRpvZtXd6mx3gyUZe5O0muz7Fb1sDV2BS6UJgOJBmCl'
				}
			}
		},
		{
			module: 'currentweather',
			position: 'top_right',
			config: {
				location: 'La jolla',
				locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
				appid: 'ff5b188249eab39338f5d1eb9e28922f'
			}
		},
		{
			module: 'weatherforecast',
			position: 'top_right',
			header: 'Weather Forecast',
			config: {
				location: 'La jolla',
				locationID: '5342353',  //ID from http://www.openweathermap.org
				appid: 'ff5b188249eab39338f5d1eb9e28922f'
			}
		},
		{
			module: 'newsfeed',
			position: 'bottom_center',
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true
			}
		},
		{
			module: 'gesture_control',
			position: 'bottom_right'
		},
		{
			module: 'voice_control',
			position: 'bottom_left'
		}

	]
};
*/


/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined')
{
	module.exports = config;
}
