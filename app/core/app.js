(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'ui.bootstrap',
        'ng-token-auth',
        'angular-loading-bar',
        'toastr',
        'app.nav.breadcrumbs',
        'app.nav.footer',
        'app.nav.header',
        'app.nav.menu',
        'app.directives.datepicker',
        'app.directives.about',
        'app.session',
        'app.sessionService',
        'app.user',
        'app.serie',
        'app.serie.list',
        'app.serie.details',
        'app.omdbapi',
    ]);
})();
