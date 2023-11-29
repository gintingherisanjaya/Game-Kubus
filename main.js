import * as THREE from 'three';

let pauseStartTime;
let pausedElapsedTime = 0; 
let isLevel2 = false;
let level2DisplayTime = 1000; // Durasi tampilan tulisan Level 2 dalam milidetik
let level2StartTime;
// Tambahkan checkpoint di posisi (0, 0, -47)
const checkpointPosition = new THREE.Vector3(0, 0, -5);

const level2Overlay = document.createElement('div');
level2Overlay.id = 'level2Overlay';
level2Overlay.style.display = 'none'; // Sembunyikan overlay
level2Overlay.style.position = 'absolute';
level2Overlay.style.top = '0';
level2Overlay.style.left = '20';
level2Overlay.style.width = '100%';
level2Overlay.style.height = '100%';
level2Overlay.style.textAlign = 'center';

document.body.appendChild(level2Overlay);

const level2Message = document.createElement('div');
level2Message.id = 'level2Message';
level2Message.style.color = 'yellow';
level2Message.style.fontSize = '50px';
level2Message.style.paddingTop = '50px';
level2Overlay.appendChild(level2Message);

const continueButton = document.createElement('button');
continueButton.id = 'continueButton';
continueButton.style.marginTop = '20px';
continueButton.style.padding = '10px 20px';
continueButton.style.fontSize = '24px';
continueButton.style.backgroundColor = '#4CAF50';
continueButton.style.color = 'black';
continueButton.style.border = 'none';
continueButton.style.cursor = 'pointer';
continueButton.textContent = 'Main Lagi';
continueButton.addEventListener('click', () => {
  level2Overlay.style.display = 'none'; // Sembunyikan overlay pesan "Level 2" setelah tombol "Main Lagi" diklik
  resetGame();
});
level2Overlay.appendChild(continueButton);

// Fungsi untuk menampilkan tulisan Level 2
function showLevel2Message() {
  level2Overlay.style.display = 'flex'; // Menampilkan overlay
  level2Message.innerHTML = 'Level 2';

  continueButton.style.display = 'none'; // Sembunyikan tombol "Main Lagi"  
    setTimeout(() => {
      level2Overlay.style.display = 'none';
      removeAllInterval();
    }, 1000);
}

let isGameRunning = false;
let startButtonVisible = true;
let gameStartTime = null;
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

// Membuat geometri kubus baru
const redKubusGeometry = new THREE.BoxGeometry(17, 1, 15); // Panjang 17, tinggi 1, lebar 15

// Membuat material dengan tekstur menggunakan TextureLoader
const textureLoaderx = new THREE.TextureLoader();
const texturex = textureLoaderx.load('galaksi.png'); // Ganti 'lokasi_gambar_anda.jpg' dengan path file gambar Anda

const redKubusMaterial = new THREE.MeshBasicMaterial({ map: texturex });

// Mengganti material kubus dengan material yang memiliki tekstur
const redKubus = new THREE.Mesh(redKubusGeometry, redKubusMaterial);

// Mengatur posisi redKubus
redKubus.position.set(-2, -1, -20);

// Membuat geometri kubus baru
const redKubusGeometry2 = new THREE.BoxGeometry(17, 1, 15); // Panjang 17, tinggi 1, lebar 15

// Membuat material dengan tekstur menggunakan TextureLoader
const texture = new THREE.TextureLoader().load('galaksi.png'); // Ganti 'lokasi_gambar_anda.jpg' dengan path file gambar Anda

const redKubusMaterial2 = new THREE.MeshBasicMaterial({ map: texture });

// Membuat kubus menggunakan geometri dan material yang telah dibuat
const redKubus2 = new THREE.Mesh(redKubusGeometry2, redKubusMaterial2);


// Mengatur posisi redKubus2
redKubus2.position.set(2, -1, -39.4);

// Menerapkan bayangan pada redKubus2
redKubus2.castShadow = true;
redKubus2.receiveShadow = true;

// Menambahkan redKubus2 ke dalam scene
scene.add(redKubus2);


// Menerapkan bayangan pada redKubus
redKubus.castShadow = true;
redKubus.receiveShadow = true;

// Menambahkan redKubus ke dalam scene
scene.add(redKubus);


// Membuat geometri kubus baru (biru cerah)
const kubuscheckGeometry = new THREE.BoxGeometry(19, 1, 2); // Panjang 1, tinggi 2, lebar 1
const kubuscheckMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00}); // Warna biru cerah
const kubuscheck = new THREE.Mesh(kubuscheckGeometry, kubuscheckMaterial);

// Mengatur posisi kubuscheck
kubuscheck.position.set(0, -1, -5);

// Menerapkan bayangan pada kubuscheck
kubuscheck.castShadow = true;
kubuscheck.receiveShadow = true;

// Menambahkan kubuscheck ke dalam scene
scene.add(kubuscheck);

// Memuat gambar atau tekstur sebagai latar belakang
const backgroundTextureLoader = new THREE.TextureLoader();
const backgroundTexture = backgroundTextureLoader.load('background_texture.jpg');
scene.background = backgroundTexture;

// Mengaktifkan bayangan
renderer.shadowMap.enabled = true;

// Membuat geometri kubus
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Membuat objek kubus dengan geometri dan material yang telah dibuat
const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('venus.jpeg') }));
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
hole.position.set(0, 0, -70);

// Membuat geometri kubus baru
const obstacleGeometry = new THREE.BoxGeometry(20, 1, 0.75); // Panjang 20, lebar 1, tinggi 5

// Membuat material untuk persegi panjang menggunakan tekstur
const obstacleTexture = new THREE.TextureLoader().load('5.jpg'); // Ganti 'venus.jpeg' dengan path file tekstur Anda
const obstacleMaterial = new THREE.MeshBasicMaterial({ map: obstacleTexture });

// Membuat objek rintangan dengan geometri dan material yang telah dibuat
const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

// Menambahkan rintangan ke dalam scene
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

// Fungsi untuk mendeteksi tabrakan
function detectCollision() {
  if (isGameRunning) {
    const distanceToCheckpoint = cube.position.distanceTo(checkpointPosition);
    const distanceXToKubusCheck = Math.abs(cube.position.x - kubuscheck.position.x);
    const distanceZToKubusCheck = Math.abs(cube.position.z - kubuscheck.position.z);
    const kubusCheckWidth = 19;

    if (distanceXToKubusCheck < kubusCheckWidth / 1.9 && distanceZToKubusCheck < 1) {
      // Call showLevel2Message when the main cube collides with kubuscheck
      showLevel2Message();
    }

    if (distanceToCheckpoint < 5) {
      // Kubus utama mencapai checkpoint, tampilkan tulisan Level 2
      isLevel2 = true;
      level2StartTime = Date.now();
      showLevel2Message();
    }

    const distanceXToRedKubus = Math.abs(cube.position.x - redKubus.position.x);
    const distanceZToRedKubus = Math.abs(cube.position.z - redKubus.position.z);
    const redKubusWidth = 17;

    if (distanceXToRedKubus < redKubusWidth / 1.9 && distanceZToRedKubus < 8.3) {
      cube.position.copy(checkpointPosition);
    }

    const distanceXToRedKubus2 = Math.abs(cube.position.x - redKubus2.position.x);
    const distanceZToRedKubus2 = Math.abs(cube.position.z - redKubus2.position.z);
    const redKubus2Width = 17;

    if (distanceXToRedKubus2 < redKubus2Width / 1.9 && distanceZToRedKubus2 < 8.4) {
      cube.position.copy(checkpointPosition);
    }

    const distanceX = cube.position.x - hole.position.x;
    const distanceZ = cube.position.z - hole.position.z;
    const holeRadius = 20;

    if (distanceX < holeRadius && distanceZ < 1) {
      showSuccessMessage();
    } else {
      if (obstacle.position.y <= 0) {
        const distanceXToObstacle = Math.abs(cube.position.x - obstacle.position.x);
        const distanceZToObstacle = Math.abs(cube.position.z - obstacle.position.z);
        const obstacleWidth = 20;
        if (distanceXToObstacle < obstacleWidth / 2 && distanceZToObstacle < 3) {
          resetCubePosition();
        }
      }
      
      const distanceXToAdditionalCube = Math.abs(cube.position.x - additionalCube.position.x);
      const distanceZToAdditionalCube = Math.abs(cube.position.z - additionalCube.position.z);
      const additionalCubeWidth = 1;

      if (distanceXToAdditionalCube < additionalCubeWidth / 2 && distanceZToAdditionalCube < 2) {
        // Reset posisi kubus utama ke titik awal
        resetCubePosition();
      }
    }
  }
}

function resetCubePosition() {
  cube.position.set(0, 0, 50);
}

function pauseGame() {
  pauseStartTime = Date.now();
  isGameRunning = false;

  // Hentikan permainan, tampilkan overlay dan tombol "RESUME" dan "Quit"
  overlay.style.display = 'flex'; // Mengatur overlay sebagai flex container
  overlay.style.flexDirection = 'column'; // Menjadikan anak elemen berada dalam satu kolom
  overlay.style.alignItems = 'center'; // Mengatur agar anak elemen berada di tengah-tengah
  // restartButton.style.display = 'none';

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

   // Tambahkan tombol "Quit" dan event listener untuk menutup halaman
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
     window.close(); // Menutup halaman
   });
   overlay.appendChild(quitButton);
 }

 function resumeGame() {
  if (isGameRunning) {
    return; // Tidak melakukan apa-apa jika permainan sudah berjalan
  }

  // Ambil waktu saat tombol resume ditekan
  const resumeTime = Date.now();

  // Hitung selisih waktu sejak permainan di-pause
  const pauseDuration = resumeTime - pauseStartTime;

  // Tambahkan durasi pause ke elapsed time yang di-pause
  pausedElapsedTime += pauseDuration;

  // Atur ulang waktu awal permainan
  gameStartTime = resumeTime - pausedElapsedTime;

  isGameRunning = true;
  overlay.style.display = 'none';
  // restartButton.style.display = 'block';

  // Hapus tombol "RESUME" dan "Quit"
  const resumeButton = document.querySelector('#resumeButton');
  const quitButton = document.querySelector('#quitButton');
  if (resumeButton) {
    overlay.removeChild(resumeButton);
  }
  if (quitButton) {
    overlay.removeChild(quitButton);
  }

  // Lanjutkan permainan dari keadaan di-pause
  animate();
}

// Fungsi untuk menampilkan pesan keberhasilan dan tombol "MAIN LAGI"
function showSuccessMessage() {
  successOverlay.style.display = 'block';
  successMessage.innerHTML = 'SELAMAT ANDA BERHASIL';
  playAgainButton.innerHTML = 'MAIN LAGI';

  // Mengambil waktu permainan saat ini
  const currentTime = Date.now();
  const elapsedTime = (currentTime - gameStartTime) / 1000;
  var score = 0;
  var message = "NO POINT";

  if(elapsedTime <= 20) {
    score = 90;
    message = "EXCELLENT";
  } else if(elapsedTime <= 30) {
    score = 80;
    message = "GREAT";
  } else if(elapsedTime <= 35) {
    score = 70;
    message = "GOOD"
  } else if(elapsedTime <= 45) {
    score = 60;
    message = "NO BAD";
  } else {
    score = 50;
    message = "YOU CAN BE BETTER NEXT TIME";
  }

  const distanceX = cube.position.x - hole.position.x;
  const distanceXAreas = Math.abs(distanceX);
  const areaScore = 10 - parseFloat(distanceXAreas.toFixed(2)); 
  score += areaScore;

  // Menampilkan skor waktu
  successMessage.innerHTML += '<br>Waktu : ' + elapsedTime.toFixed(2) + ' detik' + `<br> ${message} <br> Point Kamu : ${score}`;
  isGameRunning = false;
  if (startButtonVisible) {
    startButton.style.display = 'block'; // Tampilkan tombol "Start" jika tombol belum ditampilkan
  }
}

// Event listener untuk tombol "MAIN LAGI"
playAgainButton.addEventListener('click', () => {
  location.reload();
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

// Fungsi untuk menghitung waktu permainan
function calculateGameTime() {
  if (gameStartTime && isGameRunning) {
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

document.addEventListener('keydown', (event) => {
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
  if (cube.position.z - moveSpeed >= -71) {
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

// Memanggil fungsi createCube untuk membuat kubus tambahan
// Memuat gambar sebagai tekstur untuk kubus tambahan
const additionalCubeTextureLoader = new THREE.TextureLoader();
const additionalCubeTexture = additionalCubeTextureLoader.load('5.jpg'); // Ganti 'texture.jpg' dengan path file gambar Anda

// Membuat material dengan tekstur untuk kubus tambahan
const additionalCubeMaterial = new THREE.MeshBasicMaterial({ map: additionalCubeTexture });

// Menggunakan material baru pada kubus tambahan
createCube(new THREE.Vector3(additionalCubeInitialX, 0.1, 0), additionalCubeMaterial);




// Fungsi untuk membuat kubus tambahan
function createCube(position, material) {
  additionalCube = new THREE.Mesh(geometry, additionalCubeMaterial);
  additionalCube.position.copy(position);
  scene.add(additionalCube);
}

function countTimeOver() {
  const elapsedTime = (Date.now() - gameStartTime) / 1000;
  if(elapsedTime >= 80) {
    alert("TIME OVER. Please Click OK to Continue. We will restart the game");
    isGameRunning = false;
    location.reload();
  }
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

    if (isLevel2) {
      const elapsedTime = Date.now() - level2StartTime;
      if (elapsedTime > level2DisplayTime) {
        isLevel2 = false; // Reset status Level 2 setelah durasi tampilan berakhir
      }
    }
    countTimeOver();

    renderer.render(scene, camera);
  }
}
