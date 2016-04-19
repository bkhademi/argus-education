<!DOCTYPE html>
<html>
<head>
    <title> Report </title>
    <link rel="stylesheet" type="text/css" href="css/mystylecss.css">
</head>
<body>
<!--Code for heading begins-->
<!--Should print: school name, chosen date, and user school logo-->
<header>
    <img id="img_left" src="{{$school->ImageReference}}" alt="No_File Found"/>
    <img id="img_right" src="{{$school->ImageReference}}" alt="No_File Found"/>
    <h1>{{ $school->Name }} - {{ $date->toFormattedDateString() }} - End of the Day Report </h1>
</header>
<br>
<br>
<br>
<br>
<!--Code for heading ends-->

<!--Code OSS Report Table begins-->
<div style="text-align:center">
    <h2 id="program_titles"> Out of School Suspension Report </h2>
    <table id="report_tables" class="table table-bordered">
        <thead>

        <tr>
            <th> Student Name</th>
            <th> ID</th>
            <th> Date of suspension</th>
            <th> Reason</th>
            <th> Parent Meeting Set ?</th>
            <th> Parent Meeting Date</th>
            <th> Parent Meeting Attendance</th>
            <th> Parent Supportive ?</th>
        </tr>

        </thead>
        <tbody>
        {{--@foreach($oss as $stu)--}}
            {{--<tr--}}

            {{-->--}}
                {{--<td>Brandon Hernandez</td>--}}
                {{--<td>3500036</td>--}}
                {{--<td> 3/19/16</td>--}}
                {{--<td>ISS --> OSS</td>--}}
                {{--<td>Yes</td>--}}
                {{--<td>3/20/16</td>--}}
                {{--<td>Pending</td>--}}
                {{--<td>Yes</td>--}}
            {{--</tr>--}}
        {{--@endforeach--}}
        </tbody>
    </table>
</div>
<!--Code OSS Report Table ends-->
<br>
<br>
<br>
<br>

<!--Lunch Detention Report Begins-->
<div style="text-align:center">
    <h2 id="program_titles"> Lunch Detention </h2>
    <table id="report_tables" class="table table-bordered">
        <thead>
        <tr>
            <th> First Name</th>
            <th> Last Name</th>
            <th> ID</th>
            <th> Grade</th>
            <th> Overlap</th>
            <th> Attendance</th>
            <th> Progression</th>
        </tr>
        </thead>
        <tbody>
        @foreach($lunch as $stu)
            <tr
                    class="{{  $stu['statusColor'] }} {{$stu['overlap']['class']}} "
            >
                <td>{{$stu->user->FirstName}}</td>
                <td>{{$stu->user->LastName}}</td>
                <td> {{$stu->StudentId}}</td>
                <td>{{$stu->Grade}}</td>
                <td> {{$stu['overlap']['msg']}}</td>
                <td>{{ strpos($stu->referred[0]->activity->Name, ':') === FALSE? 'N/A' :explode(':',$stu->referred[0]->activity->Name)[1] }}</td>
                <td>None</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
<br>
<br>
<div style="text-align:center">
    <h3 id="program_titles"> Lunch Detention Totals </h3>
        <table id="report_tables" class="table table-bordered">
            <thead>
            <tr>
                <th> Expected</th>
                <th> Present</th>
                <th> No Shows</th>
                <th> Sent Outs</th>
                <th> School Absent</th>
                <th> Left School</th>
                <th> Other</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{$lunch->count()}}</td>
                    <td>{{$lunch_counters['presents']}}</td>
                    <td>{{$lunch_counters['noshows']}}</td>
                    <td>{{$lunch_counters['sentouts']}}</td>
                    <td>{{$lunch_counters['schoolabsents']}}</td>
                    <td>{{$lunch_counters['leftschools']}}</td>
                    <td>{{$lunch_counters['others']}}</td>
                </tr>
            <tr>
                <th colspan="7"> Todays' Attendance</th>
            </tr>
            <tr>
                <td colspan="7"> {{ round(($lunch_counters['presents'] / ( ( $lunch->count() - $lunch_counters['leftschools']-$lunch_counters['schoolabsents'] -$lunch_counters['others']) === 0 ? 1:( $lunch->count() - $lunch_counters['leftschools']-$lunch_counters['schoolabsents'] -$lunch_counters['others']) ) ) * 100,1)  }}%</td>
            </tr>
            </tbody>
        </table>
</div>
<!--Lunch Detention Report Ends-->

<br>
<br>
<br>
<br>
<br>
<br>

<!--ReTeach Report Begins-->
<div style="text-align:center">
    <h3 id="program_titles"> Re-Teach Report </h3>
    <table id="report_tables" class="table table-bordered">
        <thead>
        <tr>
            <th> First Name</th>
            <th> Last Name</th>
            <th> ID</th>
            <th> Grade</th>
            <th> Overlap</th>
            <th> Attendance</th>
            <th> Progression</th>
        </tr>
        </thead>
        <tbody>
        @foreach($reteach as $stu)
            <tr
                    class="{{  $stu['statusColor'] }}  {{$stu['overlap']['class']}}"
            >
                <td>{{$stu->user->FirstName}}</td>
                <td>{{$stu->user->LastName}}</td>
                <td>{{$stu->StudentId}}</td>
                <td>{{$stu->Grade}}</td>
                <td> {{$stu['overlap']['msg']}}</td>
                <td>{{ strpos($stu->referred[0]->activity->Name, ':') === FALSE? 'N/A' :explode(':',$stu->referred[0]->activity->Name)[1] }}</td>
                <td>None</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
<br>
<br>
<br>
<div style="text-align:center">
    <h3 id="program_titles"> Re-Teach Totals </h3>
        <table id="report_tables" class="table table-bordered">
            <thead>
            <tr>
                <th> Expected</th>
                <th> Present</th>
                <th> No Shows</th>
                <th> Sent Outs</th>
                <th> School Absent</th>
                <th> Left School</th>
                <th> Other</th>
            </tr>
            </thead>
            <tbody>

            <tr
            >
                <td>{{$reteach->count()}}</td>
                <td>{{$reteach_counters['presents']}}</td>
                <td>{{$reteach_counters['noshows']}}</td>
                <td>{{$reteach_counters['sentouts']}}</td>
                <td>{{$reteach_counters['schoolabsents']}}</td>
                <td>{{$reteach_counters['leftschools']}}</td>
                <td>{{$reteach_counters['others']}}</td>
            </tr>
            <tr>
                <th colspan="7"> Todays' Attendance</th>
            </tr>
            <tr>
                <td colspan="7"> {{ round(($reteach_counters['presents'] / ( ($reteach->count() - $reteach_counters['leftschools']-$reteach_counters['schoolabsents'] -$reteach_counters['others']) ===0?1:($reteach->count() - $reteach_counters['leftschools']-$reteach_counters['schoolabsents'] -$reteach_counters['others'])  ) ) * 100,1)  }}%</td>
            </tr>
            </tbody>
        </table>
</div>
<!--ReTeach Report Ends-->

<br>
<br>
<br>
<br>
<br>
<br>

<!--AEC Report Begins-->
<div style="text-align:center">
    <h2 id="program_titles"> AEC Report </h2>
    <table id="report_tables" class="table table-bordered">
        <thead>
        <tr>
            <th> First Name</th>
            <th> Last Name</th>
            <th> ID</th>
            <th> Grade</th>
            <th> Overlap</th>
            <th> Attendance</th>
            <th> Progression</th>
        </tr>
        </thead>
        <tbody>
        @foreach($aec as $stu)
            <tr
                class="{{  $stu['statusColor'] }}  {{$stu['overlap']['class']}} "
            >
                <td>{{$stu->user->FirstName}}</td>
                <td>{{$stu->user->LastName}}</td>
                <td> {{$stu->StudentId}}</td>
                <td>{{$stu->Grade}}</td>
                <td> {{$stu['overlap']['msg']}}</td>
                <td>{{ strpos($stu->referred[0]->activity->Name, ':') === FALSE? 'N/A' :explode(':',$stu->referred[0]->activity->Name)[1] }}</td>
                <td>None</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
<br>
<br>
<br>
<div style="text-align:center">
    <h3 id="program_titles"> AEC Totals </h3>
        <table id="report_tables" class="table table-bordered">
            <thead>
            <tr>
                <th> Expected</th>
                <th> Present</th>
                <th> No Shows</th>
                <th> Sent Outs</th>
                <th> School Absent</th>
                <th> Left School</th>
                <th> Other</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{$aec->count()}}</td>
                <td>{{$aec_counters['presents']}}</td>
                <td>{{$aec_counters['noshows']}}</td>
                <td>{{$aec_counters['sentouts']}}</td>
                <td>{{$aec_counters['schoolabsents']}}</td>
                <td>{{$aec_counters['leftschools']}}</td>
                <td>{{$aec_counters['others']}}</td>
            </tr>
            <tr>
                <th colspan="7"> Todays' Attendance</th>
            </tr>
            <tr>
                <td colspan="7"> {{ round(($aec_counters['presents'] / ( ($aec->count() - $aec_counters['leftschools']-$aec_counters['schoolabsents'] -$aec_counters['others']) ===0?1:($aec->count() - $aec_counters['leftschools']-$aec_counters['schoolabsents'] -$aec_counters['others'])) ) * 100,1)  }}%</td>
            </tr>
            </tbody>
        </table>
</div>
<!--AEC Report Ends-->
<br>
<br>
<br>
<br>
<br>
<br>

<!--ORoom Report Begins-->
<div style="text-align:center">
    <h2 id="program_titles"> O-Room Report </h2>
    <table id="report_tables" class="table table-bordered">
        <thead>
        <tr

        >
            <th> First Name</th>
            <th> Last Name</th>
            <th> ID</th>
            <th> Grade</th>
            <th> Overlap</th>
            <th> Attendance</th>
            <th> Progression</th>
        </tr>
        </thead>
        <tbody>
        @foreach($orm as $stu)
            <tr
                    class="{{  $stu['statusColor']  }}  {{$stu['overlap']['class']}}   "
            >
                <td>{{$stu->user->FirstName}}</td>
                <td>{{$stu->user->LastName}}</td>
                <td> {{$stu->StudentId}}</td>
                <td>{{$stu->Grade}}</td>
                <td> {{$stu['overlap']['msg']}}</td>
                <td>{{ strpos($stu->referred[0]->activity->Name, ':') === FALSE || $stu->referred[0]->activity->Id == 38? 'N/A' :explode(':',$stu->referred[0]->activity->Name)[1] }}</td>
                <td>None</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
<br>
<br>
<br>
<div style="text-align:center">
    <h3 id="program_titles"> O-Room Totals </h3>
        <table id="report_tables" class="table table-bordered">
            <thead>
            <tr>
                <th> Expected</th>
                <th> Present</th>
                <th> No Shows</th>
                <th> Sent Outs</th>
                <th> School Absent</th>
                <th> Left School</th>
                <th> Other</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{$orm->count()}}</td>
                <td>{{$orm_counters['presents']}}</td>
                <td>{{$orm_counters['noshows']}}</td>
                <td>{{$orm_counters['sentouts']}}</td>
                <td>{{$orm_counters['schoolabsents']}}</td>
                <td>{{$orm_counters['leftschools']}}</td>
                <td>{{$orm_counters['others']}}</td>

            </tr>
            <tr>
                <th colspan="7"> Todays' Attendance</th>
            </tr>
            <tr>
                <td colspan="7"> {{ round(($orm_counters['presents'] / ( ($orm->count() - $orm_counters['leftschools']-$orm_counters['schoolabsents'] -$orm_counters['others']) ===0?1:($orm->count() - $orm_counters['leftschools']-$orm_counters['schoolabsents'] -$orm_counters['others'])  ) ) * 100,1)  }}%</td>
            </tr>
            </tbody>
        </table>
</div>
<!--ORoom Report Ends-->
<br>
<br>
<br>
<br>
<br>
<br>

<!--ISS Report Begins-->
<div style="text-align:center">
    <h2 id="program_titles"> In School Supspension Report </h2>
    <table id="report_tables" class="table table-bordered">
        <thead>
        <tr

        >
            <th> First Name</th>
            <th> Last Name</th>
            <th> ID</th>
            <th> Grade</th>
            <th> Overlap</th>
            <th> Attendance</th>
            <th> Progression</th>
        </tr>
        </thead>
        <tbody>
        @foreach($iss as $stu)
            <tr
                    class="{{  $stu['statusColor'] }}  {{$stu['overlap']['class']}} "
            >
                <td>{{$stu->user->FirstName}}</td>
                <td>{{$stu->user->LastName}}</td>
                <td> {{$stu->StudentId}}</td>
                <td>{{$stu->Grade}}</td>
                <td> {{$stu['overlap']['msg']}}</td>
                <td>{{ strpos($stu->referred[0]->activity->Name, ':')  === FALSE  ? 'N/A' :explode(':',$stu->referred[0]->activity->Name)[1] }}</td>
                <td>None</td>
            </tr>
        @endforeach
        </tbody>
    </table>
</div>
<br>
<br>
<br>
<div style="text-align:center">
    <h3 id="program_titles"> In School Suspension Totals </h3>
        <table id="report_tables" class="table table-bordered">
            <thead>
            <tr>
                <th> Expected</th>
                <th> Present</th>
                <th> No Shows</th>
                <th> Sent Outs</th>
                <th> School Absent</th>
                <th> Left School</th>
                <th> Other</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{{$iss->count()}}</td>
                <td>{{$iss_counters['presents']}}</td>
                <td>{{$iss_counters['noshows']}}</td>
                <td>{{$iss_counters['sentouts']}}</td>
                <td>{{$iss_counters['schoolabsents']}}</td>
                <td>{{$iss_counters['leftschools']}}</td>
                <td>{{$iss_counters['others']}}</td>
            </tr>
            <tr>
                <th colspan="7"> Todays' Attendance</th>
            </tr>
            <tr>
                <td colspan="7"> {{ round(($iss_counters['presents'] / ( ($orm->count() - $orm_counters['leftschools']-$orm_counters['schoolabsents'] -$orm_counters['others']) ===0 ? 1:($orm->count() - $orm_counters['leftschools']-$orm_counters['schoolabsents'] -$orm_counters['others'])  ) ) * 100,1)  }}%</td>
            </tr>
            </tbody>
        </table>
</div>
<!--ISS Report Ends-->
</body>


</html>