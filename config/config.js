/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */

/* Pulled the constant for rotation, updates, and scans, of the MM pages and calendar */
const refresh = 1000*60*3;

let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 12,
	units: "imperial",

modules: [
    {
      module: 'MMM-pages',
      config: {
        homePage: 0,
		rotationHomePage: refresh,
		modules: [
          ["MMM-OneCallWeather"],
          ['page1'],
        ],
		fixed: ["MMM-page-indicator", "MMM-CalendarExt2", "alert", "clock"]
      }
    },
	{
        module: 'MMM-page-indicator',
        position: 'bottom_bar',
        config: {
            pages: 2,
			activeBright: true,
			showPageNumberOnHover: false,
        }
    },
	{
  		module: 'MMM-CalendarExt2',
  		config: {
    		rotateInterval: 0,
			updateInterval: refresh,
			deduplicateEventsOn: 
			[
				"startDate", "endDate"
			],
			calendars : [
		{
		/* Charlotte's GameChanger calendar for her 2026 Patriots 10U team */	
		name: "Patriots 10U",
		url: "${PATRIOTS_CAL_URL}",
		className: "patriots",
		scanInterval: refresh,
		icon: "cil:baseball",
		replaceTitle:
		[
			[
				"Precision Patriots 10U - Adams", "Patriots"
			],
		],	
		},
		{
        name: "Family Calendar",
		url: "${FAMILY_CAL_URL}",
		scanInterval: refresh,
		filter: (event) => {
            if (event.title.includes("Practice")) {
                return false
                  }
			return true
	  		},
      },
	  
    	],
    views: [
      {
        name: "MONTH",
		mode: "week",
		position: "fullscreen_below",
		title: "Hepker Month Calendar",
		hideOverflow: false,
		hideFooter: true,
		showAttendees: false,
		weekStart: "0",
		slotCount: "4",
		slotMaxHeight: "180px",
		slotSubTitleFormat: "ddd",
		slotAltTitleFormat: "MMMM-D",
		dateFormat: "MM/D",
		timeFormat: "h:mm a",
		dateTimeFormat: {
			sameDay: "[Today] h:mm a",
			nextDay: "[Tomorrow] h:mm a",
			nextWeek: "dddd h:mm a",
			lastDay: "[Yesterday] h:mm a",
			lastWeek: "[Last] ddd h:mm a",
			sameElse: "M/D h:mm a"
		},
      },
	  {
		name: "WEEK",
		mode: "daily",
		position: "middle_center",
		type: "row",
		title: "Hepker Family Agenda",
		hideOverflow: false,
		hideFooter: true,
		showAttendees: false,
		fromNow: "-1",
		slotCount: "5",
		slotMaxHeight: "250px",
		slotSubTitleFormat: "ddd",
		slotAltTitleFormat: "MMMM-D",
		dateFormat: "MM/D",
		timeFormat: "h:mm a",
		dateTimeFormat: {
			sameDay: "[Today] h:mm a",
			nextDay: "[Tomorrow] h:mm a",
			nextWeek: "dddd h:mm a",
			lastDay: "[Yesterday] h:mm a",
			lastWeek: "[Last] ddd h:mm a",
			sameElse: "M/D h:mm a"
		},
	  }
    ],
    scenes: [ 
	  {
		name: "Week Calendar",
		views: ["WEEK"]
	  },
	  {
		name: "Month Calendar",
		views: ["MONTH"]
	  },
	  
    ],
	notifications: {
		"PAGE_SELECT": 
			{
				exec: "changeSceneById",
				payload: (payload) => {return payload}
			}
  		}
		},
	},
	{
	module: "MMM-OneCallWeather",
    position: "top_right",
    header: "Weather at Home",
    config: {
        latitude: "${HOME_LAT}",  // Longitude from https://www.latlong.net/
        longitude: "${HOME_LONG}", // Longitude from https://www.latlong.net/
        apikey: "${WEATHER_API}", // openweathermap.org API key
        iconset: "9a",          // Icon set to use.
        iconsetFormat: "svg",   // File format of the icons.
		showWind: false,
		showWindSpeedUnit: true,
		showWindDirectionAsArrow: false,
		arrangement: "horizontal",
		forecastLayout: "rows",
		roundTemp: true,
      }	
	},
	{
	module: "alert",
	},
	{
		module: "updatenotification",
		position: "top_bar"
	},
    {
      module: 'clock',
      position: 'top_left'
    },
	{
		module: "calendar",
		position: "top_left",
		config: {
			}
	},
  ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
