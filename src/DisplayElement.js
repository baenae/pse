(function (window)
{
    function ElementMC(data)
    {
		//Allgemeiner Container
        this.container = new createjs.Container();
		
		//Hintergrundbild
        this.background = new createjs.Bitmap('images/element_bg.jpg');
        this.container.addChild(this.background);
		
		this.drawSymbol(data.symbol);
		
		this.container.scaleX = this.container.scaleY = 4;
    }
    window.ElementMC = ElementMC;
	
	/**
	 * Positionierung des Elementes ohne getMC aufrufen zu muessen
	 * @param posX
	 * @praram posY
	 */
	ElementMC.prototype.setTransform = function (posX, posY) 
	{
		this.container.setTransform(posX, posY, 0.3, 0.3);
	}
	
	/**
	 * Gibt eine Referenz auf den Container wieder
	 * @return Container
	 */
	ElementMC.prototype.getMC = function () 
	{
		return this.container;
	}
	
	/**
	 * Malt das Chemische Symbol
	 * @param symbol
	 */
	ElementMC.prototype.drawSymbol = function (symbol) 
	{
		var text = new createjs.Text(symbol, "bold 72px Arial", "#000000");
		text.x = 20;
		text.y = 30;
		this.container.addChild(text);
	}
	
	/**
	 * malt den schatten
	 */
	ElementMC.prototype.drawXXX = function (symbol) 
	{
		var color = new createjs.Shape();
		color.graphics.f("yellow").dr(0, 0, ELEMENT_WIDTH, ELEMENT_HEIGHT);
		this.container.addChild(color);
	}
		
	/**
	 * malt den schatten
	 */
	ElementMC.prototype.drawShadow = function (symbol) 
	{
		var dimout = new createjs.Shape();
		dimout.graphics.f("black").dr(0, 0, ELEMENT_WIDTH, ELEMENT_HEIGHT);
		this.container.addChild(dimout);
	}
}(window));