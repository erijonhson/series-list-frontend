(function () {
    'use strict';

    angular.module('app.serie', [])

            .factory('Serie', serieFactory);

    serieFactory.$inject = ['$http', 'API_URIS', 'DEFAULT_POSTER'];

    /**
     * Represents entity of series.
     */
    function serieFactory($http, API_URIS, DEFAULT_POSTER) {

        this.backup;

        /**
         * Constructor.
         * @param data JSON for create a Serie.
         */
        const Serie = function (data) {
            this.id = data.id;
            this.imdb = data.imdbID;
            this.posterUrl = data.Poster;
            this.title = data.Title;
            if (data.attributes) {
                this.imdb = data.attributes['imdb'];
                this.posterUrl = data.attributes['poster-uri'];
                this.title = data.attributes['title'];
                this.my_rating = data.attributes['my-rating'];
                this.last_season = data.attributes['last-season'];
                this.last_episode = data.attributes['last-episode'];
                this.serie_type = data.attributes['serie-type'];
                this.user_id = data.attributes['user-id'];
            }

            this.mergeDetails(data);
            this.backup = angular.copy(this);
        };

        /**
         * 
         */
        Serie.prototype.addOrUpdateSerie = function(serie) {
            if (!this.id) {
                return this.add();
            } else {
                return this.update();
            }
        }

        /**
         * Post one serie.
         */
        Serie.prototype.add = function () {
            var temp = this;
            const json = temp.getData();
            return $http.post(API_URIS.SERIE, json).then(function(data) {
                angular.extend(temp, data.data);
                temp.backup = angular.copy(temp);
                return data;
            });
        };

        /**
         * Update one serie.
         */
        Serie.prototype.update = function () {
            var temp = this;
            const json = temp.getData();
            const uri = API_URIS.SERIE + temp.imdb;
            return $http.put(uri, json).then(function(data) {
                angular.extend(temp, data.data);
                temp.backup = angular.copy(temp);
                return data;
            });
        };

        /**
         * Remove one serie.
         */
        Serie.prototype.remove = function () {
            var temp = this;
            const uri = API_URIS.SERIE + temp.imdb;
            return $http.delete(uri).then(function(data) {
                angular.extend(temp, data.data);
                return { data: temp };
            });
        };

        /**
         * Reload infos of the serie for last communication with server. 
         */
        Serie.prototype.reload = function () {
            const backup = this.backup;
            delete this.backup;
            angular.copy(backup, this);
            this.backup = angular.copy(this);
        };

        /**
         * Download IMDB details for series.
         */
        Serie.prototype.loadDetails = function () {
            var temp = this;
            const uri = API_URIS.OMDBBYID + temp.imdb;
            return $http.get(uri, {
                    timeout: 4000, 
                    headers: {'if-modified-since': undefined}
                }).then(function(data) {
                    temp.mergeDetails(data.data);
                    temp.backup = angular.copy(temp);
                    return temp;
                });
        };

        /**
         * Merge incoming information to the object by updating it.
         */
        Serie.prototype.mergeDetails = function (data) {
            this.year = data.Year;
            this.plot = data.Plot;
            this.rated = data.Rated;
            this.imdbRating = data.imdbRating;
            this.released = data.Released;
            this.genre = data.Genre;
            this.writer = data.Writer;
            this.totalSeasons = data.totalSeasons;
            if (!this.posterUrl || this.posterUrl === "N/A") {
                this.posterUrl = DEFAULT_POSTER;
            }
        };

        Serie.prototype.constructor = Serie;

        /**
         * Filter and format JSON infos for only server need.
         */
        Serie.prototype.getData = function () {
            return {
                serie: {
                    id: this.id,
                    title: this.title,
                    imdb: this.imdb,
                    my_rating: this.my_rating,
                    last_season: this.last_season,
                    last_episode: this.last_episode,
                    poster_uri: this.posterUrl,
                    serie_type: this.serie_type,
                    user_id: this.user_id
                }
            };
        };

        return Serie;
    }
})();
