/* global angular */

(function (app) {
	"use strict";
//	O-Room Coordinator
	app.controller('NavigationAdmin3Ctrl', function () {
		var path = "../Client/Views/dashItems/";
		var vm = this;
		/**
		 * Navigation bar places with their links and icons
		 */
		vm.tabs = [
			{
				id: 'Dashboard',
				link: "admin3.dashboard",
				icon: 'dashboard fa-2x'
			},{
				id: 'Activity Log',
				link: 'admin3.oroomActivityLogAdmin',
				icon: 'tasks fa-2x'
			},{
				id: 'Create Referral',
				link: "admin3.CoordinatorReferralSystem",
				icon: 'pencil-square-o fa-2x'
			},{
				id: 'Attendance Rosters',
				link: "admin3.attendanceRosters.oroom",
				icon: 'list-alt fa-2x'
			},{
				id: 'Reports',
				link: 'admin3.reports',
				icon: 'area-chart fa-2x'
			}
		];
	});
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsController', ['$scope'	, function ($scope) {
			$scope.eod = {};
			$scope.eod.issStudents = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White', Attendance:'Present', Progression:''  },
				
				
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Attendance:'Sent-Out', Progression:'ISS --> OSS'  },
				
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black', Attendance:'Absent', Progression:'ISS --> Re-ISS'  }
				
			];
		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsEODController', ['$scope', "$timeout", function ($scope , $timeout) {
			$scope.eodReports = [
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'Reteach', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			$scope.eod.selected = {name:0, value:0 };
			
			
			
			
			angular.forEach($scope.eod.issStudents, function(item){
				if(item.Attendance === 'Absent')
					item.class = 'bg-gray';
				else if(item.Attendance ==='Sent-Out')
					item.class = 'bg-danger';
				else 
					item.class = 'bg-green';
			});
			
		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsProgressionController', ['$scope', '$timeout'	, function ($scope, $timeout) {
			$scope.startingPoints = [
				{name:'Reteach', value:1},
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'O-Room+1', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			
			
			
			$scope.starting = undefined;
			$scope.eod.issStudents1 = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Date:'12/10/2015'  },
				{StudentId:'100131423', FirstName:'Adrian ',LastName:'Black',  Date:'12/10/2015', class:'bg-warning'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/10/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/10/2015'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez',  Date:'12/10/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/10/2015'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/10/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/10/2015'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/10/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/10/2015'  }];
			
			$scope.eod.issStudents2 = [
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/11/2015'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez',  Date:'12/11/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/11/2015'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/11/2015'  },
				{StudentId:'100344318', FirstName:'Adrian ',LastName:'Black',  Date:'12/11/2015', class:'bg-warning'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/11/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/11/2015'  }];
			
			
			$scope.eod.issStudents3 = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Date:'12/12/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/12/2015'  },
				{StudentId:'100131834', FirstName:'Adrian ',LastName:'Black', Date:'12/12/2015' ,class:'bg-warning'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/12/2015'  },
				{StudentId:'102234384', FirstName:'Henry ',LastName:'Lopez',  Date:'12/12/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/12/2015'  }];
			
			
			$scope.eod.issStudents4 = [
				{StudentId:'100109607', FirstName:'Mark',LastName:'Gonzales', Date:'12/13/2015'  },
				{StudentId:'100131423', FirstName:'Tyron ',LastName:'Black',  Date:'12/13/2015'  },
				{StudentId:'100131834', FirstName:'Adrian ',LastName:'Black', Date:'12/13/2015', class:'bg-warning'  },
				{StudentId:'100131834', FirstName:'Sara ',LastName:'Marquez', Date:'12/13/2015'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/13/2015'  }];
			
			$scope.eod.issStudents5 = [
			
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/14/2015'  },
				{StudentId:'100131834', FirstName:'Adrian ',LastName:'Black', Date:'12/14/2015', class:'bg-warning'  },
				{StudentId:'100344318', FirstName:'David ',LastName:'White',  Date:'12/14/2015'  }];
			$scope.selected = $scope.eod.issStudents1[1];
		}]);
}(angular.module('Argus')));

(function (app) {
	app.controller('Admin1ReportsAtRiskController', ['$scope'	, function ($scope) {
			$scope.eodReports = [
				{name:'AEC', value:1},
				{name:'O-Room', value:2},
				{name:'Reteach', value:3},
				{name:'ISS', value:4},
				{name:'OSS PMP', value:5}
			];
			$scope.eod.selected = {name:0, value:0 };
			
			angular.forEach($scope.eod.issStudents, function(item){
				item.class = 'bg-danger';
			});
		}]);
}(angular.module('Argus')));