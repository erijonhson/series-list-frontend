/* global expect */

"use strict";

describe("About directive", function () {
    var elm, scope;

    beforeEach(module("app.directives.about"));

    it("should return name, version and author of app", inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        elm = angular.element('<span app-about></span>');
        $compile(elm)(scope);
        expect(elm.text()).toEqual("angular-todo-list app v0.2.2 by Eri Jonhson");
    }));
});
