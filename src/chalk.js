const vals = {
	black: '30',
	bgBlack: '40',
	red: '31',
	bgRed: '41',
	green: '32',
	bgGreen: '42',
	yellow: '33',
	bgYellow: '43',
	blue: '34',
	blueLight: '2,34',
	bgBlue: '44',
	magenta: '35',
	bgMagenta: '45',
	cyan: '36',
	bgCyan: '46',
	white: '37',
	bgWhite: '47',
	blackBright: '90',
	redBright: '91',
	greenBright: '92',
	yellowBright: '93',
	blueBright: '94',
	magentaBright: '95',
	cyanBright: '96',
	whiteBright: '97',
	gray: '90',
	grey: '90'
};
const methods = {};
Object.keys(vals).map(key => {
	methods[key] = str => {
		return '\x1b[' + vals[key] + 'm' + str + '\x1b[0m';
	}
	String.prototype[key] = function(){
		return '\x1b[' + vals[key] + 'm' + this.toString() + '\x1b[0m';
	}
})

module.exports = methods