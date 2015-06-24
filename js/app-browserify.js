// "use strict";

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

window.Task = Task

import $ from 'jquery'

Parse.$ = $
Parse.initialize("57KkEoyo9i0avbjMO3shJ7eia0Fdf7W3gjxeJ4La", "0Nx7vBI1q0sb5ygxtGVVubJrTgVmGT4zihggDXtc")


// singleton
const list = new Tasks()
list.query = new Parse.Query(Task)

// setInterval(() => list.fetch(), 15*1000)

class TaskView extends React.Component {
    constructor(props){
        super(props)
        this.rerender = () => {
            console.log('trying to save')
            this.props.data.save()
            this.forceUpdate()
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
                <input type="checkbox" checked={model.get('isUrgent')} /> <span className="urgent"> urgent </span>
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
        var input = React.findDOMNode(this.refs.title)
        var model = new Task({ title: input.value })
        var acl = new Parse.ACL()
        acl.setWriteAccess(Parse.User.current(), true)
        acl.setPublicReadAccess(true)
        model.setACL(acl)
        this.props.data.create(model)
        input.value = ''
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
        this.state = { error: 0 }
    }
    _signupOrLogin(e){
        e.preventDefault()

        var u = new Parse.User(),
            email = React.findDOMNode(this.refs.email).value,
            password = React.findDOMNode(this.refs.password).value

        u.set({
            email: email,
            password: password,
            username: email
        })

        var signup = u.signUp()
        signup.then(() => window.location.hash = '#list')
        signup.fail(() => {
            var login = u.logIn()
            login.then((e) => window.location.hash = '#list')
            login.fail((...args) => {
                this.setState({error: this.state.error + 1 })
            })
        })
    }
    render(){
        var error = this.state.error ? (<p className="error-message">{this.state.error} try - password invalid</p>) : ''
        return (<div>
            <form onSubmit={(e) => this._signupOrLogin(e)}>
                <p> login or register: </p>
                <hr />
                <div><input type="email" ref="email" placeholder="email address" /></div>
                <div><input type="password" ref="password" placeholder="password" /></div>
                {error}
                <div><button>submit</button></div>
            </form>
        </div>)
    }
}

var Router = Parse.Router.extend({
    routes: {
        'list': 'list',
        '*default': 'login'
    },
    initialize: () => {
        Parse.history.start()
    },
    list: () => {
        if(!Parse.User.current()){
            window.location.hash = '#login'
            return
        }

        list.fetch()
        React.render(<ListView data={list} />, document.querySelector('.container'))
    },
    login: () => {
        if(Parse.User.current()){
            window.location.hash = '#list'
            return
        }

        React.render(<LoginView />, document.querySelector('.container'))
    }
})

var router = new Router()