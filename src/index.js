import React from 'react';
import {Component} from 'react';
import ReactDOM from 'react-dom';
// import './index.css';

class Input extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputText: "",
			queryText: "",
			caretPositions: [0,0],
			results: [],
			imeOn: true,
		};
		this.IMEBubbleRef = React.createRef();
		this.MainInputFieldRef = React.createRef();
		this.handleIMEKeyUp = this.handleIMEKeyUp.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
	}
	insertPhrase(phrase) {
		this.setState({inputText: phrase});
	}
	handleIMEKeyUp(event) {
		event.preventDefault();
		this.setState({queryText: event.target.value});
		const charCode = event.which;
		console.log(charCode);
		if (charCode>48 && charCode<(49+(this.state.results.length))) {
			this.insertPhrase(this.state.results[charCode-49]);
		}
		this.getCharacters(event.target.value);
	}
	handleInputChange(event) {
	  this.setState({inputText: event.target.value});
	}
	handleInputKeyDown(event) {
		console.log(event.which);
		if (event.ctrlKey || event.which<65 || event.which>90){
			return;
		}
		console.log(this.IMEBubbleRef.current.queryInputRef.current);
		this.IMEBubbleRef.current.queryInputRef.current.focus();
	}
	render() {
		return (
			<div>
				<MainInputField 
					value={this.state.inputText} 
					onChange={this.handleInputChange}
					onKeyDown={this.handleInputKeyDown}
					ref = {this.MainInputFieldRef}
				></MainInputField>		
				<ImeBubble 
					results={this.state.results}
					onKeyUp={this.handleIMEKeyUp}
					ref = {this.IMEBubbleRef}
				></ImeBubble>
			</div>
		)
	}
	getCharacters(queriedText) {
		if (queriedText==="") {
			this.setState({results: []});
		} else {
			fetch("https://www.google.com/inputtools/request?"+
				"ime=pinyin&ie=utf-8&oe=utf-8&app=translate&num="+ 5 +"&text=" 
				+ queriedText)
				.then( response => response.json() )
				.then( json => {
					this.setState({results: json[1][0][1]});
				});
		}
	}
}

class MainInputField extends Component {
	render() {
		return (
			<input 
				type="text"
				value={this.props.value}
				onChange={this.props.onChange}
				onKeyDown={this.props.onKeyDown}
				// onKeyDown={() => this.getCharacters(this.props.value)}
			/>
		);
	}
}

class	ImeBubble extends Component {
	constructor(props) {
	   super(props);
	   // Declare and initialize the ref in the constructor
		this.queryInputRef = React.createRef();
	 }
	renderResult(i) {
		return (
				<Result value={i}></Result>
		);
	}
	render() {
		const items = this.props.results.map((string) => {
			return <Result 
				key={string}
				value={string}
			></Result>;
		})
		return (
			<div>
			<input 
				type="text"
				onKeyUp={ this.props.onKeyUp }
				ref={this.queryInputRef}
			/>
				<br/>
				<ol>{items}</ol>
			</div>
		);
	}
}

// class	ImeInputField extends Component {
// 	render() {
// 		let queryInputRef = React.createRef();
// 		return (
// 			<input 
// 				type="text"
// 				onKeyUp={ this.props.onKeyUp }
// 				ref={queryInputRef}
// 			/>
// 		);
// 	}
// }

class	Result extends Component {
	render() {
		return (
			<li >{this.props.value}</li>
		);
	}
}

export default ImeBubble;

// ========================================

ReactDOM.render(
  <Input />,
  document.getElementById('root')
);