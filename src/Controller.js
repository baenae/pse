import * as PIXI from 'pixi.js'
import { Container } from '@pixi/display';
import { DisplayElement } from '@/DisplayElement';
import { Shooter } from '@/Shooter';
import { TweenMax } from "gsap";
import * as PixiPlugin from "gsap/PixiPlugin";

export class Controller {
	constructor() {
		this.app = null;
		this.pseData = '';

		this.shooter = null;
		this.shooterStage = null;
		this.shots = new Array();

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
			resolution: devicePixelRatio,
			backgroundColor: 0x0a3659
		});

		this.app.stage.interactive = true;

		//Add the canvas that Pixi automatically created for you to the HTML document
		document.body.appendChild(this.app.view);

		this.app.renderer.view.style.position = "absolute";
		this.app.renderer.view.style.display = "block";
		this.app.renderer.autoResize = true;
		this.app.renderer.resize(window.innerWidth, window.innerHeight);

		this.app.stop();

		//Auf Rezise reagieren
		window.addEventListener('resize', () => {
			if (this.chemElementPane && this.shooterStage) {
				this.app.renderer.resize(window.innerWidth, window.innerHeight);
				this.app.stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);

				this.chemElementPane.scale.x = 1;
				this.chemElementPane.scale.y = 1;

				let scale = Math.min(1, (window.innerWidth / (this.chemElementPane.width + 100)), (window.innerHeight / (this.chemElementPane.height + 400)));

				this.chemElementPane.scale.set(scale);
				this.shooterStage.scale.set(scale)

				this.shooterStage.x = this.chemElementPane.x = (window.innerWidth / 2) - (this.chemElementPane.width / 2);
				this.chemElementPane.y = 25;
				this.shooterStage.y = 25 + 50 + (this.chemElementPane.height);
			}
		});

		self = this;

		this.app.loader
			.add('spritesheet', ASSETS_PATH_PREFIX + 'img/' + 'mc.json')
			.add(ASSETS_PATH_PREFIX + "img/trail.png").load()
			.load(() => {
				console.log("go futher");
				self.onAssetsLoaded();
			});


		// Listen for animate update
		this.app.ticker.add((delta) => {
			// Read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
			// When implementing this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
			const mouseposition = this.app.renderer.plugins.interaction.mouse.global;

			// Shooter Positionieren
			if (this.shooterStage) {
				let x = (mouseposition.x - this.shooterStage.x)  / this.shooterStage.scale.x;
				x = Math.max((Shooter.SHOOTER_SIZE / 2), x);
				x = Math.min((Shooter.BACKGROUND_WIDTH - (Shooter.SHOOTER_SIZE / 2)), x);
				this.shooter.x = x;
			}

			// Alle Schüsse bewegen
			for (const shotIndex in this.shots) {
				const shot = this.shots[shotIndex];
				shot.y -= 10;

				for (const elementIndex in this.chemElementList) {
					const element = this.chemElementList[elementIndex];

					// hit?
					if (Controller.testForAABB(shot, element.mc)) {
						// Remove shot
						this.shots.splice(shotIndex, 1);
						this.app.stage.removeChild(shot);


						// Hit Element, death?
						if (element.hit()) {
							//Remove Element
							this.explode (elementIndex);

							// Damage the surrounding elements
						} else {
							this.explodeAnimation(shot, true);
						}
					}
				}
			}
		});
	}

	onAssetsLoaded() {
		console.log("3");
		this.loadFonts();
	}

	explode (elementIndex) {
		const element = this.chemElementList[elementIndex];

		// To intersect the other elements
		element.mc.scale.set(element.mc.scale.x + 0.2);
		element.mc.x -= 20;
		element.mc.y -= 20;

		this.chemElementList.splice(elementIndex, 1);

		for (const surroundIndex in this.chemElementList) {
			const surroundElement = this.chemElementList[surroundIndex];

			// hit?
			if (Controller.testForAABB(element.mc, surroundElement.mc)) {
				if (surroundElement.hit()) {
					//Remove Element
					setTimeout(() => {
						this.explode(surroundIndex)
					}, 300);
				}
			}
		}

		this.explodeAnimation (element.mc);
		this.chemElementPane.removeChild(element.mc);
	}

	static testForAABB(object1, object2) {
		const bounds1 = object1.getBounds();
		const bounds2 = object2.getBounds();

		return bounds1.x < bounds2.x + bounds2.width
			&& bounds1.x + bounds1.width > bounds2.x
			&& bounds1.y < bounds2.y + bounds2.height
			&& bounds1.y + bounds1.height > bounds2.y;
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

	explodeAnimation(mc, small = false) {
		// create an array to store the textures
		const explosionTextures = [];
		let i;

		for (i = 0; i < 26; i++) {
			const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
			explosionTextures.push(texture);
		}

		// create an explosion AnimatedSprite
		const explosion = new PIXI.AnimatedSprite(explosionTextures);
		explosion.loop = false;



		explosion.anchor.set(0.5);
		explosion.rotation = Math.random() * Math.PI;

		explosion.gotoAndPlay(0);


		if (small) {
			explosion.x = mc.x + this.chemElementPane.x;
			explosion.y = mc.y + this.chemElementPane.y - 20;
			explosion.scale.set(0.3);
			this.app.stage.addChild(explosion);

			explosion.onComplete = () => {
				this.app.stage.removeChild(explosion);
			};
		} else {
			explosion.x = mc.x + DisplayElement.WIDTH / 2;
			explosion.y = mc.y + DisplayElement.HEIGHT / 2;
			explosion.scale.set(3);
			this.chemElementPane.addChild(explosion);

			explosion.onComplete = () => {
				this.chemElementPane.removeChild(explosion);
			};
		}

	}


	loadFontsSuccess () {
		console.log("loadFontsSuccess");
		//this.createBackground();
		this.createSymbols();
		this.createShooter();

		this.app.start();
		window.dispatchEvent(new Event('resize'));
	}


	createShooter () {
		let shooterContainer = new Shooter();
		this.shooter = shooterContainer.shooter;
		this.shooterStage = shooterContainer.mc

		this.app.stage.addChild(this.shooterStage);

		// setup events for mouse + touch using
		// the pointer events
		this.app.stage.on('pointerdown', down)

		const self = this;
		function down(event) {
			self.shooter.width = self.shooter.height = 50;
			TweenMax.to(self.shooter, 0.3, { width: 100, height: 100 });

			self.createShot();
		}
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
			//console.log(elementData);
			let element = new DisplayElement(elementData)
			this.chemElementList.push(element);
			this.chemElementPane.addChild(element.mc);
		}

		this.app.stage.addChild(this.chemElementPane);
	}


	createShot() {
		const mc = new PIXI.Sprite(
			this.app.loader.resources[ASSETS_PATH_PREFIX + "img/trail.png"].texture
		);

		this.app.stage.addChild(mc);
		this.shots.push(mc);

		mc.x = this.shooter.x * this.shooterStage.scale.x + this.shooterStage.x;
		mc.y = this.shooter.y * this.shooterStage.scale.y + this.shooterStage.y - 50;

		return mc;
	}
}
