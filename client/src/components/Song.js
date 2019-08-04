import React, { useState,useEffect } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {addToPlaylistAction} from '../redux'

const Song = (props) => {
    const [buttonLoading,setButonLoading] = useState(false)
    const [addedToPlaylist,setAddedToPlaylist] = useState(false)
    const dispatch = useDispatch()
    const addToPlaylist = (title) => dispatch(addToPlaylistAction(title))
    const playlistSongs = useSelector(state => state.playlist.songs) 
    const inPlaylist = playlistSongs.some(song => song === props.title)
    let player=null

    const playSong = () => {
        if(props.playing) {
            player.pause()
        }
        else {
            player.play()
        }
        
    }
    
    const addToPlaylistButton = () => {
        setButonLoading(true)
        setTimeout(() => {
            setAddedToPlaylist(true)
            setButonLoading(false)
        },1000)
    }

    useEffect(() => {
        setAddedToPlaylist(inPlaylist)
    },[props.playing])

    return (
        <>
            <div className="song-cover">
                <i className="fas fa-music"></i>
            </div>
            <h4 className="song-title">{props.title}</h4>
            <button onClick={() => {props.playingHandler({type:'PLAYING_HANDLER',payload:props.title});playSong()}}  className="play-pause-button"><i style={props.playing ? {display:'none'} : {display:'block'}} className="fas fa-play"></i><i style={props.playing ? {display:'block'} : {display:'none'}} className="fas fa-pause"></i>
                <audio ref={ref => player = ref} src={require(`../audio/${props.title}.mp3`)}/>
            </button>
            <span onClick={() => {addToPlaylist(props.title);addToPlaylistButton();}} className="add-to-playlist" style={addedToPlaylist || buttonLoading ? {cursor:'auto',pointerEvents:'none'} : {cursor:'pointer'}}><span className="add-to-playlist-loader" style={buttonLoading ? {display:'block',pointerEvents:'none'} : {display:'none'}}></span><i style={buttonLoading || addedToPlaylist ? {display:'none',pointerEvents:'none'} : {display:'block'}} className="fas fa-plus"></i><i style={addedToPlaylist ? {display:'block'} : {display:'none'}} className="fas fa-check"></i></span>
        </>
    )
}

export default Song
