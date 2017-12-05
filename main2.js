function Jukebox(element){
  this.songs = [];
  this.currentSong = 0;
  // getter for current song
  Object.defineProperty(this,"song",{
    get: function(){
      return this.songs[this.currentSong];
    }
  });
  // getter and setter for current player, on current song
  Object.defineProperty(this,"player",{
    get: function(){
      return this.song && this.song.player;
    },
    set: function(player) {
      this.song.player = player;
    }
  });
  // populate list of songs
  SC.get("/tracks",{q: "Dogs"}).then((response) => {
    this.songs.push( ...response );
    this.play();
  });
  this.html = {
    container: element,
    controls: element.querySelector(".controls"),
    seek: element.querySelector(".seek input"),
    info: element.querySelector(".info")
  };

  this.html.seek.addEventListener("change",(event) => {
    this.player.seek(event.target.value * this.song.duration / 10000);
  });
  this.html.controls.addEventListener("click", (event) => {
    if( event.target.classList.contains("play") ){
      this.play();
    } else if( event.target.classList.contains("pause")) {
      this.pause();
    } else if( event.target.classList.contains("back")) {
      this.back();
    } else if( event.target.classList.contains("next")) {
      this.next();
    }
  });

  // start-up an interval to update the slider
  setInterval( () => {
    this.html.seek.value = this.player.currentTime() / this.song.duration * 10000;
  },500);
}
Jukebox.prototype = {
  play: function(){
    if( this.player ) {
      this.player.play();
    } else {
      SC.stream(`/tracks/${this.song.id}`).then((player) => {
        this.player = player;
        player.play();
      });
    }
    this.updateUI();
  },
  pause: function(){
    if( this.player ) {
      this.player.pause();
      return true;
    }
    return false;
  },
  stop: function(){
    if( this.pause() ) {
      this.player.seek(0);
    }
  },
  back: function(){
    this.stop();
    this.currentSong = (this.currentSong + this.songs.length - 1) % this.songs.length;
    this.play();
  },
  next: function(){
    this.stop();
    this.currentSong = (this.currentSong + 1) % this.songs.length;
    this.play();
  },
  updateUI: function(){
    this.html.info.innerText = this.song.title;
  }
};


let myJukebox;
document.addEventListener("DOMContentLoaded",function(){
  myJukebox = new Jukebox(document.getElementById("jukebox"));
});