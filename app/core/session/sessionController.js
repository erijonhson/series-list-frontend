(function () {
    'use strict';

    angular.module('app.session', ['ui.router', 'app.sessionService', 'toastr'])

            .controller('SessionController', SessionController);

    SessionController.$inject = ['$state', 'sessionService', 'toastr'];

    function SessionController($state, sessionService, toastr) {
        var vm = this;
        let ERROR = 'Favor atualize a página, verifique suas credencias e sua conexão com a internet.';

        vm.user = {};

        vm.signup = function (user) {
            vm.user = angular.copy(user);
            vm.user.password = md5(user.password);
            sessionService.signUp(vm.user)
              .then(function(resp) {
                  toastr.success('Cadastro realizado com sucesso! Faça login para continuar...');
                  $state.go('root.signin');
              })
              .catch(function(resp) {
                  toastr.error(resp.errors ? resp.errors[0] : ERROR);
                  $state.reload();
              });
        }

        vm.signin = function (user) {
            vm.user = angular.copy(user);
            vm.user.password = md5(user.password);
            sessionService.login(vm.user)
                .then(function(resp) {
                    toastr.success('Olá ' + resp.data.name);
                    sessionService.loadSeries();
                })
                .catch(function(resp) {
                  toastr.error(resp.errors ? resp.errors[0] : ERROR);
                    $state.reload();
                });
        };
    }
})();
