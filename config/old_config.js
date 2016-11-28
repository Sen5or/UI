/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var config = {
	port: 8080,
	language: 'en',
	timeFormat: 24,
	units: 'imperial',  //metric,imperial

	modules: [

		/*
		{
			module: 'youtube',
			position: 'top_center', // This can be any of the regions, best results in center regions.
			config: {
				// See 'Configuration options' for more information.
				api_key: "1eb5ae949c95eb8fb61268a61740d836",
				token: "8d25ead382ad30807ad5848f37e1d38dbfee714531c0685cf7664689e71717e9",
				list: "INSERT_YOUR_LIST_ID"
			}
		},*/
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
		/*{
			module: 'calendar',
			header: 'US Holidays',
			position: 'top_left',
			config: {
				calendars: [
					{
						symbol: 'calendar-check-o ',
						url: 'webcal://www.calendarlabs.com/templates/ical/US-Holidays.ics'
					}
				]
			}
		},*/
		/*{
			module: 'compliments',
			position: 'lower_third'
		},*/
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



/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined') {module.exports = config;}
