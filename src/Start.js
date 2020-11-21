import * as PIXI from 'pixi.js'
import { Container } from '@pixi/display';
import { DisplayElement } from '@/DisplayElement';

export class Start {
	static get WIDTH() { return 920; };
	static get HEIGHT() { return 560; };

	constructor(data) {
		this._mc = new Container();
		this._background = new Container();

		const bg = new PIXI.Graphics();
		bg.beginFill(0xd4edff);
		bg.drawRect(0, 0, Start.WIDTH, Start.HEIGHT);
		bg.endFill();

		this._mc.addChild(bg);

		const mc = new PIXI.Sprite(
			this.app.loader.resources[ASSETS_PATH_PREFIX + "img/trail.png"].texture
		);
	}

	get mc() {
		return this._mc;
	}
}
