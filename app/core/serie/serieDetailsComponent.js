(function () {
    'use strict';

    angular.module('app.serie.details', [])

            .component('serieDetailsComponent', {
                templateUrl: 'core/serie/serieDetailsView.html',
                bindings: {
                    resolve: '<',
                    close: '&',
                    dismiss: '&'
                },
                controller: detailsController
            });

    detailsController.$inject = ['sessionService'];
    function detailsController(sessionService) {
        var $ctrl = this;

        $ctrl.serie;
        $ctrl.currentUser = sessionService.getLoggedUser();

        $ctrl.$onInit = function() {
            $ctrl.serie = $ctrl.resolve.serie;
            $ctrl.serie.loadDetails();
        };

        $ctrl.update = function() {
            $ctrl.serie.update();
        }

        $ctrl.isUserSerie = function(serie) {
            return $ctrl.currentUser.isWishingSeries(serie) 
                || $ctrl.currentUser.isWatchingSeries(serie);
        }
    }

})();
