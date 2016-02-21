//uses docFragments in intoColors(),  when chosing only show valid colorings : docFragment gets filled . 
// implement docFragment in drawTree to increase speed
//make another document using simple variables instead of fragments 


// last updated tue, august, 13 ,2013
var publicFragment = document.createDocumentFragment(); //public document fragment accesible throught the entire document
//toggling content (alternative to Jquery a simplified if/else Statement => (condition/boolean ? true : false)
function toggleContent(contentID) {
  // Get the DOM reference
  var contentId = document.getElementById(contentID);
  // Toggle 
  contentId.style.display == "block" ? contentId.style.display = "none" : 
contentId.style.display = "block"; 
}
//empty a tag's contents, 
function emptyContent(contentID){
var myNode = document.getElementById(contentID);
while (myNode.lastChild) {
    myNode.removeChild(myNode.lastChild);
}
}
//changes the color of the fields when the user focus on the field(interactive touch).
function bgColorInput(element){
	if(element.style.background.match('yellow')){
		element.style.background = 'white'
	}else{
		element.style.background = 'yellow'
	}
}
// emptes main containers 
function erase(){ 
	emptyContent('allColoringsWithColors');
	emptyContent('EaAndN');
	emptyContent('tree');
	emptyContent('validColorings');
}
function calculateN(){
	numOfColors = 2;
	for(var i = 0 ; i<= 4 ; i++){
		if(document.userInput.elements[i].checked){
			numOfColors = parseFloat(document.userInput.elements[i].value);
		}
	} 
	x = parseFloat(document.userInput.xVal.value);
	z = parseFloat(document.userInput.zVal.value);
	yMin = 0; 
	yMax = 0;
	if(document.getElementById('mode3').checked){
		yMin = parseFloat(document.userInput.yMinVal.value);
		yMax = parseFloat(document.userInput.yMaxVal.value);
		document.getElementById('EqAndN').appendChild(document.createElement('p')).appendChild(document.createTextNode('Equation = '+x +'x  + ' + ' ['+yMin +'to' +yMax +']'+'y '+ ' = '+ z+'z'))

	}else{
		y =  parseFloat(document.userInput.yVal.value);
		document.getElementById('EqAndN').appendChild(document.createElement('p')).appendChild(document.createTextNode('Equation = '+ x +'x  + ' + y +'y  = '+ z+'z'))

	}

var limit = parseFloat(document.userInput.limitN.value);

var colorings = new Array(1);
var n = 1;
var coloringStatus = true;
colorings[0] = 0;
var position = 1;
counter = 0;
if((document.getElementById('validColoring').checked ||document.getElementById('treeOption').checked )){
var valColorList = new Array();
var backtrackingCounter = 0;
var treeStructure = 0;
}
for( var h = 0; h < ((yMax-yMin)+1) ; h++){
if((yMax-yMin) > 0){y = yMin +h;}
do{
	if( n < colorings.length){
		n = colorings.length;
	}
	
	coloringStatus = coloringCheck(colorings, y)
	
	if(coloringStatus && colorings[0] == 0){
		if(document.getElementById('allColorings').checked){
		publicFragment.appendChild(intoColors(colorings.toString().split(','),1,coloringStatus));
		}
		colorings.push(0);
		if((document.getElementById('validColoring').checked ||document.getElementById('treeOption').checked ))
		backtrackingCounter = 0;
		position++;
	}else{
		colorings[colorings.length-1]=colorings[colorings.length-1] + 1;
	}
	while((colorings[colorings.length-1] >= numOfColors)){
		if(backtrackingCounter<=0 && (document.getElementById('validColoring').checked ||document.getElementById('treeOption').checked )){
			valColorList[treeStructure] = '';
			valColorList[treeStructure] = valColorList[treeStructure].concat(colorings.toString().slice(0,-2));
			valColorList[treeStructure] = valColorList[treeStructure].split(',');
			treeStructure++;
			backtrackingCounter++;
		}
		colorings.pop();
		colorings[colorings.length-1] = colorings[colorings.length-1]+1;
		position--;
	
	}
	
	counter++;	
}while(position<=limit && colorings[0] == 0);
if(document.getElementById('allColorings').checked){
document.getElementById('allColoringsWithColors').appendChild(publicFragment);
}
if(document.getElementById('validColoring').checked){ //write the content of valColorList into the html document if checked.
	for(var i = 0; i <valColorList.length; i++){
		document.getElementById('validColorings').appendChild(intoColors(valColorList[i],i,'undefined','validColorings'));
	}
	
}
if(document.getElementById('validColoring').checked ||document.getElementById('treeOption').checked)
	valColorList.reverse();


var docFragment = document.createDocumentFragment();
if((yMax-yMin) > 0){	
docFragment.appendChild(document.createElement('p')).appendChild(document.createTextNode('Equation = '+ x +'x '+ ' + ' + '['+(yMin+h)+']'+'y'+ '='+ z+'z'));

}
docFragment.appendChild(document.createElement('p')).appendChild(document.createTextNode('N = '+n));
docFragment.appendChild(document.createElement('p')).appendChild(document.createTextNode('Colorings Tested = '+counter));
if(document.getElementById('treeOption').checked || document.getElementById('validColoring').checked){
docFragment.appendChild(document.createElement('p')).appendChild(document.createTextNode('Biggest Valid Colorings = '+valColorList.length));
}
if((yMax-yMin) > 0){docFragment.appendChild(document.createElement('hr'));}
document.getElementById('EqAndN').appendChild(docFragment);
if((n < 2)){
document.getElementById('EqAndN').style.color = 'red';
document.getElementById("EqAndN").appendChild(document.createElement("p")).appendChild(document.createTextNode(" No Valid Colorings"));
}else{
	if(document.getElementById('treeOption').checked){
		width = valColorList.length*100;
		document.getElementById('tree').style.width = width+'px';
		drawTree(valColorList);
	}
	
}
	counter = 0;
	colorings[0] = 0;
	position = 1;
	n=1;
}
}
function coloringCheck(coloredList , yCoeff){
	var validity = true;
	var colorsList = new Array();
	for(var i = 0 ; i < numOfColors; i++){
		colorsList[i] = new Array();
	}
	for(var i = 0; i< coloredList.length; i++){
		switch(coloredList[i]){
			case 0 :
			case '0':
			colorsList[0].push(i+1);
			break;
			case 1:
			case '1':
			colorsList[1].push(i+1);
			break;
			case 2:
			case '2':
			colorsList[2].push(i+1);
			break;
			case 3:
			case '3':
			colorsList[3].push(i+1);
		}
	}
	
	for(var i = 0; (validity && (i < numOfColors)); i++){
		
		for(var j = 0; (validity &&(j< colorsList[i].length)) ; j++){
			var tempZ = z*colorsList[i][j];
			for(var k = 0 ; (validity && (k<colorsList[i].length)); k++){
				var tempX = x*colorsList[i][k];
				for(var b = 0; (validity && (b < colorsList[i].length)); b++){
					if((tempX + yCoeff*colorsList[i][b]) == tempZ){
						validity = false;
						if(document.getElementById('validColoring').checked || document.getElementById('allColorings').checked)
						publicFragment.appendChild(intoColors(coloredList.toString().split(',') ,1,validity,'', colorsList[i][k], colorsList[i][b],colorsList[i][j]));						
					}
				}
			}
		}
	}
	return validity
}
function intoColors(binaryList,divNumber,isItValid,tagDestination, pointerX, pointerY, pointerZ){
	var fragment = document.createDocumentFragment();
	fragment.appendChild(document.createElement('div'));
	
	fragment.firstChild.appendChild(document.createElement('span')).appendChild(document.createTextNode(''+(1)+', '));
	fragment.firstChild.lastChild.setAttribute('class','red');
	for(var i =  1; i < (binaryList.length) ; i++){
		switch (binaryList[i]){
			case "0":
				fragment.firstChild.appendChild(fragment.firstChild.firstChild.cloneNode(true));
				fragment.firstChild.lastChild.lastChild.nodeValue = ""+(i+1)+", ";
				fragment.firstChild.lastChild.setAttribute('class','red');
				
				break;
			case "1":
				fragment.firstChild.appendChild(fragment.firstChild.firstChild.cloneNode(true));
				fragment.firstChild.lastChild.lastChild.nodeValue = ""+(i+1)+", ";
				fragment.firstChild.lastChild.setAttribute('class','blue');
				break;
			case "2":
				fragment.firstChild.appendChild(fragment.firstChild.firstChild.cloneNode(true));
				fragment.firstChild.lastChild.lastChild.nodeValue = ""+(i+1)+", ";
				fragment.firstChild.lastChild.setAttribute('class','green');
				break;
			case "3":
				fragment.firstChild.appendChild(fragment.firstChild.firstChild.cloneNode(true));
				fragment.firstChild.lastChild.lastChild.nodeValue = ""+(i+1)+", ";
				fragment.firstChild.lastChild.setAttribute('class','brown');
				break;
		}
	}
	if(isItValid == true){
		fragment.firstChild.className= 'validColoring';
		fragment.firstChild.id = binaryList;
		fragment.firstChild.appendChild(document.createElement('span')).appendChild(document.createTextNode(" coloring  valid "));
	}else if(isItValid ==false){
		fragment.firstChild.appendChild(document.createElement('span')).appendChild(document.createTextNode(" coloring not valid "));
		fragment.firstChild.getElementsByTagName('span')[pointerX-1].id = 'invalidxy';
		fragment.firstChild.getElementsByTagName('span')[pointerY-1].id = 'invalidxy';
		fragment.firstChild.getElementsByTagName('span')[pointerZ-1].id = 'invalidz';
		
		fragment.firstChild.appendChild(document.createElement('div')).appendChild(document.createTextNode(x+'('));
		//fragment.firstChild.lastChild.id = 'whyInvalid'+divNumber;
		fragment.firstChild.lastChild.className = 'whyInvalidClass';
		fragment.firstChild.lastChild.appendChild(document.createElement('span'));
		var temp1 = fragment.firstChild.getElementsByTagName('span')[pointerX-1].className;
		fragment.firstChild.lastChild.lastChild.className = temp1 ;
		fragment.firstChild.lastChild.lastChild.appendChild(document.createTextNode(pointerX));
		
		fragment.firstChild.lastChild.appendChild(document.createTextNode(') + '+y+'('));
		fragment.firstChild.lastChild.appendChild(document.createElement('span'));
		fragment.firstChild.lastChild.lastChild.appendChild(document.createTextNode(pointerY));
		var temp2 = fragment.firstChild.getElementsByTagName('span')[pointerY-1].className;
		fragment.firstChild.lastChild.lastChild.className = temp2;
		
		fragment.firstChild.lastChild.appendChild(document.createTextNode(') = '+z+'('));
		fragment.firstChild.lastChild.appendChild(document.createElement('span'));
		fragment.firstChild.lastChild.lastChild.appendChild(document.createTextNode(pointerZ));
		var temp3 = fragment.firstChild.getElementsByTagName('span')[pointerZ-1].className;
		fragment.firstChild.lastChild.lastChild.className = temp2;
		fragment.firstChild.lastChild.appendChild(document.createTextNode(')'));
	}else if(isItValid==='undefined'){}
	
	if(divNumber != 'z'){
		fragment.appendChild(document.createElement('hr'));
		return fragment;
		//document.getElementById(tagDestination).appendChild(fragment);//appends the div-fragment once it is complete populated
	}else{
		document.getElementById(tagDestination).appendChild(fragment);//appends the div-fragment once it is complete populated
	}
}
function drawTree(ordValCol){
	document.getElementById('tree').appendChild(document.createElement('ul')).appendChild(document.createElement('li')).appendChild(document.createElement('span')).appendChild(document.createTextNode('1'));
	document.getElementById('tree').querySelector('ul span:last-child').setAttribute('class','red');
	document.getElementById('tree').querySelector('ul').setAttribute('id','root');
	for(var i = 1 ; i < ordValCol[0].length; i++){
		var color;
		switch(ordValCol[0][i]){
			case '0': color = 'red'; break;
			case '1': color = 'blue'; break;
			case '2': color = 'green'; break;
			case '3': color = 'brown'; break;
		}
		document.getElementById('tree').getElementsByTagName('li')[i-1].appendChild(document.createElement('ul')).appendChild(document.createElement('li')).appendChild(document.createElement('span')).appendChild(document.createTextNode(i+1));
		document.getElementById('tree').getElementsByTagName('span')[i].setAttribute('class',color);
	}
	//compare arrays
	for(var i = 0 ; i < ordValCol.length-1; i++){
		for(var j = 0 ; j< (ordValCol[i+1].length); j++){
			if(ordValCol[i][j] != ordValCol[i+1][j]){
				
				var perColoringIterations;
				perColoringIterations = ordValCol[i+1].length-j;
				if(perColoringIterations  ==0) {perColoringIterations  = 1;}
				
				for(var k = 0; k < perColoringIterations  ; k++){
					var temp = (j+k);
					var color; 
					switch(ordValCol[i+1][j+k]){
						case '0': color = 'red'; break;
						case '1': color = 'blue'; break;
						case '2': color = 'green'; break;
						case '3': color = 'brown'; break;
					}
					
					if(perColoringIterations  == 1 || k==0){
						var coloredNumber  = document.createDocumentFragment();
						coloredNumber.appendChild(document.createElement('li'));
						coloredNumber.firstChild.appendChild(document.createElement('span'));
						coloredNumber.firstChild.firstChild.setAttribute('class',color);
						coloredNumber.firstChild.firstChild.appendChild(document.createTextNode(temp+1));
						
						document.getElementById('tree').getElementsByTagName('ul')[temp].insertBefore(coloredNumber, document.getElementById('tree').getElementsByTagName('ul')[temp].firstChild);
					}else{
						document.getElementById('tree').getElementsByTagName('li')[temp-1].appendChild(document.createElement('ul')).appendChild(document.createElement('li')).appendChild(document.createElement('span')).appendChild(document.createTextNode(temp+1));
						document.getElementById('tree').getElementsByTagName('span')[temp].setAttribute('class',color);
						
					}
				} 
				break;
			}
		}
	}
}
function normalMode(){
		//show this
	$("[name='find n'],[name='coloringsTested'], [name='validColorings'], [name='treeOutput'], [name='yVal'],#compute").show();
		//hide this
	$("[name='testColoring'], #coloringInput, #intervalTagMode, #coloringz").hide()
	
	for(var i = 0; i < 3 ; i++){
		document.getElementsByName('compute')[i].checked = true;
	}
}
function singleColoringMode(){
	//$("[name='testColoring'] ,#coloringInput, [name='find n'],[name='coloringsTested'], [name='validColorings'], [name='treeOutput'],[name='reset']  ").toggle();
		//show this
	$("[name='testColoring'], #coloringz, #coloringInput, [name='yVal']").show();
		//hide this
	$("[name='find n'],  [name='coloringsTested'], [name='validColorings'],[name='treeOutput'],#intervalTagMode,#compute").hide();
}
function intervalMode(){
		//show this
	$("#intervalTagMode,[name='find n']").show();
		//hide this
	$("[name='coloringsTested'],#coloringz,[name='validColorings'], [name='treeOutput'], [name='yVal'], [name='testColoring'], #coloringInput,#compute").hide();
	document.getElementById('validColoring').checked = false;
	document.getElementById('allColorings').checked = false;
	document.getElementById('treeOption').checked = false;
}
function singleColoringChanger(){
	emptyContent('coloringz');
	intoColors(document.userInput.field4.value.split(',') ,'z','undefined','coloringz');
}
function singleColoringCheck(){
	$('#coloringz').empty();
	numOfColors = 2;
for(var i = 0; i <= 4;i++){
	if(userInput.elements[i].checked){
		numOfColors = parseFloat(document.userInput.elements[i].value);
	}
}
x =  parseFloat(document.userInput.xVal.value);  
y =  parseFloat(document.userInput.yVal.value); 
z =  parseFloat(document.userInput.zVal.value);  
	var valid = coloringCheck(document.userInput.field4.value.split(','), y);
	if(!valid){
		emptyContent('coloringz');
		
		document.getElementById('coloringz').appendChild(publicFragment);
	}else{
		intoColors(document.userInput.field4.value.split(','),'z',valid, 'coloringz');
	}
}