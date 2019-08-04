import {createStore,applyMiddleware, compose,combineReducers} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

// Action Types

const GET_PLAYLIST = 'GET_PLAYLIST';
const REMOVE_SONG = 'REMOVE_SONG';
const ADD_SONG = 'ADD_SONG';
const PLAYLIST_LOADING = 'PLAYLIST_LOADING';
const USER_LOADING = 'USER_LOADING';
const USER_LOADED = 'USER_LOADED';
const AUTH_ERROR = 'AUTH_ERROR';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAIL = 'REGISTER_FAIL';
const GET_ERRORS = 'GET_ERRORS';
const CLEAR_ERRORS = 'CLEAR_ERRORS';


// Reducers

const initialPlaylistState = {
    songs:[],
    isLoading:false,
    userId:null
}

const playlistReducer = (state = initialPlaylistState, action) => {
    switch(action.type){
        case GET_PLAYLIST:
            return{
                ...state,
                songs:[...action.payload.songs],
                isLoading:false,
                userId:action.payload.userId
            };
        case ADD_SONG:
            return{
                ...state,
                songs:[...state.songs,action.payload]
            };
        case REMOVE_SONG:
            return{
                ...state,
                songs:state.songs.filter(song => song._id !== action.payload)
            };
        case PLAYLIST_LOADING:
            return{
                ...state,
                isLoading:true
            };
        
        default:
            return state;
    }
}

const initialErrorState = {
    msg:{},
    status:null,
    id:null
}

const errorReducer = (state=initialErrorState,action) => {
    switch(action.type){
        case GET_ERRORS : 
            return {
                msg:action.payload.msg,
                status:action.payload.status,
                id:action.payload.id
            }
        case CLEAR_ERRORS : 
            return{
                msg:{},
                status:null,
                id:null
            }
        default:
            return state;
    }
}

const initialAuthState = {
    token:localStorage.getItem('token'),
    isAuthenticated:null,
    isLoading:false,
    user:null
}

const authReducer = (state=initialAuthState,action) => {
    switch(action.type){
        case USER_LOADING : 
            return{
                ...state,
                isLoading:true
            }
        case USER_LOADED : 
            return{
                ...state,
                isAuthenticated:true,
                isLoading:false,
                user:action.payload
            }
        case LOGIN_SUCCESS : 
        case REGISTER_SUCCESS :
            localStorage.setItem('token',action.payload.token)
            return{
                ...state,
                ...action.payload,
                isAuthenticated:true,
                isLoading:false
            }
        case AUTH_ERROR : 
        case LOGIN_FAIL :
        case LOGOUT_SUCCESS :
        case REGISTER_FAIL :
            localStorage.removeItem('token');
            return{
                ...state,
                token:null,
                user:null,
                isAuthenticated:false,
                isLoading:false
            }
        default:
            return state;    
    }
}


// Playlist Actions

export const getPlaylistAction = () => (dispatch,getState) => {
    // Set playlist reducer loading
    dispatch(setPlaylistLoading());

    // Get the token from auth reducer
    const token = getState().auth.token;

    const config = {
        headers:{
            "Content-type" : "application/json"
        }
    }

    if(token) config.headers['x-auth-token'] = token;

    // Hit /api/playlist end point and get user's playlist info
    axios.get('/api/playlist',config)
        .then(res => dispatch({type:GET_PLAYLIST,payload:res.data}))
        .catch(err => dispatch(returnErrorsAction(err.response.data,err.response.status)));
}

export const addToPlaylistAction = (title) => (dispatch,getState) => {
     // Get token from localStorage
    const token = getState().auth.token;
     // Headers
    const config = {
         headers:{
             "Content-type" : "application/json"
        }
    }
     // İf token exists add it to the headers
     if(token) {
         config.headers['x-auth-token'] = token
    }

    const body = JSON.stringify({title})

    axios.post('/api/playlist',body,config)
        .then(res =>  dispatch({type:ADD_SONG,payload:title}))
        .catch(err => dispatch(returnErrorsAction(err.response.data,err.response.status)));
}

export const removeFromPlaylistAction = (title) => (dispatch,getState) => {
    // Get token from localStorage
    const token = getState().auth.token
     // Headers
    const config = {
         headers:{
             "Content-type" : "application/json"
         }
     }
     // İf token exists add it to the headers
     if(token) {
         config.headers['x-auth-token'] = token
     }

    //const body = JSON.stringify({title})

    axios.delete(`/api/playlist/${title}`,config)
        .then(res => dispatch({type:REMOVE_SONG,payload:title}))
        .catch(err => dispatch(returnErrorsAction(err.response.data,err.response.status)))
}

export const setPlaylistLoading = () => ({
    type:PLAYLIST_LOADING
})


// Error Actions

export const returnErrorsAction = (msg,status,id=null) => {
    return{
        type:GET_ERRORS,
        payload:{msg,status,id}
    }
}

export const clearErrorsAction = () => {
    return{
        type:CLEAR_ERRORS
    }
}

// Auth Actions

export const loadUserAction = () => (dispatch, getState) => {
    // User loading
    dispatch({type:USER_LOADING});
      // Get token from localStorage
      const token = getState().auth.token;
      // Headers
      const config = {
          headers:{
              "Content-type" : "application/json"
          }
      }
      // İf token exists add it to the headers
      if(token) {
          config.headers['x-auth-token'] = token
      }

    axios.get('/api/auth/user',config)
        .then(response => dispatch({type:USER_LOADED,payload:response.data}))
        .catch(err => {
            dispatch(returnErrorsAction(err.response.data,err.response.status));
            dispatch({type:AUTH_ERROR});
        });
}


export const registerAction = ({name,email,password}) => dispatch => {
    // Config
    const config = {
        headers:{
            'Content-type':'application/json'
        }
    }
    // Request Body
    const body = JSON.stringify({name,email,password});

    axios.post('/api/users',body,config)
        .then(response => {
            dispatch({
                type:REGISTER_SUCCESS,
                payload:response.data
            })
        })
        .catch(err => {
            dispatch(returnErrorsAction(err.response.data,err.response.status,'REGISTER_FAIL'));
            dispatch({
                type:REGISTER_FAIL
            })
        })   
}

export const loginAction = ({email,password}) => dispatch => {

    // Request Body
    const body = {email,password};

    axios.post('/api/auth',body)
        .then(response => {
            dispatch({
                type:LOGIN_SUCCESS,
                payload:response.data
            })
        })
        .catch(err => {
            dispatch(returnErrorsAction(err.response.data,err.response.status,'LOGIN_FAIL'));
            dispatch({
                type:LOGIN_FAIL
            })
        }) 
}

export const logoutAction = () => {
    return{
        type:LOGOUT_SUCCESS
    }
}
// Redux Setup

const reducers =  combineReducers({
    error:errorReducer,
    auth:authReducer,
    playlist:playlistReducer
})

export const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);
