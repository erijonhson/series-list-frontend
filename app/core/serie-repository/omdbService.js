(function () {
    'use strict';

    angular.module('app.omdbapi', ['app.serie'])

            .service('omdbService', omdbService);

    omdbService.$inject = ['$http', 'Serie'];

   /**
    * Services for search OMDB series.
    * TODO to improvement: https://github.com/theapache64/movie_db
    */
    function omdbService($http, Serie) {
        var vm = this;
        const OMDB_NAME = 'http://www.omdbapi.com/?apikey=93330d3c&r=json&type=series&s=';
        const CONFIG = {timeout: 5000, headers: {'if-modified-since': undefined}};

        /**
         * Find serie by name.
         * @param name name to be searched
         * @return Promise with request result
         */
        vm.findSeries = function(name) {
            const searchUri = `${OMDB_NAME}${name}`;
            return $http.get(searchUri, CONFIG)
                .then(function(json) {
                    const result = {};
                    result.data = createSeriesList(json.data.Search);
                    return result;
                });
        }

        /**
         * Converts list received from the request to list of Series objects.
         * @param jsonSeries list from request received.
         * @return list of Series objects.
         */
        const createSeriesList = function(jsonSeries) {
            const result = [];
            if (jsonSeries && jsonSeries.length > 0) {
                jsonSeries.forEach(function(elem) {
                    const serie = new Serie(elem);
                    result.push(serie);
                });
            }
            return result;
        }
    }
})();
