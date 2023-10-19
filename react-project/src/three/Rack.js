import * as THREE from 'three';

export default class Rack {
	// minX = null;
	// maxX = null;
	// minY = null;
	// maxY = null;
	// minZ = null;
	// maxZ = null;

	/**
	 * 
	 * @param {*} sizeX 
	 * @param {*} sizeZ 
	 * @param {*} rackFloor 
	 * @param {*} rackPos 
	 * @returns 
	 */
	constructor(sizeX, sizeZ, rackFloor, rackPos) {
		let rack = this.createRack(sizeX, sizeZ, rackFloor, rackPos);
		let box = new THREE.Box3().setFromObject(rack);

		this.minX = Math.round(box.min.x*10)/10
		// console.log(`this.min.X의 값은?(클래스 내부) - ${this.minX}`)
		this.maxX = Math.round(box.max.x*10)/10
		// console.log(`this.max.X의 값은?(클래스 내부) - ${this.maxX}`)
		this.minY = Math.round(box.min.y*10)/10
		this.maxY = Math.round(box.max.y*10)/10
		this.minZ = Math.round(box.min.z*10)/10
		this.maxZ = Math.round(box.max.z*10)/10
		console.log("rack 생성 완료")
		return rack
	}
	
	createRack(sizeX, sizeZ, rackFloor, rackPos) {
		const board = new THREE.BoxGeometry(sizeX, 0.02, sizeZ, 1, 1, 1);
		// const pilar = new THREE.BoxGeometry(0.05, sizeY, 0.05);
		// const board = new THREE.BoxGeometry(1, 0.02, 1, 1, 1, 1);
		const pilar = new THREE.BoxGeometry(0.05, 1, 0.05);
		// const material = new THREE.MeshBasicMaterial({color:0xffffff})
		const randomColor = new THREE.Color(
			Math.random(),
			Math.random(),
			Math.random()
		);

		const material = new THREE.MeshBasicMaterial({
			color:"#9b59b6",
			emissive: 0x000000,
			roughness: 1,
			metalness: 0,
			clearcoat: 1,
			clearcoatRoughness: 0,
			wireframe: false,
			flatShading: false
		})
		const boardMesh = new THREE.Mesh(board, material);

		const pilar1 = new THREE.Mesh(pilar, material);
		const pilar2 = new THREE.Mesh(pilar, material);
		const pilar3 = new THREE.Mesh(pilar, material);
		const pilar4 = new THREE.Mesh(pilar, material);

		// 수정 필요
		// boardMesh.position.set(rackPos.x, 0.2, rackPos.z);

		const boardBox = new THREE.Box3().setFromObject(boardMesh);
		const pilarBox = new THREE.Box3().setFromObject(pilar1);
		const pilarYLen = pilarBox.max.y - pilarBox.min.y;

		pilar1.position.set(boardBox.min.x, boardBox.max.y + pilarYLen/2 - pilarYLen * 0.2, boardBox.min.z);
		pilar2.position.set(boardBox.max.x, boardBox.max.y + pilarYLen/2 - pilarYLen * 0.2, boardBox.min.z);
		pilar3.position.set(boardBox.max.x, boardBox.max.y + pilarYLen/2 - pilarYLen * 0.2, boardBox.max.z);
		pilar4.position.set(boardBox.min.x, boardBox.max.y + pilarYLen/2 - pilarYLen * 0.2, boardBox.max.z);


		const rackUnitGroup = new THREE.Group();
		let rackComponentGroup = new THREE.Group();
		
		boardMesh.name = "판11111"
		rackComponentGroup.add(boardMesh, pilar1, pilar2, pilar3, pilar4);

		rackUnitGroup.add(rackComponentGroup);

		// 층 입력 받으면 층 수만큼 올리는 코드 작성하기!
		for(let i = 0; i < rackFloor - 1; i++){
			let rackFloorGroup =  rackComponentGroup.clone();
			rackFloorGroup.position.y += 1 //sizeY
			rackUnitGroup.add(rackFloorGroup);
			rackComponentGroup = rackFloorGroup.clone();
		}

		// 수정 필요
		rackUnitGroup.name = "선반"
		rackUnitGroup.position.set(rackPos.x, 0.2, rackPos.z)

		return rackUnitGroup;
	}

	getMinX() {
		console.log(`this.max.X의 값은?(클래스 getMin) - ${this.maxX}`)
		// return this.minX;
	}
}