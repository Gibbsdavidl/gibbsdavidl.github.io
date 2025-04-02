
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var numBugs = 128;
  var bugs = [];
  var bugLength = 3;
  var bugSize = 8;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

function initBugs() {
  bugs = [];
  for (let i = 0; i < numBugs; i++) {
    let x = 10 + 100 * (Math.random() - 0.5);
    let y = 10 + 100 * (Math.random() - 0.5);
    let z = 10 + 100 * (Math.random() - 0.5);

    let c1 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    let c2 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    let c3 = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    let bugcol = [c1, c2, c3]; 

    let trail = [];
    for (let j = 0; j < bugLength; j++) {
      trail.push({ x, y, z });
    }

    bugs.push({
      x: x, y: y, z: z,
      trail: trail,
      bugcol: bugcol,
      tick: 0
    });
  }
}


function updateLorenz(bug, dt) {
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;

  let dx = sigma * (bug.y - bug.x);
  let dy = bug.x * (rho - bug.z) - bug.y;
  let dz = bug.x * bug.y - beta * bug.z;

  const nudge = 0.1;
  dx += (Math.random() - 0.5) * nudge;
  dy += (Math.random() - 0.5) * nudge;
  dz += (Math.random() - 0.5) * nudge;

  bug.x += dx * dt;
  bug.y += dy * dt;
  bug.z += dz * dt;

  // Always add to trail every frame (but dt is slow)
  bug.trail.unshift({ x: bug.x, y: bug.y, z: bug.z });
  if (bug.trail.length > bugLength) {
    bug.trail.length = bugLength;
  }
}


function drawBugs() {
  const scale = 18; // adjust for how large you want the display
  for (let i = 0; i < bugs.length; i++) {
    const b = bugs[i];
    const colors = b.bugcol;

    for (let j = 0; j < b.trail.length; j++) {
      const t = b.trail[j];
      const px = canvas.width / 2 + t.x * scale;
      const py = canvas.height / 2 - t.z * scale+240;

      // Only draw if visible
      if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
        ctx.beginPath();
        ctx.rect(px, py, bugSize, bugSize);
        ctx.fillStyle = colors[j] || colors[colors.length - 1];
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bugs.length; i++) {
      updateLorenz(bugs[i], 0.001 + Math.random() * 0.001);
    }

    drawBugs();
    requestAnimationFrame(draw);
  }

  function start() {
    resizeCanvas();
    initBugs();
    window.addEventListener('resize', resizeCanvas);
    draw();
  }

  (function () {
    window.onload = function () {
      start();
    };
  })();

