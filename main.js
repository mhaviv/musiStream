$(document).ready(function(){
	function Jukebox(){

		let currentSong = "";
		let tracks = [];
		let trackName = [];
		let trackNum = 0;
		const audio = $("#myAudio")[0];

		//Adds a song to the Jukebox object
		this.addSongToTrack = function(song){
			tracks.push(song);
			return tracks;
		};

		// displaying the songs in the array in divs
		this.displaySongs = function(){
			$('#list_songs').html('')
			for (i in tracks) {
				$("#list_songs").append("<div class='song-display'><a href='#' class='songName' data-id='" + i + "' >" + tracks[i].songName + "</a></div>")
			}
			// $('#list_songs').html(this.song_names.join(" "));
		};
		
		this.playIt = function() {
	       audio.play();
	    };

	    this.stopIt = function() {
	      audio.pause();
	    };

	


    // $('#myAudio').on('timeupdate', function() {
    // $('#seekbar').attr("value", this.currentTime / this.duration);

	    this.loadInSong = function(selectedSong){
	    	let player = $('#myAudio');
	    	// clearing audio source and replacing it with empty string
	    	player.html("");
	    	trackNum = selectedSong;
	    	// finding the location of the song
	  		let songSrc = tracks[selectedSong].location;
	  		// add songSrc to player
	    	player.append('<source src="' + songSrc + '" type="audio/mp4">"');
	    	player[0].load();
	    	player[0].play();
	    	return trackNum;

	    };


	    this.loadNext = function(){
	    	audio.pause();
	    	if (trackNum === tracks.length - 1){
	    		trackNum = 0;
	    	} else {
	    		trackNum = trackNum + 1;
	    	}
	    	
	    	this.loadInSong(trackNum);


	    	return trackNum;
	    }



	     this.loadPrev = function(){
	    	audio.pause();
	    	if (trackNum === 0){
	    		trackNum = tracks.length -1;
	    	} else {
	    		trackNum = trackNum - 1;
	    	}
	 
	    	this.loadInSong(trackNum);

	    	return trackNum;
	    }



	    this.addSong = function() {
	       let location = $("#addSong").val();
	       let songName =  $("#addName").val();
	       let songTitle =  $("#addTitle").val();
	       let newSong = new Song(songName, songTitle, location)
	       tracks.push(newSong);
	       this.displaySongs();
	       // $("#list_songs").append("<div class='song-display'><a href='#' class='songName' data-id='" + tracks.length + "' >" + songName + "</a></div>")
     		
     	}


	};

	function Song(songName, title, location){
		this.songName = songName
		this.title = title;
		this.location = location;
	};

	let sky = new Song("Sky by Alan Walker & Alex Skrindo", "sky.m4a", "audio/sky.m4a");
	let moreThanYouKnow = new Song("More Than You Know by Axwell /\ Ingrosso", "More-Than-You-Know.m4a", "audio/More-Than-You-Know.m4a");
	let castleOfGlass = new Song("Castle of Glass by Linkin Park", "CASTLE_OF_GLASS.m4a", "audio/CASTLE_OF_GLASS.m4a");
	let greatSpirit = new Song("Great Spirit (feat. Hilight Tribe) by Armin Van Buuren & Vini Vici", "Great-Spirit.m4a", "audio/Great-Spirit.m4a");
	let burnItDown = new Song("Burn it Down by Linkin Park", "BURN-IT-DOWN.m4a", "audio/BURN-IT-DOWN.m4a");

	jukeBox = new Jukebox();

		jukeBox.addSongToTrack(sky);
		jukeBox.addSongToTrack(moreThanYouKnow);
		jukeBox.addSongToTrack(castleOfGlass);
		jukeBox.addSongToTrack(greatSpirit);
		jukeBox.addSongToTrack(burnItDown);


	//make a function to display the songs
	jukeBox.displaySongs();

	//play the first song on load
	let songList = $('#list_songs');
	jukeBox.loadInSong(0);

	//load in selected song & play it on click
	$(songList).on('click', '.songName',function(){
		let selectedSong = this.dataset.id;
		console.log(selectedSong);
		jukeBox.loadInSong(selectedSong);
	});

});