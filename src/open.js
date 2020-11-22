const child_process = require('child_process')
const open = require('open')

child_process.spawn('start', ['https://www.baidu.com'])
// open('https://www.baidu.com')
