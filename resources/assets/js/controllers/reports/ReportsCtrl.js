/* global angular */

(function (app) {
	app.controller('ReportsCtrl', ['$scope', 'notify','$modal', function ($scope, notify,$modal) {
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
