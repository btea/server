#!/usr/bin/env node

const net = require('net')
const fs = require('fs')
const path = require('path')
const http = require('http')
const open = require('open')
const log = console.log
const chalk = require('../src/chalk')
const typeList = require('../src/type')

const logMet = {
    red: (text) => log(chalk.red(text)),
    success: (text) => log(chalk.green(text))
}

function pathDeal(p) {
    if (~p.indexOf('?')) {
        p = p.slice(0,p.indexOf('?'))
    }
    return p
}
let port = process.argv.slice(2)[0] || 2233
let root = process.argv.slice(2)[1]

if (!/^\d+$/.test(port)) {
    root = port
    port = 3000
}
if (!root) {
    logMet.red('请输入要启动的项目的文件夹')
}
function portInuse(port) {
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port)
        server.on('listening', () => {
            // server.close()
            resolve(server)
        })
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                reject(`${chalk.green('端口: ')}${chalk.red(port)}${chalk.green('被占用')}`);
            }else {
                reject(`启动端口${chalk.red(port)}有问题`)
            }
        })
    })
}

function tryUsePort(port, portAvailableCallback) {
    portInuse(port).then(portAvailableCallback).catch(err => {
        console.log(err)
        port++
        tryUsePort(port, success)
    })
}
let success = (ser) => {
    ser.close()
    // console.log(chalk.green('启动服务：http://localhost:'  + port))
    // console.log(ser)
    serveStart(port)
}
tryUsePort(port, success)

function serveStart(port) {
    if (!root) {
        logMet.red('没有能启动的文件')
        process.exit()
    }
    let link = path.join(__dirname, root)
    if (!fs.existsSync(link)) {
        logMet.red(`${root} 文件夹找不到`)
        process.exit()
    }
    fs.stat(link, (err, stats) => {
        if (err) {
            logMet.red('文件读取有问题')
            process.exit()
        }
        let dir = link
        if (stats.isDirectory()) {
            dir = path.join(link, './index.html')
        }
        http.createServer((request, response) => {
            let url = request.url
            if (url === '/') {
                fs.readFile(dir, (err, chunk) => {
                    if (err) {
                        logMet.red('入口文件取有问题')
                    }
                    response.setHeader('Content-Type', typeList['.html'])
                    response.end(chunk)
                })
                return
            }
            let suffix = url.slice(url.lastIndexOf('.'))
            if (~suffix.indexOf('?')) {
                suffix = suffix.slice(0, suffix.indexOf('?'))
            }
            let type =  typeList[suffix]
            p = path.join(link, url)
            p = pathDeal(p)
            let isExist = fs.existsSync(p)
            if (!isExist) {
                response.end()
                return
            }
            fs.readFile(p, (err, chunk) => {
                if (err) {
                    logMet.red(p + '读取失败')
                    process.exit()
                }
                if (type) {
                    response.setHeader('Content-Type', type)
                }
                response.end(chunk)
            })
        }).listen(port, () => {
            let href = `http://localhost:${port}`
            logMet.success('已启动本地服务：' + href)
            open(href)
        })
    })
}
