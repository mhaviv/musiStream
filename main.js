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

let imageContainer = $('#image-container');
let scPlayer
let currentlyPlaying

// Intializing the Sound Cloud API
SC.initialize({
    client_id: 'fd4e76fc67798bfa742089ed619084a6'
});

// 
function createTracks(tracks) {
    console.log(tracks);
    for (let i = 0; i < tracks.length; i++) {
        let img = document.createElement('img');
        let a = document.createElement('a');
        img.className = 'thumb';

        if (tracks[i].artwork_url) {
            img.setAttribute('src', tracks[i].artwork_url);
        } else {
            img.setAttribute('src', tracks[i].user.avatar_url)
        }

        img.setAttribute('title', tracks[i].title);
        img.setAttribute('width', 70);
        img.setAttribute('height', 70);
        img.trackInfo = tracks[i];
        a.setAttribute('href', '#');
        a.append(img);
        imageContainer.append(a);
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
function displaySong(song){
	let chosenImage = song.artwork_url || song.user.avatar_url; 
	$('#song-container #songTitle').text(song.title);
	$('#song-container #artistLink').html("<a href=" + song.user.permalink_url + " target='_blank'>"+ song.user.permalink + "</a>");
	$('#song-container #songImage').attr("src", chosenImage);
	$('#song-container #songGenre').text(song.genre);
	$('#song-container #songDescription').text(song.description);
}


function streamTrack(e, trackInfo) {
    SC.stream('/tracks/' + trackInfo.id).then(function(player) {
    	currentlyPlaying = trackInfo
        player.play();
        scPlayer = player // made variable global
        displaySong(trackInfo)
    })
}


function getTracks(query) {
    // if the query is undefined, get out of function
    if (!query) {
        return;
    }
    // Get the first 10 tracks and then set them for display and stream
    SC.get('/tracks', {
        q: query,
        limit: 10
    }).then(function(tracks) {
        createTracks(tracks);
        streamTrack(null, tracks[0]); // streams the first track 
    })
};



// When searching = return/enter key --> get tracks that match query
document.body.onkeypress = function(e) {

    if (e.charCode === 13) {
        getTracks($('#search-field').val())
    }
}



// if you click the thumbnail, it will play the song you clicked 
document.body.addEventListener('click', function(e) {
    let target = e.target;
    if (target.className === 'thumb') {
        streamTrack(null, target.trackInfo);
    }
})


$('#play').click(function(){
	scPlayer.play()
})

$('#pause').click(function(){
	scPlayer.pause()
})