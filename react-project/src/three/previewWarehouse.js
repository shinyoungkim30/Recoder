import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class App {
  constructor(width, length, rectangleWidth = 1, rectangleHeight = 1, index) {
    const divContainer = document.querySelector(`#webgl-container-${index}`);
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true }); // 계단 현상 없이 부드럽게
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene(); // scene 객체
    this._scene = scene;
    scene.background = new THREE.Color(0xffffff);

    this.width = width;
    this.length = length;
    this.cellSize = 1; // 각 격자 칸의 크기를 클래스 멤버로 정의
    this.rectangleWidth = rectangleWidth;
    this.rectangleHeight = rectangleHeight;

    this._setupCamera();
    this._setupLight();
    this._setupModel();
    this._setupControls();
    // _로 시작하는 이유 app 클래스 내부에서만 호출

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupControls() {
    new OrbitControls(this._camera, this._divContainer);
  }

  _setupCamera() {
    // three.js가 3차원 그래픽을 출력할 영역의 가로, 세로 크기를 가져오기
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    // 카메라 객체 생성
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);

    camera.position.y = 10;
    camera.position.z = 10;
    this._camera = camera;
  }

  _setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  // 파란색 정육면체 mesh 생성
  _setupModel() {
    this._createBoard();
  }

  _createBoard() {
    const wareHouse = new THREE.Object3D();

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

    group1.add(wareHouseMesh);
    group1.add(line);
    // 판 돌리기
    group1.rotation.x = -Math.PI / 2;

    wareHouse.add(group1);

    const mesh = wareHouse;
    mesh.position.set(0, 0, 0);

    this._scene.add(mesh);

    wareHouseMesh.name = "ground";

    this._warehouse = wareHouse;

    this.rectangleMesh = null;
  }

  setupMouseEvents(rectangleWidth, rectangleHeight) {
    this._divContainer.addEventListener("mousemove", (event) => {
      // // 수정해본 코드 *폐기*
      const rect = this._divContainer.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this._camera);

      // 원래 코드
      // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // this.raycaster.setFromCamera(this.mouse, this._camera);

      const intersects = this.raycaster.intersectObject(this._warehouse);

      if (intersects.length > 0) {
        const intersection = intersects[0];
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
          this._scene.add(this.rectangleMesh);
        } else {
          // 이미 직사각형 객체가 존재한다면 크기만 업데이트
          this.rectangleMesh.geometry.dispose(); // 기존 geometry 메모리 해제

          const updatedRectangleGeometry = new THREE.PlaneGeometry(
            rectangleWidth,
            rectangleHeight
          );

          this.rectangleMesh.geometry = updatedRectangleGeometry;
        }

        // 계산된 intersection.point를 격자 칸에 맞게 조정
        const cellX = Math.floor(
          (intersection.point.x + this.width / 2) / this.cellSize
        );
        // console.log("pointer", intersection.point.x);
        // console.log("cellX", cellX)
        const cellY = Math.floor(
          (intersection.point.z + this.length / 2) / this.cellSize
        );

        let newPosX;
        let newPosZ;
        let newPosY;

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

        this.rectangleMesh.visible = true;
      } else {
        if (this.rectangleMesh) {
          this.rectangleMesh.visible = false;
        }
      }
    });

    this._divContainer.addEventListener("mouseout", () => {
      if (this.rectangleMesh) {
        this.rectangleMesh.visible = false;
      }
    });

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

        console.log("Clicked at cell:", cellX, cellY+1);
      }
    });
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
