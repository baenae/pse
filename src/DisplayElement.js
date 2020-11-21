import * as PIXI from 'pixi.js'
import { Container } from '@pixi/display';
import { TweenMax } from "gsap";

export class DisplayElement {
	static get WIDTH() { return 240; };
	static get HEIGHT() { return 320; };
	static get LIVE_COLOR() { return [0xd4edff, 0x85bed9 ,0x4f8aa6, 0x0f5173, 0x0a3659] }

	constructor(data) {
		this.elementData = data;
		this._mc = new Container();
		this.background = null;

		this._orgPosX = 0;
		this._orgPosY = 0;

		// Count until Death
		this.lives = 4;

		this.init();
	}

	init () {
		this.drawBackground();

		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xFFFFFF);
		graphics.drawRect(0, 0, DisplayElement.WIDTH, 4);
		graphics.drawRect(0, 0, 4, DisplayElement.HEIGHT);
		graphics.drawRect(0, DisplayElement.HEIGHT - 4, DisplayElement.WIDTH, 4);
		graphics.drawRect(DisplayElement.WIDTH - 4, 0, 4, DisplayElement.HEIGHT);
		graphics.endFill();

		this._mc.addChild(graphics);

		const atomicNumber = new PIXI.Text(this.elementData.ordnungszahl, {
			fontFamily: 'Open Sans',
			fontWeight: '900',
			fontSize: 28,
			fill: 'white',
			align: 'left',
		});
		atomicNumber.position.set(24, 20);
		this._mc.addChild(atomicNumber);

		const name = new PIXI.Text(this.elementData.name_englisch, {
			fontFamily: 'Open Sans',
			fontWeight: '400',
			fontSize: 28,
			fill: 'white',
			align: 'left'
		});
		name.anchor.set(0.5, 0.5);
		name.position.set(120, 206);
		this._mc.addChild(name);

		const symbol = new PIXI.Text(this.elementData.symbol, {
			fontFamily: 'Open Sans',
			fontWeight: '900',
			fontSize: 90,
			fill: 'white',
			align: 'center'
		});
		symbol.anchor.set(0.5, 0.5);
		symbol.position.set(120, 130);
		this._mc.addChild(symbol);

		const atomicWeight = new PIXI.Text(this.elementData.masse, {
			fontFamily: 'Open Sans',
			fontWeight: '900',
			fontSize: 28,
			fill: 'white',
			align: 'left',
		});
		atomicWeight.position.set(24, 264);

		this._orgPosX = (this.elementData.gruppe - 1) * DisplayElement.WIDTH;
		this._orgPosY = (this.elementData.periode - 1) * DisplayElement.HEIGHT;

		this._mc.alpha = 0;
		this._mc.x = this._orgPosX - 30;
		this._mc.y = this._orgPosY -30;
		this._mc.width = DisplayElement.WIDTH * 1.2;
		this._mc.height = DisplayElement.HEIGHT * 1.2;

		this._mc.cacheAsBitmap = true;
		this._mc.addChild(atomicWeight);
	}

	animateStart (delay) {
		TweenMax.to(this._mc, 0.2, {
			x: this._orgPosX,
			y: this._orgPosY,
			width: DisplayElement.WIDTH,
			height: DisplayElement.HEIGHT,
			alpha: 1,
			delay: delay,
		});
	}

	get mc() {
		return this._mc;
	}

	hit () {
		if (this.lives >= 0) {
			this._mc.cacheAsBitmap = false;
			this.lives--;
			this.drawBackground();

			if (this.lives < 0) {
				return true;
			} else {
				TweenMax.to(this._mc, 0.1, {x: "+=10", yoyo: true, repeat: 2});
				TweenMax.to(this._mc, 0.1, {x: "-=10", y: "-=10", yoyo: true, repeat: 2});
			}
		}
		return false;
	}

	drawBackground () {
		if (!this.background) {
			this.background = new PIXI.Graphics();
			this._mc.addChildAt(this.background, 0);
		}
		this.background.clear();
		this.background.beginFill(DisplayElement.LIVE_COLOR[this.lives]);
		this.background.drawRect(0, 0, DisplayElement.WIDTH, DisplayElement.HEIGHT);
		this.background.endFill();
	}
}
