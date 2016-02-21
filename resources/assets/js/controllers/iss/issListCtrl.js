/* global angular */

(function (app) {
	app.controller('IssListCtrl', ['$scope', 'notify', '$modal', 'ISSService',
		function ($scope, notify, $modal, isss) {
			$scope.iss = isss.query({roster: true});
			
			$scope.getISSList = function(){
				$scope.iss = isss.query({roster: true});
			};
			$scope.activities = [
				{name: "Present", Id:38 },
//				{name: "No Show", Id: 12},
				{name: "Left School", Id: 40},
				{name: "School Absent", Id: 41},
				{name: "Sent Out", Id: 42},
				{name: "Walked Out", Id: 43}
			];

			$scope.issAttendance = function (item,  oldActValue) {
				//oldActValue = oldActValue?angular.fromJson(oldActValue) : '';
				
//				if(item.activity.Id === 13 || item.activity.Id === 14  ){
//					var confirmation = confirm('Are you sure the student activity is '+ item.activity.name
//						+ '. A push notification will be sent to all users');
//					
//					if(!confirmation){
//						item.activity = oldActValue;
//						return;
//					}
					
//					var modalInstance = $modal.open({
//						templateUrl: 'views/modals/ISSNotificationDocumentationModal.html',
//						size: 'lg',
//						controller:function($scope, student){
//							$scope.student  = student;
//							$scope.title = 'ISS'
//						},
//						resolve: {
//							student :function(){return item;}
//						}
//					});
//					
//					modalInstance.result.then(function(data){
//						// submit notification
//					});
//				
//					
//				
//				
//				
				
				//}
				
				if (!item) {
					isss.update({id: item.referred[0].Id, attendance: true}, {
						ActivityTypeId: 0
					});
					return;
				}
				//console.log(item);
				isss.update({id: item.referred[0].Id, attendance: true}, {
					ActivityTypeId: item.activity? item.activity.Id:0
				});

			};
		}]);
}(angular.module('Argus')));
 