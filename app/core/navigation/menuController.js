(function () {
    'use strict';

    angular.module('app.nav.menu', ['ui.router', 'app.sessionService'])

            .controller('MenuController', MenuController);

    MenuController.$inject = ['$state', 'sessionService'];

    function MenuController($state, sessionService) {
        var vm = this;

        vm.getClass = getClass;

        vm.userLogged = function() {
            return sessionService.isLoggedIn();
        }

        vm.logout = function() {
            sessionService.logout();
        }

        function getClass(path) {
            if ($state.current.name.substr(0, path.length) === path) {
                return 'active';
            } else {
                return '';
            }
        }
    }
})();
