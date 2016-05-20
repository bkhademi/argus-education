/**
 * Created by Brandon on 5/19/2016.
 */
(function (app) {

   app.controller("CompiledListCtrl",function($scope,referrals,StudentsService){
       $scope.refTable = referrals.getList();
       $scope.refTable.then(processlist,error)
       var button = {
           name:"O-Room",
           color: "Blue"
       };
       function processlist(list){
           $scope.refTable = list.list;
           angular.forEach(list.list,StudentsService.addTodaysAct);
       }
       function error (){
           console.log("error");
       }
   })

}(angular.module("Argus")));