(function () {
    'use strict';

    angular.module('app')

            .config(interceptorConfig)
            .config(stateConfig)
            .run(run);

    interceptorConfig.$inject = ['$provide', '$httpProvider'];
    function interceptorConfig($provide, $httpProvider) {

        function unauthorizedInterceptor($q, $injector) {
            return {
                'responseError': function (rejection) {
                    if(rejection.status === 401) {
                        localStorage.setItem('loggedUser', null);
                        $injector.get('$state').go('root.signin');
                    }
                    return $q.reject(rejection);
                }
            }
        }

        $provide.factory('unauthorizedInterceptor', ['$q', '$injector', unauthorizedInterceptor]);

        $httpProvider.interceptors.push('unauthorizedInterceptor');

    }

    stateConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider', 'API_URIS'];
    function stateConfig($stateProvider, $urlRouterProvider, $authProvider, API_URIS) {
        $urlRouterProvider.when('', '/signin');
        $urlRouterProvider.when('/', '/signin');
        $urlRouterProvider.otherwise('/');

        function checkLogin($state, sessionService, $q, toastr) {
            if (!sessionService.isLoggedIn()) {
                toastr.error('Faça login para continuar.');
                $state.go('root.signin');
                return $q.reject("Usuário não logado.");
            }
            return $q.when();
        }

        $stateProvider
                .state('root', {
                    abstract: true,
                    url: '/',
                    data: {
                        title: 'Home',
                        breadcrumb: 'Home'
                    },
                    views: {
                        'header': {
                            templateUrl: 'core/navigation/headerView.html',
                            controller: 'HeaderController',
                            controllerAs: 'HC'
                        },
                        'menu': {
                            templateUrl: 'core/navigation/menuView.html',
                            controller: 'MenuController',
                            controllerAs: 'MC'
                        },
                        'breadcrumbs': {
                            templateUrl: 'core/navigation/breadcrumbsView.html',
                            controller: 'BreadcrumbsController',
                            controllerAs: 'BC'
                        },
                        'content': {
                            template: 'Escolha um menu...'
                        },
                        'footer': {
                            templateUrl: 'core/navigation/footerView.html',
                            controller: 'FooterController',
                            controllerAs: 'FC'
                        }
                    }
                })
                .state('root.series', {
                    abstract: true,
                    url: 'series',
                    data: {
                        title: 'Series',
                        breadcrumb: 'Series'
                    },
                    resolve: {
                        checkLogin: checkLogin
                    }
                })
                .state('root.series.search', {
                    url: '/search',
                    data: {
                        title: 'Series search',
                        breadcrumb: 'Search'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'core/serie/seriesSearchView.html',
                            controller: 'SerieListController',
                            controllerAs: 'SLC'
                        }
                    }
                })
                .state('root.series.watching', {
                    url: '/watching',
                    data: {
                        title: 'Series list',
                        breadcrumb: 'Watching'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'core/serie/seriesListView.html',
                            controller: 'SerieListController',
                            controllerAs: 'SLC'
                        }
                    }
                })
                .state('root.series.wishing', {
                    url: '/wishing',
                    data: {
                        title: 'Series list',
                        breadcrumb: 'Wishing'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'core/serie/seriesListView.html',
                            controller: 'SerieListController',
                            controllerAs: 'SLC'
                        }
                    }
                })
                .state('root.signup', {
                    url: 'signup',
                    views: {
                        'content@': {
                            templateUrl: 'core/session/signupView.html',
                            controller: 'SessionController',
                            controllerAs: 'SC'
                        }
                    }
                })
                .state('root.signin', {
                    url: 'signin',
                    views: {
                        'content@': {
                            templateUrl: 'core/session/signinView.html',
                            controller: 'SessionController',
                            controllerAs: 'SC'
                        }
                    },
                    resolve: {
                        doSignin: function ($location, sessionService) {
                            if (sessionService.isLoggedIn()) {
                                // $state.go('root.series.list');
                                $location.path('/series/list');
                            }
                        }
                    }
                });

        $authProvider.configure({
            apiUrl:                  API_URIS.API_ROOT,
            tokenValidationPath:     '/auth/validate_token',
            signOutUrl:              '/auth/sign_out',
            emailRegistrationPath:   '/auth',
            accountUpdatePath:       '/auth',
            accountDeletePath:       '/auth',
            confirmationSuccessUrl:  window.location.href,
            passwordResetPath:       '/auth/password',
            passwordUpdatePath:      '/auth/password',
            passwordResetSuccessUrl: window.location.href,
            emailSignInPath:         '/auth/sign_in',
            storage:                 'localStorage',
            forceValidateToken:      false,
            validateOnPageLoad:      true,
            proxyIf:                 function() { return false; },
            proxyUrl:                '/proxy',
            omniauthWindowType:      'sameWindow',
            tokenFormat: {
                "access-token": "{{ token }}",
                "token-type":   "Bearer",
                "client":       "{{ clientId }}",
                "expiry":       "{{ expiry }}",
                "uid":          "{{ uid }}"
            },
            cookieOps: {
                path: "/",
                expires: 9999,
                expirationUnit: 'days',
                secure: false,
                domain: 'domain.com'
            },
            createPopup: function(url) {
                return window.open(url, '_blank', 'closebuttoncaption=Cancel');
            },
            parseExpiry: function(headers) {
                // convert from UTC ruby (seconds) to UTC js (milliseconds)
                return (parseInt(headers['expiry']) * 1000) || null;
            },
            handleLoginResponse: function(response) {
                return response.data;
            },
            handleAccountUpdateResponse: function(response) {
                return response.data;
            },
            handleTokenValidationResponse: function(response) {
                return response.data;
            }
        });
    }

    run.$inject = ['$rootScope', '$location', 'toastr'];
    function run($rootScope, $location, toastr) {
        $rootScope.$on('auth:invalid', function(ev) {
            toastr.error('Faça login para continuar!');
            $location.path('/').replace();
            $rootScope.$apply();
        });
    }

})();
