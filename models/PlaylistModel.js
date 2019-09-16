const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  songs: [],
  userId: {
    type: String,
  },
});

module.exports = Playlist = mongoose.model('playlist', PlaylistSchema);
