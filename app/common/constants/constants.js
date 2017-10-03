(function () {
    'use strict';
    // const apiRoot = 'https://task-manager-elife.herokuapp.com/api';
    const apiRoot = 'http://0.0.0.0:3000/api/v1';
    angular.module('app')

            .constant('APP_AUTHOR', 'Eri Jonhson')
            .constant('APP_NAME', 'angular-series-list')
            .constant('APP_VERSION', '2.1.2')
            .constant('API_URIS', {
                OMDB: 'https://www.omdbapi.com/?apikey=93330d3c&r=json&type=series&s=',
                OMDBBYID: 'https://www.omdbapi.com/?apikey=93330d3c&r=json&i=',
                API_ROOT: apiRoot,
                SERIE: apiRoot + '/series/',
                SIGNUP: apiRoot + '/users/'
            })
            .constant('DEFAULT_POSTER', 'assets/images/no_poster.jpg');
})();
