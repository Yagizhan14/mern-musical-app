import React, { useState,useEffect,useRef } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import PlaylistSong from './PlaylistSong';
import Simplebar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { getPlaylistAction } from '../redux';

const Playlist = () => {
    const [volume,setVolume] = useState(50)
    const player = useRef(null)
    const progressBar = useRef(null)
    const durationRef = useRef(null)
    const songTitleRef = useRef(null)
    const playlistSongs = useSelector(state => state.playlist.songs)
    const [currentSong,setCurrentSong] = useState(0)
    const dispatch = useDispatch()
    const getPlaylist = () => dispatch(getPlaylistAction())

    const convertToTime = (time) => {
        let minutes = Math.floor(time / 60)
        let seconds = Math.floor(time % 60)
        if(seconds < 10) seconds = `0${seconds}`
        if(minutes < 10) minutes = `0${minutes}`
        return `${minutes}:${seconds}`
    }

    const playOrPauseSong = () => {
        progressBar.current.setAttribute('max',Math.floor(player.current.duration))
        if(player.current.paused) {
            player.current.play()
            document.querySelector('.fa-pause').style.display = "block"
            document.querySelector('.fa-play').style.display = "none"
        }
        else {
            player.current.pause()
            document.querySelector('.fa-pause').style.display = "none"
            document.querySelector('.fa-play').style.display = "block"
        }
    }

    const seekSong = () => {
        player.current.currentTime = progressBar.current.value
    }

    const playerTimeUpdate = () => {
        let position = Math.round(player.current.currentTime)
        progressBar.current.value = position
        durationRef.current.textContent = convertToTime(player.current.currentTime)
    }

    const next = () => {
        if(currentSong === playlistSongs.length - 1) setCurrentSong(0)
        else{
            setCurrentSong(currentSong + 1)
        }
        playOrPauseSong()
    }

    const prev = () => {
        if(currentSong === 0) setCurrentSong(playlistSongs.length -1)
        else{
            setCurrentSong(currentSong - 1)
        }
        playOrPauseSong()
    }

    const PlaylistRender = playlistSongs.length ? (
    <div className="playlist-page">
        <div className="player">
            <div className="player-song-cover">
                <i className="fas fa-music"></i>
                <h4 className="player-song-title" ref={songTitleRef}>{playlistSongs[currentSong]}</h4>
            </div>
            <div className="volume-control">
                <i className="fas fa-volume-up"></i>
                <input className="volume" type="range" max="100" min="0" onChange={e => {setVolume(e.target.value);player.current.volume = volume / 100}} value={volume}/>
            </div>
            <div className="player-controls">
                <div className="control-buttons">
                    <button className="prev-button" onClick={prev}><i className="fas fa-backward"></i></button>
                    <button className="play-pause-button" onClick={playOrPauseSong}><i className="fas fa-play"></i><i style={{display:'none'}} className="fas fa-pause"></i></button>
                    <button className="next-button" onClick={next}><i className="fas fa-forward"></i></button>
                </div>
            </div>
            <div className="player-progress">
                <input type="range" className="progress" min="0" ref={progressBar} onChange={seekSong}/>
                <span className="player-song-duration" ref={durationRef}></span>
            </div>
            <audio src={require(`../audio/${playlistSongs[currentSong]}.mp3`)} ref={player} onTimeUpdate={playerTimeUpdate} onEnded={next} />
        </div>
        <div className="playlist-section">
            <h2 className="playlist-header">My Playlist</h2>
            <Simplebar style={{ height: '450px' }}>
            <ul className="playlist">
                {playlistSongs.map((song,index) => {
                    return (
                        <PlaylistSong key={index} title={song} player={player} playOrPauseSong={playOrPauseSong} songTitleRef={songTitleRef}/>
                    )
                })}    
            </ul>
            </Simplebar>
        </div>
    </div>
    ) : (  
        <div className="no-songs-found">
            <div className="no-songs-description">
                <i className="far fa-file-audio"></i>
                <div className="no-songs-text">
                    <h2>You don't have any song in your playlist</h2>
                    <p>You can add songs into your playlist by clicking the button below.</p>
                </div>
            </div>
            <Link to="/search">Search Songs</Link>
        </div>
    )

    useEffect(() => {
        document.querySelector('.preloader').classList.toggle('complete')
        getPlaylist()
        setTimeout(() => {
            document.querySelector('.preloader').classList.toggle('complete')
        },2000)
    }, [])

    return (
        <>
            {PlaylistRender}
        </>
    )
}

export default Playlist
