export class PreventDragClick {
	constructor(canvas) {
		this.canvas = canvas
		this.mouseMoved = false; // 마우스를 드래그 했는지 true/ false
		this.clickStartX=0;
		this.clickStartY=0;
		this.clickStartTime=0;
	}

	mouseDownFunc(e) {
		this.clickStartX = e.clientX;
		this.clickStartY = e.clientY;
		this.clickStartTime = Date.now();
	}

	mouseUpFunc(e) {
		const xGap = Math.abs(e.clientX - this.clickStartX);
		const yGap = Math.abs(e.clientY - this.clickStartY); 
		// console.log(xGap, yGap)
		const timeGap = Date.now() - this.clickStartTime;

		if( xGap > 3 || yGap > 3 || timeGap > 1000) {
			this.mouseMoved = true;
			return true;
		}
		else {
			this.mouseMoved = false;
			return false;
		}
	}
}