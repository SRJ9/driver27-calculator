var app = angular.module('CalculatorApp', ['ngRoute', 'apiFactory']);
app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/calculator', {
                templateUrl: '../views/calculator.html'
            })
            .when('/table', {
                templateUrl: '../views/table.html'
            })
            .otherwise({
                templateUrl: '../views/calculator.html'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]);


app.controller("CalculatorCtrl", function ($scope, $filter, API) {
    $scope.max_pos_str = null;

    API.getStanding().then(function (response) {
        var standing = response.data;
        angular.forEach(angular.element(standing), function (element, index) {
            element.id = index;
        });
        $scope.standing = standing;

    }, function (err) {
        console.error(err);
    });

    API.getSeasonSummary().then(function(response){
        var season_data = response.data;
        $scope.season_competition_name = season_data.competition_name;
        $scope.season_year = season_data.year;
        $scope.num_pending_races = season_data.num_pending_races || 4;
        $scope.range = _.range(1, $scope.num_pending_races+1);
        $scope.pointSystem = season_data.punctuation_config.finish;
        $scope.pending_races_summary = season_data.pending_races_summary;
        console.log(season_data);
    }, function(err){
        console.log(err);
    });

    $scope.finalStanding = function () {
        return $filter('orderBy')($scope.standing, ['-total', '-total_str']);
    };

    $scope.raceCls = function (val) {
        return 'race_' + val;
    };

    $scope.contenderCls = function (val) {
        return 'contender_' + val;

    };

    $scope.tableTdCls = function(val){
        return 'table-td-'+val;
    };



    $scope.calculateAllPoints = function () {
        angular.forEach($scope.standing, function (contender) {
            $scope.calculatePoints(contender);
        })
    };

    $scope.calculatePoints = function (contender) {

        var points = contender.points;
        var error_count = false;

        contender.total_str = contender.positions_order;

        var total_split = contender.total_str.match(/.{3}/g);
        var total_split_length = total_split.length;


        angular.forEach(angular.element('.contender_' + contender.id), function (result, index) {
            var result_pos = result.value;
            if (result_pos >= 1 && result_pos <= total_split_length) {
                total_split[result_pos - 1] = parseInt(total_split[result_pos - 1]) + 1;
            }

            var factor = 1;
            var alter_punctuation = angular.element(result).data('alter-punctuation');
            if(alter_punctuation === 'half') factor = 0.5;
            else if(alter_punctuation === 'double') factor = 2;

            var race_point = $scope.pointSystem[result.value - 1] * factor;
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