const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    songs:[],
    currentPlayingSong:{
        title:String,
        time:Number
    },
    userId:{
        type:String,
        unique:true
    }
});

module.exports = Playlist = mongoose.model('playlist',PlaylistSchema);