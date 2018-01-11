// MAKING SOUNDCLOUD JUKEBOX
//
// get results from search bar
// match input from search with results from api
// print results to display songs
// use API Key provided
// has to play
// has to stop
// has to go next
// has to go previous

let imageContainer = document.getElementById('image-container');
let scPlayer


// Intializing the Sound Cloud API
SC.initialize({
    // client_id: '342b8a7af638944906dcdb46f9d56d98'
    // client_id: 'fd4e76fc67798bfa742089ed619084a6'
    client_id: '83f67039ae0c3790030d256cb9029678'
});

function Jukebox(tracks, currentSong){
    this.tracks = [];
    this.currentSong = 0;
}

Jukebox.prototype.createTracks = function(tracks) {
    imageContainer.innerHTML="" //remove all from container
    var tracks = this.tracks
    //  Makes thumbnails of img and anchor tag
    for (let i = 0; i < tracks.length; i++) {
        let img = document.createElement('img');
        let a = document.createElement('a');
        img.className = 'thumb';

        // console.log('hello for loop img!', img);
        // console.log('hello for loop a!', a);

        if (tracks[i].artwork_url) {
            img.setAttribute('src', tracks[i].artwork_url);
        } else {
            img.setAttribute('src', tracks[i].user.avatar_url)
        }



        img.setAttribute('title', tracks[i].title);
        img.setAttribute('width', 170);
        img.setAttribute('height', 170);
        img.trackInfo = tracks[i];
        a.setAttribute('href', '#');
        a.append(img);
        imageContainer.appendChild(a);
    }

    // Animation for the song choices
    TweenMax.staggerFrom('#image-container img', 1, {
        scale: 0,
        delay: 1.5,
        borderRadius: '50%',
        transformOrigin: '50% 50%'
    }, 0.1)
}


// This function will diplay song in song container
Jukebox.prototype.displaySong = function(song) {

    let chosenImage = song.artwork_url || song.user.avatar_url;
    console.log(chosenImage)
    document.getElementById('songTitle').innerHTML="<a href=" + song.permalink_url + " target='_blank'>"+ song.title + "</a>"
    document.getElementById('artistLink').innerHTML="<a href=" + song.user.permalink_url + " target='_blank'>"+ song.user.permalink + "</a>"
    document.getElementById('songImage').src=chosenImage
    document.getElementById('songGenre').innerHTML=song.genre
    document.getElementById('songDescription').innerHTML=song.description
}


Jukebox.prototype.streamTrack = function(e, trackInfo) {
    let self = this
    SC.stream('/tracks/' + trackInfo.id).then(function(player) {
        self.currentSong = trackInfo
        player.play();
        scPlayer = player // made variable global
        Jukebox.prototype.displaySong(trackInfo)
    })
}


Jukebox.prototype.getTracks = function(query) {
    // if the query is undefined, get out of function
    if (!query) {
        return;
    }
    let self = this; //promises lose context!!!
    // Get the first 10 tracks and then set them for display and stream
    SC.get('/tracks', {
        q: query,
        limit: 10
    }).then(function(response) {
        console.log('responding!!', response);
        // console.log('this is tracks!!!', this.tracks)
        self.tracks = response;
        // console.log('this is self', self);
        self.createTracks(self.tracks);
        self.streamTrack(null, self.tracks[0]); // streams the first track
    });
    // console.log(response);
};


var jukebox = new Jukebox()

// When searching = return/enter key --> get tracks that match query
document.body.onkeypress = function(e) {

    var searchField = document.getElementById('search-field').value;
    // console.log(searchField)

    if (e.charCode === 13) {
        // alert('hello!')
        jukebox.getTracks(searchField);
    }
}



// if you click the thumbnail, it will play the song you clicked
document.body.addEventListener('click', function(e) {
    let target = e.target;
    if (target.className === 'thumb') {
        jukebox.streamTrack(null, e.target.trackInfo);
    }
})

// var jukePlay = document.getElementById('play');
// var jukePause = document.getElementById('pause');
// console.log(jukePlay)

let playButton = document.getElementById('play')
jukebox.play = playButton.addEventListener('click', function(){
    scPlayer.play()
    console.log('playing')
})

let pauseButton = document.getElementById('pause')
jukebox.pause = pauseButton.addEventListener('click', function(){
        scPlayer.pause()
        console.log('pausing')
})



