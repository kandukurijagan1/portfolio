/**
 * Three.js Interactive 3D WebGL Neural Scene & 3D Card Physics
 * Built for Kandukuri Jagan's Portfolio
 */

(function() {
  "use strict";

  // Check if Three.js is loaded
  if (typeof THREE === "undefined") {
    console.warn("Three.js not loaded. Skipping 3D WebGL initialization.");
    return;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHero3DScene();
    initAdvanced3DCardTilt();
  });

  /**
   * 1. Interactive 3D WebGL Neural Constellation & Core Geometry
   */
  function initHero3DScene() {
    const container = document.getElementById("hero-3d-container");
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 700;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 3000);
    camera.position.z = 520;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.id = "hero-3d-canvas";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "0";
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "0";
    container.insertBefore(renderer.domElement, container.firstChild);

    // Color Palettes based on current theme
    function getThemeColors() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      return isLight ? {
        nodeColor: 0x2563eb,     // Royal Blue
        lineColor: 0x3b82f6,     // Vibrant Blue
        coreWireColor: 0x0284c7, // Deep Cyan
        coreInnerColor: 0x93c5fd,// Sky Blue
        dustColor: 0x64748b,     // Slate
        lineOpacity: 0.28,
        nodeOpacity: 0.85
      } : {
        nodeColor: 0x38bdf8,     // Neon Cyan
        lineColor: 0x818cf8,     // Purple/Indigo
        coreWireColor: 0x38bdf8, // Cyan
        coreInnerColor: 0xc084fc,// Neon Violet
        dustColor: 0x94a3b8,     // Light Slate
        lineOpacity: 0.32,
        nodeOpacity: 0.9
      };
    }

    let colors = getThemeColors();

    // --------------------------------------------------------------------------
    // A. 3D Floating Tech Polyhedron (The Futuristic Holographic Core)
    // --------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    coreGroup.position.set(width > 992 ? 260 : 0, 0, -40);
    scene.add(coreGroup);

    // Outer Wireframe Icosahedron
    const icosaGeom = new THREE.IcosahedronGeometry(90, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: colors.coreWireColor,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const icosahedron = new THREE.Mesh(icosaGeom, icosaMat);
    coreGroup.add(icosahedron);

    // Inner Glowing Geometric Dodecahedron
    const dodecaGeom = new THREE.DodecahedronGeometry(50, 0);
    const dodecaMat = new THREE.MeshBasicMaterial({
      color: colors.coreInnerColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const dodecahedron = new THREE.Mesh(dodecaGeom, dodecaMat);
    coreGroup.add(dodecahedron);

    // Orbiting Satellite Rings
    const ringGeom = new THREE.TorusGeometry(125, 1.2, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: colors.coreWireColor,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh1 = new THREE.Mesh(ringGeom, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeom, ringMat);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = -Math.PI / 4;
    coreGroup.add(ringMesh2);

    // --------------------------------------------------------------------------
    // B. Interactive 3D Neural Constellation Network (Nodes + Dynamic Links)
    // --------------------------------------------------------------------------
    const particleCount = width > 768 ? 120 : 65;
    const maxConnectionDistance = width > 768 ? 130 : 100;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    // Spread volume
    const boundX = width * 0.75;
    const boundY = height * 0.7;
    const boundZ = 350;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * boundX;
      const y = (Math.random() - 0.5) * boundY;
      const z = (Math.random() - 0.5) * boundZ;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleVelocities.push({
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        vz: (Math.random() - 0.5) * 0.5,
        baseX: x,
        baseY: y,
        baseZ: z
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Particle Material with Soft Circular Point Texture
    const canvasPoint = document.createElement("canvas");
    canvasPoint.width = 32;
    canvasPoint.height = 32;
    const ctx = canvasPoint.getContext("2d");
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(56,189,248,0.9)");
    gradient.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const pointTexture = new THREE.CanvasTexture(canvasPoint);

    const particleMaterial = new THREE.PointsMaterial({
      size: 9,
      map: pointTexture,
      transparent: true,
      opacity: colors.nodeOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Dynamic Line Segments connecting nearby nodes
    const maxLines = particleCount * 6;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: colors.lineOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // --------------------------------------------------------------------------
    // C. Deep Atmospheric 3D Starfield / Floating Data Dust
    // --------------------------------------------------------------------------
    const dustCount = width > 768 ? 220 : 100;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * boundX * 1.5;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * boundY * 1.5;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 3,
      color: colors.dustColor,
      transparent: true,
      opacity: 0.4
    });
    const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustParticles);

    // --------------------------------------------------------------------------
    // D. Interactive Mouse & Gyroscope Physics
    // --------------------------------------------------------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeIntersect = new THREE.Vector3();

    window.addEventListener("mousemove", (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouse.targetX = (e.clientX - windowHalfX) * 0.35;
      mouse.targetY = (e.clientY - windowHalfY) * 0.35;

      // Project mouse into 3D space for particle deflection
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera({ x: normX, y: normY }, camera);
      raycaster.ray.intersectPlane(planeZ, planeIntersect);
    }, { passive: true });

    // Interactive Shockwave on Click
    let shockwaveRadius = -1;
    let shockwaveCenter = new THREE.Vector3();
    window.addEventListener("click", (e) => {
      if (e.target.closest("a, button, input, textarea, select")) return;
      shockwaveRadius = 0;
      shockwaveCenter.copy(planeIntersect);
    });

    // High-speed vortex burst on HUD badge hover
    const hudBadge = document.getElementById("hud-3d-badge");
    let speedBurst = 1;
    if (hudBadge) {
      hudBadge.addEventListener("mouseenter", () => {
        speedBurst = 6;
      });
      hudBadge.addEventListener("mouseleave", () => {
        speedBurst = 1;
      });
    }

    // --------------------------------------------------------------------------
    // E. Responsive Resize & Intersection Visibility Observer
    // --------------------------------------------------------------------------
    let isVisible = true;
    const heroSection = document.getElementById("home");
    if (heroSection && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(heroSection);
    }

    function onWindowResize() {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 700;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      coreGroup.position.x = width > 992 ? 260 : 0;
    }
    window.addEventListener("resize", onWindowResize);

    // Watch for Light / Dark Mode Toggle to update 3D colors live
    const themeObserver = new MutationObserver(() => {
      colors = getThemeColors();
      icosaMat.color.setHex(colors.coreWireColor);
      dodecaMat.color.setHex(colors.coreInnerColor);
      ringMat.color.setHex(colors.coreWireColor);
      lineMaterial.opacity = colors.lineOpacity;
      particleMaterial.opacity = colors.nodeOpacity;
      dustMaterial.color.setHex(colors.dustColor);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // --------------------------------------------------------------------------
    // F. 60 FPS Render & Animation Loop
    // --------------------------------------------------------------------------
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return; // Freeze when scrolled away for 100% CPU saving

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth Camera Parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      camera.position.x = mouse.x;
      camera.position.y = -mouse.y;
      camera.lookAt(0, 0, 0);

      // Rotate Holographic Tech Core
      const burstDelta = delta * speedBurst;
      icosahedron.rotation.x += 0.005 * speedBurst;
      icosahedron.rotation.y += 0.008 * speedBurst;
      dodecahedron.rotation.x -= 0.009 * speedBurst;
      dodecahedron.rotation.z += 0.007 * speedBurst;
      ringMesh1.rotation.z += 0.006 * speedBurst;
      ringMesh2.rotation.z -= 0.007 * speedBurst;
      coreGroup.position.y = Math.sin(elapsedTime * 1.5) * 12;

      // Expand Shockwave
      if (shockwaveRadius >= 0) {
        shockwaveRadius += 12;
        if (shockwaveRadius > 450) shockwaveRadius = -1;
      }

      // Update Constellation Nodes
      const positions = particleGeometry.attributes.position.array;
      let lineIndex = 0;
      const linePos = lineGeometry.attributes.position.array;
      const lineCol = lineGeometry.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];

        // Normal Drift
        positions[i * 3] += vel.vx;
        positions[i * 3 + 1] += vel.vy;
        positions[i * 3 + 2] += vel.vz;

        // Bounce boundaries
        if (Math.abs(positions[i * 3]) > boundX / 2) vel.vx *= -1;
        if (Math.abs(positions[i * 3 + 1]) > boundY / 2) vel.vy *= -1;
        if (Math.abs(positions[i * 3 + 2]) > boundZ / 2) vel.vz *= -1;

        // Mouse Repulsion & Spring
        const dx = positions[i * 3] - planeIntersect.x;
        const dy = positions[i * 3 + 1] - planeIntersect.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 140) {
          const force = (1 - distToMouse / 140) * 8;
          positions[i * 3] += (dx / distToMouse) * force;
          positions[i * 3 + 1] += (dy / distToMouse) * force;
        }

        // Shockwave Ripple
        if (shockwaveRadius >= 0) {
          const distToShock = Math.sqrt(
            Math.pow(positions[i * 3] - shockwaveCenter.x, 2) +
            Math.pow(positions[i * 3 + 1] - shockwaveCenter.y, 2)
          );
          if (Math.abs(distToShock - shockwaveRadius) < 35) {
            positions[i * 3 + 2] += Math.sin((distToShock - shockwaveRadius) * 0.15) * 6;
          }
        }

        // Dynamic Line Connections
        for (let j = i + 1; j < particleCount; j++) {
          const p2x = positions[j * 3];
          const p2y = positions[j * 3 + 1];
          const p2z = positions[j * 3 + 2];

          const pDist = Math.sqrt(
            Math.pow(positions[i * 3] - p2x, 2) +
            Math.pow(positions[i * 3 + 1] - p2y, 2) +
            Math.pow(positions[i * 3 + 2] - p2z, 2)
          );

          if (pDist < maxConnectionDistance && lineIndex < maxLines * 6) {
            const alpha = 1.0 - pDist / maxConnectionDistance;

            linePos[lineIndex] = positions[i * 3];
            linePos[lineIndex + 1] = positions[i * 3 + 1];
            linePos[lineIndex + 2] = positions[i * 3 + 2];

            linePos[lineIndex + 3] = p2x;
            linePos[lineIndex + 4] = p2y;
            linePos[lineIndex + 5] = p2z;

            // Gradient line color
            const r = (colors.lineColor >> 16 & 255) / 255;
            const g = (colors.lineColor >> 8 & 255) / 255;
            const b = (colors.lineColor & 255) / 255;

            lineCol[lineIndex] = r * alpha;
            lineCol[lineIndex + 1] = g * alpha;
            lineCol[lineIndex + 2] = b * alpha;

            lineCol[lineIndex + 3] = r * alpha;
            lineCol[lineIndex + 4] = g * alpha;
            lineCol[lineIndex + 5] = b * alpha;

            lineIndex += 6;
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIndex / 3);

      // Slow deep dust rotation
      dustParticles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    }

    animate();
  }

  /**
   * 2. Advanced 3D Gyroscopic Tilt & Holographic Specular Glare System
   */
  function initAdvanced3DCardTilt() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Target rich interactive cards across the portfolio
    const interactive3DCards = document.querySelectorAll(
      ".project-card, .cert-folder-card, .skill-category-card, .about-card, .timeline-card.featured-synora, .timeline-card.featured-winner"
    );

    interactive3DCards.forEach(card => {
      // Create holographic specular glare overlay element if not present
      let glare = card.querySelector(".card-3d-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "card-3d-glare";
        card.style.position = card.style.position || "relative";
        card.style.transformStyle = "preserve-3d";
        card.appendChild(glare);
      }

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle, high-end 3D rotation angles (up to 7 degrees)
        const rotateX = ((mouseY - centerY) / centerY) * -7;
        const rotateY = ((mouseX - centerX) / centerX) * 7;

        card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;

        // Position holographic specular glare
        const glareX = (mouseX / rect.width) * 100;
        const glareY = (mouseY / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 70%)`;
        glare.style.opacity = "1";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        glare.style.opacity = "0";
      });
    });
  }

})();
