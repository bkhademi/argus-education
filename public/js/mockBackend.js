// We will be using backend-less development
// $http uses $httpBackend to make its calls to the server
// $resource uses $http, so it uses $httpBackend too
// We will mock $httpBackend, capturing routes and returning data
//angular.module('Argus')
myFakeBackend = angular.module("ArgusDev",["Argus", 'ngMockE2E' ] )


.run(function ($httpBackend, ServerDataModel) {

    $httpBackend.whenGET('/assignments').respond(function (method, url, data) {
        var assignments = ServerDataModel.getAssignments();
        return [200, assignments, {}];
    })

    $httpBackend.whenGET(/\/classes\/\d+/).respond(function (method, url, data) {
        // [parse the url to pull id 
        var studentID = url.split('/')[2];
        console.log(studentID);
        var classes = ServerDataModel.getClassesById(studentID);
        //console.info(classes);
        return [200, classes, {}];
    })

    $httpBackend.whenGET(/\/studentActivities\/\d+/).respond(function (method, url, data) {
        //getid 
        var studentID = url.split('/')[2];
        var activities = ServerDataModel.getActivitiesById(studentID);
        return [200, activities, {}];
    })

    $httpBackend.whenGET('/students').respond(function (method, url, data) {
        var students = ServerDataModel.getStudents();
        return [200, students, {}];
    });

    $httpBackend.whenGET(/\/students\/\d+/).respond(function (method, url, data) {
        // parse the matching URL to pull out the id (/games/:id)
        var studentID = url.split('/')[2];
        
        var student = ServerDataModel.getStudentById(studentID);
        console.log(student);
        return [200, student, {}];
    })

    $httpBackend.whenGET('/teachers').respond(function(method,url,data){
        var teachers = ServerDataModel.getTeachers();
        return [200, teachers, {}];
    })

    $httpBackend.whenGET('/AECList').respond(function (method, url, data) {
        console.log("whenGET(/AECList) : "+ data)
        var list = ServerDataModel.getAECList(data);
        return [200, list, {}];
    })

    $httpBackend.whenPUT('/AECList').respond(function (method, url, data) {
        console.log("whenPOST(/AECList");
        data = JSON.parse(data);
        var list = ServerDataModel.createAECList(data.date, data.stuInfo);
        return [203, list, {}];
    })

    $httpBackend.whenDELETE('/AECList').respond(function (method, url, data) {
        data = JSON.parse(data);
        var completedAEC = ServerDataModel.removeAssignmentsFromStudentInAECList(data.studentID, data.assignments, data.date);
       
        return [204, {data:completedAEC}, {}];
    })

    $httpBackend.whenPOST('/AECList').respond(function (method, url, data) {
        console.log("whenPOST('/AECList')");
        console.log(data);
        data = JSON.parse(data);
        ServerDataModel.AECReschedule(data.comment, data.dateOld, data.dateNew, data.staff, data.student);
        console.log(data);
        return [201, '','']

    })

    $httpBackend.whenGET('/ARCList').respond(function (method, url, data) {
        console.log("whenGET(/ARCList) : " + data)
        var list = ServerDataModel.getARCList(data);
        return [200, list, {}];
    })

    $httpBackend.whenPUT('/ARCList').respond(function (method, url, data) {
        console.log("whenPUT(/ARCList");
        data = JSON.parse(data);
        var list = ServerDataModel.createARCList(data.date, data.stuInfo);
        return [203, list, {}];
    })

    $httpBackend.whenDELETE('/ARCList').respond(function (method, url, data) {
        console.log("whenDelete('ARCList')");
        console.log(data);
        data = JSON.parse(data);
        console.log(data);
        var completedAEC = ServerDataModel.clearStudentFromARC(data.comment, data.date, data.staff, data.student);

        return [204,'', ''];
    })

    $httpBackend.whenPOST('/ARCList').respond(function (method, url, data) {
        console.log("whenPOST('/ARCList')");
        data = JSON.parse(data);
        console.log(data);
        ServerDataModel.ARCReschedule(data.comment, data.dateOld, data.dateNew,data.staff, data.student);
       
        return [201, '', '']

    })

    $httpBackend.whenPUT('/ARCAbsenceList').respond(function (method, url, data) {
        console.log("whenPUT('ARCAbsenceList')");
        data = JSON.parse(data);
        var list// = ServerDataModel.createARCAbsenceList(data.date, data.stuInfo);
        return [203, list, {}];
    })

    $httpBackend.whenGET(/Client\//).passThrough();
    $httpBackend.whenJSONP(/http:\/\/www.filltext.com\?.*/).passThrough();
    $httpBackend.whenPOST(/\/pdf\//).passThrough();

});