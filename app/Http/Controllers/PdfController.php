<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Roles;
use App\User;
use App\Schools;
use App\Students;
use App\Referrals;

use App\Activities;
use PDF;

class PdfController extends Controller
{


    public function printEODReport(Request $request)
    {
        ini_set('memory_limit','256M');
        //get data
        $data = [];
        $date = $this->getDate($request);
        $date->subWeekDay();
        $school = Schools::find($this->user->SchoolId);
        $data['date'] = $date;
        $data['school'] = $school;
        $data['aec'] = $this->getAEC($date, $school->Id);
        $data['reteach'] = $this->getReteach($date, $school->Id);
        $data['iss'] = $this->getISS($date, $school->Id);
        $data['oss'] = $this->getOSS($date, $school->Id);
        $data['orm'] = $this->getOroom($date, $school->Id);
        $data['lunch'] = $this->getLunch($date, $school->Id);


        $data['lunch_counters'] = $this->getlunchCounters($data['lunch']);
        $data['orm_counters'] = $this->getORMCounters($data['orm']);
        $data['iss_counters'] = $this->getISSCounters($data['iss']);
        $data['aec_counters'] = $this->getAECCounters($data['aec']);
        $data['reteach_counters'] = $this->getReteachCounters($data['reteach']);

        $this->getORMOverlaps($data['orm']);
        $this->getAECOverlaps($data['aec']);
        $this->getReteachOverlaps($data['reteach']);
        $this->getLunchOverlaps($data['lunch']);
        $this->getISSOverlaps($data['iss']);


        $this->setColorLunch($data['lunch']);
        $this->setColorORM($data['orm']);
        $this->setColorISS($data['iss']);
        $this->setColorAEC($data['aec']);
        $this->setColorReteach($data['reteach']);

        $data['lunch'] = $this->sortAll($data['lunch']);
        $data['orm'] = $this->sortAll($data['orm']);
        $data['iss'] = $this->sortAll($data['iss']);
        $data['aec'] = $this->sortAll($data['aec']);
        $data['reteach'] = $this->sortAll($data['reteach']);


//        return [$data['lunch_counters'], $data['orm_counters'], $data['iss_counters'], $data['aec_counters'] ,
//            $data['reteach_counters']
//        ];
        //return view('pdf.fullEOD', $data);
        $pdf = PDF::loadView('pdf.fullEOD', $data);
        return $pdf->download('EODFUll.pdf');
        return require __DIR__.'/../../bootstrap/start.php';
    }

    public function sortAll($list)
    {
        return $list->sortBy(function ($key) {
            if($key->referred->count() === 0){
                return 10;
            }
            if ((strpos($key->referred[0]->activity->Name, 'Present') !== false) ) {
                $val = 1;
            }else if((strpos($key->referred[0]->activity->Name, 'Clear') !== false)){
                $val = 2;
            }else if((strpos($key->referred[0]->activity->Name, 'Reschedule') !== false)){
                $val = 3;
            }else if((strpos($key->referred[0]->activity->Name, 'No Show') !== false) ) {
                $val = 4;
            }else if((strpos($key->referred[0]->activity->Name, 'Sent Out') !== false)){
                $val = 5;
            }else if((strpos($key->referred[0]->activity->Name, 'Walked Out') !== false)){
                $val  = 6;
            }else if (strpos($key->referred[0]->activity->Name, 'N/A') !== false ) {
                $val = 8;
            }else{
                $val = 7;
            }
            return $val;
        });
    }

    private function getAEC($date, $schoolId)
    {
        $aec = Students
            ::with('counters', 'user', 'classes.professor_class.room')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    ->where('Date', $date)
                    ->whereNotIn('ReferralTypeId', [9])// dont load LD
                    ->where('RefferalStatus', '!=', 99)
                    ->with('assignment', 'teacher', 'activity');
            }])
            ->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
                $q->where('SchoolId', $schoolId);
            })
            ->whereHas('referred', function ($q) use ($date) {
                $q
                    //->where('RefferalStatus', 0)
                    ->where('RefferalStatus', '!=', 99)
                    ->where('ReferralTypeId', 12)
                    ->where('Date', $date);
            })
            ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
            ->orderBy('LastName', 'ASC')
            ->select('students.*')
            ->get();


        return $aec;
    }

    private function getReteach($date, $schoolId)
    {

        $aec = Students
            ::with('counters', 'user')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    ->where('Date', $date)
                    ->whereNotIn('ReferralTypeId', [9])// dont load LD
                    ->with('assignment', 'teacher', 'activity');
            }])
            ->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
                $q->where('SchoolId', $schoolId);
            })
            ->whereHas('referred', function ($q) use ($date) {
                $q
                    //->where('RefferalStatus', 0)
                    ->where('ReferralTypeId', 18)
                    ->where('Date', $date);
            })
            ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
            ->orderBy('LastName', 'ASC')
            ->select('students.*')
            ->get();

        return $aec;

    }

    private function getISS($date, $schoolId)
    {
        $iss = Students
            ::with('counters', 'user', 'classes.professor_class.classs', 'classes.professor_class.room')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    //->where('RefferalStatus', 0)
                    ->where('Date', $date)
                    ->whereNotIn('ReferralTypeId', [9])// dont load lunch
                    ->where('RefferalStatus', '!=', 99)
                    ->with('teacher', 'activity', 'referralType')
                    ->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
                    ->orderBy('Priority', 'ASC')
                    ->select('refferals.*');
            }])
            ->wherehas('user', function ($q) use ($schoolId) { // from the school the user requested
                $q->where('SchoolId', $schoolId);
            })
            ->whereHas('counters', function ($q) {
                //$q->where('ISSDays', '>', 0);
            })
            ->whereHas('referred', function ($q) use ($date) {
                $q
                    //->where('refferals.RefferalStatus', 0)
                    ->whereIn('ReferralTypeId', [5, 6, 7, 10, 11, 15, 17])
                    //->where('RefferalStatus','!=',99)
                    ->where('Date', $date);
            })
            ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
            ->orderBy('LastName', 'ASC')
            ->select('students.*')
            ->get();


        return $iss;
    }

    private function getOSS($date, $schoolId)
    {
        $oss = Referrals::with('user', 'studentUser.student.counters', 'teacher', 'referralType', 'activity')
            ->wherehas('studentUser', function ($q) use ($schoolId) {
                $q->where('SchoolId', $schoolId);
            })
            ->wherehas('referralType', function ($q) {
                $q->where('ReferralTypeId', 11);// OSS Referrals
//
            })
            ->where('newDate', $date)
            //->where('RefferalStatus', 0) // get all since the activity is recorded along the referral
            ->join('aspnetusers', 'aspnetusers.id', '=', 'refferals.StudentId')
            ->orderBy('LastName', 'ASC')
            ->select('refferals.*')
            ->get();
        $oss['presents'] = 0;
        $oss['noshows'] = 0;
        $oss['sentouts'] = 0;
        $oss['schoolabsents'] = 0;
        $oss['leftschools'] = 0;
        $oss['others'] = 0;
        return $oss;
    }

    private function getOroom($date, $schoolId)
    {
        $OroomList = Students
            ::with('counters', 'user', 'classes.professor_class.room')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    //->where('RefferalStatus', 0)
                    ->whereNotIn('ReferralTypeId', [9])// dont load LD
                    ->where('Date', $date)
                    ->where('RefferalStatus', '!=', 99)
                    ->whereIn('ReferralTypeId', [1, 2, 3, 16, 19])
                    ->with('user', 'teacher', 'referralType', 'assignment', 'activity')
                    ->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
                    ->orderBy('Priority', 'ASC')
                    ->select('refferals.*');
            }])
            ->wherehas('user', function ($q) use ($schoolId) { // from the school the user requested
                $q->where('SchoolId', $schoolId);
            })
            ->whereHas('counters', function ($q) {
                //$q->where('ORoomsToBeServed', '>', 0);
            })
            ->whereHas('referred', function ($q) use ($date) { // not processed with oroom referrals for $date
                $q
                    //->where('RefferalStatus', 0)
                    ->whereIn('ReferralTypeId', [1, 2, 3, 16, 19])
                    ->where('RefferalStatus', '!=', 99)
                    ->where('Date', $date);
            })
            ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
            ->orderBy('LastName', 'ASC')
            ->select('students.*')
            ->get();


        return $OroomList;
    }

    private function getLunch($date, $schoolId)
    {
        $lunchStudents = Students
            ::with('counters', 'user')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    //->where('RefferalStatus', 0)
                    ->where('Date', $date)
                    ->whereNotIn('ReferralTypeId', [12, 18])
                    ->where('RefferalStatus', '!=', 99)
                    ->with('referralType', 'user', 'teacher', 'activity')
                    ->orderBy('ReferralTypeId', 'DESC');
            }])
            ->whereHas('user', function ($q) use ($schoolId) {
                $q->where('SchoolId', $schoolId);
            })
            ->whereHas('referred', function ($q) use ($date) { // only with not processed lunch  referrals for $date
                $q
                    //->where('refferals.RefferalStatus', 0)
                    ->where('ReferralTypeId', 9)
                    ->where('Date', $date);
            })
            ->whereHas('counters', function ($q) {
                //$q->where('LunchDetentionsToBeServed', '>', 0);
            })
            ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
            ->orderBy('LastName', 'ASC')
            ->select('students.*')
            ->get();


        return $lunchStudents;
    }


    private function setColorAEC($list)
    {
        foreach ($list as $stu) {

            switch ($stu->referred[0]->ActivityTypeId) {
                case 49:// present
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 55: // sent out
                case 56: // walked out
                case 52: // no show
                    $stu['statusColor'] = 'bg-danger';
                    break;
                case 50: // rescheduled
                case 51: // cleared
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 53:// Left School
                case 54:// School Absent
                case 57:// Other
                case 0: // N/A
                    $stu['statusColor'] = 'bg-gray';
                    break;
                default:
                    $stu['statusColor'] = 'bg-gray';
            }

        }


    }

    private function setColorReteach($list)
    {
        foreach ($list as $stu) {

            switch ($stu->referred[0]->ActivityTypeId) {
                case 64:// present
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 75: // sent out
                case 70: // walked out
                case 67: // no show
                    $stu['statusColor'] = 'bg-danger';
                    break;
                case 65: // rescheduled
                case 66: // cleared
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 68:// Left School
                case 69:// School Absent
                case 71:// Other
                case 0: // N/A
                    $stu['statusColor'] = 'bg-gray';
                    break;
                default:
                    $stu['statusColor'] = 'bg-gray';
            }
            //$stu->referred[0]->update(['ActivityTypeId'=>64, 'RefferalStatus'=>1]);

        }
    }

    private function setColorISS($list)
    {
        foreach ($list as $stu) {
            if($stu->referred->count() === 0){
                continue;
            }
            switch ($stu->referred[0]->ActivityTypeId) {
                case 38:// present
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 42:// Sent Out
                case 43:// Walked Out
                case 39:// No Show
                    $stu['statusColor'] = 'bg-danger';
                    break;
                case 40:// Left School
                case 41:// School Absent
                case 47:// Other
                case 0: // N/A
                    $stu['statusColor'] = 'bg-gray';
                    break;
                default:
                    $stu['statusColor'] = 'bg-gray';
            }

        }
    }

    private function setColorOSS($list)
    {
        foreach ($list as $stu) {

            switch ($stu->referred[0]->ActivityTypeId) {
                case 49:// present
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 55: // sent out
                case 56: // walked out
                case 52: // no show
                    $stu['statusColor'] = 'bg-warning';
                    break;
                case 50: // rescheduled
                case 51: // cleared
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 53:// Left School
                case 54:// School Absent
                case 57:// Other
                    $stu['statusColor'] = 'bg-gray';
                    break;

            }

        }
    }

    private function setColorORM($list)
    {
        foreach ($list as $stu) {
            foreach ($stu->referred as $ref) {
                switch ($ref->ActivityTypeId) {

                    case 24:// present
                        $stu['statusColor'] = 'bg-success';
                        break;
                    case 28:// Sent Out
                    case 29:// Walked Out
                    case 25:// No Show
                        $stu['statusColor'] = 'bg-danger';
                        break;
                    case 26:// Left School
                    case 27:// School Absent
                    case 30:// Other
                    case 0:// NA
                        $stu['statusColor'] = 'bg-gray';
                        break;
                    case 38:
                        $stu['statusColor'] = 'bg-gray';
                        $stu->referred[0]->activity->Name = 'N/A';
                        break;
                    default:
                        $stu['statusColor'] = 'bg-gray';

                }
            }

        }
    }

    private function setColorLunch($list)
    {
        foreach ($list as $stu) {

            switch ($stu->referred[0]->ActivityTypeId) {
                case 31:// present
                    $stu['statusColor'] = 'bg-success';
                    break;
                case 35: // sent out
                case 36: // walked out
                case 32: // no show  (DISLEXIA)
                    $stu['statusColor'] = 'bg-danger';
                    break;
                case 33:// Left School
                case 34:// School Absent
                case 30:// Other
                case 0: // N/A
                    $stu['statusColor'] = 'bg-gray';
                    break;
                default:
                    $stu['statusColor'] = 'bg-gray';
            }

        }
    }


    private function getlunchCounters($list)
    {
        $lunch_counters = [];
        $lunch_counters['presents'] = 0;
        $lunch_counters['noshows'] = 0;
        $lunch_counters['sentouts'] = 0;
        $lunch_counters['walkedouts'] = 0;
        $lunch_counters['schoolabsents'] = 0;
        $lunch_counters['leftschools'] = 0;
        $lunch_counters['others'] = 0;

        foreach ($list as $stu) {
            $stu->referred = $stu->referred->filter(function ($item) {
                return $item->ReferralTypeId === 9;
            });
            $stu->referred = $stu->referred->values();


            switch ($stu->referred[0]->ActivityTypeId) {
                case 31:
                    $lunch_counters['presents']++;
                    break;
                case 32:
                    $lunch_counters['noshows']++;
                    break;
                case 35:
                    $lunch_counters['sentouts']++;
                    break;
                case 36:
                    $lunch_counters['walkedouts']++;
                    break;
                case 34:
                    $lunch_counters['schoolabsents']++;
                    break;
                case 33:
                    $lunch_counters['leftschools']++;
                    break;
                case 37:
                    $lunch_counters['others']++;
                    break;
            }
        }


        return $lunch_counters;
    }

    private function getORMCounters($list)
    {
        $orm_counters = [];
        $orm_counters['presents'] = 0;
        $orm_counters['noshows'] = 0;
        $orm_counters['sentouts'] = 0;
        $orm_counters['walkedouts'] = 0;
        $orm_counters['schoolabsents'] = 0;
        $orm_counters['leftschools'] = 0;
        $orm_counters['others'] = 0;

        foreach ($list as $stu) {
            $stu->referred = $stu->referred->filter(function ($item) {
                return $item->ReferralTypeId === 1 || $item->ReferralTypeId === 2 ||
                $item->ReferralTypeId === 3 || $item->ReferralTypeId === 16 || $item->ReferralTypeId === 19;
            });
            $stu->referred = $stu->referred->values();

            switch ($stu->referred[0]->ActivityTypeId) {
                case 24:
                    $orm_counters['presents']++;
                    break;
                case 25:
                    $orm_counters['noshows']++;
                    break;
                case 28:
                    $orm_counters['sentouts']++;
                    break;
                case 29:
                    $orm_counters['walkedouts']++;
                    break;
                case 27:
                    $orm_counters['schoolabsents']++;
                    break;
                case 26:
                    $orm_counters['leftschools']++;
                    break;
                case 30:
                    $orm_counters['others']++;
                    break;
            }
        }


        return $orm_counters;
    }

    private function getISSCounters($list)
    {
        $counters = [];
        $counters['presents'] = 0;
        $counters['noshows'] = 0;
        $counters['sentouts'] = 0;
        $counters['walkedouts'] = 0;
        $counters['schoolabsents'] = 0;
        $counters['leftschools'] = 0;
        $counters['others'] = 0;

        foreach ($list as $stu) {
            $stu->referred = $stu->referred->filter(function ($item) {
                return $item->ReferralTypeId === 5 || $item->ReferralTypeId === 6 ||
                $item->ReferralTypeId === 7 || $item->ReferralTypeId === 10 || $item->ReferralTypeId === 11 ||
                $item->ReferralTypeId === 15 || $item->ReferralTypeId === 17;
            });
            $stu->referred = $stu->referred->values();

            if($stu->referred->count() === 0){
                continue;
            }

            switch ($stu->referred[0]->ActivityTypeId) {
                case 38:
                    $counters['presents']++;
                    break;
                case 39:
                    $counters['noshows']++;
                    break;
                case 42:
                    $counters['sentouts']++;
                    break;
                case 43:
                    $counters['walkedouts']++;
                    break;
                case 41:
                    $counters['schoolabsents']++;
                    break;
                case 40:
                    $counters['leftschools']++;
                    break;
                case 47:
                    $counters['others']++;
                    break;
            }
        }


        return $counters;
    }

    private function getAECCounters($list)
    {
        $counters = [];
        $counters['presents'] = 0;
        $counters['noshows'] = 0;
        $counters['sentouts'] = 0;
        $counters['walkedouts'] = 0;
        $counters['schoolabsents'] = 0;
        $counters['leftschools'] = 0;
        $counters['others'] = 0;
        $counters['clears'] = 0;
        $counters['reschedules'] = 0;
        $counters['absents'] = 0;

        foreach ($list as $stu) {
            $stu->referred = $stu->referred->filter(function ($item) {
                return $item->ReferralTypeId == 12;
            });
            $stu->referred = $stu->referred->values();
            try {
                switch ($stu->referred[0]->ActivityTypeId) {
                    case 49:
                        $counters['presents']++;
                        break;
                    case 52:
                        $counters['noshows']++;
                        break;
                    case 55:
                        $counters['sentouts']++;
                        break;
                    case 56:
                        $counters['walkedouts']++;
                        break;
                    case 54:
                        $counters['schoolabsents']++;
                        break;
                    case 53:
                        $counters['leftschools']++;
                        break;
                    case 57:
                        $counters['others']++;
                        break;
                    case 51:
                        $counters['clears']++;
                        break;
                    case 50:
                        $counters['reschedules']++;
                        break;
                    case 58:
                        $counters['absents']++;
                }
            } catch (\Exception $e) {
                dd($stu->referred);
            }
        }


        return $counters;
    }

    private function getReteachCounters($list)
    {
        $counters = [];
        $counters['presents'] = 0;
        $counters['noshows'] = 0;
        $counters['sentouts'] = 0;
        $counters['walkedouts'] = 0;
        $counters['schoolabsents'] = 0;
        $counters['leftschools'] = 0;
        $counters['others'] = 0;
        $counters['clears'] = 0;
        $counters['reschedules'] = 0;
        $counters['absents'] = 0;

        foreach ($list as $stu) {
            $stu->referred = $stu->referred->filter(function ($item) {
                return $item->ReferralTypeId === 18;
            });
            $stu->referred = $stu->referred->values();


            switch ($stu->referred[0]->ActivityTypeId) {
                case 64:
                    $counters['presents']++;
                    break;
                case 67:
                    $counters['noshows']++;
                    break;
                case 75:
                    $counters['sentouts']++;
                    break;
                case 70:
                    $counters['walkedouts']++;
                    break;
                case 69:
                    $counters['schoolabsents']++;
                    break;
                case 68:
                    $counters['leftschools']++;
                    break;
                case 71:
                    $counters['others']++;
                    break;
                case 66:
                    $counters['clears']++;
                    break;
                case 65:
                    $counters['reschedules']++;
                    break;
                case 72:
                    $counters['absents']++;
            }

        }
        return $counters;
    }

    private function getProgression($ref)
    {

    }

    private function getOverlaps($student)
    {
        $iss = collect([5, 6, 7, 10, 15, 17]);
        $oss = collect([11]);
        $orm = collect([1, 2, 3, 16, 19]);
        $aec = collect([12]);
        $reteach = collect([18]);

        $overlap = ['hasiss' => false, 'hasoss' => false, 'hasaec' => false, 'hasorm' => false, 'reteach' => false];
        foreach ($student->referred as $ref) {
            if ($orm->contains($ref->ReferralTypeId))
                $overlap['hasorm'] = true;
            else if ($iss->contains($ref->ReferralTypeId)) {
                $overlap['hasiss'] = true;
            } else if ($oss->contains($ref->ReferralTypeId))
                $overlap['hasoss'] = true;
            else if ($reteach->contains($ref->ReferralTypeId))
                $overlap['hasreteach'] = true;
            else if ($aec->contains($ref->ReferralTypeId))
                $overlap['hasaec'] = true;
        }

        return $overlap;

    }

    private function getLunchOverlaps($list)
    {
        foreach ($list as $stu) {
            $overlap = $this->getOverlaps($stu);

            if ($overlap['hasoss'])
                $stu['overlap'] = ['class' => 'bg-danger', 'msg' => 'Has OSS'];
            else if ($overlap['hasiss'])
                $stu['overlap'] = ['class' => 'bg-danger', 'msg' => 'Has ISS'];

        }

    }

    private function getORMOverlaps($list)
    {
        $iss = collect([5, 6, 7, 10, 15, 17]);
        $oss = collect([11]);
        $orm = collect([1, 2, 3, 16, 19]);
        $aec = collect([12]);
        $reteach = collect([18]);


        foreach ($list as $stu) {
            $overlap = ['hasiss' => false, 'hasoss' => false, 'hasaec' => false, 'hasorm' => false, 'reteach' => false];
            foreach ($stu->referred as $ref) {
                if ($orm->contains($ref->ReferralTypeId))
                    $overlap['hasorm'] = true;
                else if ($iss->contains($ref->ReferralTypeId)) {
                    $overlap['hasiss'] = true;
                } else if ($oss->contains($ref->ReferralTypeId))
                    $overlap['hasoss'] = true;
                else if ($reteach->contains($ref->ReferralTypeId))
                    $overlap['hasreteach'] = true;
                else if ($aec->contains($ref->ReferralTypeId))
                    $overlap['hasaec'] = true;
            }
            //$overlap = $this->getOverlaps($stu);

            if ($overlap['hasoss'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has OSS'];
            else if ($overlap['hasiss']) {
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has ISS'];

            }

        }
    }

    private function getISSOverlaps($list)
    {
        foreach ($list as $stu) {
            $overlap = $this->getOverlaps($stu);

            if ($overlap['hasoss'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has OSS'];


        }
    }

    private function getAECOverlaps($list)
    {
        foreach ($list as $stu) {
            $overlap = $this->getOverlaps($stu);

            if ($overlap['hasoss'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has OSS'];
            else if ($overlap['hasiss'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has ISS'];
            else if ($overlap['hasorm'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has ORM'];
            else if ($overlap['reteach'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has Reteach'];

        }
    }

    private function getReteachOverlaps($list)
    {
        foreach ($list as $stu) {
            $overlap = $this->getOverlaps($stu);

            if ($overlap['hasoss'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has OSS'];
            else if ($overlap['hasiss'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has ISS'];
            else if ($overlap['hasorm'])
                $stu['overlap'] = ['class' => 'bg-gray', 'msg' => 'Has ORM'];


        }

    }

}

