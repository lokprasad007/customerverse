/* ==========================================
   DELIVERSE CORE INTERACTION & 3D WebGL ENGINE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== FIREBASE AUTH GATEWAY INTEGRATION ====================
  const firebaseConfig = {
    apiKey: "AIzaSyB-3u_10pQWLj6HE9-nTEkYu-z4bs3zyL8",
    authDomain: "auth-f826f.firebaseapp.com",
    projectId: "auth-f826f",
    storageBucket: "auth-f826f.firebasestorage.app",
    messagingSenderId: "888053285644",
    appId: "1:888053285644:web:1aac406ab14eaeabe7bf29",
    measurementId: "G-2EQ1H7NRFX"
  };
  
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    const authOverlay = document.getElementById('auth-login-overlay');
    const btnGoogleLogin = document.getElementById('btn-google-login');
    const customUsernameInput = document.getElementById('custom-username');
    const profilePill = document.getElementById('user-profile-pill');
    const headerUserName = document.getElementById('header-user-name');
    const btnHeaderLogout = document.getElementById('btn-header-logout');
    const btnGetStarted = document.getElementById('btn-get-started');

    if (authOverlay && btnGoogleLogin) {
      // Listen to Firebase authentication status
      auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in
          const savedName = localStorage.getItem('deliverse_user_name') || user.displayName || 'Merchant';
          localStorage.setItem('deliverse_user_name', savedName);
          
          if (headerUserName) headerUserName.innerText = savedName;
          if (profilePill) profilePill.classList.remove('hidden');
          if (btnGetStarted) btnGetStarted.classList.add('hidden');

          authOverlay.classList.add('hidden');
          setTimeout(() => {
            authOverlay.style.display = 'none';
          }, 500);
        } else {
          // User is signed out
          if (profilePill) profilePill.classList.add('hidden');
          if (btnGetStarted) btnGetStarted.classList.remove('hidden');

          authOverlay.style.display = 'flex';
          authOverlay.classList.remove('hidden');
        }
      });

      // Bind Sign Out action to the header logout button
      if (btnHeaderLogout) {
        btnHeaderLogout.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          auth.signOut().then(() => {
            localStorage.removeItem('deliverse_user_name');
          });
        });
      }

      // Bind custom name check and Google sign in popup trigger
      btnGoogleLogin.addEventListener('click', () => {
        const customName = customUsernameInput ? customUsernameInput.value.trim() : '';
        if (!customName) {
          alert('Please enter your Name in the field above before signing in.');
          if (customUsernameInput) customUsernameInput.focus();
          return;
        }
        
        localStorage.setItem('deliverse_user_name', customName);

        btnGoogleLogin.style.opacity = '0.7';
        btnGoogleLogin.innerHTML = `
          <span class="w-4 h-4 border-2 border-slate-800/30 border-t-slate-800 rounded-full animate-spin"></span>
          <span>Connecting to Google...</span>
        `;
        auth.signInWithPopup(googleProvider).catch((error) => {
          console.error("Firebase Sign-in error: ", error);
          btnGoogleLogin.style.opacity = '1';
          btnGoogleLogin.innerHTML = `
            <svg viewBox="0 0 48 48" style="width: 20px; height: 20px; flex-shrink: 0;">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.8 6.5 29.1 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c10.5 0 20-7.6 20-20.5 0-1-.1-2-.4-3h-16v-2z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.8 6.5 29.1 4.5 24 4.5c-7.8 0-14.5 4.5-17.7 10.2z"/>
              <path fill="#4CAF50" d="M24 45.5c5 0 9.7-1.9 13.2-4.9l-6.1-5.2C29.2 36.9 26.7 37.5 24 37.5c-5.2 0-9.6-3.4-11.3-8.1l-6.5 5C9.6 41.1 16.3 45.5 24 45.5z"/>
              <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.1 5.2c3.6-3.3 5.8-8.1 5.8-13.7 0-1-.1-2-.4-3h-.5z"/>
            </svg>
            <span>Sign In with Google</span>
          `;
          alert("Firebase authentication failed. Please try again: " + error.message);
        });
      });
    }
  }

  // ==================== DOM ELEMENTS ====================
  const backdrop = document.getElementById('modal-backdrop');
  
  // Modals
  const modalTracking = document.getElementById('modal-tracking');
  const modalCalculator = document.getElementById('modal-calculator');
  const modalIntegrations = document.getElementById('modal-integrations');
  const modalDriver = document.getElementById('modal-driver');
  
  // Close Buttons
  const closeTracking = document.getElementById('close-modal-tracking');
  const closeCalculator = document.getElementById('close-modal-calculator');
  const closeIntegrations = document.getElementById('close-modal-integrations');
  const closeDriver = document.getElementById('close-modal-driver');

  // Navigation Links & Triggers
  const navTracking = document.getElementById('nav-tracking');
  const btnStartShipping = document.getElementById('btn-start-shipping');
  const btnGetStarted = document.getElementById('btn-get-started');
  const btnHeroCreateAcc = document.getElementById('btn-hero-create-acc');
  const heroBadgeBtn = document.getElementById('hero-badge-btn');
  
  // Card Triggers
  const cardCreateAccount = document.getElementById('card-create-account');
  const cardConnectStore = document.getElementById('card-connect-store');
  const cardWarehouse = document.getElementById('card-warehouse');
  const cardShipping = document.getElementById('card-shipping');

  // Footer Links
  const footCalcTrigger = document.getElementById('foot-calc-trigger');
  const footTrackTrigger = document.getElementById('foot-track-trigger');

  // Mobile Menu Drawer
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-links a');
  const btnGetStartedMob = document.querySelector('.btn-text-link-mob');
  const btnStartShippingMob = document.querySelector('.btn-pill-green-mob');


  // ==================== MODAL CONTROLLER ====================
  function openModal(modal) {
    closeAllModals(modal);
    backdrop.style.display = 'block';
    modal.style.display = 'flex';
    setTimeout(() => {
      backdrop.classList.add('open');
      modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    setTimeout(() => {
      if (backdrop.classList.contains('open')) return;
      backdrop.style.display = 'none';
      modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
  }

  function closeAllModals(exceptModal = null) {
    [modalTracking, modalCalculator, modalIntegrations, modalDriver].forEach(m => {
      if (m === exceptModal) return;
      m.classList.remove('open');
      setTimeout(() => {
        if (m.classList.contains('open')) return;
        m.style.display = 'none';
      }, 300);
    });

    if (!exceptModal) {
      backdrop.classList.remove('open');
      setTimeout(() => {
        if (backdrop.classList.contains('open')) return;
        backdrop.style.display = 'none';
      }, 300);
      document.body.style.overflow = '';
    }
  }

  backdrop.addEventListener('click', closeAllModals);
  closeTracking.addEventListener('click', () => closeModal(modalTracking));
  closeCalculator.addEventListener('click', () => closeModal(modalCalculator));
  closeIntegrations.addEventListener('click', () => closeModal(modalIntegrations));
  closeDriver.addEventListener('click', () => closeModal(modalDriver));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });


  // ==================== MODAL ASSIGNMENT TRIGGERS ====================
  navTracking.addEventListener('click', (e) => { e.preventDefault(); openModal(modalTracking); });
  btnStartShipping.addEventListener('click', (e) => { e.preventDefault(); openModal(modalCalculator); });
  btnGetStarted.addEventListener('click', (e) => { e.preventDefault(); openModal(modalDriver); });
  btnHeroCreateAcc.addEventListener('click', (e) => { e.preventDefault(); openModal(modalDriver); });
  heroBadgeBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(modalCalculator); });

  cardCreateAccount.addEventListener('click', () => openModal(modalDriver));
  cardConnectStore.addEventListener('click', () => openModal(modalIntegrations));
  cardWarehouse.addEventListener('click', () => openModal(modalIntegrations));
  cardShipping.addEventListener('click', () => openModal(modalCalculator));

  footCalcTrigger.addEventListener('click', (e) => { e.preventDefault(); openModal(modalCalculator); });
  footTrackTrigger.addEventListener('click', (e) => { e.preventDefault(); openModal(modalTracking); });


  // ==================== MOBILE DRAWER CONTROLS ====================
  mobileToggle.addEventListener('click', () => {
    mobileDrawer.classList.add('open');
    backdrop.style.display = 'block';
    setTimeout(() => backdrop.classList.add('open'), 10);
  });

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    backdrop.classList.remove('open');
    setTimeout(() => {
      if (!modalTracking.classList.contains('open') && 
          !modalCalculator.classList.contains('open') && 
          !modalIntegrations.classList.contains('open') && 
          !modalDriver.classList.contains('open')) {
        backdrop.style.display = 'none';
      }
    }, 300);
  }

  drawerClose.addEventListener('click', closeMobileDrawer);
  
  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMobileDrawer();
      if (link.classList.contains('drawer-track-link')) {
        e.preventDefault();
        setTimeout(() => openModal(modalTracking), 350);
      }
    });
  });

  btnGetStartedMob.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileDrawer();
    setTimeout(() => openModal(modalDriver), 350);
  });

  btnStartShippingMob.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobileDrawer();
    setTimeout(() => openModal(modalCalculator), 350);
  });


  // ==================== INTERACTIVE 3D VEHICLE ROTATION (THREE.JS) ====================
  const init3DShowcase = () => {
    const container = document.getElementById('canvas3d-container');
    if (!container) return;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(-5, 2.2, 5); // Diagonal front-left view

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Orbit Controls (Mouse Drag Rotation)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 1.8;

    // 3. Physically Based Lighting (Studio Rig)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Dynamic glowing spotlights matching neon-cyan / fuchsia aesthetic
    const cyanLight = new THREE.PointLight(0x00f0ff, 2.0, 100);
    cyanLight.position.set(10, 10, 10);
    scene.add(cyanLight);

    const fuchsiaLight = new THREE.PointLight(0xff007f, 1.5, 100);
    fuchsiaLight.position.set(-10, -10, -10);
    scene.add(fuchsiaLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(0, 15, 0);
    scene.add(sunLight);

    // Shared Materials
    const blackPaint = new THREE.MeshStandardMaterial({
      color: 0x0d0d11,
      roughness: 0.15,
      metalness: 0.85
    });

    const shinyChrome = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 1.0,
      roughness: 0.05
    });

    const tireRubber = new THREE.MeshStandardMaterial({
      color: 0x1c1c22,
      roughness: 0.8,
      metalness: 0.05
    });

    const darkGlass = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.05,
      metalness: 0.95
    });

    const yellowLight = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.5
    });

    const slateDark = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.4
    });

    const fuchsiaDecalMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff007f,
      emissiveIntensity: 1.8
    });

    // State machine tracking active vehicle
    let activeVehicle = 'lorry';

    // ==================== 1. LORRY MODEL GROUP ====================
    const lorryGroup = new THREE.Group();
    lorryGroup.position.set(0, -0.35, 0);
    lorryGroup.scale.set(1.05, 1.05, 1.05);

    // Chassis Frame
    const chassisGeo = new THREE.BoxGeometry(4.2, 0.25, 1.4);
    const chassis = new THREE.Mesh(chassisGeo, slateDark);
    chassis.position.set(0, 0.3, 0);
    lorryGroup.add(chassis);

    // Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.6, 1.5), blackPaint);
    cabin.position.set(-0.4, 1.25, 0);
    lorryGroup.add(cabin);

    // Sleeper Rear
    const sleeper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 1.5), blackPaint);
    sleeper.position.set(0.8, 1.35, 0);
    lorryGroup.add(sleeper);

    // Top Spoiler
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.4), blackPaint);
    spoiler.position.set(0.4, 2.3, 0);
    lorryGroup.add(spoiler);

    // Sloped Engine Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 1.48), blackPaint);
    hood.position.set(-1.7, 0.85, 0);
    lorryGroup.add(hood);

    // Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 1.42), darkGlass);
    windshield.position.set(-1.32, 1.7, 0);
    windshield.rotation.z = -Math.PI / 6;
    lorryGroup.add(windshield);

    // Side Windows
    const sideWinGeo = new THREE.BoxGeometry(0.8, 0.6, 0.02);
    const rightWin = new THREE.Mesh(sideWinGeo, darkGlass);
    rightWin.position.set(-0.4, 1.4, 0.76);
    lorryGroup.add(rightWin);
    
    const leftWin = new THREE.Mesh(sideWinGeo, darkGlass);
    leftWin.position.set(-0.4, 1.4, -0.76);
    lorryGroup.add(leftWin);

    // Front Grille
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 1.0), shinyChrome);
    grille.position.set(-2.21, 0.85, 0);
    lorryGroup.add(grille);

    // Front Bumper
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 1.56), shinyChrome);
    bumper.position.set(-2.22, 0.35, 0);
    lorryGroup.add(bumper);

    // Headlights
    const lightSphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const leftLight = new THREE.Mesh(lightSphereGeo, yellowLight);
    leftLight.position.set(-2.22, 0.35, -0.65);
    lorryGroup.add(leftLight);
    
    const rightLight = new THREE.Mesh(lightSphereGeo, yellowLight);
    rightLight.position.set(-2.22, 0.35, 0.65);
    lorryGroup.add(rightLight);

    // Fuel Tanks (Cylinders)
    const fuelTankGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.4, 16);
    const leftFuel = new THREE.Mesh(fuelTankGeo, shinyChrome);
    leftFuel.rotation.x = Math.PI / 2;
    leftFuel.position.set(0.2, 0.35, -0.82);
    lorryGroup.add(leftFuel);
    
    const rightFuel = new THREE.Mesh(fuelTankGeo, shinyChrome);
    rightFuel.rotation.x = Math.PI / 2;
    rightFuel.position.set(0.2, 0.35, 0.82);
    lorryGroup.add(rightFuel);

    // Dual Exhaust Stacks
    const stackGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12);
    const leftStack = new THREE.Mesh(stackGeo, shinyChrome);
    leftStack.position.set(1.45, 1.7, -0.6);
    lorryGroup.add(leftStack);
    
    const rightStack = new THREE.Mesh(stackGeo, shinyChrome);
    rightStack.position.set(1.45, 1.7, 0.6);
    lorryGroup.add(rightStack);

    // Wheels
    const wheelPositions = [
      { pos: [-1.4, 0.3, 0.72] }, { pos: [-1.4, 0.3, -0.72] },
      { pos: [0.8, 0.3, 0.72] },  { pos: [0.8, 0.3, -0.72] },
      { pos: [1.6, 0.3, 0.72] },  { pos: [1.6, 0.3, -0.72] }
    ];
    const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 24);
    const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16);

    wheelPositions.forEach((w) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(w.pos[0], w.pos[1], w.pos[2]);

      const rubber = new THREE.Mesh(tireGeo, tireRubber);
      rubber.rotation.x = Math.PI / 2;
      wheelGroup.add(rubber);

      const metalHub = new THREE.Mesh(hubGeo, shinyChrome);
      metalHub.rotation.x = Math.PI / 2;
      wheelGroup.add(metalHub);

      lorryGroup.add(wheelGroup);
    });

    scene.add(lorryGroup);


    // ==================== 2. DELIVERY BIKE MODEL GROUP ====================
    const bikeGroup = new THREE.Group();
    bikeGroup.position.set(0, -2.0, 0); // hidden
    bikeGroup.scale.set(0.001, 0.001, 0.001);

    const emeraldGreen = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.15,
      metalness: 0.7
    });

    // Moped Frame/Body
    const mopedBody = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.45, 0.35), emeraldGreen);
    mopedBody.position.set(-0.1, 0.52, 0);
    bikeGroup.add(mopedBody);

    const mopedChassis = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.1, 0.28), slateDark);
    mopedChassis.position.set(-0.1, 0.3, 0);
    bikeGroup.add(mopedChassis);

    // Seat
    const mopedSeat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.26), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85 }));
    mopedSeat.position.set(-0.22, 0.78, 0);
    bikeGroup.add(mopedSeat);

    // Motor Block
    const mopedMotor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.26), shinyChrome);
    mopedMotor.position.set(-0.15, 0.45, 0);
    bikeGroup.add(mopedMotor);

    // Front Slanted Steering Fork
    const forkGroup = new THREE.Group();
    forkGroup.position.set(-0.62, 0.82, 0);
    forkGroup.rotation.z = Math.PI / 10;
    const forkCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12), shinyChrome);
    forkGroup.add(forkCyl);
    bikeGroup.add(forkGroup);

    // Handlebars
    const handlebars = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.56, 12), shinyChrome);
    handlebars.position.set(-0.72, 1.25, 0);
    handlebars.rotation.x = Math.PI / 2;
    bikeGroup.add(handlebars);

    // Front Apron Shield
    const frontShield = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.42), emeraldGreen);
    frontShield.position.set(-0.74, 0.85, 0);
    frontShield.rotation.z = Math.PI / 12;
    bikeGroup.add(frontShield);

    // Large Insulated Delivery Box
    const deliveryBoxMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.75 });
    const deliveryBox = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.68, 0.68), deliveryBoxMat);
    deliveryBox.position.set(0.48, 1.1, 0);
    bikeGroup.add(deliveryBox);

    const cyanBrandMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 2.5
    });
    const brandPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.26, 0.45), cyanBrandMat);
    brandPlate.position.set(0.825, 1.1, 0);
    bikeGroup.add(brandPlate);

    // Wheels & Hubs
    const bikeTireGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.15, 24);
    const bikeHubGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.18, 12);

    // Front Wheel
    const frontWheelGrp = new THREE.Group();
    frontWheelGrp.position.set(-0.78, 0.32, 0);
    const frontTire = new THREE.Mesh(bikeTireGeo, tireRubber);
    frontTire.rotation.x = Math.PI / 2;
    frontWheelGrp.add(frontTire);
    const frontHub = new THREE.Mesh(bikeHubGeo, shinyChrome);
    frontHub.rotation.x = Math.PI / 2;
    frontWheelGrp.add(frontHub);
    bikeGroup.add(frontWheelGrp);

    // Rear Wheel
    const rearWheelGrp = new THREE.Group();
    rearWheelGrp.position.set(0.62, 0.32, 0);
    const rearTire = new THREE.Mesh(bikeTireGeo, tireRubber);
    rearTire.rotation.x = Math.PI / 2;
    rearWheelGrp.add(rearTire);
    const rearHub = new THREE.Mesh(bikeHubGeo, shinyChrome);
    rearHub.rotation.x = Math.PI / 2;
    rearWheelGrp.add(rearHub);
    bikeGroup.add(rearWheelGrp);

    // Headlight
    const mopedLight = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), yellowLight);
    mopedLight.position.set(-0.82, 1.12, 0);
    bikeGroup.add(mopedLight);

    scene.add(bikeGroup);


    // ==================== 3. GOODS AUTO MODEL GROUP ====================
    const autoGroup = new THREE.Group();
    autoGroup.position.set(0, -2.0, 0); // hidden
    autoGroup.scale.set(0.001, 0.001, 0.001);

    const amberYellow = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber local yellow
      roughness: 0.15,
      metalness: 0.8
    });

    const darkBlueContainer = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Cobalt blue
      roughness: 0.2,
      metalness: 0.85
    });

    // Auto Chassis bed
    const autoChassis = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 1.25), slateDark);
    autoChassis.position.set(0, 0.3, 0);
    autoGroup.add(autoChassis);

    // Big Cargo Box
    const cargoContainer = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.25, 1.2), darkBlueContainer);
    cargoContainer.position.set(0.5, 0.98, 0);
    autoGroup.add(cargoContainer);

    // Fuchsia decals
    const stripeLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.01), fuchsiaDecalMat);
    stripeLeft.position.set(0.5, 1.1, 0.61);
    autoGroup.add(stripeLeft);
    const stripeRight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.01), fuchsiaDecalMat);
    stripeRight.position.set(0.5, 1.1, -0.61);
    autoGroup.add(stripeRight);

    // Driver Cab Main
    const autoCabin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.32, 1.1), amberYellow);
    autoCabin.position.set(-0.75, 1.0, 0);
    autoGroup.add(autoCabin);

    const autoNose = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 1.1), amberYellow);
    autoNose.position.set(-1.25, 0.75, 0);
    autoGroup.add(autoNose);

    // Windshield
    const autoWindshield = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.65, 1.06), darkGlass);
    autoWindshield.position.set(-1.2, 1.25, 0);
    autoWindshield.rotation.z = Math.PI / 15;
    autoGroup.add(autoWindshield);

    // Side Windows
    const sideWin1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.02), darkGlass);
    sideWin1.position.set(-0.75, 1.1, 0.56);
    autoGroup.add(sideWin1);
    const sideWin2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.02), darkGlass);
    sideWin2.position.set(-0.75, 1.1, -0.56);
    autoGroup.add(sideWin2);

    // Front single wheel and rear tandem wheels
    const autoTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.18, 24);
    const autoRearTireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 24);
    const autoHubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.24, 12);

    // Front Single Wheel
    const autoFrontWheel = new THREE.Group();
    autoFrontWheel.position.set(-1.25, 0.34, 0);
    const frontAutoTire = new THREE.Mesh(autoTireGeo, tireRubber);
    frontAutoTire.rotation.x = Math.PI / 2;
    autoFrontWheel.add(frontAutoTire);
    const frontAutoHub = new THREE.Mesh(autoHubGeo, shinyChrome);
    frontAutoHub.rotation.x = Math.PI / 2;
    autoFrontWheel.add(frontAutoHub);
    autoGroup.add(autoFrontWheel);

    // Rear Left Wheel
    const autoRearLeft = new THREE.Group();
    autoRearLeft.position.set(0.75, 0.34, 0.62);
    const rearLeftTire = new THREE.Mesh(autoRearTireGeo, tireRubber);
    rearLeftTire.rotation.x = Math.PI / 2;
    autoRearLeft.add(rearLeftTire);
    const rearLeftHub = new THREE.Mesh(autoHubGeo, shinyChrome);
    rearLeftHub.rotation.x = Math.PI / 2;
    autoRearLeft.add(rearLeftHub);
    autoGroup.add(autoRearLeft);

    // Rear Right Wheel
    const autoRearRight = new THREE.Group();
    autoRearRight.position.set(0.75, 0.34, -0.62);
    const rearRightTire = new THREE.Mesh(autoRearTireGeo, tireRubber);
    rearRightTire.rotation.x = Math.PI / 2;
    autoRearRight.add(rearRightTire);
    const rearRightHub = new THREE.Mesh(autoHubGeo, shinyChrome);
    rearRightHub.rotation.x = Math.PI / 2;
    autoRearRight.add(rearRightHub);
    autoGroup.add(autoRearRight);

    // Front headlights
    const autoHeadlight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), yellowLight);
    autoHeadlight.position.set(-1.43, 0.6, 0);
    autoGroup.add(autoHeadlight);

    scene.add(autoGroup);


    // ==================== selector HTML elements overlay ====================
    const buildSelectorUI = () => {
      const selector = document.createElement('div');
      selector.className = 'vehicle-selector-overlay';
      selector.style.position = 'absolute';
      selector.style.bottom = '16px';
      selector.style.left = '50%';
      selector.style.transform = 'translateX(-50%)';
      selector.style.zIndex = '30';
      selector.style.display = 'flex';
      selector.style.gap = '8px';
      selector.style.background = 'rgba(15, 23, 42, 0.75)';
      selector.style.backdropFilter = 'blur(12px)';
      selector.style.padding = '4px 6px';
      selector.style.borderRadius = '9999px';
      selector.style.border = '1px solid rgba(6, 182, 212, 0.3)';
      selector.style.boxShadow = '0 8px 32px 0 rgba(0, 240, 255, 0.15)';

      const buttonsData = [
        { id: 'lorry', text: '🚚 Lorry', activeColor: '#00f0ff', glow: 'rgba(0, 240, 255, 0.3)' },
        { id: 'bike', text: '🏍️ Bike', activeColor: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
        { id: 'auto', text: '🛺 Auto', activeColor: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' }
      ];

      buttonsData.forEach((btnData) => {
        const btn = document.createElement('button');
        btn.innerText = btnData.text;
        btn.style.padding = '6px 14px';
        btn.style.borderRadius = '9999px';
        btn.style.border = 'none';
        btn.style.fontFamily = "'Outfit', sans-serif";
        btn.style.fontWeight = '800';
        btn.style.fontSize = '10px';
        btn.style.letterSpacing = '0.08em';
        btn.style.textTransform = 'uppercase';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

        const setStyle = (isActive) => {
          if (isActive) {
            btn.style.background = btnData.activeColor;
            btn.style.color = '#0f172a';
            btn.style.boxShadow = `0 0 12px ${btnData.glow}`;
            btn.style.transform = 'scale(1.05)';
          } else {
            btn.style.background = 'transparent';
            btn.style.color = '#94a3b8';
            btn.style.boxShadow = 'none';
            btn.style.transform = 'scale(1.0)';
          }
        };

        setStyle(btnData.id === activeVehicle);

        btn.addEventListener('click', () => {
          activeVehicle = btnData.id;
          Array.from(selector.children).forEach((child, idx) => {
            const isChildActive = buttonsData[idx].id === activeVehicle;
            child.updateStyle(isChildActive);
          });
        });

        // Add custom state updater directly on DOM node
        btn.updateStyle = setStyle;

        selector.appendChild(btn);
      });

      container.appendChild(selector);
    };

    buildSelectorUI();


    // 5. Animation Render Loop with Grand transition LERPs
    const animate = (time) => {
      requestAnimationFrame(animate);

      if (controls) {
        controls.update();
      }

      const elapsed = time * 0.001;

      // Update lorry targets
      const lorryTargetScale = activeVehicle === 'lorry' ? 1.05 : 0.001;
      const lorryTargetY = activeVehicle === 'lorry' ? -0.35 : -2.5;
      const lorryRotSpeed = activeVehicle === 'lorry' ? elapsed * 0.25 : elapsed * 2.2;

      // Update bike targets
      const bikeTargetScale = activeVehicle === 'bike' ? 1.15 : 0.001;
      const bikeTargetY = activeVehicle === 'bike' ? -0.4 : -2.5;
      const bikeRotSpeed = activeVehicle === 'bike' ? elapsed * 0.25 : elapsed * 2.2;

      // Update auto targets
      const autoTargetScale = activeVehicle === 'auto' ? 1.0 : 0.001;
      const autoTargetY = activeVehicle === 'auto' ? -0.35 : -2.5;
      const autoRotSpeed = activeVehicle === 'auto' ? elapsed * 0.25 : elapsed * 2.2;

      // Smooth Lerp Lorry scale, position, rotation
      lorryGroup.scale.set(
        THREE.MathUtils.lerp(lorryGroup.scale.x, lorryTargetScale, 0.08),
        THREE.MathUtils.lerp(lorryGroup.scale.y, lorryTargetScale, 0.08),
        THREE.MathUtils.lerp(lorryGroup.scale.z, lorryTargetScale, 0.08)
      );
      lorryGroup.position.y = THREE.MathUtils.lerp(lorryGroup.position.y, lorryTargetY, 0.08);
      if (activeVehicle === 'lorry') {
        lorryGroup.rotation.y = elapsed * 0.25;
      } else {
        lorryGroup.rotation.y = THREE.MathUtils.lerp(lorryGroup.rotation.y, lorryRotSpeed, 0.08);
      }

      // Smooth Lerp Bike scale, position, rotation
      bikeGroup.scale.set(
        THREE.MathUtils.lerp(bikeGroup.scale.x, bikeTargetScale, 0.08),
        THREE.MathUtils.lerp(bikeGroup.scale.y, bikeTargetScale, 0.08),
        THREE.MathUtils.lerp(bikeGroup.scale.z, bikeTargetScale, 0.08)
      );
      bikeGroup.position.y = THREE.MathUtils.lerp(bikeGroup.position.y, bikeTargetY, 0.08);
      if (activeVehicle === 'bike') {
        bikeGroup.rotation.y = elapsed * 0.25;
      } else {
        bikeGroup.rotation.y = THREE.MathUtils.lerp(bikeGroup.rotation.y, bikeRotSpeed, 0.08);
      }

      // Smooth Lerp Auto scale, position, rotation
      autoGroup.scale.set(
        THREE.MathUtils.lerp(autoGroup.scale.x, autoTargetScale, 0.08),
        THREE.MathUtils.lerp(autoGroup.scale.y, autoTargetScale, 0.08),
        THREE.MathUtils.lerp(autoGroup.scale.z, autoTargetScale, 0.08)
      );
      autoGroup.position.y = THREE.MathUtils.lerp(autoGroup.position.y, autoTargetY, 0.08);
      if (activeVehicle === 'auto') {
        autoGroup.rotation.y = elapsed * 0.25;
      } else {
        autoGroup.rotation.y = THREE.MathUtils.lerp(autoGroup.rotation.y, autoRotSpeed, 0.08);
      }

      renderer.render(scene, camera);
    };

    requestAnimationFrame(animate);

    // 6. Handle Resizing
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  };

  // Trigger 3D Viewport Initialization
  init3DShowcase();


  // ==================== LIVE TRACKING SIMULATOR (CANVAS) ====================
  const mapCanvas = document.getElementById('mapCanvas');
  const ctx = mapCanvas.getContext('2d');
  const btnRunTracking = document.getElementById('btn-run-tracking');
  const trackInput = document.getElementById('track-input');
  
  const trackStatusTxt = document.getElementById('track-status-txt');
  const trackEtaTxt = document.getElementById('track-eta-txt');
  const trackCourierTxt = document.getElementById('track-courier-txt');
  
  const stepOrdered = document.getElementById('step-ordered');
  const stepPickup = document.getElementById('step-pickup');
  const stepTransit = document.getElementById('step-transit');
  const stepDelivered = document.getElementById('step-delivered');

  let animationFrameId = null;
  let progress = 0;
  let simulationActive = false;

  const shopLoc = { x: 50, y: 120, label: "Merchant Shop" };
  const sortingLoc = { x: 260, y: 60, label: "Deliverse Hub" };
  const houseLoc = { x: 500, y: 150, label: "Customer Door" };

  const roadNodes = [];
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const x = (1 - t) * (1 - t) * shopLoc.x + 2 * (1 - t) * t * 150 + t * t * sortingLoc.x;
    const y = (1 - t) * (1 - t) * shopLoc.y + 2 * (1 - t) * t * 140 + t * t * sortingLoc.y;
    roadNodes.push({ x, y });
  }
  for (let i = 1; i <= 50; i++) {
    const t = i / 50;
    const x = (1 - t) * (1 - t) * sortingLoc.x + 2 * (1 - t) * t * 380 + t * t * houseLoc.x;
    const y = (1 - t) * (1 - t) * sortingLoc.y + 2 * (1 - t) * t * 30 + t * t * houseLoc.y;
    roadNodes.push({ x, y });
  }

  function drawCityMap() {
    ctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < mapCanvas.width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, mapCanvas.height); ctx.stroke();
    }
    for (let j = 0; j < mapCanvas.height; j += 40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(mapCanvas.width, j); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(22, 163, 74, 0.15)';
    ctx.beginPath(); ctx.arc(380, 110, 45, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
    ctx.font = 'bold 9px Inter';
    ctx.fillText("CENTRAL PARK", 350, 113);

    ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.bezierCurveTo(150, 10, 250, 180, 560, 20);
    ctx.stroke();

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(roadNodes[0].x, roadNodes[0].y);
    for (let k = 1; k < roadNodes.length; k++) {
      ctx.lineTo(roadNodes[k].x, roadNodes[k].y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    drawLandmark(shopLoc, '#1E293B');
    drawLandmark(sortingLoc, '#F59E0B');
    drawLandmark(houseLoc, '#6366F1');
  }

  function drawLandmark(loc, color) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath(); ctx.arc(loc.x, loc.y + 4, 8, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(loc.x, loc.y, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 9px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(loc.label, loc.x, loc.y - 15);
  }

  function animateCourier() {
    if (!simulationActive) return;
    drawCityMap();
    
    const nodeIndex = Math.min(Math.floor(progress), roadNodes.length - 1);
    const courierPos = roadNodes[nodeIndex];
    
    const pulseRadius = 12 + Math.abs(Math.sin(Date.now() / 200)) * 6;
    ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
    ctx.beginPath(); ctx.arc(courierPos.x, courierPos.y, pulseRadius, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = '#16A34A';
    ctx.beginPath(); ctx.arc(courierPos.x, courierPos.y, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    updateSimulationState(progress);

    if (progress < roadNodes.length - 1) {
      progress += 0.35;
      animationFrameId = requestAnimationFrame(animateCourier);
    } else {
      simulationActive = false;
      progress = roadNodes.length - 1;
      updateSimulationState(progress);
    }
  }

  function updateSimulationState(prog) {
    const totalNodes = roadNodes.length;
    const percentage = (prog / (totalNodes - 1)) * 100;
    
    [stepOrdered, stepPickup, stepTransit, stepDelivered].forEach(step => {
      step.classList.remove('done', 'active');
    });

    if (percentage === 0) {
      trackStatusTxt.innerText = "Order Dispatched";
      trackEtaTxt.innerText = "25 mins";
      stepOrdered.classList.add('active');
    } 
    else if (percentage > 0 && percentage < 30) {
      trackStatusTxt.innerText = "Courier at Store";
      trackEtaTxt.innerText = "22 mins";
      stepOrdered.classList.add('done');
      stepPickup.classList.add('active');
    }
    else if (percentage >= 30 && percentage < 50) {
      trackStatusTxt.innerText = "Package Sorted at Hub";
      trackEtaTxt.innerText = "18 mins";
      stepOrdered.classList.add('done');
      stepPickup.classList.add('done');
      stepTransit.classList.add('active');
    }
    else if (percentage >= 50 && percentage < 95) {
      trackStatusTxt.innerText = "Out for Delivery (Transit)";
      const remMins = Math.max(1, Math.round(15 * (1 - (percentage - 50) / 45)));
      trackEtaTxt.innerText = `${remMins} mins`;
      stepOrdered.classList.add('done');
      stepPickup.classList.add('done');
      stepTransit.classList.add('active');
    }
    else {
      trackStatusTxt.innerText = "Delivered!";
      trackEtaTxt.innerText = "Delivered";
      stepOrdered.classList.add('done');
      stepPickup.classList.add('done');
      stepTransit.classList.add('done');
      stepDelivered.classList.add('done');
    }
  }

  btnRunTracking.addEventListener('click', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    progress = 0;
    simulationActive = true;
    
    const trackingCode = trackInput.value.trim().toUpperCase();
    if (trackingCode.includes('2041') || trackingCode.includes('20')) {
      trackCourierTxt.innerText = "Sarah Jenkins (Self-Courier)";
    } else {
      trackCourierTxt.innerText = "Marcus Chen (Gojek Elite)";
    }
    animateCourier();
  });

  drawCityMap();


  // ==================== SHIPPING CALCULATOR ====================
  const btnRunCalc = document.getElementById('btn-run-calc');
  const calcResultsBox = document.getElementById('calc-results');
  
  const pickupArea = document.getElementById('pickup-area');
  const dropArea = document.getElementById('drop-area');
  const packageWeight = document.getElementById('p-weight');
  const packageDimension = document.getElementById('p-dimensions');
  const deliverySpeed = document.getElementById('p-speed');

  const quotePrice = document.getElementById('quote-price');
  const quoteBase = document.getElementById('quote-base');
  const quoteDist = document.getElementById('quote-dist');
  const quoteTotal = document.getElementById('quote-total');
  const quoteEta = document.getElementById('quote-eta');
  const btnCalcOnboard = document.getElementById('btn-calc-onboard');

  btnRunCalc.addEventListener('click', () => {
    const pick = pickupArea.value;
    const drop = dropArea.value;
    const weight = parseFloat(packageWeight.value) || 1;
    const size = packageDimension.value;
    const speed = deliverySpeed.value;

    let base = 4.00;
    if (size === 'envelope') base = 3.00;
    else if (size === 'medium') base = 5.50;
    else if (size === 'large') base = 9.00;

    const weightCharge = Math.max(0, (weight - 1) * 0.75);
    base += weightCharge;

    let distanceSurcharge = 2.00;
    if (pick === drop) {
      distanceSurcharge = 1.00;
    } else if ((pick === 'harbor' && drop === 'suburbs') || (pick === 'suburbs' && drop === 'harbor')) {
      distanceSurcharge = 4.50;
    } else {
      distanceSurcharge = 2.75;
    }

    let multiplier = 1.0;
    let etaLabel = "Same-day (Under 4 Hours)";
    
    if (speed === 'eco') {
      multiplier = 0.8;
      etaLabel = "Eco Next-day (By 2:00 PM)";
    } else if (speed === 'express') {
      multiplier = 1.6;
      etaLabel = "Super Sonic Express (Under 90 Minutes)";
    }

    const subtotal = base + distanceSurcharge;
    const finalTotal = subtotal * multiplier;

    quoteBase.innerText = `$${base.toFixed(2)}`;
    quoteDist.innerText = `$${distanceSurcharge.toFixed(2)}`;
    quotePrice.innerText = `$${finalTotal.toFixed(2)}`;
    quoteTotal.innerText = `$${finalTotal.toFixed(2)}`;
    quoteEta.innerText = etaLabel;

    calcResultsBox.classList.add('active');
    
    const modalBody = modalCalculator.querySelector('.modal-body');
    modalBody.scrollTo({
      top: modalBody.scrollHeight,
      behavior: 'smooth'
    });
  });

  btnCalcOnboard.addEventListener('click', () => {
    closeModal(modalCalculator);
    setTimeout(() => openModal(modalDriver), 350);
  });


  // ==================== DRIVER EARNINGS ESTIMATOR ====================
  const tripsSlider = document.getElementById('trips-slider');
  const valTrips = document.getElementById('val-trips');
  const valEarnings = document.getElementById('val-earnings');

  function calculateDriverEarnings() {
    const trips = parseInt(tripsSlider.value);
    valTrips.innerHTML = `<strong>${trips}</strong>`;
    
    const payout = trips * 7.50;
    valEarnings.innerText = `$${payout.toFixed(2)}`;
  }

  tripsSlider.addEventListener('input', calculateDriverEarnings);
  calculateDriverEarnings();


  // ==================== STORE CONNECTIONS LIST ====================
  const btnIntMultiverse = document.getElementById('btn-int-multiverse');
  const btnIntShopify = document.getElementById('btn-int-shopify');
  const btnIntWoo = document.getElementById('btn-int-woo');

  function setupConnectionTrigger(btn, storeName, itemCardId) {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('connected')) {
        btn.classList.remove('connected');
        btn.innerText = 'Connect';
        document.getElementById(itemCardId).classList.remove('active-style');
      } else {
        btn.innerText = 'Connecting...';
        btn.disabled = true;
        
        setTimeout(() => {
          btn.disabled = false;
          btn.classList.add('connected');
          btn.innerText = 'Connected';
          document.getElementById(itemCardId).classList.add('active-style');
          alert(`${storeName} account connected to Deliverse successfully! Courier dispatching is now automated.`);
        }, 1200);
      }
    });
  }

  setupConnectionTrigger(btnIntMultiverse, 'Multiverse Vendor Hub', 'int-multiverse');
  setupConnectionTrigger(btnIntShopify, 'Shopify Store', 'int-shopify');
  setupConnectionTrigger(btnIntWoo, 'WooCommerce Dashboard', 'int-woo');

  // ==================== LIVE FLEET RADAR SIMULATION ENGINE ====================
  function initFleetRadar() {
    const canvas = document.getElementById('fleetRadarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const partnerList = document.getElementById('radar-partner-list');
    const hoverCard = document.getElementById('radar-hover-card');

    // Radar Hover Card details
    const hoverAvatar = document.getElementById('hover-partner-avatar');
    const hoverName = document.getElementById('hover-partner-name');
    const hoverVehicle = document.getElementById('hover-partner-vehicle');
    const hoverStatus = document.getElementById('hover-partner-status');
    const hoverRating = document.getElementById('hover-partner-rating');

    // Define Grid Streets
    const streetsY = [60, 150, 240, 330];
    const avenuesX = [80, 220, 360, 500, 645, 780];

    // Build Intersections Graph Nodes
    const nodes = [];
    let nodeIdCounter = 0;
    for (let x of avenuesX) {
      for (let y of streetsY) {
        nodes.push({ id: nodeIdCounter++, x: x, y: y });
      }
    }

    // Connect Adjacent Nodes to build Grid Streets
    const getNeighbors = (node) => {
      const neighbors = [];
      for (let n of nodes) {
        if (n.id === node.id) continue;
        // check horizontal adjacency
        if (n.y === node.y && Math.abs(n.x - node.x) < 150) {
          neighbors.push(n);
        }
        // check vertical adjacency
        if (n.x === node.x && Math.abs(n.y - node.y) < 100) {
          neighbors.push(n);
        }
      }
      return neighbors;
    };

    // Available Fleet Partners
    const partners = [
      { id: 0, name: "Marcus Chen", vehicle: "🏍️ Scooter", rating: "5.0", status: "Available", avatar: "🏍️", color: "#00f0ff", x: 220, y: 150, node: nodes[6], targetNode: nodes[7], progress: 0, speed: 0.008 },
      { id: 1, name: "Sarah Jenkins", vehicle: "🛺 Cargo Auto", rating: "4.9", status: "Available", avatar: "🛺", color: "#f59e0b", x: 360, y: 60, node: nodes[9], targetNode: nodes[5], progress: 0, speed: 0.005 },
      { id: 2, name: "Elena Rostova", vehicle: "🚲 E-Bike", rating: "5.0", status: "Available", avatar: "🚲", color: "#10b981", x: 500, y: 240, node: nodes[14], targetNode: nodes[15], progress: 0, speed: 0.012 },
      { id: 3, name: "Alex Rivera", vehicle: "🚛 Lorry Truck", rating: "4.8", status: "Available", avatar: "🚛", color: "#4f46e5", x: 80, y: 330, node: nodes[3], targetNode: nodes[2], progress: 0, speed: 0.004 },
      { id: 4, name: "Ravi Kumar", vehicle: "🛺 Goods Auto", rating: "4.9", status: "Available", avatar: "🛺", color: "#ff7a00", x: 645, y: 150, node: nodes[18], targetNode: nodes[17], progress: 0, speed: 0.007 },
      { id: 5, name: "Siti Aminah", vehicle: "🛵 Moped", rating: "5.0", status: "Available", avatar: "🛵", color: "#a855f7", x: 500, y: 330, node: nodes[15], targetNode: nodes[11], progress: 0, speed: 0.010 }
    ];

    let hoveredPartnerId = null;
    let sidebarHighlightedId = null;
    let mousePos = { x: 0, y: 0 };
    let sonarAngle = 0;

    // Render Sidebar Nodes dynamically
    function renderSidebar() {
      if (!partnerList) return;
      partnerList.innerHTML = partners.map(p => `
        <div class="partner-status-node" data-id="${p.id}" id="partner-node-${p.id}">
          <div class="node-avatar" style="border: 2px solid ${p.color};">${p.avatar}</div>
          <div class="node-info">
            <h5>${p.name}</h5>
            <span>${p.vehicle} · <i class="fa-solid fa-star" style="color:#f59e0b;font-size:8px;"></i> ${p.rating}</span>
          </div>
          <span class="node-status-badge">Online</span>
        </div>
      `).join('');

      // Add Sidebar Event Listeners
      partners.forEach(p => {
        const element = document.getElementById(`partner-node-${p.id}`);
        if (element) {
          element.addEventListener('mouseenter', () => {
            sidebarHighlightedId = p.id;
          });
          element.addEventListener('mouseleave', () => {
            sidebarHighlightedId = null;
          });
        }
      });
    }

    renderSidebar();

    // Canvas Mouse listeners
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mousePos.x = (e.clientX - rect.left) * scaleX;
      mousePos.y = (e.clientY - rect.top) * scaleY;

      // Check distance to partners
      let found = false;
      for (let p of partners) {
        const dist = Math.hypot(p.x - mousePos.x, p.y - mousePos.y);
        if (dist < 18) {
          hoveredPartnerId = p.id;
          found = true;

          // Populate hover card details
          if (hoverAvatar) hoverAvatar.innerText = p.avatar;
          if (hoverName) hoverName.innerText = p.name;
          if (hoverVehicle) hoverVehicle.innerText = p.vehicle;
          if (hoverStatus) hoverStatus.innerText = p.status;
          if (hoverRating) hoverRating.innerHTML = `<i class="fa-solid fa-star text-amber-500"></i> ${p.rating}`;

          // Reposition Card
          if (hoverCard) {
            const cardX = (p.x / scaleX) + 15;
            const cardY = (p.y / scaleY) - 10;
            hoverCard.style.left = `${cardX}px`;
            hoverCard.style.top = `${cardY}px`;
            hoverCard.classList.remove('hidden');
          }
          break;
        }
      }

      if (!found) {
        hoveredPartnerId = null;
        if (hoverCard) hoverCard.classList.add('hidden');
      }
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredPartnerId = null;
      if (hoverCard) hoverCard.classList.add('hidden');
    });

    // Radar main frame updates
    function updateFleet() {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Faint Fills & Map Background Grid
      ctx.fillStyle = '#040815';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
      }

      // 3. Draw Roads (slate grid tracks)
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Horizontal lines
      for (let y of streetsY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      // Vertical lines
      for (let x of avenuesX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw dashed lane markings
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      for (let y of streetsY) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      for (let x of avenuesX) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      ctx.setLineDash([]);

      // 4. Draw Radar Sonar Sweeping Glow
      ctx.save();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      sonarAngle += 0.005;

      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 380);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 380, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Sonar sweeping line
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sonarAngle) * 380, centerY + Math.sin(sonarAngle) * 380);
      ctx.stroke();
      ctx.restore();

      // 5. Draw Landmarks
      drawHubNode({ x: 360, y: 150, label: "Merchant Shop", color: "#ef4444" });
      drawHubNode({ x: 500, y: 150, label: "Deliverse Hub", color: "#f59e0b" });
      drawHubNode({ x: 220, y: 240, label: "Express Drop", color: "#6366f1" });

      // 6. Update & Draw moving partners
      partners.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.node = p.targetNode;
          // Get next random neighboring intersection node
          const neighbors = getNeighbors(p.node);
          if (neighbors.length > 0) {
            p.targetNode = neighbors[Math.floor(Math.random() * neighbors.length)];
          }
        }

        // Interpolate coordinates
        p.x = p.node.x + (p.targetNode.x - p.node.x) * p.progress;
        p.y = p.node.y + (p.targetNode.y - p.node.y) * p.progress;

        // Draw pulsing beacon halos
        const isFocused = (p.id === hoveredPartnerId || p.id === sidebarHighlightedId);
        const pulseMax = isFocused ? 24 : 14;
        const pulse = 6 + Math.abs(Math.sin(Date.now() / 250)) * pulseMax;
        
        ctx.fillStyle = isFocused ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Draw core beacon point
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw emoji overlay inside canvas
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.avatar, p.x, p.y - 14);

        // Sidebar highlight matching card
        const nodeCard = document.getElementById(`partner-node-${p.id}`);
        if (nodeCard) {
          if (isFocused) {
            nodeCard.classList.add('active');
          } else {
            nodeCard.classList.remove('active');
          }
        }
      });

      requestAnimationFrame(updateFleet);
    }

    function drawHubNode(hub) {
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.arc(hub.x, hub.y + 4, 7, 0, Math.PI * 2); ctx.fill();
      
      // core
      ctx.fillStyle = hub.color;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 9, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // label
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 8px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText(hub.label.toUpperCase(), hub.x, hub.y - 13);
    }

    requestAnimationFrame(updateFleet);
  }

  // Fire live radar simulation
  initFleetRadar();

});
