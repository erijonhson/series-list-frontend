// Adapted from: http://adamalbrecht.com/2013/12/12/creating-a-simple-modal-dialog-directive-in-angular-js/
(function () {
    'use strict';

    angular.module('app.directives.modal', [])

            .directive('modalDialog', modalDialog);

    function modalDialog() {
        return {
            restrict: 'E',
            scope: {
                show: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            link: function(scope, element, attrs) {
                scope.dialogStyle = {};
                if (attrs.width)
                    scope.dialogStyle.width = attrs.width;
                if (attrs.height)
                    scope.dialogStyle.height = attrs.height;
                scope.hideModal = function() {
                    scope.show = false;
                };
            },
            templateUrl: 'assets/html/modalView.html'
        };
    }
})();
