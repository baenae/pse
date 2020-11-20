import * as PIXI from 'pixi.js'
import { Container } from '@pixi/display';
import { DisplayElement } from '@/DisplayElement';

export class Shooter {
	static get SHOOTER_SIZE() { return 100; };
	static get BACKGROUND_WIDTH() { return DisplayElement.WIDTH * 18; };

	constructor(data) {
		this._mc = new Container();
		this._shooter = new Container();
		this._background = new Container();

		this.initBackground();
		this.initShooter();
	}

	initShooter () {
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0xFFFFFF);
		graphics.drawRect(-(Shooter.SHOOTER_SIZE / 2), -(Shooter.SHOOTER_SIZE / 2), Shooter.SHOOTER_SIZE, Shooter.SHOOTER_SIZE);
		graphics.endFill();

		// enable the bunny to be interactive... this will allow it to respond to mouse and touch events
		this._shooter.interactive = true;

		// this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
		this._shooter.buttonMode = true;

		this._shooter.x = (Shooter.BACKGROUND_WIDTH / 2);
		this._shooter.y = (Shooter.SHOOTER_SIZE / 2);

		this._shooter.addChild(graphics);
		this._mc.addChild(this._shooter);
	}


	initBackground () {
		const graphics = new PIXI.Graphics();
		graphics.beginFill(0x0f5173, 0);
		graphics.drawRect(0, 0, Shooter.BACKGROUND_WIDTH, Shooter.SHOOTER_SIZE);
		graphics.endFill();

		this._background.addChild(graphics);
		this._mc.addChild(this._background);
	}

	get mc() {
		return this._mc;
	}

	get shooter() {
		return this._shooter;
	}
}
