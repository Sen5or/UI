
var config = {
	port: 8080,
	language: 'en',
	timeFormat: 12,
	units: 'imperial',  //metric,imperial
	location: "la jolla",
	"modules" 	: [
		{
			module: 'clock',
			position: 'top_left'
		},
		{
			module: 'currentweather',
			position: 'top_right',
			config: {
				location: "la jolla",
				locationID: '5342353',  //ID from http://www.openweathermap.org  //5342353 - del mar
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
			module: 'compliments',
			position: 'lower_third'
		},
		{
			module: 'MMM-twitter',
			position: 'top_left',
			config: {
				query: {q: "nhl OR 'drones'", count: 5},
			}
		},
		{
			module: 'gesture_control',
			position: 'bottom_right'
		},
		{
			module: 'voice_control',
			position: 'bottom_right'
		},
		{
			module: 'bluetooth_control',
			position: 'bottom_right'
		}
	]
};




/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined')
{
	module.exports = config;
}
