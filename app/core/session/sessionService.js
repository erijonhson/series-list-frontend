(function () {
    'use strict';

    angular.module('app.sessionService', ['app.user', 'ng-token-auth', 'ui.router', 'toastr'])

            .service('sessionService', sessionService);

    sessionService.$inject = ['User', '$auth', '$state', 'toastr'];
    function sessionService(User, $auth, $state, toastr) {
        var vm = this;
        let loggedUser;

        vm.login = function(user) {
            return $auth.submitLogin(user).then(function(data) {
                var test = new User(data);
                loggedUser = new User(data);
                saveUserOnCache();
                var result = { data: loggedUser };
                return result;
            });
        }

        vm.signUp = function(user) {
            return $auth.submitRegistration(user).then(function(data) {
                const temp = new User(data);
                var result = { data: temp };
                return result;
            });
        }

        vm.isLoggedIn = function() {
            return !!loggedUser;
        }

        vm.getLoggedUser = function() {
            return loggedUser;
        }

        vm.logout = function() {
            return $auth.signOut().then(function(data) {
                loggedUser = null;
                removeUserFromCache();
                // $state.go('root.signin');
            })
            .catch(function(e) {
                if (e.data.errors) {
                    toastr.error(e.data.errors[0]);
                } else {
                    toastr.error('Erro de conexão com o servidor. ' + 
                        'Atualize a página e tente novamente mais tarde.');
                }
            });
        }

        vm.loadSeries = function() {
            loggedUser.loadSeries().then(function(data) {
                $state.go('root.series.search');
            });
        }

        function removeUserFromCache() {
            localStorage.setItem('loggedUser', null);
        }

        function saveUserOnCache() {
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        }

        function getUserFromCache() {
            const userStr = localStorage.getItem('loggedUser');
            if (!userStr) {
                return undefined;
            }
            return JSON.parse(userStr);
        }

        (function() {
            const cacheUser = getUserFromCache();
            if (cacheUser) {
                loggedUser = new User(cacheUser);
                vm.loadSeries();
            }
        })();
    }
})();