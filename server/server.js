import express from 'express'
import morgan from 'morgan'
import jade from 'jade'
import React from 'react'
import HelloMessage from '../interface/HelloMessage'

let app = module.exports = express()

app.use(morgan('dev'))
app.get('/', function(req, res) {
	res.end(jade.renderFile('./interface/layout.jade', {
		content: React.renderToString(<HelloMessage name="Mick"></HelloMessage>)
	}))
})
app.use(express.static('./client'))
app.use('/external', express.static('./bower_components'))
app.use('/external', express.static('./node_modules'))

console.log('Started server')
let server = app.listen(3000, function() {
	console.log('Listening\n\tmode: ' + (process.env.NODE_ENV || 'development') + '\n\taddress: ', server.address())
})

process.on('exit', function() {
	console.log('Stopped server')
})