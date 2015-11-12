/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl() {

    this.userName = 'Brandon Hernandez';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

function DashTeacherCtrl($scope, $modal, referrals) {
    var path = "../Client/Views/dashItems/";
    $scope.tabs = [
       {
           id: 'Dashboard',
           text: ['Dashboard', 'System'],
           route: path + 'referal.html',
           link: "teacher.dashboard",
           icon: 'dashboard fa-2x'
       }
//	   , {
//           id: 'Referral System',
//           text: ['Referral', 'System'],
//           route: path + 'referral.html',
//           link: "teacher.referral",
//           icon: 'eye fa-2x'
//       }, {
//           id: 'My Assignments',
//           text: ['My', 'Assignments'],
//           route: path + 'Assignments.html',
//           link: "teacher.assignments",
//           icon: 'file-pdf-o fa-2x'
//       }, {
//           id: 'Statistics',
//           text: ['Statistics'],
//           route: path + 'statistics.html',
//           link: "teacher.statistics",
//           icon: 'bar-chart fa-2x'
//       }, {
//           id: 'Saturday School',
//           text: ['Saturday', 'School'],
//           route: path + 'saturdaySchool.html',
//           link: "teacher.saturdaySchool",
//           icon: 'pencil-square-o fa-2x'
//       }, {
//           id: "Manage Saturday School",
//           text: ['Manage', 'Saturday', 'School'],
//           route: path + 'manageSaturdaySchool.html',
//           link: "teacher.manageSaturdaySchool",
//           icon: 'list-alt fa-2x'
//       }, {
//           id: "Gradebook",
//           text: ['Gradebook'],
//           route: path + 'gradebook.html',
//           link: "teacher.gradebook",
//           icon:'archive fa-2x'
//       }
    ];

   $scope.incommingAssignments = 0;
   $scope.assignmentsToReprint  = 0;
	$scope.getReferrals  = function(){
		$scope.referrals =referrals.query(function(data){
			// preprocess referrals to show easily
			// adjust the returned referrals 
			for(var i = 0; i < data.length ; i++){
				for(var j = 0 ; j < data[i].referred.length ; j++){
					
					if(data[i].referred[j].RefferalStatus === 1){
						$scope.incommingAssignments++;
						data[i].showAccept = true;
					}
					if(data[i].referred[j].Reprint === 1){
						$scope.assignmentsToReprint++;
						data[i].showReprint = true;
					}
					 data[i].referred[j].id = data[i].referred[j].Id;
					angular.extend(data[i].referred[j] ,data[i].referred[j].assignment);
					delete( data[i].referred[j].assignment);
				}
			}
		
			console.log(data);
		});
	}
	$scope.getReferrals();
	
	 /**
     * Options for Bar chart
     */
    $scope.barOptions = {
        scaleBeginAtZero: false,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 5
    };

    $scope.barData1 = {
        labels: ["Adrian", "Atl", "Brandon", "Jose", "Maxx", "Luis", "Pepe"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                highlightFill: "rgba(185, 35, 34, .75)",
                highlightStroke: "rgba(185, 35, 34, 1)",
                
                data: [65, 59, 80, 81, 56, 55, 40]
            }
            
        ]
    };
    $scope.barData2 = {
        labels: ["Adrian", "Atl", "Brandon", "Jose", "Maxx", "Luis", "Pepe"],
        datasets: [

            {
                label: "My Second dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [-28, -48, -40, -19, -86, -27, 0]
            },
        ]
    };

    
    
    $scope.assignments= [
        {class:"Advanced Calculus", name: "Assignment 1 ",date: "13 august 2015"},
        {class:"Advanced Calculus", name: "Assignment 2 ",date: "13 august 2015"},
        {class:"statistics", name: "Assignment 1 ", date:"16 august 2015"},
        {class:"statistics", name: "Assignment 2 ",date: "16 august 2015"},
        {class:"Precalc", name: "Assignment 1 ", date:"16 august 2015"},
        {class:"Precalc", name: "Assignment 2 ",date:"16 august 2015"},
        {class:"Precalc", name: "Assignment 1 ", date:"19 august 2015"},
        {class:"Precalc", name: "Assignment 2 ", date:"19 august 2015"},
    ];
    $scope.ASPAssignments = [
        {fn:"Brandon", ln:"Hernandez", assignment:"Assignment 1" ,class:"Precalc"},
        {fn:"Brandon", ln:"Hernandez", assignment:"Assignment 2" ,class:"Precalc"},
        {fn:"Brandon", ln:"Hernandez", assignment:"Assignment 3" ,class:"Precalc"},
        {fn:"Adrian", ln:"Galicia", assignment:"Assignment 1" ,class:"Statistics"},
        {fn:"Adrian", ln:"Galicia", assignment:"Assignment 2" ,class:"Statistics"},
        {fn:"Adrian", ln:"Galicia", assignment:"Assignment 3" ,class:"Statistics"},
        {fn:"Jose", ln:"Martinez", assignment:"Assignment 1" ,class:"Advanced Calculus"},
        {fn:"Jose", ln:"Martinez", assignment:"Assignment 2" ,class:"Advanced Calculus"},
        {fn:"Jose", ln:"Martinez", assignment:"Assignment 3" ,class:"Advanced Calculus"},
    ]

    $scope.fallingBehind = [
        {fn:"Brandon", ln:"Hernandez", ID:816371927, misAssignments:4, noAEC:4},
        {fn:"Brandon", ln:"Hernandez", ID:816371927, misAssignments:4, noAEC:6},
        {fn:"Brandon", ln:"Hernandez", ID:816371927, misAssignments:4, noAEC:8},
        {fn:"Adrian", ln:"Galicia", ID:816371927, misAssignments:3, noAEC:5},
        {fn:"Adrian", ln:"Galicia", ID:816371927, misAssignments:2, noAEC:7},
        {fn:"Adrian", ln:"Galicia", ID:816371927, misAssignments:1, noAEC:4},
        {fn:"Jose", ln:"Martinez", ID:816371927, misAssignments:5, noAEC:6},
        {fn:"Jose", ln:"Martinez", ID:816371927, misAssignments:6, noAEC:3},
        {fn:"Jose", ln:"Martinez", ID:816371927, misAssignments:4, noAEC:4},
    ]

 

    $scope.openAssignments = function () {
        var assignmentsModal = $modal.open({
            templateUrl: 'assignmentsModal.html',
            size: 'lg',
            controller: function ($scope, $modalInstance, assignments) {
                $scope.assignments = assignments;
                
           

                $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
            },
            resolve: {
                assignments
                : function () { return $scope.assignments },
                
            }
        })// End assignmentsModal

    }
    $scope.openASPAssignments = function () {
        var ASPAssignmentsModal = $modal.open({
            templateUrl: 'ASPassignmentsModal.html',
            size: 'lg',
            controller: function ($scope, $modalInstance, assignments) {
                $scope.assignments = assignments;
                
                $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
            },
            resolve: {
                assignments
                : function () { return $scope.ASPAssignments },
                
            }
        })// End ASPAasssignmentsModal

    }
    $scope.openCalendar = function () {
        var assignmentsModal = $modal.open({
            templateUrl: 'calendarModal.html',
            size: 'md',
            controller: function ($scope, $modalInstance, assignments) {
                $scope.assignments = assignments;
                

                $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
            },
            resolve: {
                assignments
                : function () { return $scope.assignments },
                
            }
        })// End assignmentsModal
    }
	
	$scope.openAccept = function(item, $index){
		var modalInstance = $modal.open({
			templateUrl:'views/modals/acceptModal.html',
			size:'lg',
			controller:function($scope, student){
				$scope.student = student;
				$scope.changedStatus = function(item){
						console.log(item);
					};
			},
			resolve:{
				student:function(){return item;}
			}
		});
		
		modalInstance.result.then(function (data) {
			
				$scope.rejectUnaccepted(data.student, $index);
		});
	};
	
	$scope.rejectUnaccepted = function(item, $index){
		var modalInstance = $modal.open({
			templateUrl:'views/modals/fillRejectedModal.html',
			size:'lg',
			controller:function($scope,$modalInstance,student,totalIncomming){
				var count = 0;
				debugger;
				angular.forEach(student.referred, function(referral){
					if(referral.RefferalStatus === 1 && referral.Accepted ){
						count++;
					}
				})
				if(count === totalIncomming){
					console.log('closing');
					$modalInstance.close($scope.student);
				}
				
				$scope.student = student;
				$scope.reasons= [
					{name:'Mostly wrong answers', value:1},
					{name:'Incomplete work', value:2},
					{name:'Other', value:3}
				];
			},
			resolve:{
				student: function(){return item;},
				totalIncomming: function(){ return	$scope.incommingAssignments; }
			}
		});
		modalInstance.result.then(function(data){
			// submit all to db
			var student  = data.student;
			angular.forEach(student.referred, function(referral){
				if(referral.RefferalStatus !== 0)
					referrals.update({'param':'teacherUpdate', 'id':referral.id},{data:referral} );
			});
		
		});
		
	};
	$scope.openReprint = function(item, $index){
		var modalInstance = $modal.open({
			templateUrl:'views/modals/reprintModal.html',
			size: 'lg',
			controller: function($scope,student){
				$scope.student =student;
			},
			resolve:{
				student:function(){return item;}
			}
		});
		
	};


}
function CalendarCtrl($scope) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    // Events
    $scope.events = [
        {title: 'Progress Report',start: new Date(y, m, 12)},
        {title: 'Progress Report',start: new Date(y, m+1, 12),},
        {title: 'Progress Report',start: new Date(y, m+2, 12),},
        {title: 'Progress Report',start: new Date(y, m+3, 12),},
    ];


    /* message on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        $scope.alertMessage = (event.title + ': Clicked ');
    };
    /* message on Drop */
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.alertMessage = (event.title +': Droped to make dayDelta ' + dayDelta);
    };
    /* message on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.alertMessage = (event.title +': Resized to make dayDelta ' + minuteDelta);
    };

    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
        }
    };

    /* Event sources array */
    $scope.eventSources = [$scope.events];
}

function DashAdmin1Ctrl($scope, $modal) {
    var path = "../Client/Views/dashItems/";
    $scope.tabs = [
       {
            id: 'Dashboard',
            text: ['Dashboard', 'System'],
            route: path + 'referal.html',
            link: "admin1.dashboard",
            icon: 'dashboard fa-2x'
        }, {
           id: 'Referral System',
           text: ['Referral', 'System'],
           route: path + 'referral.html',
           link: "admin1.referral",
           icon: 'eye fa-2x'
        }, 
		{
            id: 'AEC List',
            text: ['AEC', 'List'],
            route: path + 'manageAEC.html',
            link: "admin1.AECList",
            icon: 'list-alt fa-2x'
        }, {
            id: 'Absence List',
            text: ['Absence', 'List'],
            route: path + 'manageAECAbsence.html',
            link: "admin1.pending",
            icon: 'exclamation fa-2x'
        }, {
            id: 'Student Data',
            text: ['Student', 'Data'],
            route: path + 'studentInfo.html',
            link: "admin1.studentData",
            icon: 'user fa-2x'
        }
//		, {
//            id: 'Create Student Pass',
//            text: ['Create', 'Pass'],
//            route: path + "multiplePasses.html",
//            link: "admin1.createStudentPass",
//            icon: 'file fa-2x'
//        }
    ]; 
    $scope.openAverageAttendance = function () {
        var averageAttendanceModal = $modal.open({
            templateUrl: 'averageAttendanceModal.html',
            size: 'lg',
            controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
                $scope.graphOptions = graphOptions;
                $scope.graphData = graphData

                $timeout(function () {
                    $scope.drawGraph = true;
                }, 100);


                $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
            },
            resolve: {
                graphOptions : function () { return $scope.lineOptions },
                graphData: function () { return $scope.lineData }
            }
        })// End assignmentsModal
    };

    $scope.openRating = function () {
        var ratingsModal = $modal.open({
            templateUrl: 'ratingsModal.html',
            size: 'lg',
            controller: function ($scope, $modalInstance, graphOptions, graphData, $timeout) {
                $scope.graphOptions = graphOptions;
                $scope.graphData = graphData;

                $timeout(function () {
                    $scope.drawGraph = true;
                }, 100);

                $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
            },
            resolve: {
                graphOptions : function () { return $scope.lineOptions },
                graphData: function () { return $scope.lineData }
            }
        })// End assignmentsModal
    };

    /**
     * Data for Line chart
     */

                
    $scope.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                pointColor: "#B92322",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    /**
  * Options for Line chart
  */
    $scope.lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: false,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    };
    /**
 * Data for Doughnut chart
 */
    $scope.doughnutData = [
        {
            value: 300,
            color: "#2f4050",
            highlight: "#1ab394",
            label: "App"
        },
        {
            value: 50,
            color: "#2f4060",
            highlight: "#1ab394",
            label: "Software"
        },
        {
            value: 100,
            color: "#2f4070",
            highlight: "#1ab394",
            label: "Laptop"
        }
    ];

    /**
     * Options for Doughnut chart
     */
    $scope.doughnutOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 45, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false
    };

    $scope.teachersTeam = [
        {fn:"Adrian Omar", ln:"Galicia Mendez", subjects:["Math", "Physics","Spanish"], days:["M","W", "Sat"], rate:9.5},
        {fn:"Brandon", ln:"Hernandez", subjects:["Math", "Physics","Chemistry", "Biology"], days:["T","Th", "F"], rate:8.9},
        {fn:"Jose", ln:"Martinez", subjects:["Math", "Physics","Computer Science"], days:["M","W", "Sat"], rate:2.1},
    ]

}

function DashAdmin2Ctrl($scope, $modal) {
    var path = "../Client/Views/dashItems/";
    $scope.tabs = [
        {
            id: 'Dashboard',
            text: ['Dashboard', 'System'],
            route: path + 'referal.html',
            link: "admin2.dashboard",
            icon: 'dashboard fa-2x'
        },
        {
            id: 'Assign O-Room',
            lg: 2,
            text: ['Assign', 'O-Room'],
            route: path + 'referalARC.html',
            link: "admin2.assignARC",
            icon: 'hand-o-right fa-2x'
        },
        {
            id: 'O-Room List',
            text: ['O-Room', 'List'],
            route: path + 'manageARC.html',
            link: "admin2.ARCList",
            icon: 'list-alt fa-2x'
        }, {
            id: 'Absence List',
            text: ['Absence', 'List'],
            route: path + 'manageARCAbsence.html',
            link: "admin2.pending",
            icon: 'exclamation fa-2x'
        }, {
            id: 'Student Data',
            text: ['Student', 'Data'],
            route: path + 'studentInfo.html',
            link: "admin2.studentData",
            icon: 'user fa-2x'
        }, {
            id: 'Create Student Pass',
            text: ['Create', 'Pass'],
            route: path + "multiplePasses.html",
            link: "admin2.createStudentPass",
            icon: 'file fa-2x'
        }
    ];
    /**
     * Data for Line chart
     */


    $scope.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                pointColor: "#B92322",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    /**
  * Options for Line chart
  */
    $scope.lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: false,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    };
    $scope.tog = -1;
    $scope.navShow = true;
    $scope.click = function (index) {
        $scope.tog = index;
    };
}

function DashAdmin3Ctrl($scope, $modal) {
    var path = "../Client/Views/dashItems/";
    $scope.tabs = [
        {
            id: 'Dashboard',
            text: ['Dashboard', 'System'],
            route: path + 'referal.html',
            link: "admin3.dashboard",
            icon: 'dashboard fa-2x'
        }, {
            id: 'Student Data',
            text: ['Student', 'Data'],
            route: path + 'studentInfo.html',
            link: "admin3.studentData",
            icon: 'user fa-2x'
        }, {
            id: 'Assign O-Room',
            lg: 2,
            text: ['Assign', 'O-Room'],
            route: path + 'referalARC.html',
            link: "admin3.assignARC",
            icon: 'hand-o-right fa-2x'
        }, {
            id: 'Data Scrapping',
            lg: 2,
            text: ['Data', 'Scrapping'],
            route: path + 'PdfExtraction.html',
            link: "admin3.dataScrapping.step_one",
            icon: 'hand-o-right fa-2x'
        }, {
            id: 'AP Testing',
            lg: 2,
            text: ['AP', 'Testing'],
            route: path + 'APTesting.html',
            link: "admin3.APTesting",
            icon: 'glyphicon glyphicon-pencil fa-2x'
        }, {
            id: 'A-G',
            lg: 2,
            text: ['A-G', ''],
            route: path + 'A-G.html',
            link: "admin3.A-G",
            icon: 'clock-o fa-2x'
        }
    ];

    $scope.modal1Data = {
        labels: ["Math","Science","English", "Art", "Social Science"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                highlightFill: "rgba(185, 35, 34, .75)",
                highlightStroke: "rgba(185, 35, 34, 1)",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [12, 24, 30, 18, 12]
            }, {
                label: "Number of D's",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [5, 9, 8, 40, 20]
            }

        ]
    };
    

    $scope.openDFPercentagesModal = function () {
        var modalInstance = $modal.open({
            templateUrl: 'DFsPercentagesModal.html',
            size: "lg",
            controller: function ($scope, $modalInstance, graphData,  graphOptions,ServerDataModel, state, $timeout) {
                $scope.graphData1 = graphData;
                $scope.graphOptions = graphOptions;
         
                $timeout(function () { $scope.state = 1 }, 100);

                $scope.graphData2 = JSON.parse(JSON.stringify(graphData));
                $scope.graphData3 = JSON.parse(JSON.stringify(graphData));

                $scope.graphData2.labels = ['precalc', 'calc', 'algebra1', 'algebra2', 'trigonometry'];
                $scope.graphData2.datasets.pop();
                $scope.graphData3.labels = ['Mr. Hernandez', 'Mr. Arreola', 'Mr. Adrian', 'Mr. Martinez', 'Mr. Quinteros'];
                $scope.graphData3.datasets.pop();
                $scope.refTable = ServerDataModel.getStudents().slice(0,20);
                $scope.onGraphClick = function ( ){
                    if ($scope.state < 5)
                        $scope.state++;
                }
                $scope.onGraphClick2 = function (stu) {
                    if ($scope.state < 5)
                        $scope.state++;
                    $scope.toShow = stu;
                }
                $scope.onPrevClick  = function(){
                    $scope.state--;
                }

                $scope.close = function () {
                    $modalInstance.dismiss();
                } 
            },
            resolve: {
                graphData: function(){return $scope.modal1Data},
                graphOptions: function () { return $scope.barOptions },
                state: function(){return 1}
            }
        })
    }

    $scope.modal2DonutData = [{
        label: "9th",
        value: 12
    }, {
        label:"10th",
        value: 30
    }, {
        label: "11th",
        value: 20
    }, {
        label: "12th",
        value: 19
    }]
    $scope.modal2BarData = {
        labels: ["A", "B", "C", "D", "E", "F", "G"],
        datasets: [
            {
                label: "Number of F's",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                highlightFill: "rgba(185, 35, 34, .75)",
                highlightStroke: "rgba(185, 35, 34, 1)",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [12, 24, 30, 18, 12, 22, 14]
            }

        ]
    };
    $scope.openAGOnTrack = function () {
        var modalInstance = $modal.open({
            templateUrl: 'AGOnTrackModal.html',
            size: "lg",
            controller: function ($scope, $modalInstance, graphData, graphData2, graphOptions) {
                $scope.graphData1 = graphData;
                $scope.graphData2 = graphData2;
                $scope.graphOptions = graphOptions

                $scope.state = 1;
                $scope.onGraphClick = function () {
                   
                    if ($scope.state < 2)
                        $scope.state++;
                }
                $scope.statePercent = [45, 20];

                $scope.onPrevClick  = function(){
                    $scope.state--;
                }
                $scope.close = function () {
                    $modalInstance.dismiss();
                }
            },
            resolve: {
                graphData: function () { return $scope.modal2DonutData },
                graphData2: function () { return $scope.modal2BarData },
                graphOptions: function(){return $scope.barOptions}
            }
        })
    }

    $scope.modal3DonutData = [{
        label: "9th",
        value: 15
    }, {
        label: "10th",
        value: 23
    }, {
        label: "11th",
        value: 44
    }, {
        label: "12th",
        value: 72
    }]
    $scope.modal3BarData = {
        labels: ["English/Language", "History/Social", "Math", "Science", "PE", "Visual-Perf Arts", "Elective", "World Language"],
        datasets: [
            {
                label: "Number of F's",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                highlightFill: "rgba(185, 35, 34, .75)",
                highlightStroke: "rgba(185, 35, 34, 1)",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [12, 24, 30, 18, 12, 22, 14, 22]
            }

        ]
    };



    $scope.openHighschoolGradTrack = function () {
        
        var modalInstance = $modal.open({
            templateUrl: 'HighschoolGradTrackModal.html',
            size: "lg",
            controller: function ($scope, $modalInstance, graphData, graphData2, graphOptions) {
                
                $scope.graphData1 = graphData;
                $scope.graphData2 = graphData2;
                $scope.graphOptions = graphOptions

                $scope.state = 1;
                $scope.onGraphClick = function () {
                   
                    if ($scope.state < 2)
                        $scope.state++;
                }
                $scope.statePercent = [45, 20];

                $scope.onPrevClick  = function(){
                    $scope.state--;
                }
                $scope.close = function () {
                    $modalInstance.dismiss();
                }
            },
            resolve: {
                graphData: function () { return $scope.modal3DonutData },
                graphData2: function () { return $scope.modal3BarData },
                graphOptions: function(){return $scope.barOptions}
            }
        })
    }

    $scope.openASP = function () {
        var modalInstance = $modal.open({
            templateUrl: 'ASPModal.html',
            size: "lg",
            controller: function ($scope, $modalInstance, $timeout) {
             
                /**
 * Data for Line chart
 */
                $scope.lineData = {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [
                        {
                            label: "Example dataset",
                            fillColor: "rgba(185, 35, 34, .5)",
                            strokeColor: "rgba(185, 35, 34, .8)",
                            highlightFill: "rgba(185, 35, 34, .75)",
                            highlightStroke: "rgba(185, 35, 34, 1)",
                            data: [65, 59, 80, 81, 56, 55, 40]
                        }
                    ]
                };

                /**
              * Options for Line chart
              */
                $scope.lineOptions = {
                    scaleShowGridLines: true,
                    scaleGridLineColor: "rgba(0,0,0,.05)",
                    scaleGridLineWidth: 1,
                    bezierCurve: false,
                    bezierCurveTension: 0.4,
                    pointDot: true,
                    pointDotRadius: 4,
                    pointDotStrokeWidth: 1,
                    pointHitDetectionRadius: 20,
                    datasetStroke: true,
                    datasetStrokeWidth: 2,
                    datasetFill: true
                };
                /**
             * Data for Doughnut chart
             */


                $scope.doughnutData = [
                    {
                        value: 300,
                        color: "#B92322",
                        highlight: "#2f4050",
                        label: "App"
                    },
                    {
                        value: 50,
                        color: "#2f4050",
                            highlight: "#B92322",
                        label: "Software"
                    },
                    {
                        value: 100,
                        color: "#B92322",
                        highlight: "#2f4050",
                        label: "Laptop"
                    }
                ];

                /**
                 * Options for Doughnut chart
                 */
                $scope.doughnutOptions = {
                    segmentShowStroke: true,
                    segmentStrokeColor: "#fff",
                    segmentStrokeWidth: 2,
                    percentageInnerCutout: 45, // This is 0 for Pie charts
                    animationSteps: 100,
                    animationEasing: "easeOutBounce",
                    animateRotate: true,
                    animateScale: false
                };
                $scope.close = function () {
                    $modalInstance.dismiss();
                }

                $timeout(function () {
                    $scope.drawGraph = true;
                },100)
            },
            resolve: {
                
            }
        })
    }

    /**
   * Options for Bar chart
   */
    $scope.barOptions = {
        scaleBeginAtZero: false,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 5
    };

    $scope.barData1 = {
        labels: ["Adrian", "Atl", "Brandon", "Jose", "Maxx", "Luis", "Pepe"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                highlightFill: "rgba(185, 35, 34, .75)",
                highlightStroke: "rgba(185, 35, 34, 1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }

        ]
    };
    $scope.barData2 = {
        labels: ["Adrian", "Atl", "Brandon", "Jose", "Maxx", "Luis", "Pepe"],
        datasets: [

            {
                label: "My Second dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [-28, -48, -40, -19, -86, -27, 0]
            },
        ]
    };

    $scope.comments = [
        { author: "Brandon Hermandez", text: "From the moment I began to Fail, I began to Succeed", time:"1 minuts ago" },
        { author: "Brandon Hermandez", text: "From the moment I began to Fail, I began to Succeed", time:"1 minuts ago" },
        { author: "Brandon Hermandez", text: "From the moment I began to Fail, I began to Succeed", time:"1 minuts ago" },
        { author: "Brandon Hermandez", text: "From the moment I began to Fail, I began to Succeed", time:"1 minuts ago" },
        { author: "Brandon Hermandez", text: "From the moment I began to Fail, I began to Succeed", time:"1 minuts ago" },
        { author: "Brandon Hermandez", text: "From the moment I began to Fail, I began to Succeed", time:"1 minuts ago" },
    ]

    $scope.openCalendar = function () {
        var modalInstance = $modal.open({
            templateUrl: 'calendarModal.html',
            size: 'md',
            controller: function ($scope, $modalInstance, assignments) {
                $scope.assignments = assignments;


                $scope.cancel = function () { $modalInstance.dismiss('cancel'); }
            },
            resolve: {
                assignments
                : function () { return $scope.assignments },

            }
        })// End Calendar Modal
    }

}

function morrisChartCtrl($scope) {
    
    return $scope.mainData = [{
        month: "2013-01",
        xbox: 294e3,
        will: 136e3,
        playstation: 244e3
    }, {
        month: "2013-02",
        xbox: 228e3,
        will: 335e3,
        playstation: 127e3
    }, {
        month: "2013-03",
        xbox: 199e3,
        will: 159e3,
        playstation: 13e4
    }, {
        month: "2013-04",
        xbox: 174e3,
        will: 16e4,
        playstation: 82e3
    }, {
        month: "2013-05",
        xbox: 255e3,
        will: 318e3,
        playstation: 82e3
    }, {
        month: "2013-06",
        xbox: 298400,
        will: 401800,
        playstation: 98600
    }, {
        month: "2013-07",
        xbox: 37e4,
        will: 225e3,
        playstation: 159e3
    }, {
        month: "2013-08",
        xbox: 376700,
        will: 303600,
        playstation: 13e4
    }, {
        month: "2013-09",
        xbox: 527800,
        will: 301e3,
        playstation: 119400
    }], $scope.simpleData = [{
        year: "2008",
        value: 20
    }, {
        year: "2009",
        value: 10
    }, {
        year: "2010",
        value: 5
    }, {
        year: "2011",
        value: 5
    }, {
        year: "2012",
        value: 20
    }, {
        year: "2013",
        value: 19
    }], $scope.comboData = [{
        year: "2008",
        a: 20,
        b: 16,
        c: 12
    }, {
        year: "2009",
        a: 10,
        b: 22,
        c: 30
    }, {
        year: "2010",
        a: 5,
        b: 14,
        c: 20
    }, {
        year: "2011",
        a: 5,
        b: 12,
        c: 19
    }, {
        year: "2012",
        a: 20,
        b: 19,
        c: 13
    }, {
        year: "2013",
        a: 28,
        b: 22,
        c: 20
    }], $scope.donutData = [{
        label: "Download Sales",
        value: 12
    }, {
        label: "In-Store Sales",
        value: 30
    }, {
        label: "Mail-Order Sales",
        value: 20
    }, {
        label: "Online Sales",
        value: 19
    }]
}

function DashAdmin4Ctrl($scope, $modal) {
    var path = "../Client/Views/dashItems/";
    $scope.tabs = [
        {
            id: 'Dashboard',
            text: ['Dashboard', 'System'],
            route: path + 'referal.html',
            link: "admin4.dashboard",
            icon: 'dashboard fa-2x'
        }, {
            id: 'AEC List',
            text: ['AEC', 'List'],
            route: path + 'manageAEC.html',
            link: "admin4.AECList",
            icon: 'list-alt fa-2x'
        }, {
            id: 'O-Room List',
            text: ['O-Room', 'List'],
            route: path + 'manageARC.html',
            link: "admin4.ARCList",
            icon: 'list-alt fa-2x'
        }, {
            id: 'Absence List',
            text: ['Absence', 'list'],
            route: path + 'manageAECAbsence.html',
            link: "admin4.pending",
            icon: 'exclamation fa-2x'
        }, {
            id: 'Student Data',
            text: ['Student', 'Data'],
            route: path + 'studentInfo.html',
            link: "admin4.studentData",
            icon: 'user fa-2x'
        }, {
            id: 'Create Student Passes',
            text: ['Create', 'Pass'],
            route: path + 'MulPasses.html',
            link: "admin4.createStudentPasses",
            icon: 'file fa-2x'
        }, {
            id: 'Assign O-Room',
            text: ['Assign', 'O-Room'],
            route: path + 'referalARC.html',
            link: "admin4.assignARC",
            icon: 'hand-o-right fa-2x'
        }
    ];

    $scope.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                pointColor: "#B92322",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };
    /**
     * Data for Line chart
     */

                
    $scope.lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(185, 35, 34, .5)",
                strokeColor: "rgba(185, 35, 34, .8)",
                pointColor: "#B92322",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            }
        ]
    };

    /**
  * Options for Line chart
  */
    $scope.lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: false,
        bezierCurveTension: 0.7,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    };
    
        

}

function welcomeWizardCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.formData = {};

    // After process wizard
    $scope.processForm = function () {
        alert('Wizard completed');
    };

}

angular
    .module('Argus')
    .controller('MainCtrl', MainCtrl)
    .controller('DashTeacherCtrl', ["$scope", "$modal","referrals", DashTeacherCtrl])
    .controller('DashAdmin1Ctrl', ["$scope", "$modal", DashAdmin1Ctrl])
    .controller('DashAdmin2Ctrl', ["$scope", "$modal", DashAdmin2Ctrl])
    .controller('DashAdmin3Ctrl', ["$scope", "$modal", DashAdmin3Ctrl])
    .controller('DashAdmin4Ctrl', ["$scope", "$modal", DashAdmin4Ctrl])
    .controller("welcomeWizardCtrl", ["$scope", "$rootScope", welcomeWizardCtrl])
    .controller('CalendarCtrl', ["$scope", CalendarCtrl])
    .controller("morrisChartCtrl", ["$scope", morrisChartCtrl]);

    