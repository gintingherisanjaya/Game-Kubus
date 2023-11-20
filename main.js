import * as THREE from 'three';

let isGameRunning = false;
let startButtonVisible = true;
// Variabel untuk pergerakan vertikal pada objek persegi panjang
let verticalPosition = 0;
let verticalSpeed = 0.03; // Kecepatan pergerakan vertikal

// Variabel untuk pergerakan kubus tambahan ke kiri dan ke kanan
let horizontalPosition = 0;
let horizontalSpeed = 0.05; // Kecepatan pergerakan horizontal

// Membuat scene, kamera, dan renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Memuat gambar atau tekstur sebagai latar belakang
const backgroundTextureLoader = new THREE.TextureLoader();
const backgroundTexture = backgroundTextureLoader.load('background_texture.jpg');
scene.background = backgroundTexture;

// Mengaktifkan bayangan
renderer.shadowMap.enabled = true;

// Membuat geometri kubus
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Membuat objek kubus dengan geometri dan material yang telah dibuat
const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('kubusm.jpg') }));
scene.add(cube);
cube.receiveShadow = true;
cube.castShadow = true;
cube.position.set(0, 0, 50);

// Fungsi untuk mengatur posisi kamera
function updateCamera() {
  camera.position.x = cube.position.x;
  camera.position.z = cube.position.z + 5;
  camera.position.y = cube.position.y + 2;
  camera.lookAt(cube.position);
}
updateCamera();

// Membuat geometri lubang dan material dengan tekstur
const holeGeometry = new THREE.CircleGeometry(10, 20);
const textureLoader = new THREE.TextureLoader();
const holeTexture = textureLoader.load('tujuan.png');
const holeMaterial = new THREE.MeshBasicMaterial({ map: holeTexture });
const hole = new THREE.Mesh(holeGeometry, holeMaterial);
scene.add(hole);
hole.position.set(0, 0, -20);

// Membuat geometri persegi panjang
const obstacleGeometry = new THREE.BoxGeometry(20, 1, 0.75); // Panjang 20, lebar 1, tinggi 1

// Membuat material untuk persegi panjang (warna merah menyala)
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); // Warna merah menyala

// Membuat objek rintangan
const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

// Menambahkan rintangan ke scene
scene.add(obstacle);

// Mengatur posisi rintangan
obstacle.position.set(0, -1, 25); // Sesuaikan posisi sesuai kebutuhan

// Fungsi untuk mengupdate pergerakan rintangan
function updateObstacle() {
  obstacle.position.x -= 0.1; // Menggerakkan rintangan dari kanan ke kiri
  if (obstacle.position.x < -10) {
    obstacle.position.x = 10; // Kembali ke sebelah kanan lantai setelah mencapai batas kiri
  }
}

// Membuat geometri lantai
const floorGeometry = new THREE.PlaneGeometry(20, 150, 32, 32);

// Membuat material dengan gambar atau tekstur untuk lantai
const floorTextureLoader = new THREE.TextureLoader();
const floorTexture = floorTextureLoader.load('lantai_texture.jpg');
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });

// Membuat objek lantai dengan geometri dan material yang telah dibuat
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);
floor.rotation.x = Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;

// Variabel untuk mengontrol lompatan
const jumpHeight = 4;
let isJumping = false;

// Variabel untuk kubus tambahan
let additionalCube;
let additionalCubeSpeed = 0.1;
const additionalCubeInitialX = -3;

// Variabel untuk mengontrol kegagalan
let isFailed = false;

// Tambahkan variabel-variabel ini di bagian atas kode Anda
const overlay = document.createElement('div');
overlay.id = 'overlay';
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
overlay.style.textAlign = 'center';
document.body.appendChild(overlay);

const message = document.createElement('div');
message.id = 'message';
message.style.color = 'white';
message.style.fontSize = '36px';
message.style.paddingTop = '50px';
overlay.appendChild(message);

const restartButton = document.createElement('button');
restartButton.id = 'restartButton';
restartButton.style.marginTop = '20px';
restartButton.style.padding = '10px 20px';
restartButton.style.fontSize = '24px';
restartButton.style.backgroundColor = '#4CAF50';
restartButton.style.color = 'white';
restartButton.style.border = 'none';
restartButton.style.cursor = 'pointer';
overlay.appendChild(restartButton);

// Tambahkan variabel-variabel ini di bagian atas kode Anda
const successOverlay = document.createElement('div');
successOverlay.id = 'successOverlay';
successOverlay.style.display = 'none'; 
successOverlay.style.position = 'absolute';
successOverlay.style.top = '0';
successOverlay.style.left = '0';
successOverlay.style.width = '100%';
successOverlay.style.height = '100%';
successOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
successOverlay.style.textAlign = 'center';
document.body.appendChild(successOverlay);

const successMessage = document.createElement('div');
successMessage.id = 'successMessage';
successMessage.style.color = 'white';
successMessage.style.fontSize = '36px';
successMessage.style.paddingTop = '50px';
successOverlay.appendChild(successMessage);

const playAgainButton = document.createElement('button');
playAgainButton.id = 'playAgainButton';
playAgainButton.style.marginTop = '20px';
playAgainButton.style.padding = '10px 20px';
playAgainButton.style.fontSize = '24px';
playAgainButton.style.backgroundColor = '#4CAF50';
playAgainButton.style.color = 'white';
playAgainButton.style.border = 'none';
playAgainButton.style.cursor = 'pointer';
successOverlay.appendChild(playAgainButton);

// Tambahkan papan waktu di kanan atas
const timerElement = document.createElement('div');
timerElement.id = 'timer';
timerElement.style.position = 'absolute';
timerElement.style.top = '10px';
timerElement.style.right = '10px';
timerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
timerElement.style.color = 'white';
timerElement.style.fontSize = '18px';
timerElement.style.padding = '5px';
document.body.appendChild(timerElement);

// Tambahkan tombol "Start" di bagian atas kode Anda
const startButton = document.createElement('button');
startButton.id = 'startButton';
startButton.style.position = 'absolute';
startButton.style.top = '50%';
startButton.style.left = '50%';
startButton.style.transform = 'translate(-50%, -50%)';
startButton.style.fontSize = '36px';
startButton.style.backgroundColor = '#4CAF50';
startButton.style.color = 'white';
startButton.style.border = 'none';
startButton.style.cursor = 'pointer';
startButton.textContent = 'Start';
startButton.addEventListener('click', () => {
  startGame();
  overlay.style.display = 'none';
});
overlay.appendChild(startButton);

// Event listener untuk tombol "Start"
startButton.addEventListener('click', () => {
  startGame();
  overlay.style.display = 'none'; // Sembunyikan overlay saat permainan dimulai
  startButtonVisible = false;
 
});

// Fungsi untuk mendeteksi tabrakan
function detectCollision() {
  if (isGameRunning) {
    // Jika kubus utama bersentuhan dengan lubang
    const distanceX = cube.position.x - hole.position.x;
    const distanceZ = cube.position.z - hole.position.z;
    const holeRadius = 20;

    if (distanceX < holeRadius && distanceZ < 1) {
      // Tampilkan pesan keberhasilan
      showSuccessMessage();
    } else {
      // Cek apakah objek obstacle berada di bawah kubus utama
      if (obstacle.position.y <= 0) {
        // Jika kubus utama bersentuhan dengan persegi panjang (obstacle)
        const distanceXToObstacle = Math.abs(cube.position.x - obstacle.position.x);
        const distanceZToObstacle = Math.abs(cube.position.z - obstacle.position.z);
        const obstacleWidth = 20; // Lebar rintangan

        if (distanceXToObstacle < obstacleWidth / 2 && distanceZToObstacle < 3) {
          // Tampilkan pesan kegagalan
          showFailureMessage();
        } else {
          // Reset status kegagalan jika tidak ada tabrakan
          isFailed = false;
        }
      }

      // Cek apakah objek kubus tambahan bersentuhan dengan kubus utama
      const distanceXToAdditionalCube = Math.abs(cube.position.x - additionalCube.position.x);
      const distanceZToAdditionalCube = Math.abs(cube.position.z - additionalCube.position.z);
      const additionalCubeWidth = 1; // Lebar kubus tambahan

      if (distanceXToAdditionalCube < additionalCubeWidth / 2 && distanceZToAdditionalCube < 2) {
        // Tampilkan pesan kegagalan
        showFailureMessage();
      }
    }
  }
}

// Event listener untuk tombol "esc"
// document.addEventListener('keydown', (event) => {
//   if (event.key === 'Escape') {
//     pauseGame();
//   }
// });

function pauseGame() {
  isGameRunning = false;

  // Hentikan permainan, tampilkan overlay dan tombol "RESUME" dan "Quit"
  overlay.style.display = 'flex'; // Mengatur overlay sebagai flex container
  overlay.style.flexDirection = 'column'; // Menjadikan anak elemen berada dalam satu kolom
  overlay.style.alignItems = 'center'; // Mengatur agar anak elemen berada di tengah-tengah
  restartButton.style.display = 'none';

  // Tombol RESUME
  if (!document.querySelector('#resumeButton')) {
    const resumeButton = document.createElement('button');
    resumeButton.id = 'resumeButton';
    resumeButton.textContent = 'RESUME';
    resumeButton.style.marginTop = '20px';
    resumeButton.style.margin = '10px'; // Memberikan jarak antar tombol
    resumeButton.style.padding = '10px 20px';
    resumeButton.style.fontSize = '24px';
    resumeButton.style.backgroundColor = '#4CAF50';
    resumeButton.style.color = 'white';
    resumeButton.style.border = 'none';
    resumeButton.style.cursor = 'pointer';
    resumeButton.style.display = 'block';
    resumeButton.addEventListener('click', () => {
      resumeGame();
    });
    overlay.appendChild(resumeButton);
  }

  // Tombol QUIT
  if (!document.querySelector('#quitButton')) {
   const quitButton = document.createElement('button');
quitButton.id = 'quitButton';
quitButton.textContent = 'Quit';
quitButton.style.margin = '10px'; // Memberikan jarak antar tombol
quitButton.style.padding = '10px 20px';
quitButton.style.fontSize = '24px';
quitButton.style.backgroundColor = '#f44336';
quitButton.style.color = 'white';
quitButton.style.border = 'none';
quitButton.style.cursor = 'pointer';
quitButton.addEventListener('click', () => {
  quitGame();
});
overlay.appendChild(quitButton);
  }
}

function resumeGame() {
  isGameRunning = true;
  overlay.style.display = 'none';
  restartButton.style.display = 'block';

  // Hapus tombol "RESUME" dan "Quit"
  const resumeButton = document.querySelector('#resumeButton');
  const quitButton = document.querySelector('#quitButton');
  if (resumeButton) {
    overlay.removeChild(resumeButton);
  }
  if (quitButton) {
    overlay.removeChild(quitButton);
  }

  // Mulai permainan lagi dari titik terhenti
  startGame();
}


function quitGame() {
  // Reset waktu dan hentikan permainan
  gameStartTime = null;
  isGameRunning = false;
  overlay.style.display = 'none';
  timerElement.textContent = 'Waktu: 0 detik'; // Reset waktu
  
  // Hapus tombol "RESUME" dan "Quit"
  const resumeButton = document.querySelector('#resumeButton');
  const quitButton = document.querySelector('#quitButton');
  if (resumeButton) {
    overlay.removeChild(resumeButton);
  }
  if (quitButton) {
    overlay.removeChild(quitButton);
  }
}


// Fungsi untuk menampilkan pesan keberhasilan dan tombol "MAIN LAGI"
function showSuccessMessage() {
  successOverlay.style.display = 'block';
  successMessage.innerHTML = 'SELAMAT ANDA BERHASIL';
  playAgainButton.innerHTML = 'MAIN LAGI';

  // Mengambil waktu permainan saat ini
  const currentTime = Date.now();
  const elapsedTime = (currentTime - gameStartTime) / 1000;

  // Menampilkan skor waktu
  successMessage.innerHTML += '<br>Waktu : ' + elapsedTime.toFixed(2) + ' detik';

  isGameRunning = false;
  if (startButtonVisible) {
    startButton.style.display = 'block'; // Tampilkan tombol "Start" jika tombol belum ditampilkan
  }
}


function showFailureMessage() {
  overlay.style.display = 'block';
  message.innerHTML = 'MAAF ANDA GAGAL';
  restartButton.innerHTML = 'ULANGI';
  restartButton.style.display = 'absolute';
  message.style.display = 'block';
  isGameRunning = false;
}

// Fungsi untuk mengatur lompatan
function jump() {
  isJumping = true;
  const jumpSpeed = 0.1;

  function jumpAnimation() {
    if (cube.position.y < jumpHeight) {
      cube.position.y += jumpSpeed;
      cube.position.z -= jumpSpeed;
    } else {
      fall();
    }
  }

  function jumpLoop() {
    if (cube.position.y < jumpHeight) {
      requestAnimationFrame(jumpLoop);
      jumpAnimation();
      updateCamera();
    } else {
      fall();
    }
  }

  jumpLoop();
  // cube.position.z -= 2;
  // updateCamera();
}

// Event listener untuk tombol "MAIN LAGI"
playAgainButton.addEventListener('click', () => {
  resetGame();
});


// Event listener untuk tombol "ULANGI"
restartButton.addEventListener('click', () => {
  resetGame();
});
  function resetGame() {
    // Reset posisi kubus ke posisi awal
    cube.position.set(0, 0, 50);
    
    // Hide overlay setelah tombol "ULANGI" atau "MAIN LAGI" diklik
    overlay.style.display = 'none';
    successOverlay.style.display = 'none';
    message.style.display = 'none';
  
    // Mulai permainan kembali
    isGameRunning = true;
  
    // Mulai permainan secara langsung tanpa menampilkan tombol "Start"
    startGame();
  }



// Kecepatan pergerakan bola
const moveSpeed = 0.4;

// Variabel untuk mengukur waktu permainan
let gameStartTime = null;

// Fungsi untuk menghitung waktu permainan
function calculateGameTime() {
  if (gameStartTime) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - gameStartTime) / 1000;
    timerElement.textContent = `Waktu: ${elapsedTime.toFixed(2)} detik`;
  }
}

// Fungsi untuk memulai permainan

function startGame() {

  gameStartTime = Date.now();
  isGameRunning = true;
  animate();
  
  // Sembunyikan tombol "Start" setelah permainan dimulai
  startButton.style.display = 'none';
}

function moveDepanKiri() {
  if (cube.position.z - moveSpeed >= -22) {
    cube.position.z -= moveSpeed;
  }
  if (cube.position.x - moveSpeed >= -9.60) {
    cube.position.x -= moveSpeed;
  }
  updateCamera();

}

// Mendengarkan event keyboard untuk pergerakan
const keyPressed = {};

// document.addEventListener('keyup', (event) => {
//   keyPressed[event.key] = false;
// });

document.addEventListener('keydown', (event) => {
  if (!gameStartTime) {
    startGame();
  }


  // keyPressed[event.key] = true;
  
  // if(keyPressed['w'] && keyPressed['a']) {
  //   alert('wa')
  //   moveDepanKiri();
  // } else if(keyPressed['w']) {
  //   alert('w');
  //   moveForward();
  // }

  switch (event.key) {
    case 'w':
      moveForward();
      break;
    case 'a':
      moveLeft();
      break;
    case 's':
      moveBackward();
      break;
    case 'd':
      moveRight();
      break;
    case ' ':
      if (!isJumping) jump();
      break;
    case 'Escape':
      pauseGame();
      break;
    default:
      break;
  }
});

// Fungsi untuk bergerak ke depan
function moveForward() {
  // Periksa apakah kubus utama masih berada di dalam batas lantai sebelum bergerak
  if (cube.position.z - moveSpeed >= -22) {
    cube.position.z -= moveSpeed;
    updateCamera();
  }
}

// Fungsi untuk bergerak ke kiri
function moveLeft() {
  // Periksa apakah kubus utama masih berada di dalam batas lantai sebelum bergerak
  if (cube.position.x - moveSpeed >= -9.60) {
    cube.position.x -= moveSpeed;
    updateCamera();
  }
}

// Fungsi untuk bergerak ke belakang
function moveBackward() {
  // Periksa apakah kubus utama masih berada di dalam batas lantai sebelum bergerak
  if (cube.position.z + moveSpeed <= 50) {
    cube.position.z += moveSpeed;
    updateCamera();
  }
}

// Fungsi untuk bergerak ke kanan
function moveRight() {
  // Periksa apakah kubus utama masih berada di dalam batas lantai sebelum bergerak
  if (cube.position.x + moveSpeed <= 9.60) {
    cube.position.x += moveSpeed;
    updateCamera();
  }
}


// Fungsi untuk menjatuhkan bola
function fall() {
  const fallSpeed = 0.1;

  function fallAnimation() {
    if (cube.position.y > 0) {
      cube.position.y -= fallSpeed;
      cube.position.z -= fallSpeed;
    } else {
      isJumping = false;
      cube.position.y = 0;
    }
  }

  function fallLoop() {
    if (cube.position.y > 0) {
      requestAnimationFrame(fallLoop);
      fallAnimation();
      updateCamera();
    } else {
      isJumping = false;
      cube.position.y = 0;
    }
  }

  fallLoop();
  // alert(obstacle.position.y);

  // cube.position.z -= 2;
  // updateCamera();
}

// Memanggil fungsi createCube untuk membuat kubus tambahan
createCube(new THREE.Vector3(additionalCubeInitialX, 0.1, 0), new THREE.MeshBasicMaterial({ color: 0x800000 }));

// Fungsi untuk membuat kubus tambahan
function createCube(position, material) {
  additionalCube = new THREE.Mesh(geometry, material);
  additionalCube.position.copy(position);
  scene.add(additionalCube);
}

// Animasi permainan
function animate() {
  if (isGameRunning) {
    requestAnimationFrame(animate);

    detectCollision(); 
    calculateGameTime();

    // Menggerakkan objek persegi panjang secara vertikal
    verticalPosition += verticalSpeed;
    
    // Batas atas dan bawah pergerakan vertikal
    const upperBound = 5; // Batas atas
    const lowerBound = -1; // Batas bawah

    // Jika objek mencapai batas atas atau batas bawah, balik arah pergerakannya
    if (verticalPosition >= upperBound || verticalPosition <= lowerBound) {
      verticalSpeed *= -1; // Balik arah pergerakan vertikal
    }

    // Set posisi objek persegi panjang berdasarkan pergerakan vertikal
    obstacle.position.y = verticalPosition;

    // Menggerakkan objek kubus tambahan ke kiri dan ke kanan
    horizontalPosition += horizontalSpeed;
    
    // Batas kanan dan kiri pergerakan horizontal
    const rightBound = 7; // Batas kanan
    const leftBound = -7; // Batas kiri

    // Jika objek mencapai batas kanan atau kiri, balik arah pergerakannya
    if (horizontalPosition >= rightBound || horizontalPosition <= leftBound) {
      horizontalSpeed *= -1; // Balik arah pergerakan horizontal
    }

    // Set posisi objek kubus tambahan berdasarkan pergerakan horizontal
    additionalCube.position.x = horizontalPosition;

    // Tambahkan logika lainnya sesuai kebutuhan

    renderer.render(scene, camera);
  }
}

