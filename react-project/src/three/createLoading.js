import * as THREE from 'three';

/**
 * @param {object} pos - x,y,z를 가지고 있는 객체
 * @param {float} size - 정사각형-> 한변의 길이
 */
export default function createLoading(pos, size = 0.7) {
	const loadingGeo = new THREE.BoxGeometry(size, size, size);
	const loadingMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
	const mesh = new THREE.Mesh(loadingGeo, loadingMaterial);
	mesh.position.set(
		pos.x,
		pos.y + mesh.scale.y/2,
		pos.z
	)
	console.log(mesh.position);
	return mesh
}