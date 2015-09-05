import React from 'react'

export default class HelloMessage extends React.Component {
	constructor(properties) {
		super(properties)
	}
	render() {
		return <div>Hello you {this.props.name} you!</div>
	}
}
