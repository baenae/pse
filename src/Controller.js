import * as PIXI from 'pixi.js'
import { Container } from '@pixi/display';
import { DisplayElement } from '@/DisplayElement';

export class Controller {
	constructor() {
		this.app = null;
		this.pseData = '';

		this.chemElementPane = null;
		this.chemElementList = new Array();
		this.loadPSEData();
	}

	/**
	 * Load the Elements-JSON File
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

	/**
	 * Baut das Pixi auf
	 */
	buildPixi() {
		let type = "WebGL"
		if (!PIXI.utils.isWebGLSupported()) {
			type = "canvas"
		}

		PIXI.utils.sayHello(type);

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

		//Auf Rezise reagieren
		window.addEventListener('resize', () => {
			this.app.renderer.resize(window.innerWidth, window.innerHeight);

			this.chemElementPane.scale.x = 1;
			this.chemElementPane.scale.y = 1;

			let scale = Math.min (1, (window.innerWidth / (this.chemElementPane.width + 100)), (window.innerHeight / (this.chemElementPane.height + 100)));

			this.chemElementPane.scale.x = scale;
			this.chemElementPane.scale.y = scale;

			this.chemElementPane.x = (window.innerWidth / 2) - (this.chemElementPane.width / 2);
			this.chemElementPane.y = (window.innerHeight / 2) - (this.chemElementPane.height / 2);
		});

		this.loadFonts();
	}

	loadFonts() {
		let self = this;

		// Load them google fonts before starting...!
		window.WebFontConfig = {
			google: {
				families: ['Open Sans'],
			},

			active() {
				self.loadFontsSuccess();
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

	loadFontsSuccess () {
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
		this.chemElementPane = new Container();

		for (let elementData of this.pseData.wert1) {
			console.log(elementData);
			let element = new DisplayElement(elementData)

			this.chemElementList.push(element);

			this.chemElementPane.addChild(element.mc);
		}
		this.app.stage.addChild(this.chemElementPane);
		window.dispatchEvent(new Event('resize'));
	}
}
