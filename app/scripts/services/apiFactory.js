angular.module("apiFactory", [])
    .factory('API', function ($http) {
        var API = {};

        if(typeof DR27_DOMAIN === 'undefined') DR27_DOMAIN = '';
        if(typeof TITLE_CONTENDERS_PATH === 'undefined') TITLE_CONTENDERS_PATH = 'standing-demo.json';
        if(typeof SEASON_SUMMARY_PATH === 'undefined') SEASON_SUMMARY_PATH = 'season-summary-demo.json';


        API.getStanding = function () {
            return $http.get(DR27_DOMAIN + '/' + TITLE_CONTENDERS_PATH);

        };

        API.getSeasonSummary = function () {
            return $http.get(DR27_DOMAIN + '/' + SEASON_SUMMARY_PATH);

        };

        return API;

    });