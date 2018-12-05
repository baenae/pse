//URL von der die Elemente als JSON geladen werden
const WEBSERVICE_DATA_URL = "https://www.baenae.de/pse/getElements.php";

//Array mit allen Elementen des Periodensystems
var chemElementList;
var chemElementMCList;
var shadowElements;

//
var canvas;
var stage;

//Die Applikation auf der gemalt wird
var app;

//Fuer die Schattenberechnung
const SHADOW_WEAKENER = 1 / 50;
const SHADOW_MAX_DISTANCE = 20;
const SHADOW_MIN_BLUR = 5;

//Groesse der Elemente
const ELEMENT_WIDTH = 50;
const ELEMENT_HEIGHT = 60;

//Positionierung der Elemente
const ELEMENT_POS_X = ELEMENT_WIDTH + 10;
const ELEMENT_POS_Y = ELEMENT_HEIGHT + 10;

var mouseX = 0;
var mouseY = 0;

function init(canvasID) 
{
	canvas = document.getElementById(canvasID);
	stage = new createjs.Stage(canvas);
	stage.autoClear = true;
	
	app = new createjs.Container();
	app.x = 70;
	app.y = 70;
	stage.addChild(app);
	
	loadPSE();
}

function loadPSE() 
{
	$.ajax(
	{
		url: WEBSERVICE_DATA_URL,
		success: function (data) 
		{
			chemElementList = JSON.parse(data);
			createElements();
		}
	});
}

function createElements()
{
	//Hier werden alle Elemente gespeichert, die einen Schatten bekommen sollen
	chemElementMCList = new Array();
	
	for (var i = 0; i < chemElementList.wert1.length; i++)
	{
		var chemElem = chemElementList.wert1[i];
					
		//Positionierung der Elemente
		var posX = (chemElem.gruppe - 1) * ELEMENT_POS_X;
		var posY = (chemElem.periode - 1) * ELEMENT_POS_Y;
			
		var elementMC = new ElementMC(chemElem);
		elementMC.setTransform(posX, posY);
		app.addChild(elementMC.getMC());
		chemElementMCList.push(elementMC)
	}
	
	window.onmousemove = handleMouseMove;
	
	createjs.Ticker.setFPS(50);
	createjs.Ticker.on("tick", tick);
}

function tick (event)
{
	for (var i = 0; i < chemElementMCList.length; i++)
	{
		var box = chemElementMCList[i];
		var color = chemElementMCList[i];
		var dimout = chemElementMCList[i];
		
		var lenA = (mouseX - box.x);
		var lenB = (mouseY - box.y);
		
		var distance = Math.sqrt(Math.pow(lenA, 2) + Math.pow(lenB, 2));
		
		var shadowX = (box.x - mouseX) * SHADOW_WEAKENER;
		var shadowY = (box.y - mouseY) * SHADOW_WEAKENER;

		var blur = Math.max(Math.abs(shadowX), Math.abs(shadowY));
		blur = Math.max(blur, SHADOW_MIN_BLUR);
		blur = Math.min(blur, 5);
		
		dimout.alpha = distance / 1000;
		
		color.shadow = new createjs.Shadow("#000000", shadowX, shadowY, blur);
	}

	stage.update();
}

function handleMouseMove(event)
{
    mouseX = event.clientX;
    mouseY = event.clientY;	
}