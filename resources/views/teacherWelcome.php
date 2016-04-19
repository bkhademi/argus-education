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

		<!-- cgNotify -->
		<link  href='css/plugins/angular-notify/angular-notify.min.css' rel="stylesheet"> 


	</head>

	<!-- ControllerAs syntax -->
	<!-- Main controller with serveral data used in Inspinia theme on diferent view -->
	<body data-ng-controller="MainCtrl as main"  class="{{$state.current.data.specialClass}} "   >

		<!-- Main view  -->

		<script>
				/*	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				 (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				 m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				 })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
				 
				 ga('create', 'UA-70697324-1', 'auto');
				 ga('send', 'pageview');
				 */
		</script> 

		<div ui-view slimscroll="{alwaysVisible:true}" ></div>

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

		<!-- moment js  -->
		<script src="js/plugins/moment/moment.min.js"></script>

		<!-- Custom and plugin javascript -->
		<script src="js/inspinia.js"></script>

		<!-- Main Angular scripts-->
		<script src="js/angular/angular.min.js"></script>
		<!-- <script src="js/angular/angular-storage.min.js"></script> -->
		<script src="js/plugins/oclazyload/dist/ocLazyLoad.min.js"></script>
		<script src="js/ui-router/angular-ui-router.min.js"></script>
		<script src="js/bootstrap/ui-bootstrap-tpls-0.12.0.min.js"></script>
		<script src="js/angular/angular-resource.min.js"></script>
		<script src="js/angular/satellizer.min.js"></script>
		<script src= 'js/plugins/angular-notify/angular-notify.min.js'></script>
		<script src="js/angular/angular-storage.min.js"></script>
		<!-- Anglar App Script -->
<!--		<script src="js/app.min.js"></script>
		<script src="js/argusdirectives.js"></script>
		<script src="js/argusservices.js"></script>-->
		<script src="js/argusCore.min.js"></script>
		<!--<script src="js/directives.min.js"></script>-->	
		<script src="js/angular-inspinia-directives.min.js"></script>


		<script src="js/admin1Main.js"></script>



</html>
<style>
	/* red : #D9212B; */
	/* gray: #6385A8; */

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
		background-color: #D9212B;
		background: #D9212B;
		color: white;
		font-weight: 900;
	}



	.wizard > .steps .disabled a,
	.wizard > .steps .disabled a:hover,
	.wizard > .steps .disabled a:active,
	.nav-pills > li:nth-child(3n-1).active > a,
	.nav-pills > li:nth-child(3n-1).active > a:hover,
	.nav-pills > li:nth-child(3n-1).active > a:focus {
		background-color: #6385A8;
		color: white;
	}

	.pagination > .active > a,
	.pagination > .active > a:hover,
	.pagination > .active > a:focus,
	.pagination > .active > span,
	.pagination > .active > span:hover,
	.pagination > .active > span:focus {
		background-color: #D9212B;
		color: white;
	}

	.nav-pills > li:nth-child(3n).active > a,
	.nav-pills > li:nth-child(3n).active > a:hover,
	.nav-pills > li:nth-child(3n).active > a:focus {
		background-color: #D9212B;
	}


	.profilebtn {
		background-color: #6385A8;
		color: white;
	}

	.profilebtn:active {
		background-color: #FF7857;
	}

	.profilebtn:hover, .fc-state-active, .fc-event {
		background-color: #D9212B;
		border-color: #D9212B;
		color: white;
	}

	.fc-event-title {
		color: white;
	}

	.btn-success {
		background-color: #D9212B;
		border-color: #D9212B;
	}

	.btn-success:hover {
		opacity: 0.6;
		background-color: #D9212B;
		border-color: #D9212B;
	}

	.btn-success:active,
	.btn-success:focus {
		background-color: #D9212B;
		border-color: #D9212B;
		opacity: .85;
	}


	.btn-success[disabled],
	.btn-success[disabled]:hover,
	.btn-success[disabled]:focus,
	.btn-success[disabled].focus,
	.btn-success[disabled]:active,
	.btn-success[disabled].active {
		background-color: #D9212B;
		border-color: #D9212B;
	}

	/*btn  primary */
	.btn-primary {
		background-color: #D9212B;
		border-color: #D9212B;
	}

	.btn-primary:focus, .btn-primary:hover, .btn-primary.active {
		background-color: #941D1C;
		border-color: #941D1C;
	}

	.btn-primary[disabled] {
		background-color: rgba(217, 33, 43, 0.70);
		border-color: rgba(217, 33, 43, 0.70);
		opacity: .7;
	}

	.btn-primary.active {
		background-color: #3E0C0C;
		border-color: #3E0C0C;
	}

	/* label primary */

	label.btn-primary {
		background-color: #6385A8;
		border-color: #6385A8;

	}
	label.btn-primary.active {
		background-color: #D9212B;
		border-color: #D9212B;
	}

	label.btn-primary[focus], .btn-primary:hover {
		background-color: #941c1b;
		border-color: #941c1b;
	}

	.btn-info {
		background-color: #6385A8;
		border-color: #6385A8;
	}

	.btn-info:focus, .btn-info:hover,.btn-info.active {
		background-color: #8A8B8E;
		border-color: #8A8B8E;
	}

	.btn-info:active,
	.btn-info:focus {
		background-color: #6385A8;
		border-color: #6385A8;
		opacity: .85;
	}

	.bg-primary, .navy-bg {
		background-color: #D9212B;
		border-color: #D9212B;

	}


	.bg-gray{
		background-color: #C2C3C5;
		color: #000000;
	}
	.bg-danger{
		background-color: #CA423F;
		border-color:#CA423F;
		color:#000000;
	}
	.bg-warning{
		background-color: #FFB757;
		border-color:#FFB757;
		color:#000000;
	}

	.bg-success, .bg-green{
		background-color: #6FA45A;
		border-color: #6FA45A;
		color:#000000;
	}
	table tr td {
		color:#000000;
	}


	.bg-info, .lazur-bg {
		background-color: #6385A8;
	}



	.btn-info[disabled] {
		background-color: #6385A8;
		border-color: #6385A8;
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
		background-color: #D9212B;
		outline: 0;
	}



	.top-header {
		background-color: #D9212B;
		color: white;
	}

	.wizard > .content {
		display: block;
		min-height: 35em;
		overflow-y: auto;
		position: relative;
	}

	.nav > li.active {
		border-left: 4px solid #D9212B;
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
		border: #D9212B dashed 3px;
		width: 80%;
		padding: 30px;
		margin: auto;
		color: white;
	}
	/* Custom Switches */
	label > span.onoffswitch-inner:before {
		background-color: #D9212B;
	}

	label.onoffswitch-label, span.onoffswitch-switch {
		border-color: #D9212B;
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
		background: #D9212B;
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

