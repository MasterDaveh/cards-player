angular.module('toast', ['toastHelper'])

.controller('toastCtrl', function($scope, $timeout, toastHelper){
  $scope.message = '';
  $scope.active = false;
  let timer = null;
  
  $scope.hide = () => {
    $timeout.cancel(timer);
    $scope.active = false;
  }

  $scope.show = (msg) => {
    $scope.message = msg;
    $scope.active = true;
    timer = $timeout($scope.hide, 5000);
  }

  toastHelper.on('message', (msg) => {
    if( $scope.active ){
      $scope.hide();
      timer = $timeout(() => $scope.show(msg), 330);
    } else {
      $scope.show(msg);
    }
  });

})