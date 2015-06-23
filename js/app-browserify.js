
"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
// es6 polyfills, powered by babel
require("babel/register")



// var Promise = require('es6-promise').Promise
// equivalent to...
import {Promise} from 'es6-promise'
import Backbone from 'backbone'
import React from 'react'
import {Task, Tasks} from './task'
//parse 
Parse.initialize("1oEEynw3WvfBGuA3JDWqO7jwgwxTkXdx5yr9bsyd", "im5rJtvJxi4vlaSvkeB2ciKZZ0dAWu8iUywBmmhe");


const list = new Tasks([
    list.query = new Parse.Query(Task),
    // list.fetch();
])

class TaskView extends React.Component {
    constructor(props){
        super(props)
        this.rerender = () => this.forceUpdate(){
            // this.save()
        }
    }
    componentDidMount(){
        this.props.data.on('change', this.rerender)
    }
    componentDidUnmount(){
        this.props.data.off('change', this.rerender)
    }
    _toggleDone(){
        var model = this.props.data
        var progress = model.get('progress')
        if(progress !== 'done') {
            model.set('progress', 'done')
        } else {
            model.set('progress', 'upcoming')
        }
    }
    _saveTitle(){
        var text = React.findDOMNode(this.refs.title).innerText
        this.props.data.set('title', text)
    }
    render(){
        var model = this.props.data
        return (<li className={ model.get('progress') }>
            <p contentEditable ref="title" onBlur={() => this._saveTitle()}>{model.get('title')}</p>
            <input type="checkbox"
                checked={model.get('progress') === 'done'}
                onChange={() => this._toggleDone()} />
            <div>
                <input type="checkbox" checked={model.get('isUrgent')} />
                <input type="date" />
            </div>
        </li>)
    }
}

class ListView extends React.Component {
    constructor(props){
        super(props)
        this.rerender = () => this.forceUpdate()
    }
    componentDidMount(){
        this.props.data.on('update sync', this.rerender)
    }
    componentDidUnmount(){
        this.props.data.off('update sync', this.rerender)
    }
    _add(e){
        e.preventDefault()
        var model = new Task({ title: input.value})
        var acl = new Parse(acl)
        var input = React.findDOMNode(this.refs.title)
        this.props.data.add({ title: input.value })
        input.value = ''
        // acl.setWriteAccess()
        model.setACL(acl)
    }
    render(){
        return (<div>
            <form onSubmit={(e) => this._add(e)}>
                <div><input ref="title"/></div>
                <button>+</button>
            </form>
            <ul>
                {this.props.data.map((model) => <TaskView data={model} />)}
            </ul>
        </div>)
    }
}

class LoginView extends React.Component {
    constructor(props){
        super(props)
    }

    _signupOrLogin(){
        var user = new Parse.User(),
            email = React.findDOMNode(this.refs.email).value
            password = React.findDOMNode(this.refs.password).value


    user.set({
        email: email,
        password: password,
        username: email
    })

    var signup = user.signup()
        signup.then(()=> window.location.hash = '#list')
        signup.fail(()=> { 
            var loging = user.login()
            login.then((e)=> window.location.hash = '#list')
            login.fail((...args)=> {
                this.setState({error:this.state.error *1 
                })
            })

        }

    render(){
        return(<div>
            <form onSubmit={(e>) => this.signupOrLogin(e)}>
            <p> Login or Register </p>
            <hr>
                <input type="email" ref="email" placeholder="email address" /> <div>

                <input type="password" ref="password" placeholder="password" /> </div>
                {error}
                <div> <button> Submit </button> </div>
            </form>    
            )
        }
    }


React.render(<ListView data={list} />, document.querySelector('.container'))
window.list = list

var router = Parse.Router.extende({
    routes: {
        'list' : 'list',
        '*default': 'login'
    },
    initialize () => {
        Parse.history.start()
    },


    list() => {
        if (!Parse.User.current()){
            window.locatuon.hash = '#login'
        }
        React.render(<ListView data={list} />, document.querySelector('.container'))
    },
    login() => {
         window.locatuon.hash = '#list'
     }
        React.render(<LoginView/>, document.querySelector('.container'))
    }
})





