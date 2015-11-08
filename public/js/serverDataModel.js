angular.module("Argus").service('ServerDataModel', function ServerDataModel() {
    this.data = all;
   
    function formatDate(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
    var today = new Date();
    var yesterday = new Date() ; 
    yesterday.setDate(today.getDate() - 1); 
    var tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1);

    var teachers = [];

    //ID, fn, ln ,GR, 
    var studentInfo = [];

    var studentsAssignments = [];
    var teacherAssignments = [];
    var teacherClasses = [];
   var assignmentsStrings = ["Primary Source Packet","Packet %232 (wk 1/26-1/30)","Activity 18-1","packet %23 2 week of 01/26 to 01/30 ","Assignment 1","Create an Animal","MONDAY-FRIDAY","Monday - Friday","Legal Alien Essay","Monday-Friday","G.O. Meiosis","End of WWII","Test Corrections","11.4 IAGP","Chapter 15, Sec. 3 Guided Reading","Standard 7.0A Review Sheet","Food Diary Project","packet %232 week of 01/26 to 01/30 "];
   this.teachers = ['Deborah Byrd', "Marilee Ambriz", 'Robert Hall', 'Tino Medrano', "Samanta Ochoa", 'Cynthia Beltran', "Roman Avalos"];
   var assignments = [];
   var index = 1;
   angular.forEach(assignmentsStrings, function (item) {
       assignments.push({ id: index++, name: item });
   })

    //  sample studentActivities = (stuID, activityInfo), activityInfo = (date, activity, comment, staff)
    var studentActivities = [
        {
            ID: 1061201, activityInfo:
              [
                  { date: "8/3/2015", activity: "AEC Clear", Comment: "student finished his assignments", Staff: " Montes", 
                  parentNotified: false, studentNotified:true, finished:false , status:[true,false,true]},
              { date: "8/3/2015", activity: "AEC", Comment: "student finished his assignments", Staff: " Montes", 
            parentNotified: false, studentNotified:true, finished:false },
                  {
                      date: "8/2/2015", activity: "O-Room", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: false, studentNotified: true, finished: false, status: [true, false, true]
                  },
                  {
                      date: "8/2/2015", activity: "AEC Clear", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: false, studentNotified: true, finished: true, status: [true, false, true]
                  },
                  {
                      date: "8/1/2015", activity: "AEC Reschedule", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: false, studentNotified: true, finished: false,
                  },
                  {
                      date: "8/1/2015", activity: "O-Room Clear", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: true, studentNotified: true, finished: true
                  },
                  {
                      date: "8/10/2015", activity: "AEC Reschedule", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: false, studentNotified: true, finished: false
                  },
                  {
                      date: "6/28/2015", activity: "O-Room", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: false, studentNotified: true, finished: false
                  },
                  {
                      date: "6/26/2015", activity: "O-Room", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: true, studentNotified: true, finished: true
                  },
                  {
                      date: "6/24/2015", activity: "AEC", Comment: "student finished his assignments", Staff: " Montes",
                      parentNotified: false, studentNotified: true, finished: false
                  }
              ]
        }


    ]

    var AECReschedules = [];

    //   date: 'MM/[D]D/YYYY' (ex: 8/1/2015)
    // stuInfo: { }
    // sample AEC List =  (date, stuInfo), stuInfo = (Assignments, GR, stuID,  fn, ln ) , Assignments = (assignmentName) 
    // grab GR, fn and ln from students table so that stuInfo = (Assignments, stuID)  
    var AECLists = [
        { date: formatDate(today), stuInfo: [
            {
                Assignments:
                  [assignments[0], assignments[3]],
                GR: 12, ID: 1024511, Period: 5, fn: "ACKERMAN", ln: "JASON EDWARD"
            },
             {
                 Assignments:
                     [assignments[4], assignments[8], assignments[3]],
                 GR: 10, ID: 1044728, Period: 5, fn: "ABDULKADIR", ln: "FATIMA"
             },
             {
                 Assignments:
                   [assignments[5], assignments[2], assignments[2]],
                 GR: 10, ID: 1064877, Period: 5, fn: "ACOSTA ", ln: "ALEXXIS MARIE"
             }]
        },
        {
            date: formatDate(tomorrow), stuInfo: [
              {
                  Assignments:
                    [{ name: "G.O. Meiosis" }],
                  GR: 12, ID: 1024511, Period: 5, fn: "ACKERMAN", ln: "JASON EDWARD"
              },
              {
                  Assignments:
                    [{ name: "Monday - Friday" }],
                  GR: 10, ID: 1044728, Period: 5, fn: "ABDULKADIR", ln: "FATIMA"
              }]
        },
        {
            date: formatDate(tomorrow), stuInfo: [
              {
                  Assignments:
                    [{ name: "G.O. Meiosis" }],
                  GR: 12, ID: 1024511, Period: 5, fn: "ACKERMAN", ln: "JASON EDWARD"
              },
              {
                  Assignments:
                    [{ name: "Legal Alien Essay" }, { name: "Monday - Friday" }],
                  GR: 10, ID: 1044728, Period: 5, fn: "ABDULKADIR", ln: "FATIMA"
              }]
        }
    ];
    // sample AECAbsenceList  =  (date, stuInfo) , stuInfo = (stuID, Assignments)
    // grab all required student information from students table using ID
    var AECListsAbsence = [];

    // sample O-Room List =   (date, stuInfo), stuInfo=(stuID, Reason, Staff, Comment)
    // grab staff and comment from activity table so that stuInfo = (ID, Reason) 
    var ARCLists = [
        {
            date: formatDate(tomorrow), stuInfo: [
                { ID: 1024511, Reason: "Behavior", Teacher:this.teachers[3], Staff: 'de la Torre', Comment: " bad student  " },
            ]
        },
        {
            date: formatDate(today), stuInfo: [
                { ID: 1044728, Reason: "Absences", Teacher: this.teachers[5], Staff: 'Gonzalez', Comment: "too many absences in the week " },
                { ID: 1064877, Reason: "Tardiness", Teacher: this.teachers[2], Staff: 'Corona', Comment: "Always late this week" },
                { ID: 1024511, Reason: "Tardiness", Teacher: this.teachers[6], Staff: 'Montes', Comment: " Late 3 days in a row" }
            ]
        },
        {
            date: formatDate(tomorrow), stuInfo: [
                { ID: 1044728, Reason: "Absences", Teacher: this.teachers[5], Staff: 'Gonzalez', Comment: "too many absences in the week " },
                { ID: 1064877, Reason: "Tardiness", Teacher: this.teachers[4], Staff: 'Corona', Comment: "Always late this week" },
                { ID: 1024511, Reason: "Tardiness", Teacher: this.teachers[2], Staff: 'Montes', Comment: " Late 3 days in a row" }
            ]
        }
        
    ]

    //  sample ARCAbsenceList  = (date , stuInfo), stuInfo = (stuID, Reason)
    var ARCListAbsence = [];

    // add the students to the StudentINfo list (students lists)
    angular.forEach(this.data, function (item) {
        if (!(contains(item.ID))) {
            var student = new Object
            student.ID = item.ID;
            student.fn = item.STUDENT.split(',')[0];
            student.ln = item.STUDENT.split(',')[1];
            student.GR = item.GR;
            studentInfo.push(student)
        }

    })


    // private fuction for getStudents
    function contains(ID) {
        for (var i = 0 ; i < studentInfo.length ; i++)
            if (ID === studentInfo[i].ID) return true;
        return false;
    }

    this.getStudents = function () {
        return studentInfo;
    }

    this.getStudentById = function(studentID){
        var student = null;
        angular.forEach(studentInfo, function (item) {
            if (item.ID === studentID)
                student = item;
        })
        
        return student;
    }

    this.getActivityById = function (studentID) {
        var activityInfo;
        angular.forEach(studentActivities, function (item) {
            if (item.ID === studentID)
                activityInfo = item.activityInfo;
        })
        return activityInfo;
    }




    this.getTeachers = function (teacher) {
        
        angular.forEach(this.data, function (item) {
            if (teachers.indexOf(item.TEACHER) == -1)// not in teachers
                teachers.push(item.TEACHER);
        })
        return teachers;
    }

    this.getAssignments = function () {
        return assignments;
    }

    // creates if it doesnt exists. else appends
    this.createAECList = function (date, studentsInfo) {
        //check if the date is in the list
        var listExist = false;
        var i;
        for ( i = 0; i < AECLists.length; i++)
            if (date == AECLists[i].date){
                listExist = true;
                break;
            }
        if (listExist) {
            // add all students in studentsInfo (if not there alread) 
            // if already in the list.. add assignments 
            for (var j = 0; j < studentsInfo.length; j++) {
                var k;
                for(k =0;  k < AECLists[i].stuInfo.length; k++)
                    if(AECLists[i].stuInfo[k].ID === studentsInfo[j].ID){// item already in the list, only add assign
                        AECLists[i].stuInfo[k].Assignments = studentsInfo[j].Assignments;
                        break;
                    }
                if(k === AECLists[i].stuInfo.length)
                    AECLists[i].stuInfo.push(studentsInfo[j]);
            }
            
        }
        else {
            var newList = { 'date': date, 'stuInfo': studentsInfo };
            AECLists.push(newList);
            console.log(newList.toString())
        }
        
        // if true -> add the student ínfo
        // else -> add the date and the student (create a new date List) 
    }

    this.getAECList = function (date) {
       
        for (var i = 0; i < AECLists.length; i++)
            if (AECLists[i].date === date)
                return AECLists[i];
        return null;
    }


    this.removeAssignmentsFromStudentInAECList = function (studentID, assignments, date) {
        var list = this.getAECList(date);
        for (var i = 0 ; i < list.stuInfo.length; i++) {
            if (list.stuInfo[i].ID === studentID) {
                // remove the elements of assignments that are in list.stuInfo.Assignments  (list.stuInfo[i].Assignments - assignments)
                angular.forEach(assignments, function(item){
                    for(var j = 0; j < list.stuInfo[i].Assignments.length; j++)
                        if (item.name === list.stuInfo[i].Assignments[j].name) {
                            list.stuInfo[i].Assignments.splice(j, 1)
                            break
                        }

                })

                
                if (list.stuInfo[i].Assignments.length == 0) { // student has completed his AEC, remove
                    list.stuInfo.splice(i, 1);
                    return true;
                }
                break; // we are done here 
            }
           
            
        }
        return false; // student still has some assignments 

    }

    // creates if it doesnt exists. else appends
    this.createARCList = function (date, studentsInfo) {
        //check if the date is in the list
        var listExist = false;
        var i;
        for (i = 0; i < ARCLists.length; i++)
            if (date == ARCLists[i].date) {
                listExist = true;
                break;
            }
        if (listExist) {
            // add all students in studentsInfo (if not there already) 
            // if already in the list.. add assignments 
            for (var j = 0; j < studentsInfo.length; j++) {
               var k;
               for (k = 0; k < ARCLists[i].stuInfo.length; k++) {
                   var item = ARCLists[i].stuInfo[k];
                   if (item.ID === studentsInfo[j].ID) { // update Entry
                       item.Reason = studentsInfo[j].Reason
                       item.Staff = studentsInfo[j].Staff;
                       item.Comment = studentsInfo[j].Comment
                       break;
                   }
               }
                if (k === ARCLists[i].stuInfo.length)//student was not in the list.. 
                    ARCLists[i].stuInfo.push(studentsInfo[j]);
            }

        }
        else {// !listExist
            var newList = { 'date': date, 'stuInfo': studentsInfo };
            ARCLists.push(newList);
            console.log(newList.toString())
        }
        return ARCLists[i];
 
    }

    this.getARCList = function (date) {
        for (var i = 0; i < ARCLists.length; i++)
            if (ARCLists[i].date == date) {
                var list = [];
                for (var j = 0; ARCLists[i].stuInfo[j];j++){
                    var item =ARCLists[i].stuInfo[j]; 
                    var stu = this.getStudentById(item.ID);
                    stu.Reason = item.Reason;
                    stu.Staff = item.Staff;
                    stu.Teacher = item.Teacher;
                    stu.Comment = item.Comment;
                    list.push(stu)
                }
                return list;

            }
              

      
        return null;
    }

    this.removeAssignmentsFromStudentInARCList = function (studentID, assignments, date) {
        var list = this.getAECList(date);
        for (var i = 0 ; i < list.stuInfo.length; i++) {
            if (list.stuInfo[i].ID === studentID) {
                // remove the elements of assignments that are in list.stuInfo.Assignments  (list.stuInfo[i].Assignments - assignments)
                angular.forEach(assignments, function (item) {
                    for (var j = 0; j < list.stuInfo[i].Assignments.length; j++)
                        if (item.name === list.stuInfo[i].Assignments[j].name) {
                            list.stuInfo[i].Assignments.splice(j, 1)
                            break
                        }

                })


                if (list.stuInfo[i].Assignments.length == 0) { // student has completed his AEC, remove
                    list.stuInfo.splice(i, 1);
                    return true;
                }
                break; // we are done here 
            }


        }
        return false; // student still has some assignments 

    }

    this.ARCReschedule = function(comment, dateOld,dateNew, staff, student){

        var ARCList = this.getARCList(dateOld);
        console.log(ARCList)
        //find student and remove it from the oldlist
        var studentInList;
        for (var i = 0; i < ARCList.length; i++) {
            if (student.ID === ARCList[i].ID) {
                studentInList = ARCList.splice(i, 1);
                break;
            }
        }

        if (!studentInList) {
            return null;
            alert("434: not found");
        }
        ARCLists.push({ 'date': dateNew, stuInfo: [studentInList] });
       
        //check if the student is already there.. just add the activity info 
        for (var i = 0; i < studentActivities.length; i++)
            if (studentActivities[i].ID === student.ID) {
                studentActivities[i].activityInfo.push({ date: dateOld, activity: "O-Room Reschedule", Comment: comment, Staff: staff });
                return
            }
        studentActivities.push({ ID: student.ID, activityInfo: [{ date: dateOld, activity: "O-Room Reschedule", Comment: comment, Staff: staff }] })
        console.log(studentActivities);
    }

    this.AECReschedule = function (comment, dateOld, dateNew, staff, student) {
        var AECList = this.getAECList(dateOld).stuInfo;
        console.log(AECList)
        var studentInList;
        for (var i = 0 ; i < AECList.length; i++) {
            if (student.ID === AECList[i].ID) {
                studentInList = AECList[i];
                return
            }
        }
        if (!studentInList) {
            alert("434: not found");
            return null;
           
        };

        AECLists.push({ 'date': dateNew, 'stuInfo': [studentInList] });
        //check if the student is already there.. just add the activity info 
        for (var i = 0; i < studentActivities.length; i++)
            if (studentActivities[i].ID === student.ID) {
                studentActivities[i].activityInfo.push({ date: dateOld, activity: "AEC Reschedule", Comment: comment, Staff: staff })
            }
        studentActivities.push({ 'ID': student.ID, activityInfo: [{ date: dateOld, activity: "AEC Reschedule", Comment: comment, Staff: staff }] })
        console.log(studentActivities);
    }


    this.clearStudentFromARC = function (comment,date, staff, student) {
        var ARCList = this.getARCList(date);

        var studentInList;
        for (var i = 0; i < ARCList.length; i++) {
            if (student.ID == ARCList[i].ID) {
                studentInList = ARCList.splice(i, 1);
                break;
            }
        }


        studentActivities.push({ ID: student.ID, activityInfo: [{ date: date, activity: "O-Room Clear", Comment: comment, Staff: staff }] })
        console.log(studentActivities);
    }

    this.getClassesById = function (ID) {
        var classes = [];
        ID = parseInt(ID);
        angular.forEach(this.data, function (item) {
            if (item.ID === ID)
                classes.push({ period: item.PD, className: item.CLASS, teacher: item.TEACHER, room: item.RM })
            else
                if (classes.length != 0) return;
        })
        return classes;
    }

    this.getActivitiesById = function (ID) {
        var activities;
        ID =parseInt(ID);
        angular.forEach(studentActivities, function (item) {
            if (item.ID == ID)
                activities = item.activityInfo;
        })
        return activities
    }
     
    this.getActivities = function () {
        return studentActivities[0].activityInfo;
    }

    
})