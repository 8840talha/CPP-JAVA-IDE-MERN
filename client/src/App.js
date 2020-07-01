import React, { Component } from 'react';
import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import axios from 'axios'
import { InputBase } from '@material-ui/core';
class App extends Component {
  state = {
    script: '',
    language: '',
    versionIndex: '',
    stdin: '',
    clientId: "42ff208a1b422da8713b1141cf090d68",
    clientSecret: "b236ce70d45f7b6190963c19d39c69c645851ee1629272202935ac1ee208cf13",
    StdOut: '',
    StdErr: '',
    cpuTime: '',
    memory: '',
    showOutput: false,
    showError: false

  }

  clear = () => {
    this.setState({ script: '' })
    window.location.reload();

  }
  changeHandler = (e) => {
    e.preventDefault();
    this.setState({
      script: e.target.value,

    })

  }
  changeStdin = (e) => {
    e.preventDefault();
    this.setState({
      stdin: e.target.value,

    })

  }

  changeLangJava = (e) => {
    e.preventDefault();
    alert('Java Selected')
    this.setState({ language: 'java', versionIndex: '1' })
  }
  changeLangCpp = (e) => {
    e.preventDefault();
    alert('Cpp Selected')
    this.setState({ language: 'cpp', versionIndex: '1' })
  }
  dataPost = (e) => {
    e.preventDefault();
    if (this.state.language == '') {
      return alert('Select a language')
    }
    const data = {
      "script": this.state.script,
      "language": this.state.language,
      "versionIndex": this.state.versionIndex,
      "stdin": this.state.stdin,
      "clientId": this.state.clientId,
      "clientSecret": this.state.clientSecret
    }

    axios.post('http://localhost:5000/codeCheck', {
      body: data,
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      console.log(res.data)
      const { output, cpuTime, memory } = res.data.data;

      this.setState({ StdOut: output, cpuTime: cpuTime, memory: memory, showOutput: true, showError: false })
    }).catch(err => {
      this.setState({ StdErr: err.response.data.error, showError: true, showOutput: false })

    })


  }

  render() {

    console.log(this.state)
    console.log(this.state.script)
    console.log(this.state.StdOut)
    return (
      <div style={{ overflowX: 'hidden' }}>
        <div class="row">
          <nav class="navbar sticky-top navbar-light bg-light col-xs-12  col-sm-12 col-lg-12 ">
         
            <div >
            <h1 class="h">Test IDE for Java/CPP</h1>     
              <button onClick={this.dataPost} class="btn btn-outline-success mr-2" type="button">Build&Run</button>
              <button onClick={this.clear} class="btn btn-outline-success" type="button">Clear</button>
            </div>
            <div >
              <h1 className="h ">Select A Language</h1>
              <button onClick={this.changeLangJava} class="btn btn-sm btn-outline-secondary mr-2" type="button">Java</button>
              <button onClick={this.changeLangCpp} class="btn btn-sm btn-outline-secondary" type="button">CPP</button>
            </div>
          </nav>
        </div>


        <div class="row">
          <div style={{ height: '100vh', backgroundColor: '#2C3335', }} class="col-xs-7 col-sm-6 col-lg-8 textarea">
            <textarea className="text" name="input" onChange={this.changeHandler} style={{ color: '#fff', width: '100%', height: '100vh', resize: 'none', fontSize: 'small' }} placeholder="Your Code Here" />
          </div>

          <div class="col-xs-5 col-sm-6 col-lg-4">
            <div style={{ height: '40vh', background: '#2C3335', }} class=" col-lg-12">
              <textarea name="stdin" placeholder="StdIn Here" onChange={this.changeStdin} style={{ height: '40vh', color: '#fff', backgroundColor: '#2C3335', marginLeft: '0', resize: 'none', width: '100%' }} />
            </div>

            <div style={{ height: '60vh', background: '#fff', color: '#2C3335', border: '1px solid black', marginTop: '10px' }} class=" col-lg-12">
              <button class="btn  btn-outline-white" style={{ width: '100%' }}>Std Out</button>

              {this.state.showOutput ? <div>
                {this.state.StdOut}
                <p>Memory:{this.state.memory}</p>
                <p>CpuTime:{this.state.cpuTime}</p>
              </div> : null
              }
              {this.state.showError ? <div style={{ color: 'red' }}>
                Error:{this.state.StdErr}
                <p>Memory:null</p>
                <p>CpuTime:null</p>
              </div> : null
              }

            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default App;
