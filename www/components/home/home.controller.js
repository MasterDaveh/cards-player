angular.module('home', ['spotifySrvc'])

.controller('homeCtrl', function($scope, spotify) {
  $scope.songs = [];
  $scope.query = '';
  $scope.artist = { 
    name: '',
    followers: { total: 0 },
    popularity: 0,
    images: []
  };
  $scope.searching = false;
  $scope.searchesCount = 0;


  $scope.search = () => {
    $scope.searching = false;
    if( $scope.searching ) return;
    spotify.getArtist( $scope.query, (artists) => {
      if( artists.length > 0 ){
        $scope.artist = artists[0];
        $scope.searching = true;
        spotify.getTracksByArtistID( $scope.artist.id, (tracks) => {
          $scope.searchesCount++;
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

  $scope.getFollowers = ( flw ) => {
    return numeral(flw).format('0.0a')
  };

})