import express from 'express'
import morgan from 'morgan'

let server = module.exports = express()

server.use(morgan('dev'))
server.use(express.static('./serve'))
server.use('/external', express.static('./bower_components'))


server.listen(3000)