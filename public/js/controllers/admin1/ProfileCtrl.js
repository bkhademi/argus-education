(function(app){
	app
	.controller("ProfileCtrl", ["$scope","students","$http", function ($scope, students, $http) {
		$scope.schedule = []; // holds  student's schedule
		$scope.activities = []; // holds student'activities
		$scope.checks = [];
		$scope.currentDate = new Date();
		
		$scope.$watch('checks', function (n, o) {
			console.log(n);
		},true)
		
		//console.log($scope.student)// contains the student to display
		
		$scope.$watch('student', function (newVal, oldVal) {
			console.info('student changed')
			console.log(newVal);
			$scope.schedule = newVal.professor_classes;
			var parentName = newVal.GuardianName?newVal.GuardianName.split(',') :["No", " name"] ;
			$scope.parents = [{fn:parentName[0], ln: parentName[1], phone:newVal.GuardianPhone  ||"none" , mphone:'None', email:'None' }]
			$http.get('api/classes/'+newVal.Id).then(function(response){
				$scope.schedule = response.data;
				console.log($scope.schedule);
			})
			$scope.activities = newVal.user.activities_affected;
			angular.forEach($scope.activities, function(act){
				act.ActionType = parseInt(act.ActionType);
				switch(act.ActionType){
					case 0:
					act.activity = 'Referred';
					break;
					case 1:
					act.activity = 'Present';
					break;
					case 2:
					act.activity = 'Reschedule';
					break;
					case 3: 
					act.activity = ' Cleared';
					break;
					case 4:
					act.activity = 'Absent';
					break;
					case 5:
					act.activity = 'Absent Processed';
					break;
					case 6:
					act.activity = 'Parent Notified';
					break;
					default:
					act.activity = 'unknown' + act.ActionType;
				}
			})
		})
		//        studentActivitiesService.getAll()
		//        .then(function (data) {
		//            $scope.activities = data;
		//        }, function (err) {
		//            console.log(err);
		//        })
		/*  Grab All information from database */
		
		/*******************  Left Side Controllers ***************************/
		
		//        classesService.get($scope.student.ID)
		//            .success(function (data) {
		//                $scope.schedule = data;
		//            })
		$scope.schedule = [
			{ period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'A' },
			{ period: 1, className: "Advanced Math II", teacher: "Mr. Brandon", room: 'A' },
			{ period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'B' },
			{ period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'B+' },
			{ period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'C' },
			{ period: 1, className: "Integrated Math III", teacher: "Mr. Brandon", room: 'C-' }
		];
		$scope.colors = ['bg-green', 'bg-info', ];
		$scope.parents = [
			{ Fn: "Max", ln: "Quinteros", phone: "6192451818", mphone: "", email: "parent@argus.com" },
			{ Fn: "Max", ln: "Quinteros", phone: "6192451818", mphone: "", email: "max@argus.com" }
		];
		$scope.tog = 0;
		$scope.click = function (index) {
			$scope.tog = index;
		};
		
		/*******************  Right Side Controllers*********************/
		//        studentActivitiesService.get($scope.student.ID)
		//            .success(function (data) {
		//                if (data) {
		//                    $scope.activities = data;
		//                } else {
		//                    $scope.activities = [];
		//                }
		//            })
		
		$scope.currentDate;
		$scope.$watch("profileForm.date.$modelValue", function (newVal, oldVal) {
			//console.info("date changedto :" + newVal)
		})
		
		
		$scope.showDetail = false;
		$scope.toggleShowDetail = function (index) {
			$scope.showDetail = !$scope.showDetail;
			$scope.selected = $scope.activities[index];
		};
		
		$scope.showComment = false;
		$scope.toggleShowComment = function (index) {
			$scope.showComment = !$scope.showComment;
			$scope.selected = $scope.activities[index];
		}
		
		$scope.addComment = function () {
			var entry =
			{ date: formatDate(new Date), activity: "comment", Comment: $scope.comment, Staff: " Montes" }
			$scope.activities.push(entry)
			$scope.comment = '';
		}
		$scope.activities = [
			{ date: "2015-01-15", activity: "AEC" },
			{ date: "2015-01-21", activity: "ARC" },
			{ date: "2015-01-22", activity: "AEC Clear" },
			{ date: "2015-04-03", activity: "AEC Reschedule" },
			{ date: "2015-05-03", activity: "ARC Clear" },
			{ date: "2015-06-21", activity: "AEC Reschedule" },
			{ date: "2015-06-01", activity: "ARC" },
			{ date: "2015-08-03", activity: "ARC" },
			{ date: "2015-12-25", activity: "AEC" },
		];
		
		function formatDate(date) {
			return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
		}
		
		$scope.filter = [];
		$scope.getActivities = function () {
			return ($scope.activities || []).map(function (w) {
				return w.activity;
				}).filter(function (w, idx, arr) {
				return arr.indexOf(w) === idx;
			});
		};
		
		$scope.filterByCategory = function (act) {
			return $scope.filter[act.activity] || noFilter($scope.filter);
		}// date selected on the checkboxes;
		function noFilter(filterObj) {
			for (var key in filterObj) {
				if (filterObj[key]) {
					return false;
				}
			}
			return true;
		}
		
		
	}])
	
}(angular.module('Argus')));