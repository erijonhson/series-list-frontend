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
            return serie.addOrUpdateSerie().then(function(data) {
                const serie = new Serie(data.data);

                // update
                var updated = tryUpdateSerie(temp.watching, serie) 
                                || tryUpdateSerie(temp.wishing, serie);

                // add
                if (!updated) {
                    addSerie(serie);
                }

                return { data: serie };
            });
        }

        /**
         * Delete user's serie.
         */
        User.prototype.deleteSerie = function(todo) {
            const serie = angular.copy(todo);
            var temp = this;
            return todo.deleteTodo().then(function(data) {
                temp.watching = tryDeleteSerie(temp.watching, serie.id);
                temp.wishing = tryDeleteSerie(temp.wishing, serie.id);
                return { data: serie };
            });
        }

        /**
         * Add serie by type.
         */
        function addSerie(serie) {
            var temp = this;
            if (serie.type_serie === "watching" || serie.type_serie == 0)
                temp.watching.push(serie);
            else
                temp.wishing.push(serie);
        }

        /**
         * Try to update a series, return true if affirmative or false otherwise.
         */
        function tryUpdateSerie(list, serie) {
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i].id == serie.id) {
                    list[i] = serie;
                    return true;
                }
            }
            return false;
        }

        /**
         * Try to delete a series, return list updated.
         */
        function tryDeleteSerie(list, idSerie) {
            return list.filter(function(item) {
                return item.id != idSerie;
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
                    addSerie(new Serie(s));
                });
                return { data: 'success' };
            }
        }

        /**
         * Get watching series list of the User.
         */
        User.prototype.getWatchingList = function() {
            return this.watching;
        }

        /**
         * Get wishing series list of the User.
         */
        User.prototype.getWishingList = function() {
            return this.wishing;
        }

        User.prototype.constructor = User;

        User.prototype.getData = function() {
            return {
                name: this.name,
                email: this.email
            };
        };

        return User;
    }
})();