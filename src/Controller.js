import * as PIXI from 'pixi.js'

export class Controller {
	constructor() {
		this.app = null;
		this.pseData = '';
		this.chemElementMCList = new Array();
		this.loadPSEData();
	}

	/**
	 * Callbackfunktion, wenn die Sprachen geladen wurden
	 * @param Labels
	 */
	loadPSEData() {
		let request = new XMLHttpRequest();
		request.open('GET', 'https://www.baenae.de/pse/getElements.php', true);

		const controllerInstance = this;
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				// Success!
				controllerInstance.pseData = JSON.parse(this.response);
				controllerInstance.buildPixi();
			} else {
				console.error("PSE Data not found http-status[" + this.status + "]");
			}
		};

		request.onerror = function() {
			console.error("PSE Data loading failure http-status[" + this.status + "]");
		};

		request.send();
	}

	buildPixi() {
		let type = "WebGL"
		if (!PIXI.utils.isWebGLSupported()) {
			type = "canvas"
		}

		PIXI.utils.sayHello(type);
		console.log("this " + this);
		//Create a Pixi Application
		this.app = new PIXI.Application({
			autoResize: true,
			resolution: devicePixelRatio
		});

		//Add the canvas that Pixi automatically created for you to the HTML document
		document.body.appendChild(this.app.view);

		this.app.renderer.view.style.position = "absolute";
		this.app.renderer.view.style.display = "block";
		this.app.renderer.autoResize = true;
		this.app.renderer.resize(window.innerWidth, window.innerHeight);

		window.addEventListener('resize', () => {
			this.app.renderer.resize(window.innerWidth, window.innerHeight);
		});

		let self = this;

// // Load them google fonts before starting...!
		window.WebFontConfig = {
			google: {
				families: ['Open Sans'],
			},

			active() {
				self.go2();
			},
		};

		/* eslint-disable */
// include the web-font loader script
		(function () {
			const wf = document.createElement('script');
			wf.src = `${ document.location.protocol === 'https:' ? 'https' : 'http'
			}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
			wf.type = 'text/javascript';
			wf.async = 'true';
			const s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(wf, s);
		}());
		/* eslint-enabled */
	}

	go2 () {

		this.createBackground();
		this.createSymbols();
	}

	createBackground() {
		this.app.loader
			.add(ASSETS_PATH_PREFIX + "img/bluebg.jpg")
			.load(setup);

		const self = this;
		function setup() {
			let bgsprite = new PIXI.Sprite(
				self.app.loader.resources[ASSETS_PATH_PREFIX + "img/bluebg.jpg"].texture
			);

			self.app.stage.addChildAt(bgsprite, 0);
		}
	}

	createSymbols () {
		for (var i = 0; i < this.pseData.wert1.length; i++)
		{
			var chemElem = this.pseData.wert1[i];
console.log(chemElem);
			//Positionierung der Elemente
			var posX = (chemElem.gruppe - 1) * 100;
			var posY = (chemElem.periode - 1) * 150;

			const textSample = new PIXI.Text(chemElem.symbol, {
				fontFamily: 'Open Sans',
				fontWeight: 'Bold',
				fontSize: 50,
				fill: 'white',
				align: 'left',
			});
			textSample.position.set(posX, posY);

			this.app.stage.addChild(textSample);
			/*


			var elementMC = new sprite(chemElem);
			elementMC.setTransform(posX, posY);
			this.app.addChild(elementMC.getMC());
			this.chemElementMCList.push(elementMC)

			 */
		}
	}


	createSymbol (element) {

	}
}
