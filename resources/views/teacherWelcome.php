<!--
* INSPINIA - Responsive Admin Theme
* Version 2.2
*
-->

<!DOCTYPE html>
<html data-ng-app="Argus">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Page title set in pageTitle directive -->
    <title page-title></title>

    <!-- Font awesome -->
    <link href="font-awesome/css/font-awesome.css" rel="stylesheet">

    <!-- Bootstrap and Fonts -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Main Inspinia CSS files -->
    <link href="css/animate.css" rel="stylesheet">
    <link id="loadBefore" href="css/style.css" rel="stylesheet">


</head>

<!-- ControllerAs syntax -->
<!-- Main controller with serveral data used in Inspinia theme on diferent view -->
<body ng-controller="MainCtrl as main">

<!-- Main view  -->
<div ui-view></div>

<!-- jQuery and Bootstrap -->
<script src="js/jquery/jquery-2.1.1.min.js"></script>
<script src="js/plugins/jquery-ui/jquery-ui.js"></script>
<script src="js/bootstrap/bootstrap.min.js"></script>

<!-- MetsiMenu -->
<script src="js/plugins/metisMenu/jquery.metisMenu.js"></script>

<!-- SlimScroll -->
<script src="js/plugins/slimscroll/jquery.slimscroll.min.js"></script>

<!-- Peace JS -->
<script src="js/plugins/pace/pace.min.js"></script>

<!-- Custom and plugin javascript -->
<script src="js/inspinia.js"></script>

<!-- Main Angular scripts-->
<script src="js/angular/angular.min.js"></script>
<script src="js/plugins/oclazyload/dist/ocLazyLoad.min.js"></script>
<script src="js/ui-router/angular-ui-router.min.js"></script>
<script src="js/bootstrap/ui-bootstrap-tpls-0.12.0.min.js"></script>
<script src="js/angular/angular-resource.min.js"></script>
<script src="js/angular/satellizer.min.js"></script>

<!-- Anglar App Script -->
<script src="js/app.js"></script>
<script src="js/config.js"></script>
<script src="js/directives.js"></script>
<script src="js/controllers.js"></script>

<script src="js/arguscontrollers.js"></script>
<script src="js/argusdirectives.js"></script>
<script src="js/argusservices.js"></script>
<!--<script src="js/Data.js"></script>
<script src="js/serverDataModel.js"></script></body>-->



</html>
    <style>
        /* red : #B92322; */
        /* gray: #AAADB1; */

        .wizard > .actions a,
        .wizard > .actions a:hover,
        .wizard > .actions a:active,
        .wizard > .steps .current a,
        .wizard > .steps .current a:hover,
        .wizard > .steps .current a:active,
        .wizard > .steps .done a,
        .wizard > .steps .done a:hover,
        .wizard > .steps .done a:active,
        .nav-pills > li:nth-child(3n-2).active > a,
        .nav-pills > li:nth-child(3n-2).active > a:hover,
        .nav-pills > li:nth-child(3n-2).active > a:focus {
            background-color: #B92322;
            background: #B92322;
            color: white;
            font-weight: 900;
        }



        .wizard > .steps .disabled a,
        .wizard > .steps .disabled a:hover,
        .wizard > .steps .disabled a:active,
        .nav-pills > li:nth-child(3n-1).active > a,
        .nav-pills > li:nth-child(3n-1).active > a:hover,
        .nav-pills > li:nth-child(3n-1).active > a:focus {
            background-color: #AAADB1;
            color: white;
        }

        .pagination > .active > a,
        .pagination > .active > a:hover,
        .pagination > .active > a:focus,
        .pagination > .active > span,
        .pagination > .active > span:hover,
        .pagination > .active > span:focus {
            background-color: #B92322;
            color: white;
        }

        .nav-pills > li:nth-child(3n).active > a,
        .nav-pills > li:nth-child(3n).active > a:hover,
        .nav-pills > li:nth-child(3n).active > a:focus {
            background-color: #B92322;
        }


        .profilebtn {
            background-color: #AAADB1;
            color: white;
        }

            .profilebtn:active {
                background-color: #FF7857;
            }

            .profilebtn:hover, .fc-state-active, .fc-event {
                background-color: #B92322;
                border-color: #B92322;
                color: white;
            }

        .fc-event-title {
            color: white;
        }

        .btn-success {
            background-color: #B92322;
            border-color: #B92322;
        }

            .btn-success:hover {
                opacity: 0.6;
                background-color: #B92322;
                border-color: #B92322;
            }

            .btn-success:active,
            .btn-success:focus {
                background-color: #B92322;
                border-color: #B92322;
                opacity: .85;
            }


            .btn-success[disabled],
            .btn-success[disabled]:hover,
            .btn-success[disabled]:focus,
            .btn-success[disabled].focus,
            .btn-success[disabled]:active,
            .btn-success[disabled].active {
                background-color: #B92322;
                border-color: #B92322;
            }

        .btn-primary, btn-primary {
            background-color: #B92322;
            border-color: #B92322;
        }

            .btn-primary:focus, .btn-primary:hover, .btn-primary.active {
                background-color: #941D1C;
                border-color: #941D1C;
            }

            .btn-primary[disabled] {
                background-color: #B92322;
                border-color: #B92322;
                opacity: .7;
            }

            .btn-primary.active {
                background-color: #3E0C0C;
                border-color: #3E0C0C;
            }

        label.btn-primary {
            background-color: #AAADB1;
            border-color: #AAADB1;
            
        }

            label.btn-primary.active {
                background-color: #B92322;
                border-color: #B92322;
            }

            label.btn-primary[focus], .btn-primary:hover {
                background-color: #941c1b;
                border-color: #941c1b;
            }

        .btn-info {
            background-color: #AAADB1;
            border-color: #AAADB1;
        }

            .btn-info:focus, .btn-info:hover {
                background-color: #8A8B8E;
                border-color: #8A8B8E;
            }

            .btn-info:active,
            .btn-info:focus {
                background-color: #AAADB1;
                border-color: #AAADB1;
                opacity: .85;
            }

        .bg-primary, .navy-bg {
            background-color: #B92322;
            border-color: #B92322;
        }


        .bg-success {
            background-color: #B92322;
            border-color: #B92322;
        }

        .bg-info, .lazur-bg {
            background-color: #AAADB1;
        }

        .btn-info[disabled] {
            background-color: #AAADB1;
            border-color: #AAADB1;
            opacity: .65;
        }

        .badge-black {
            background-color: white;
            color: black;
            font-weight: 900;
        }

        .dropdown-menu > .active > a, .dropdown-menu > .active > a:focus, .dropdown-menu > .active > a:hover {
            color: #fff;
            text-decoration: none;
            background-color: #B92322;
            outline: 0;
        }



        .top-header {
            background-color: #B92322;
            color: white;
        }

        .wizard > .content {
            display: block;
            min-height: 35em;
            overflow-y: auto;
            position: relative;
        }

        .nav > li.active {
            border-left: 4px solid #B92322;
        }

        .logo {
            background-color: white;
        }

        .animate-hide {
            -webkit-transition: all ease 0.5s;
            transition: all ease 0.5s;
            line-height: 20px;
            opacity: 1;
            padding: 10px;
            background: white;
        }

            .animate-hide.ng-hide {
                line-height: 0;
                opacity: 0;
                padding: 0 10px;
            }

        #dropZone {
            background: gray;
            border: #B92322 dashed 3px;
            width: 80%;
            padding: 30px;
            margin: auto;
            color: white;
        }
        /* Custom Switches */
        label > span.onoffswitch-inner:before {
            background-color: #B92322;
        }

        label.onoffswitch-label, span.onoffswitch-switch {
            border-color: #B92322;
        }

        label > span.onoffswitch-inner.highlow:before {
            content: 'HIGH';
        }

        label > span.onoffswitch-inner.highlow:after {
            content: 'LOW';
        }

        label > span.onoffswitch-inner.yesno:before {
            content: 'YES';
        }

        label > span.onoffswitch-inner.yesno:after {
            content: 'NO';
        }

        ul.chosen-results > li.active-result.highlighted {
            background: #B92322;
            color: white;
        }

        @media screen {
            #printSection {
                display: none;
            }
        }

        @media print {
            body * {
                visibility: hidden;
            }

            #printSection, #printSection * {
                visibility: visible;
            }

            #printSection {
                position: absolute;
                left: 0;
                top: 0;
            }
        }

    </style>
