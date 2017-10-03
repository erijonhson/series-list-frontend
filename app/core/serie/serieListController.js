(function () {
    'use strict';

    angular.module('app.serie.list', ['ui.router', 'app.omdbapi', 'app.sessionService', 'toastr'])

            .controller('SerieListController', SerieListController);

    SerieListController.$inject = ['$state', '$q', '$location', 'omdbService', 'sessionService', 'toastr'];

    function SerieListController($state, $q, $location, omdbService, sessionService, toastr) {
        var vm = this;

        vm.currentUser = sessionService.getLoggedUser();

        vm.series = {
            list: []
        }

        vm.getSeries = function() {
            const path = $location.path();
            if (path.includes('wishing')) {
                vm.series.list = vm.currentUser.getWishingList();
            } else if (vm.series.list.length == 0 || path.includes('watching')) {
                vm.series.list = vm.currentUser.getWatchingList();
            }
            return vm.series.list;
        }

        vm.search = function(name) {
            omdbService.findSeries(name)
                .then(putSeries)
                .catch(searchFailed);

            function putSeries(response) {
                vm.series.list = response.data;
            }

            function searchFailed(e) {
                var newMessage = e.errors ? e.errors[0] : 'Erro ao buscar séries';
                toastr.error(newMessage);
                return $q.reject(e);
            }
        }

        vm.isWatchingSeries = function(serie) {
            return vm.currentUser.isWatchingSeries(serie);
        }

        vm.addWatchingSeries = function(serie) {
            serie.serie_type = 'watching';
            return vm.currentUser.addOrUpdateSerie(serie);
        }

        vm.isWishingSeries = function(serie) {
            return vm.currentUser.isWishingSeries(serie);
        }

        vm.addWishingSeries = function(serie) {
            serie.serie_type = 'wishing';
            return vm.currentUser.addOrUpdateSerie(serie);
        }

        vm.deleteSeries = function(serie) {
            return vm.currentUser.deleteSerie(serie);
        }
    }

})();
