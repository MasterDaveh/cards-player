angular.module('home', ['spotifySrvc', 'ngAudio'])

.controller('homeCtrl', function($scope, $interval, spotify, ngAudio) {
  $scope.songs = [];
  $scope.query = '';
  $scope.artist = { 
    name: '',
    followers: { total: 0 },
    popularity: 0,
    images: []
  };
  $scope.resultsVisible = false;
  $scope.searchesCount = 0;
  $scope.others = [];
  const songs = {};
  let timer = null;

  const stopAll = () => {
    $scope.songs.forEach((track) => {
      if( track.playing ){
        songs[track.id].pause();
        track.playing = false;
      }
    });
  }

  const setProgress = (track) => {
    const progress = Math.round(songs[track.id].progress * 100);
    track.progress = progress;
    if( progress === 100 ){
      let next = null;

      songs[track.id].progress = 0;
      $scope.pause(track);
    }
  }

  $scope.search = () => {
    if( $scope.query.trim().length === 0 ) return;
    stopAll();
    $scope.searching = true;
    spotify.getArtist( $scope.query, (artists) => {
      if( artists.length > 0 ){
        $scope.artist = artists.shift();
        $scope.others = artists;
        $scope.searching = false;
        spotify.getTracksByArtistID( $scope.artist.id, (tracks) => {
          $scope.searchesCount++;
          tracks.forEach((track, i) => {
            track.playing = false
            track.order = i;
            songs[track.id] = ngAudio.load(track.preview_url);
          });
          $scope.songs = tracks;
        });
      } else {
        console.log('no artists found');
      }
    })
  }

  $scope.getPic = (result) => {
    let pic = '';
    if( result.images.length > 0 ){
      pic = result.images[0].url;
    }
    return pic;
  }

  $scope.getTrackPic = (track) => {
    const pic = $scope.getPic( track.album );
    return pic;
  }

  $scope.getFollowers = ( flw ) => {
    return numeral(flw).format('0.0a')
  };

  $scope.play = ( track ) => {
    if( track.playing ) return;
    
    stopAll();
    songs[track.id].play();
    track.playing = true;
    setProgress(track);
    timer = $interval(() => setProgress(track), 100);
  }

  $scope.pause = ( track ) => {
    if( !track.playing ) return;
    
    songs[track.id].pause();
    track.playing = false;
    $interval.cancel(timer);
  }

})