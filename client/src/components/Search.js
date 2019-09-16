import React, { useState, useReducer, useEffect } from 'react';
import Simplebar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import Song from './Song';
import { useDispatch } from 'react-redux';
import { getPlaylistAction } from '../redux';

const Search = () => {
  const [filterInput, setFilterInput] = useState('');
  const dispatch = useDispatch();
  const getPlaylist = () => dispatch(getPlaylistAction());

  const songsReducer = (state, action) => {
    switch (action.type) {
      case 'PLAYING_HANDLER':
        const newState = state.map(song => {
          if (song.title !== action.payload)
            return { title: song.title, playing: false };
          else {
            return { title: song.title, playing: !song.playing };
          }
        });
        return newState;

      default:
        return state;
    }
  };

  const [songs, dispatchSongs] = useReducer(songsReducer, [
    { title: 'Gürkan Uygun - Bu Şehir Girdap Gülüm', playing: false },
    { title: 'Haluk Levent - Elfida', playing: false },
    { title: 'Kelushka - Gipsy', playing: false },
    { title: 'Koray Avcı - Adaletin Bu Mu Dünya', playing: false },
    { title: 'Koray Avcı - Ağlama Yar', playing: false },
    { title: 'Koray Avcı - Hangimiz Sevmedik', playing: false },
    { title: 'Koray Avcı - Neriman', playing: false },
    { title: 'Koray Avcı - Pirlere Niyaz Ederiz', playing: false },
    { title: 'Koray Avcı - Yanımda Sen Olmayınca', playing: false },
    { title: 'Koray Avcı - Yazımı Kışa Çevirdin', playing: false },
    { title: 'Light of The Seven - Game of Thrones', playing: false },
    { title: 'Pinhani - Gönül Dağı', playing: false },
    { title: 'Pinhani - Hele Bi Gel', playing: false },
    { title: 'Sen Gel Diyorsun - Cem Adrian', playing: false },
    { title: 'Sıla - Vur Kadehi Ustam', playing: false },
    { title: 'Tarkan - Dilli Düdük', playing: false },
    { title: 'Tarkan - Firuze', playing: false },
    { title: 'Tarkan - Gül Döktüm Yollarına', playing: false },
    { title: 'Tarkan - Kuzu Kuzu', playing: false },
    { title: 'Tarkan - Vay Anam Vay', playing: false },
    { title: 'Tuğçe Kandemir - Gülü Soldurmam', playing: false },
    { title: 'Zalım - Ceylan Ertem', playing: false },
    { title: 'Ziynet Sali - Bana da Söyle', playing: false },
    { title: 'Ziynet Sali - Boşu Boşuna', playing: false },
  ]);

  const filterHandler = e => {
    setFilterInput(e.target.value);
  };

  const filterKeyUp = () => {
    const term = filterInput.toLowerCase();
    const listItemsTitles = document.querySelectorAll('.song-list li h4');
    listItemsTitles.forEach(item => {
      if (
        item.textContent.toLowerCase().indexOf(term) !== -1 ||
        filterInput === ''
      ) {
        item.parentElement.style.display = 'flex';
      } else {
        item.parentElement.style.display = 'none';
      }
    });
  };

  useEffect(() => {
    document.querySelector('.preloader').classList.toggle('complete');
    getPlaylist();
    setTimeout(() => {
      document.querySelector('.preloader').classList.toggle('complete');
    }, 2000);
  }, []);

  return (
    <div className='search-page'>
      <div className='search-input-field'>
        <input
          className='search-input'
          type='text'
          value={filterInput}
          onChange={filterHandler}
          onKeyUp={filterKeyUp}
          placeholder='Type the name of the song or the artist you want to filter'
        />
      </div>
      <Simplebar style={{ height: '550px', autoHide: false }}>
        <ul className='song-list'>
          {songs.map((song, index) => {
            return (
              <li className='song' key={index}>
                <Song
                  title={song.title}
                  playing={song.playing}
                  playingHandler={dispatchSongs}
                />
              </li>
            );
          })}
        </ul>
      </Simplebar>
    </div>
  );
};

export default Search;
