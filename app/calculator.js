var app = angular.module('CalculatorApp', ['ngRoute']);
var range = _.range(1, 3);
app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/calculator', {
                templateUrl: 'views/calculator.html'
            })
            .when('/table', {
                templateUrl: 'views/table.html'
            })
            .otherwise({
                templateUrl: 'views/calculator.html'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);

app.factory('APIFactory', function ($http) {
    var APIFactory = {};

    APIFactory.getStanding = function () {
        return $http.get('/standing-demo.json');

    };

    return APIFactory;

});

app.controller("CalculatorCtrl", function ($scope, $filter, APIFactory) {
    $scope.max_pos_str = null;

    APIFactory.getStanding().then(function (response) {
        $scope.standing = response.data;
    }, function (err) {
        console.error(err);
    });

    $scope.range = range;

    $scope.finalStanding = function () {
        return $filter('orderBy')($scope.standing, ['-total', '-total_str']);
    };

    $scope.raceCls = function (val) {
        return 'race_' + val;
    };

    $scope.contenderCls = function (val) {
        return 'contender_' + val;
    };

    $scope.pointSystem = function () {
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

    $scope.calculateAllPoints = function () {
        angular.forEach($scope.standing, function (contender) {
            $scope.calculatePoints(contender);
        })
    };

    $scope.calculatePoints = function (contender) {

        var points = contender.points;
        var error_count = false;

        contender.total_str = contender.pos_str;

        var total_split = contender.total_str.match(/.{3}/g);
        var total_split_length = total_split.length;


        angular.forEach(angular.element('.contender_' + contender.id), function (result, index) {
            var result_pos = result.value;
            if (result_pos >= 1 && result_pos <= total_split_length) {
                total_split[result_pos - 1] = parseInt(total_split[result_pos - 1]) + 1;
            }
            var race_point = $scope.pointSystem()[result.value];
            if (race_point) {
                points += race_point;
            }

        });

        var default_str = '000';

        angular.forEach(total_split, function (total_s, index) {
            total_split[index] = (default_str + total_s).slice(-default_str.length);
        });

        contender.total_str = total_split.join('');
        contender.total = (!error_count) ? points : 0;
    };

    $scope.maxPoints = function () {
        var max_points = 0;
        var max_pos_str = null;
        angular.forEach($scope.standing, function (contender) {
            if (contender.total === max_points && contender.total_str > max_pos_str) {
                max_pos_str = contender.total_str;
            }

            if (contender.total > max_points) {
                max_points = contender.total;
                max_pos_str = contender.total_str;
            }

        });
        $scope.max_pos_str = max_pos_str;
        return max_points;
    };

    $scope.isMax = function (contender) {
        return contender.total === $scope.maxPoints() && contender.total_str === $scope.max_pos_str;
    };

    $scope.repeatPos = function (race_cls, pos) {
        var count = 0;
        angular.forEach(angular.element('.race_' + race_cls), function (el, key) {
            if (parseInt(el.value) === pos) {
                count += 1;
            }
        });
        return (count > 1);

    };
});