angular.module("apiFactory", [])
    .factory('API', function ($http) {
        var API = {};

        API.getStanding = function () {
            return $http.get('/standing-demo.json');

        };

        API.getPunctuationList = function () {
            return {
                '1': 25,
                '2': 18,
                '3': 15,
                '4': 12,
                '5': 10,
                '6': 8,
                '7': 6,
                '8': 4,
                '9': 2,
                '10': 1
            }
        };

        return API;

    });