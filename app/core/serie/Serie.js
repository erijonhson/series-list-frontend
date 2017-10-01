(function () {
    'use strict';

    angular.module('app.serie', [])

            .factory('Serie', serieFactory);

    serieFactory.$inject = ['$http', 'API_URIS', 'DEFAULT_POSTER'];

    /**
     * Represents entity of series.
     */
    function serieFactory($http, API_URIS, DEFAULT_POSTER) {
        var vm = this;

        vm.backup;

        /**
         * Constructor.
         * @param data JSON for create a Serie.
         */
        const Serie = function (data) {
            vm.id = data.id;
            vm.my_rating = data.my_rating;
            vm.last_season = data.last_season;
            vm.last_episode = last_episode;
            vm.serie_type = data.serie_type;
            vm.user_id = data.user_id;
            vm.imdb = data.imdbID || data.imdb;

            vm.mergeDetails(data);
            vm.backup = angular.copy(this);
        };

        /**
         * 
         */
        Serie.prototype.addOrUpdateSerie = function(serie) {
            if (vm.id) {
                return vm.add();
            } else {
                return vm.update();
            }
        }

        /**
         * Post one serie.
         */
        Serie.prototype.add = function () {
            const json = vm.getData();
            return $http.post(API_URIS.SERIE, json).then(function(data) {
                angular.extend(this, data.data);
                vm.backup = angular.copy(this);
                return data;
            });
        };

        /**
         * Update one serie.
         */
        Serie.prototype.update = function () {
            const json = vm.getData();
            const uri = API_URIS.SERIE + vm.id;
            return $http.put(uri, json).then(function(data) {
                angular.extend(this, data.data);
                vm.backup = angular.copy(this);
                return data;
            });
        };

        /**
         * Remove one serie.
         */
        Serie.prototype.remove = function () {
            const uri = API_URIS.SERIE + vm.id;
            return $http.delete(uri).then(function(data) {
                angular.extend(this, data.data);
                return data;
            });
        };

        /**
         * Reload infos of the serie for last communication with server. 
         */
        Serie.prototype.reload = function () {
            const backup = vm.backup;
            delete vm.backup;
            angular.copy(backup, this);
            vm.backup = angular.copy(this);
        };

        /**
         * Download IMDB details for series.
         */
        Serie.prototype.loadDetails = function () {
            const uri = API_URIS.OMDBBYID + vm.imdbID;
            return $http.get(getUri, {timeout: 4000}).then(function(data) {
                vm.mergeDetails(data.data);
                vm.backup = angular.copy(this);
                return this;
            });
        };

        /**
         * Merge incoming information to the object by updating it.
         */
        Serie.prototype.mergeDetails = function (data) {
            vm.title = data.Title;
            vm.year = data.Year;
            vm.plot = data.Plot;
            vm.rated = data.Rated;
            vm.imdbRating = data.imdbRating;
            vm.posterUrl = data.Poster;
            if (vm.posterUrl === "N/A") {
                vm.posterUrl = DEFAULT_POSTER;
            }
        };

        Serie.prototype.constructor = Serie;

        /**
         * Filter and format JSON infos for only server need.
         */
        Serie.prototype.getData = function () {
            return {
                serie: {
                    id: vm.id,
                    imdb: vm.imdb,
                    my_rating: vm.my_rating,
                    last_season: vm.last_season,
                    last_episode: vm.last_episode,
                    serie_type: vm.serie_type,
                    user_id: vm.user_id
                }
            };
        };

        return Serie;
    }
})();
