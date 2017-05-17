var app = angular.module('CalculatorApp', ['ngRoute']);
var range = _.range(1, 3);
app.config(['$routeProvider','$locationProvider',
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


app.controller("CalculatorCtrl", function ($scope, $filter) {
    $scope.max_pos_str = null;

    $scope.standing = [
        {
            'id': 1, 'name': 'H', 'last_name': 'Burnett', 'team': 'British', 'points': 76, 'total': 76,
            'pos_str': '003000000000000000000000000001', 'total_str': '003000000000000000000000000001'
        },
        {
            'id': 2, 'name': 'E', 'last_name': 'Jans', 'team': 'SK', 'points': 58, 'total': 58,
            'pos_str': '000003000000000000000001000000', 'total_str': '000003000000000000000001000000'
        },
        {
            'id': 3, 'name': 'P', 'last_name': 'Hogaboom', 'team': 'FireCruiser', 'points': 55, 'total': 55,
            'pos_str': '000001001001001000000000000000', 'total_str': '000001001001001000000000000000'
        },
        {
            'id': 4, 'name': 'R', 'last_name': 'Hale', 'team': 'British', 'points': 41, 'total': 41,
            'pos_str': '001000001000000000000000000000', 'total_str': '001000001000000000000000000000'
        },
        {
            'id': 5, 'name': 'C', 'last_name': 'Kubn', 'team': 'FireCruiser', 'points': 37, 'total': 37,
            'pos_str': '000000001001001000000000000000', 'total_str': '000000001001001000000000000000'
        },
        {
            'id': 6, 'name': 'C', 'last_name': 'Druphagel', 'team': 'SK', 'points': 35, 'total': 35,
            'pos_str': '000000001001000001000000000000', 'total_str': '000000001001000001000000000000'
        }

    ];

    $scope.range = range;

    $scope.final_standing = function () {
        return $filter('orderBy')($scope.standing, ['-total']);
    };

    $scope.race_cls = function(val){
        return 'race_'+val;
    };

    $scope.contender_cls = function(val){
        return 'contender_'+val;
    };

    $scope.point_system = function () {
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

    $scope.calculate_all_points = function () {
        angular.forEach($scope.standing, function (contender) {
            $scope.calculate_points(contender);
        })
    };

    $scope.calculate_points = function (contender) {

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
            var race_point = $scope.point_system()[result.value];
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

    $scope.max_points = function () {
        var max_points = 0;
        var max_pos_str = null;
        angular.forEach($scope.contenders, function (contender) {
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

    $scope.is_max = function (contender) {
        return contender.total === $scope.max_points() && contender.total_str === $scope.max_pos_str;
    };

    $scope.repeat_pos = function (race_cls, pos) {
        var count = 0;
        angular.forEach(angular.element('.race_' + race_cls), function (el, key) {
            if (parseInt(el.value) === pos) {
                count += 1;
            }
        });
        return (count > 1);

    };
});