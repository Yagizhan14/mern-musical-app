const router = require('express').Router();
const auth = require('../middlewares/authenticate');
const Playlist = require('../models/PlaylistModel')

// GET /api/playlist
// Get user's playlist
// Access private
router.get('/',auth,(req,res) => {
    // Get userId from token
    const userId = req.user.id;

    Playlist.findOne({userId})
        .then(playlist => {
            // if user has a playlist send the playlist
            if(playlist) res.json(playlist);

            // if user does not have a playlist create a playlist
            else{
                const newPlaylist = new Playlist({
                    songs:[],
                    userId:req.user.id
                });
                
                // Add the playlist to database
                newPlaylist.save()
                    .then(playlist => res.json({message:'Successfully created the playlist and added to the database.',playlist}))
                    .catch(err => res.status(500).json(err.message));
            }
        })
        .catch(err => res.status(500).json(err.message));
})


// POST /api/playlist/
// Add a song to playlist
// Access private
router.post('/',auth,(req,res) => {
    // Get the title from body
    const { title } = req.body;

    // If no title response with error
    if(!title) return res.status(400).json({message:'Please add a title'});

    Playlist.findOne({userId:req.user.id})
        .then(playlist => {
            // Check if the user has playlist
            if(playlist){
                // Check if the user already has the song on their playlist
                if(playlist.songs.some(song => song === title)) return res.json({message:'Successfully added to playlist',playlist});

                // If user does not have song in his playlist then add it to playlist.
                playlist.songs.push(title);
                playlist.save()
                    .then(playlist => res.json({message:'Successfully added to playlist',playlist}))
                    .catch(err => res.json(err.message));
            }
        })
        .catch(err => res.status(500).json(err.message));
});

// DELETE /api/playlist/
// Remove a song from playlist
// Access private
router.delete('/:title',auth,async (req,res) => {
    // Get the song title from body
    const title = req.params.title;

    if(!title) return res.status(400).json({message:'Please add a title'});
    
    try{
        // Find the user's playlist
        let updPlaylist = await Playlist.findOne({userId:req.user.id});

        // Remove the song from playlist
        let updPlaylistSongs = updPlaylist.songs.filter(song => song !== title);

        updPlaylist.songs = updPlaylistSongs;

        // Then update the playlist
        const response = await Playlist.updateOne({userId:req.user.id},updPlaylist);
        res.json({message:'Successfully removed from playlist.',response});

    } catch(err){
        res.json(err.message);
    }

});

module.exports = router;