
var config = {
	port: 8080,
	language: 'en',
	timeFormat: 12,
	units: 'imperial',  //metric,imperial
	location: "la jolla",
	modules: [
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
			module: 'MMM-twitter',
			position: 'top_left',
			config: {
				maxNumTweets: 5,
				query: {q: "ucsd OR 'computer science'", count: 5 },
				api_keys: {
					consumer_key: 'PmLtnXP1PgO3bmSXvRLp6IlEC',
					consumer_secret: 'BmmMwKxW5SJkZhNkZnfB0lxhxH7AYp5pUYUKvd60OozPvMCnyq',
					access_token_key: '1528289544-OpPCjIaaAk81T9j8q3CcrHGtK9GEwoclS6sHzGF',
					access_token_secret: '4nOyFKhgkNemu0WauF6RF7XIAtXSrMH3E4KdPK7K4wscO'
				}
			}
		},
	]
};




/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== 'undefined')
{
	module.exports = config;
}
