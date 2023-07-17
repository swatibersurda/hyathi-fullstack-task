import * as Types from "./actionTypes";
import axios from "axios";
export const postRegister=(payload)=>(dispatch)=>{
    dispatch({type:Types.POST_REGISTER_REQUEST})
  return axios.post("",payload).then((res)=>{
    dispatch({type:Types.POST_REGISTER_SUCCESS,payload})
    return Types.POST_LOGIN_SUCCESS
  }).catch((err)=>{
    dispatch({type:Types.POST_REGISTER_FAILURE})
  })
}

// LOGIN
export const postLogin=(payload)=>(dispatch)=>{
    dispatch({type:Types.POST_LOGIN_REQUEST})
  return axios.post("",payload).then((res)=>{
    dispatch({type:Types.POST_LOGIN_SUCCESS,payload:res.data})
    return Types.POST_LOGIN_SUCCESS
  }).catch((err)=>{
    dispatch({type:Types.POST_LOGIN_FAILURE})
  })
}

// get all pokemon
export const getAllPokemon=()=>(dispatch)=>{
    dispatch({type:Types.GETALLPOKEMON_REQUEST})
    return axios.get("").then((res)=>{
        dispatch({type:Types.GETALLPOKEMON_SUCCESS,payload:res.data})
    })
}