angular.module('base', ['home', 'toast', 'spotifySrvc', 'enter'])

.config(function( $locationProvider ){
  $locationProvider.html5Mode(true);
})

.run(function( spotify ) {
  spotify.authorize();
})