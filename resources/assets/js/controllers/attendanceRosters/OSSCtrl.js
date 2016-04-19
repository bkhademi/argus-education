/* global angular */

(function (app) {
    app.controller('OSSRosterController',
        ['$scope', 'notify', '$modal', 'OSSService', 'FormatTimeService', 'ISSService', 'CountersService',
            function ($scope, notify, $modal, osss, time, isss, counters) {
                $scope.currentDate = new Date();
                $scope.$watch('form.date.$viewValue', function (newV, oldV) {
                    if (newV) {
                        $scope.currentDate = newV;
                        $scope.oss = osss.getOSSList($scope.currentDate, function(data){
                            $scope.count.oss = data.length;
                        });
                    }
                });




            }]);
}(angular.module('Argus')));