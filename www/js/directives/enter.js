// do something when pressing enter on the element on which it is applied
const search = angular.module('enter', [])

const link = ($scope, el, attrs) => {
  const onEnter = $scope[attrs.onEnter];

  el = el[0];
  el.onkeyup = (e) => {
    if(e.keyCode == 13){
      onEnter();
    }
  };
}

search.directive('onEnter', function(){
  return {
    restrict: 'A',
    scope: false, 
    link
  }
});