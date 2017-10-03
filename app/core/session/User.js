(function () {
    'use strict';

    angular.module('app.user', ['app.serie'])

            .factory('User', userFactory);

    userFactory.$inject = ['Serie', '$q', '$http', 'API_URIS'];

    /**
     * Represents a User of the app.
     */
    function userFactory(Serie, $q, $http, API_URIS) {

        const User = function(data) {
            if (!!data) {
                this.id = data.id;
                this.name = data.name;
                this.email = data.email;
                this.watching = [];
                this.wishing = [];
            }
        }

        /**
         * Add ou update user's serie.
         */
        User.prototype.addOrUpdateSerie = function(serie) {
            var temp = this;
            serie.user_id = temp.id;
            var serieCtrl = getSerie(temp.watching.concat(temp.wishing), serie)
                                || serie;
            return serieCtrl.addOrUpdateSerie().then(function(data) {
                const serverSerie = new Serie(data.data.data);

                temp.wishing = tryRemoveSeries(temp.wishing, serverSerie);
                temp.watching = tryRemoveSeries(temp.watching, serverSerie);

                if (serverSerie.serie_type === 'watching') {                        
                    addSerie(temp.watching, serverSerie);
                } else {
                    addSerie(temp.wishing, serverSerie);
                }

                return { data: serverSerie };
            });
        }

        /**
         * Get serie from list.
         */
        function getSerie(list, serie) {
            return list.find(function(s) {
                return serie.imdb === s.imdb;
            });
        }

        /**
         * Add serie in list.
         */
        function addSerie(list, serie) {
            var inList = getSerie(list, serie);
            if (!inList) list.push(serie);
        }

        /**
         * Delete user's serie.
         */
        User.prototype.deleteSerie = function(serie) {
            const deletedSerie = angular.copy(serie);
            var temp = this;
            return serie.remove().then(function(data) {
                temp.watching = tryRemoveSeries(temp.watching, deletedSerie);
                temp.wishing = tryRemoveSeries(temp.wishing, deletedSerie);
                return { data: deletedSerie };
            });
        }

        /**
         * Try to remove a series of the list.
         */
        function tryRemoveSeries(list, serie) {
            return list.filter(function(s) {
                return serie.imdb !== s.imdb;
            });
        }

        /**
         * Received all the series of the User.
         */
        User.prototype.loadSeries = function() {
            var temp = this;
            return $http.get(API_URIS.SERIE)
                    .then(success);

            function success(response) {
                temp.watching = [];
                temp.wishing = [];
                response.data.data.forEach(function(s) {
                    if (s.attributes['serie-type'] === 'watching')
                        addSerie(temp.watching, new Serie(s));
                    else 
                        addSerie(temp.wishing, new Serie(s));
                });
                return { data: 'success' };
            }
        }

        /**
         * Get watching series list of the User.
         */
        User.prototype.getWatchingList = function() {
            var temp = this;
            return temp.watching;
        }

        /**
         * Get wishing series list of the User.
         */
        User.prototype.getWishingList = function() {
            var temp = this;
            return temp.wishing;
        }

        /**
         * Check if exists series in watching series list of the User.
         */
        User.prototype.isWatchingSeries = function(serie) {
            var temp = this;
            return temp.watching.find(function(s) {
                return serie.imdb === s.imdb;
            });
        }

        /**
         * Check if exists series in wishing series list of the User.
         */
        User.prototype.isWishingSeries = function(serie) {
            var temp = this;
            return temp.wishing.find(function(s) {
                return serie.imdb === s.imdb;
            });
        }

        User.prototype.constructor = User;

        User.prototype.getData = function() {
            return {
                user: {
                   name: this.name,
                   email: this.email
                }
            };
        };

        return User;
    }
})();