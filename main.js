import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const startBtn = document.querySelector('.modal-start__start-btn')
const loadingScreen = document.querySelector('.modal-start__loading')
const modal = document.querySelector('.modal-start')
// const modalOver = document.querySelector('.modal-over')
// const playAgainBtn = document.querySelector('.modal-over__play-again-btn')

startBtn.addEventListener('click', () => {
  modal.style.display = 'none'
  animate()
})

const sizes = {
  width: innerWidth,
  height: innerHeight
}

const canvas = document.getElementById('canvas')
canvas.width = sizes.width
canvas.height = sizes.height

window.addEventListener('resize', () => {
  sizes.width = innerWidth
  sizes.height = innerHeight
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

})

const scene = new THREE.Scene()

let planeIsLoaded = false

const gltfLoader = new GLTFLoader()
let planeMixer = null
let plane = null
gltfLoader.load('public/models/Plane1/scene2.gltf', (gltf) => {
  plane = gltf.scene
  scene.add(plane)
  planeMixer = new THREE.AnimationMixer(plane)
  const action = planeMixer.clipAction(gltf.animations[1])
  action.play()
  planeIsLoaded = true
})

let sky = null
gltfLoader.load('public/models/Sky/scene.gltf', (gltf) => {
  sky = gltf.scene
  sky.scale.x = 20
  sky.scale.y = 20
  sky.scale.z = 20
  sky.position.z = -8
  scene.add(sky)
  if (planeIsLoaded) {
    startBtn.style.display = 'inline'
    loadingScreen.style.display = 'none'
  }
})


const coins = []

let planePosition = null

function renderCoin() {
  if (numberOfCoins < 5) {
    gltfLoader.load('public/models/Coin/scene.gltf', (gltf) => {
      const coin = gltf.scene
      coin.scale.x = 0.05
      coin.scale.y = 0.05
      coin.scale.z = 0.05
      coins.push(coin)
      coin.position.z = planePosition - 100
      coin.position.x = (Math.random() - 0.5) * 8
      coin.position.y = Math.random() * 6
      scene.add(coin)
      numberOfCoins++
    })
  }
}


const floorGeometry = new THREE.PlaneGeometry(10, 500, 2, 2)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x0055ff })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = Math.PI * -0.5
floor.position.y = -1
floor.position.z = -250
// scene.add(floor)

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 10000)
camera.position.z = 12
camera.position.y = 2
camera.lookAt(new THREE.Vector3(0, 0, -10000))

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(10, 5, 1)
scene.add(directionalLight)

const renderer = new THREE.WebGL1Renderer({ canvas: canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

const clock = new THREE.Clock()

let rotatePlaneLeft = false
let rotatePlaneRight = false
let rotatePlaneUp = false
let rotatePlaneDown = false
let movePlaneUp = false
let movePlaneDown = false
let movePlaneLeft = false
let movePlaneRight = false

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      rotatePlaneLeft = true
      movePlaneLeft = true
      break;
    case 'ArrowRight':
      rotatePlaneRight = true
      movePlaneRight = true
      break;
    case 'ArrowUp':
      rotatePlaneUp = true
      movePlaneUp = true
      break;
    case 'ArrowDown':
      rotatePlaneDown = true
      movePlaneDown = true
      break;
  }
})
window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      rotatePlaneLeft = false
      movePlaneLeft = false
      break;
    case 'ArrowRight':
      rotatePlaneRight = false
      movePlaneRight = false
      break;
    case 'ArrowUp':
      rotatePlaneUp = false
      movePlaneUp = false
      break;
    case 'ArrowDown':
      rotatePlaneDown = false
      movePlaneDown = false
      break;
  }
})
let gameStatus = 'playing'

let collisions = 0
let numberOfCoins = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  renderer.render(scene, camera)
  // controls.update()
  const frames = requestAnimationFrame(animate)
  coins.forEach(coin => {
    coin.rotation.y += 0.05
    detectCollision(plane, coin)
  })
  if (plane) {
    rotatePlane()
    movePlane()
  }

  if (coins.length < 3 && frames % 100 === 0) {
    renderCoin()
  }
  if (planeMixer) {
    planeMixer.update(elapsedTime)
  }
  if(gameStatus === 'playing'){
    checkGameStatus()
  }else{
    modalOver.style.display = 'block'

  }
  gameStatus = frames > 200 && coins.length === 0 ? 'over' : 'playing'
}


function movePlane() {
  plane.position.z -= 0.3
  planePosition = plane.position.z
  if(gameStatus === 'playing'){
    camera.position.z -= 0.3
  }
  if (movePlaneUp && plane.rotation.x > 0.3) {
    plane.position.y += 0.06
  }
  if (movePlaneDown && plane.rotation.x < -0.3) {
    plane.position.y -= 0.06
  }
  if (movePlaneLeft && plane.rotation.z > 0.3) {
    plane.position.x -= 0.06
  }
  if (movePlaneRight && plane.rotation.z < -0.3) {
    plane.position.x += 0.06
  }
}

function rotatePlane() {
  if (plane) {
    if (rotatePlaneLeft && plane.rotation.z <= 1) {
      plane.rotation.z += 0.05
    }
    else if (plane.rotation.z >= 1) {
      plane.rotation.z === 1
    }
    if (!rotatePlaneLeft && plane.rotation.z > 0) {
      plane.rotation.z -= 0.05
    }


    if (rotatePlaneRight && plane.rotation.z >= -1) {
      plane.rotation.z -= 0.05
    }
    else if (plane.rotation.z <= -1) {
      plane.rotation.z === 1
    }
    if (!rotatePlaneRight && plane.rotation.z < 0) {
      plane.rotation.z += 0.05
    }

    if (rotatePlaneDown && plane.rotation.x >= -0.5) {
      plane.rotation.x -= 0.05
    }
    else if (plane.rotation.x <= 0.5) {
      plane.rotation.x === 0.5
    }
    if (!rotatePlaneDown && plane.rotation.x < 0) {
      plane.rotation.x += 0.03
    }

    if (rotatePlaneUp && plane.rotation.x <= 0.5) {
      plane.rotation.x += 0.05
    }
    else if (plane.rotation.x >= 0.5) {
      plane.rotation.x === 0.5
    }
    if (!rotatePlaneUp && plane.rotation.x > 0) {
      plane.rotation.x -= 0.03
    }
  }
}

function detectCollision(box1, box2) {
  const planeBbox = new THREE.Box3().setFromObject(box1)
  const coinBbox = new THREE.Box3().setFromObject(box2)

  if (planeBbox.min.z < coinBbox.max.z && planeBbox.max.z > coinBbox.min.z && planeBbox.min.x <= coinBbox.max.x && planeBbox.max.x >= coinBbox.min.x && planeBbox.min.y <= coinBbox.max.y && planeBbox.max.y >= coinBbox.min.y) {
    scene.remove(box2)
    collisions += 1
    removeCoin(box2)
  }
  if (coinBbox.min.z > planeBbox.max.z + 1) {
    removeCoin(box2)
  }
}

function removeCoin(coin) {
  scene.remove(coin)
  coins.shift()
}

function checkGameStatus(){
  gameStatus = coins.length > 0 ? 'playing' : 'over'
}

