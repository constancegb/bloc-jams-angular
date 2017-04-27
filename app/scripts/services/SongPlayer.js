(function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};
          var currentAlbum = Fixtures.getAlbum();
         
          /** @desc Buzz object audio file
          * @type {Object}*/
          var currentBuzzObject = null;
         
         
         /** @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song */
         var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(SongPlayer.currentSong);
            }
 
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
             
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
 
            SongPlayer.currentSong = song;
         };
         
         
         
         /** @function playSong
         * @desc plays a song
         * @param {Object} song */
          var playSong = function(song){
              currentBuzzObject.play(); 
              song.playing = true;
          };
         
         /** @function stopSong
         * @desc stops a song
         * @param {Object} song */
         var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
         };
         
          /** @function getSongIndex
         * @desc gets index of a song
         * @param {Object} song */
         var getSongIndex = function(song) {
         return currentAlbum.songs.indexOf(song);
         };
         
         /** @desc Active song object from list of songs
          * @type {Object}*/
          SongPlayer.currentSong = null;
         
          /* @desc Current playback time (in seconds) of currently playing song
          * @type {Number}*/
          SongPlayer.currentTime = null;
         
          /* @ desc Initiate the volume value to 75
          * @type {Number}*/
          SongPlayer.volume = 75;
         
         /** @function play
         * @desc Sarts playing the current song
         * @param {Object} song */
          SongPlayer.play = function(song) {
              song = song || SongPlayer.currentSong;
              if (SongPlayer.currentSong !== song) {
                  setSong(song);    
                  playSong(song);
              
              } else if (SongPlayer.currentSong === song) {
                  if (currentBuzzObject.isPaused()) {
                     playSong(song);
                      
                  }
              }  
          };
         
         /** @function pause
         * @desc pauses currently playing song
         * @param {Object} song */
          SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
          };
         
          /** @function previous
         * @desc go to the previous song, or stops if the current song is the first song of the album. */
          SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
          };
         
          /** @function next
         * @desc go to the next song, or stops if the current song is the last song of the album. */
          SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            var lastSongIndex = currentAlbum.songs.length - 1;
            if (currentSongIndex > lastSongIndex) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
          };
         
          /**@function setCurrentTime
          * @desc Set current time (in seconds) of currently playing song
          * @param {Number} time*/
          SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
          };
         SongPlayer.currentTime
          SongPlayer.setVolume = function(volume) {
              if (currentBuzzObject) {
                  currentBuzzObject.setVolume(volume);
              }
          };
         
          return SongPlayer;
     };
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();