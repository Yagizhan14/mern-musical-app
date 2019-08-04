import React, { useRef } from 'react'
import { removeFromPlaylistAction,getPlaylistAction } from '../redux'
import { useDispatch } from 'react-redux'

function PlaylistSong(props) {
    const audioRef = useRef(null)
    const durationRef = useRef(null)
    const dispatch = useDispatch()
    const removeSong = (title) => dispatch(removeFromPlaylistAction(title))
    const getPlaylist = () => dispatch(getPlaylistAction())

    const convertToTime = (time) => {
        let minutes = Math.floor(time / 60)
        let seconds = Math.floor(time % 60)
        if(seconds < 10) seconds = `0${seconds}`
        return `${minutes}:${seconds}`
    }

    return (
        <li className="playlist-song" onClick={() => {props.player.current.src = require(`../audio/${props.title}.mp3`);props.playOrPauseSong();props.songTitleRef.current.textContent = props.title}}>
            <audio src={require(`../audio/${props.title}.mp3`)} ref={audioRef} onLoadedData={() => durationRef.current.textContent = convertToTime(audioRef.current.duration)} />
            <div className="playlist-song-cover">
                <i className="fas fa-music"></i>
            </div>
            <p className="playlist-song-title">{props.title}</p>
            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
              <span className="song-duration" style={{marginRight:'10px'}}  ref={durationRef}></span>
              <span onClick={() => {removeSong(props.title);getPlaylist()}} style={{marginRight:'10px'}} className="remove-song"><i className="fas fa-trash-alt"></i></span>
            </div>
        </li>
    )
}

export default PlaylistSong
