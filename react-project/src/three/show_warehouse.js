import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import createRack from './createRackModule';
import createItem from './createItem'
import { PreventDragClick } from './PreventDragClick';

export default class App {
    constructor(warehouseWidth, warehouseLength, racks, items) {

        // 변수
        this.meshes = []


        const divContainer = document.querySelector("#waredetail-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true }); // 계단 현상 없이 부드럽게
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene(); // scene 객체
        this._scene = scene;
        scene.background = new THREE.Color(0xffffff);
        // scene.background = new THREE.Color(0x71a379);

        this.cellSize = 1; // 각 격자 칸의 크기를 클래스 멤버로 정의
        this.width = warehouseWidth;
        this.length = warehouseLength;
        this.racks = racks
        this.items = items
        

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        // this.setupMouseEvents();
        // _로 시작하는 이유 app 클래스 내부에서만 호출

        // console.log("rackX",this.rackX);

        this.preventDragClick = new PreventDragClick(this._divContainer);

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.raycaster.selectedMesh = null;

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
        for( const rack of this.racks){
            this.addShelf(rack);
        }
        // for( const item of this.items){
        //     this.addItem(item);
        // }
        this.addItem(this.items)
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

        const group1 = new THREE.Group();
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
        // 바닥을 group1에 추가
        wareHouseMesh.rotation.x = THREE.MathUtils.degToRad(-90);
        group1.add(wareHouseMesh);
        this.groundBound = new THREE.Box3().setFromObject(wareHouseMesh);

        // 선 이름 설정
        line.name = "선"
        // group1.add(line);
        // 선을 씬에 추가
        this._scene.add(line);

        // 판 돌리기
        line.rotation.x = -Math.PI / 2; // 90도

        // const mesh = wareHouse;
        // mesh.position.set(0, 0, 0);

        // this._warehouse에 group1을 추가
        this._warehouse.add(group1);

        // this._scene에 this._warehouse를 추가
        this._scene.add(this._warehouse);

        // this._warehouse = wareHouse;

        this.rectangleMesh = null;
        this.groundBoundPos = {
            minX: Math.round(this.groundBound.min.x * 10) / 10,
            maxX: Math.round(this.groundBound.max.x * 10) / 10,
            minZ: Math.round(this.groundBound.min.z * 10) / 10,
            maxZ: Math.round(this.groundBound.max.z * 10) / 10
        }

        // this.addShelf();
        // console.log(this.groundBoundPos);
    }

    addShelf(rack) {
        // 선반 만들기
        // console.log(this.rackX);
        // console.log(this.rackZ);

        let rackPos = {
            // x: this.rackX.position.x,
            x: rack.rackX,
            y: 0.2,
            // z: this.rackZ.position.z
            z: rack.rackZ
        }
        console.log("현재 선반의 층수는?", rack.rackFloor)

        // Rack 생성부분 - createRack 호출
        let rackGroup = createRack(rack.rackWidth, rack.rackLength, rack.rackFloor, rackPos)
        let mesh = new THREE.Box3().setFromObject(rackGroup)

        let aa = {
            minX: Math.round(mesh.min.x * 10) / 10,
            maxX: Math.round(mesh.max.x * 10) / 10,
            minZ: Math.round(mesh.min.z * 10) / 10,
            maxZ: Math.round(mesh.max.z * 10) / 10
        }
        // console.log("바닥", this.groundBoundPos);
        // console.log("선반", aa);

        if (aa.minX < this.groundBoundPos.minX) {
            console.log(`선반의 x 값이 더 작아! 선반 : ${aa.minX}, 바닥 : ${this.groundBoundPos.minX}`)
            return;
        }
        if (aa.maxX > this.groundBoundPos.maxX) {
            console.log("선반의 x 값이 더 커!")
            return;
        }
        if (aa.minZ < this.groundBoundPos.minZ) {
            console.log("선반의 z 값이 더 작아!")
            return;
        }
        if (aa.maxZ > this.groundBoundPos.maxZ) {
            console.log("선반의 z 값이 더 커!!")
            return;
        }
        // this.meshes.push(rackGroup);
        rackGroup.name = "선반인데요"
        this._scene.add(rackGroup);
        // console.log("addShelf", this.meshes)

        // console.log(`rackGroup의 위치 : ${JSON.stringify(rackGroup.position)}`)
    }

    addItem(item) {

        let itemPos = {
            // x: this.rackX.position.x,
            x: item.itemX,
            y: 0.2,
            // z: this.rackZ.position.z
            z: item.itemZ
        }

        // Rack 생성부분 - createRack 호출
        let itemGroup = createItem(item.itemWidth, item.itemLength, 3, itemPos)
        let mesh = new THREE.Box3().setFromObject(itemGroup)

        let aa = {
            minX: Math.round(mesh.min.x * 10) / 10,
            maxX: Math.round(mesh.max.x * 10) / 10,
            minZ: Math.round(mesh.min.z * 10) / 10,
            maxZ: Math.round(mesh.max.z * 10) / 10
        }
        // console.log("바닥", this.groundBoundPos);
        // console.log("선반", aa);

        if (aa.minX < this.groundBoundPos.minX) {
            console.log(`선반의 x 값이 더 작아! 선반 : ${aa.minX}, 바닥 : ${this.groundBoundPos.minX}`)
            return;
        }
        if (aa.maxX > this.groundBoundPos.maxX) {
            console.log("선반의 x 값이 더 커!")
            return;
        }
        if (aa.minZ < this.groundBoundPos.minZ) {
            console.log("선반의 z 값이 더 작아!")
            return;
        }
        if (aa.maxZ > this.groundBoundPos.maxZ) {
            console.log("선반의 z 값이 더 커!!")
            return;
        }
        // this.meshes.push(rackGroup);
        // rackGroup.name = "선반인데요"
        this._scene.add(itemGroup);
        // console.log("addShelf", this.meshes)

        // console.log(`rackGroup의 위치 : ${JSON.stringify(rackGroup.position)}`)
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