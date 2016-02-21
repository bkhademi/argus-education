@extends('layouts.master')

@section('title', 'Page Title')

@section('sidebar')

	@parent

	<p>This is appented to the master sidebar. </p>

@endsection

@section('content')
<p>This is my body content </p>
<p> and the name is {{$name}}</p>
<p> current UNIX timestamp  is @{{time()}}</p>
<ol>
	@for($i =0;$i<10;$i++)
	<li>The time is{{ time()}}</li>
	@endfor
</ol>
@endsection