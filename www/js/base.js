angular.module('base', ['home'])

.config(function( $locationProvider ){
  $locationProvider.html5Mode(true);
})

.run(() => {

})