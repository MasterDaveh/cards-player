angular.module('toastHelper', [])

.factory('toastHelper', function(){
  
  const events = {
    message: []
  }

  const on = (evName, cb) => {
    if( !events[evName] ){
      throw `toastHelper: ${ evName } event is not supported`;
    }
    events[evName].push(cb);
  }

  const publish = (evName, args) => {
    if( !events[evName] ){
      throw `toastHelper: cannot publish unknown ${ evName } event`;
    }
    events[evName].forEach((fn) => fn(...args));
  }

  const show = (msg) => {
    publish('message', [msg]);
  }

  return {
    show, on
  }

})