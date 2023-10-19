import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PreventDragClick } from './PreventDragClick';
import createRack from './createRackModule';
import createLoading from "./createLoading";
import Rack from "./Rack";

export default class App {

	/**
	 * @constructor
	 * @param {int} width - 바닥 width
	 * @param {int} Length - 바닥 Length
	 * @param {number} rectangleWidth - 빨간판 width
	 * @param {number} rectangleHeight - 빨간판 height
	 * @param {Array} 메쉬배열 - 메쉬배열을 담을 배열
	 * @returns {number} width + length
	 */
	constructor(width, length, rectangleWidth = 1, rectangleHeight = 1, 메쉬배열) {
		// 변수
		this.meshes = 메쉬배열
		this.mousedownHandler = this.mousedownHandler.bind(this);
		this.mouseUpHandler = this.mouseUpHandler.bind(this);
		

		const divContainer = document.querySelector('#webgl-container');
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true }); // 계단 현상 없이 부드럽게
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene(); // scene 객체
		this._scene = scene;
		// scene.background = new THREE.Color(0xbdffc0); // 초록
		scene.background = new THREE.Color(0xffffff);
		// scene.background = new THREE.Color(0x71a379);

		this.width = width;
		this.length = length;
		this.cellSize = 1; // 각 격자 칸의 크기를 클래스 멤버로 정의
		this.rectangleWidth = rectangleWidth;
		this.rectangleHeight = rectangleHeight;


		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls();
		this.setupMouseEvents();
		// _로 시작하는 이유 app 클래스 내부에서만 호출

		this.preventDragClick = new PreventDragClick(this._divContainer);

		window.addEventListener("resize", this.resize.bind(this));
		this.resize();

		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.raycaster.selectedMesh = null;

		localStorage.setItem("rack_width", 1)
		localStorage.setItem("rack_length", 1)
		localStorage.setItem("rack_floor", 1)
		requestAnimationFrame(this.render.bind(this));
	}

	_setupControls() {
		const controls = new OrbitControls(this._camera, this._divContainer);
		controls.addEventListener('change', () => {
			// 카메라가 변경될 때마다 호출되는 함수
			// 이곳에서 raycaster의 설정 및 계산을 수행하는 곳
		})
	}

	_setupCamera() {
		// three.js가 3차원 그래픽을 출력할 영역의 가로, 세로 크기를 가져오기
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		// 카메라 객체 생성
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

		camera.position.y = 10;
		camera.position.z = 10;
		camera.name = "카메라";
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		light.name = "DirectionalLight"
		this._scene.add(light);
	}

	// 파란색 정육면체 mesh 생성
	_setupModel() {
		this._createBoard();
	}

	_createBoard() {
		// 창고 3d
		this._warehouse = new THREE.Object3D();

		const cellSize = this.cellSize; // 각 격자 칸의 크기
		const numCellsX = this.width; // 가로 방향 격자 수
		const numCellsY = this.length; // 세로 방향 격자 수
		const planeGeometry = new THREE.PlaneGeometry(
			cellSize * numCellsX,
			cellSize * numCellsY,
			numCellsX,
			numCellsY
		);
		const wareHouseMaterial = new THREE.MeshPhongMaterial({
			color: 0xff0000,
			emissive: 0x888888,
			flatShading: true,
			side: THREE.DoubleSide,
			visible: false,
		});

		const baseGroup = new THREE.Group();
		const wareHouseMesh = new THREE.Mesh(planeGeometry, wareHouseMaterial);
		// 노란색 라인 생성
		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xa0a0a0 });
		const line = new THREE.LineSegments(
			// WireframeGeometry : 모델의 외각선 표시
			new THREE.WireframeGeometry(planeGeometry),
			lineMaterial
		);

		// 바닥 이름 설정
		wareHouseMesh.name = "ground";
		// 바닥을 baseGroup에 추가
		wareHouseMesh.rotation.x = THREE.MathUtils.degToRad(-90);
		baseGroup.add(wareHouseMesh);
		this.groundBound = new THREE.Box3().setFromObject(wareHouseMesh);

		// 선 이름 설정
		line.name = "선"
		// baseGroup.add(line);
		// 선을 씬에 추가
		this._scene.add(line);

		// 판 돌리기
		line.rotation.x = -Math.PI / 2; // 90도

		// const mesh = wareHouse;
		// mesh.position.set(0, 0, 0);

		// this._warehouse에 group1을 추가
		this._warehouse.add(baseGroup);

		// this._scene에 this._warehouse를 추가
		this._scene.add(this._warehouse);

		// this._warehouse = wareHouse;

		this.rectangleMesh = null;
		this.groundBoundPos = {
			minX : Math.round(this.groundBound.min.x*10)/10,
			maxX : Math.round(this.groundBound.max.x*10)/10,
			minZ : Math.round(this.groundBound.min.z*10)/10,
			maxZ : Math.round(this.groundBound.max.z*10)/10
		}
	}

	setupMouseEvents(rectangleWidth = 1, rectangleHeight = 1, rackFloor = 1, ) {
		this.rectangleWidth = rectangleWidth
		this.rectangleHeight = rectangleHeight
		this.rackFloor = rackFloor
		

		let isCreateRack = false

		let newPosX;
		let newPosZ;
		let newPosY;

		this._divContainer.addEventListener("mousemove", (event) => {
			const rect = this._divContainer.getBoundingClientRect();
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.raycaster.setFromCamera(this.mouse, this._camera);

			const intersects = this.raycaster.intersectObject(this._warehouse);

			// raycaster에 맞은 객체가 있다면, 
			if (intersects.length > 0) {
				const intersection = intersects[0];
				// rectangleMesh가 없으면 -> 객체를 생성
				if (!this.rectangleMesh) {
					const rectangleMaterial = new THREE.MeshPhongMaterial({
						emissive: 0xff0000,
						flatShading: true,
						side: THREE.DoubleSide,
					});
					const rectangleGeometry = new THREE.PlaneGeometry(
						rectangleWidth,
						rectangleHeight, // 직사각형의 가로와 세로 크기를 사용
						1
					);
					this.rectangleMesh = new THREE.Mesh(
						rectangleGeometry,
						rectangleMaterial
					);
					this.rectangleMesh.rotation.x = THREE.MathUtils.degToRad(-90);
					this.rectangleMesh.name = "빨간 판";
					this._scene.add(this.rectangleMesh);
				}
				else {
					// 이미 직사각형 객체가 존재한다면 크기만 업데이트
					isCreateRack = true
					this.rectangleMesh.geometry.dispose(); // 기존 geometry 메모리 해제
					const updatedRectangleGeometry = new THREE.PlaneGeometry(
						rectangleWidth,
						rectangleHeight
					);
					this.rectangleMesh.geometry = updatedRectangleGeometry;
				}// else문 끝

				/** 계산된 intersection.point를 격자 칸에 맞게 조정*/
				const cellX = Math.floor(
					(intersection.point.x + this.width / 2) / this.cellSize
				);
				// console.warn("pointer", intersection.point.x );
				const cellY = Math.floor(
					(intersection.point.z + this.length / 2) / this.cellSize
				);



				// 정확한 X, Y 위치 계산 (직사각형의 중심이 칸의 중심과 일치하도록)
				if (rectangleWidth % 2 === 0 && rectangleHeight % 2 === 1) {
					newPosX =
						cellX * this.cellSize - this.width / 2 + this.cellSize / 2 + 0.5;
					newPosY = 0.001; // 판 위에 놓이도록 약간 위로 띄움
					newPosZ = cellY * this.cellSize - this.length / 2 + this.cellSize / 2;
				} else if (rectangleWidth % 2 === 0 && rectangleHeight % 2 === 0) {
					newPosX =
						cellX * this.cellSize - this.width / 2 + this.cellSize / 2 + 0.5;
					newPosY = 0.001; // 판 위에 놓이도록 약간 위로 띄움
					newPosZ =
						cellY * this.cellSize - this.length / 2 + this.cellSize / 2 + 0.5;
				} else if (rectangleWidth % 2 === 1 && rectangleHeight % 2 === 0) {
					newPosX = cellX * this.cellSize - this.width / 2 + this.cellSize / 2;
					newPosY = 0.001; // 판 위에 놓이도록 약간 위로 띄움
					newPosZ =
						cellY * this.cellSize - this.length / 2 + this.cellSize / 2 + 0.5;
				} else {
					newPosX = cellX * this.cellSize - this.width / 2 + this.cellSize / 2;
					newPosY = 0.001; // 판 위에 놓이도록 약간 위로 띄움
					newPosZ = cellY * this.cellSize - this.length / 2 + this.cellSize / 2;
				}

				// 현재 위치로부터 새로운 위치까지 직접 이동 (초기화)
				if (this.rectangleMesh) {
					this.rectangleMesh.position.x = newPosX;
					this.rectangleMesh.position.z = newPosZ;
					this.rectangleMesh.position.y = newPosY;
				}

				


				// this.rectangleMesh.position.x = intersection.point.x;
				// this.rectangleMesh.position.z = intersection.point.z;
				// this.rectangleMesh.position.y = 0.001; // 판 위에 띄우려면 적절한 Y 위치를 설정 

				this.rectangleMesh.visible = true;

			} else { // raycaster에 맞은 객체가 없을 때
				if (this.rectangleMesh) {
					// rectangleMesh를 보이지 않게 설정
					this.rectangleMesh.visible = false;
				}
				return;
			}

		}); // mousemove 끝

		// 마우스가 mouseout 했을 때
		this._divContainer.addEventListener("mouseout", () => {
			if (this.rectangleMesh) {
				this.rectangleMesh.visible = false;
			}
		});

		// 마우스가 클릭 했을 때
		this._divContainer.addEventListener("click", (event) => {
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			this.raycaster.setFromCamera(this.mouse, this._camera);

			const intersects = this.raycaster.intersectObject(this._warehouse);

			if (intersects.length > 0) {
				const intersection = intersects[0];

				// 계산된 intersection.point를 격자 칸에 맞게 조정
				const cellX = Math.floor(
					(intersection.point.x + this.width / 2) / this.cellSize
				);
				const cellY = Math.floor(
					(intersection.point.z + this.length / 2) / this.cellSize
				);

			}
			
		});

		
		this._divContainer.removeEventListener('click', () => this.addShelf());

		this._divContainer.removeEventListener('mousedown', this.mousedownHandler);
		this._divContainer.removeEventListener('mouseup', this.addShelf);

		this._divContainer.addEventListener('mousedown', this.mousedownHandler) 
		this._divContainer.addEventListener('mouseup', this.mouseUpHandler)
	}

	mousedownHandler(e) {
		if(e.button == 0) { // 왼쪽 클릭 했을 때
			this.preventDragClick.mouseDownFunc(e);
		} else if (e.button == 2) { // 우클릭 
			this.raycaster.setFromCamera(this.mouse, this._camera);
			const intersects = this.raycaster.intersectObjects(this._scene.children, true);

			if(intersects.length > 0) {
				const intersection = intersects[0];
				if(intersection.object.name == "ground" || intersection.object.name == "선") return;

				if(intersection.object.parent && intersection.object.parent.parent) {
					
					this.raycaster.selectedMesh = intersection.object.parent.parent
					// scene에서 제거
					if(this.raycaster.selectedMesh) {
						this._scene.remove(this.raycaster.selectedMesh)
					}
					// this.meshes 배열에서도 해당 객체 제거
					const index = this.meshes.indexOf(this.raycaster.selectedMesh);
					if(index !== -1) {
						this.meshes.splice(index, 1);
					}
					// const index = this.meshes.indexOf({
						// 	x: this.rectangleMesh.position.x,
						// 	y: 0.2,
						// 	z: this.rectangleMesh.position.z
						// });

					// Mesh를 자원을 해제
					if(this.raycaster.selectedMesh instanceof THREE.Group) {
						// this.raycaster.selectedMesh가 Group일 때
						this.raycaster.selectedMesh.traverse(child => {
							if(child instanceof THREE.Mesh) {
								// 자식이  Mesh인 경우 geometry를 dispose
								child.geometry.dispose();
								child.material.dispose();
							}
						})
					}
				}
			}
		}
	}

	mouseUpHandler(e) {
		if (e.button == 0) { // 왼쪽 클릭 뗌
			let 클릭됨 = this.preventDragClick.mouseUpFunc(e);
			if (!클릭됨) {
				this.raycaster.setFromCamera(this.mouse, this._camera);
				const intersects = this.raycaster.intersectObject(this._warehouse);

				// raycaster가 창고 밖에면 
				if (intersects.length <= 0) {
					return
				}
				this.addShelf();
				// this.addLoading();

			}
		} // if문 끝

		else if (e.button == 2) { // 우클릭
		}
	}

	// 모든 메쉬 삭제
	deleteAllMesh() {
		if(this._scene != null) {
			this._scene = null;
		} else {
		}
	}

	addShelf() {
		// 선반 만들기
		if(this.rectangleMesh) {
			let rackPos = {
				x: this.rectangleMesh.position.x,
				y: 0.2,
				z: this.rectangleMesh.position.z
			}
			let rackWidth = localStorage.getItem("rack_width") == null || localStorage.getItem == undefined ?  1 : localStorage.getItem("rack_width");
			let rackLength = localStorage.getItem("rack_length") == null || localStorage.getItem == undefined ?  1 : localStorage.getItem("rack_length");
			let rackFloor = localStorage.getItem("rack_floor") == null || localStorage.getItem == undefined ?  1 : localStorage.getItem("rack_floor");

			// let rackGroup = createRack(this.rectangleWidth, this.rectangleHeight, this.rackFloor, rackPos)
			let rackGroup = createRack(rackWidth, rackLength, rackFloor, rackPos)
			rackGroup.name = localStorage.getItem("rack_name") == undefined || localStorage.getItem("rack_name") == null ? "" : localStorage.getItem("rack_name");
			rackGroup.userData.rackWidth = rackWidth;
			rackGroup.userData.rackLength = rackLength;
			rackGroup.userData.rackFloor = rackFloor;

			let mesh = new THREE.Box3().setFromObject(rackGroup)

			let aa = {
				minX : Math.round(mesh.min.x*10)/10,
				maxX : Math.round(mesh.max.x*10)/10,
				minZ : Math.round(mesh.min.z*10)/10,
				maxZ : Math.round(mesh.max.z*10)/10
			}

			if(aa.minX < this.groundBoundPos.minX) {
				return;
			}
			if(aa.maxX > this.groundBoundPos.maxX) {
				return;
			}
			if(aa.minZ < this.groundBoundPos.minZ) {
				return;
			}
			if( aa.maxZ > this.groundBoundPos.maxZ) {
				return;
			}
			
			// this.meshes.push(rackGroup);
			// this.meshes.push({
			// 	rackpos: rackPos,
			// });
			this.meshes.push(rackGroup);
			this._scene.add(rackGroup);
		} else {
		}
	}

	addLoading() {
		// this.raycaster.
		let pos = {
			x: this.rectangleMesh.position.x,
			y: this.rectangleMesh.position.y,
			z: this.rectangleMesh.position.z
		}

		let loading = createLoading(pos, 0.7)
		this._scene.add(loading);
	}


	// 창의 크기가 변경될때 발생하는 이벤트
	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	// time : 렌더링이 처음 시작된 이후 경과된 시간(ms 단위)
	// time은 requestAnimationFrame 함수가 render함수에 전달해준 값이다
	render(time) {
		// 랜더링 시에 scene을 카메라의 시점으로 렌더링하도록 만드는 장치
		this._renderer.render(this._scene, this._camera);
		// 속성값을 변경시켜 애니메이션 효과를 만드는 장치
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; // 알아보기 쉽게 ms단위를 초단위로 변경
	}


}