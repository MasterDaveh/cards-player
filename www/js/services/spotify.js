const spot = angular.module('spotifySrvc', ['utils']);

spot.factory('spotify', function(ajax, lstorage, $timeout){
  const baseURL = 'https://api.spotify.com/v1';
  const REDIRECT_URI = encodeURIComponent( window.location.href );
  let lastQuery = '';
  let pageIdx = 0;

  const TOKEN_KEY = 'access_token';
  const EXPIRATION_KEY = 'expiration_tmp';
  const DEFAULT_COUNTRY = 'US';

  const getCommonHeaders = (token) => {
    return {
      Authorization: `Bearer ${ token }`
    }
  }

  // authorization process for the spotify search api
  const authorize = () => {
    let token = lstorage.get(TOKEN_KEY);
    if( !token ){
      // if the token param is present in the querystring it means
      // the user was redirected to the page from the spotify api login
      if( window.location.href.indexOf(TOKEN_KEY) === -1 ){
        let url = 'https://accounts.spotify.com/authorize?';
        url += `client_id=${ CLIENT_ID }`;
        url += '&response_type=token';
        url += `&redirect_uri=${ REDIRECT_URI }`;
        url += '&state=118';
        window.location.href = url;
      } else {
        // retrieve ACCESS_TOKEN from url
        const pageURL = window.location.href;
        let idx = pageURL.indexOf('access_token');
        let expiration_offset = 0;
        let expiration_tmp = 0;

        token = pageURL.slice( pageURL.indexOf('=', idx)+1, pageURL.indexOf('&', idx) );
        lstorage.set(TOKEN_KEY, token);

        idx = pageURL.indexOf('expires_in');
        expiration_offset = pageURL.slice( pageURL.indexOf('=', idx)+1, pageURL.indexOf('&', idx) );
        expiration_offset++;
        expiration_tmp = moment().unix() + expiration_offset;
        lstorage.set(EXPIRATION_KEY, expiration_tmp);

        // calling authorize after the expiration time of the token will force a new token request
        $timeout(authorize, expiration_offset);
        
        window.location.href = pageURL.slice(0, pageURL.indexOf('#'));
      }
    } else {
      // if token is present check its validity
      const expiration_tmp = +lstorage.get(EXPIRATION_KEY);
      const now = moment().unix();
      if( now >= expiration_tmp ){
        lstorage.remove(TOKEN_KEY);
        authorize();
      }
    }
  }

  const getTracksByArtistID = ( artistID, done ) => {
    let url = `${ baseURL }/artists/${ artistID }/top-tracks?country=${ DEFAULT_COUNTRY }`;
    const token = lstorage.get(TOKEN_KEY);
    const headers = getCommonHeaders(token);
    ajax.call(url, {},
      (res) => {
        let tracks = res.data.tracks;
        tracks = tracks.sort(sortByPopularity);
        done(tracks);
      }, ( err ) => console.log(err.data),
      'get', headers
    );
  }

  const getArtist = ( artistName, done ) => {
    let url = `${ baseURL }/search?q=${ artistName }&type=artist&market=${ DEFAULT_COUNTRY }&limit=5`;
    const token = lstorage.get(TOKEN_KEY);
    const headers = getCommonHeaders(token);
    ajax.call(url, {},
      (res) => {
        let artists = res.data.artists.items;
        artists = artists.sort(sortByPopularity);
        done(artists);
      }, ( err ) => console.log(err.data),
      'get', headers
    );
  }

  const sortByPopularity = (curr, prev) => {
    return prev.popularity - curr.popularity;
  }

  return {
    authorize, 
    getTracksByArtistID, getArtist
  }
  
});