const utils = angular.module('utils', []);

utils.factory('ajax', function ($http) {
  const call = (url, data, succCB, errCB, method = 'post', headers = {}) => {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return $http({ method, headers, url, data }).then(succCB, errCB);
  }

  return { call }
});

utils.factory('lstorage', function () {
  let get = key => {
    let val = window.localStorage.getItem(key);
    try {
      val = JSON.parse( val );
    } catch (ex) {
      val = val.replace('/', '');
    }

    return val;
  };
  let set = (key, value, preserveInt = false) => {
    let val = value;
    if (angular.isObject(val)) {
      val = JSON.stringify(value);
    } else if( angular.isNumber(value) ){
      // this will make the json.parse fail
      // so if I stored an integer it won't be cast to a string
      val = `/${ val }`;
    }
    window.localStorage.setItem(key, val);
  };
  let remove = key => window.localStorage.removeItem(key);
  let clear = () => window.localStorage.clear();

  return {
    get,
    set,
    remove,
    clear
  }

});

utils.factory('strings', function() {
  const replaceAt = (string, index, replacement) => {
    return string.slice(0, index) + replacement + string.slice(index + 1);
  }

  return { replaceAt }
  
})