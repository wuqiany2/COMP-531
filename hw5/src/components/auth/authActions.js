import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {resource} from '../../actions'
import {fetchProfile} from '../profile/profileActions'
import {fetchFollowers} from '../main/followingActions'
import {fetchArticles} from '../article/articleActions'

export function init(){
    return (dispatch) => {
        resource('GET','headlines')
        .then((response)=>{
            dispatch({type:'TO_HOME'})
            dispatch({type:'UPDATE_HEADLINE',username:response.headlines[0].username, headline:response.headlines[0].headline})
            dispatch(fetchProfile())
            dispatch(fetchFollowers())
            dispatch(fetchArticles())
        })
        .catch((err)=>{
            //console.log(err)
            //console.log(err.stack)
        })
    }
} 


export function LoginAction(username, password){
    return (dispatch) =>{
        resource('POST','login',{username, password})
        .then((response)=>{
            dispatch({type:'LOG_IN', username:response.username})
            dispatch(init())
        }).catch((err)=>{
            console.log(err)
            dispatch({type:'ON_ERROR', error: `Error Logging in as ${username}`})
        })
    }
}

export function LogoutAction(){
    return (dispatch) => {
        resource('PUT', 'logout')
        .then(dispatch({type:'TO_OUT'}))
        .catch((err)=>{
            dispatch({type:'LOG_IN', username:undefined})
            dispatch({type:'TO_OUT'})
        })
    }
}

export function Register(data){
    return (dispatch)=>{
        resource('POST','register',data)
        .then(dispatch({type:'ON_SUCCESS', success:'successfully registered'}))
        .catch((err)=>{
            dispatch({type:'ON_ERROR', error:'there is something wrong'})
        })
    }
}

export default LoginAction