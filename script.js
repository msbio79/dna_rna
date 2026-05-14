// State
let nucleotides = [];
let nextId = 1;
let currentMode = 'simple'; // 'simple' | 'atomic'
let selectedSugar = 'deoxy';
let selectedBase = 'A';

let panX = 0, panY = 0, zoom = 1;
let animationFrameId = null;

let customBuilder = {
  phosphate: 'yes',
  sugar: 'deoxy',
  base: 'A'
};

// Base Models
const SIMPLE_BASES = {
  A: `<path d="M 25,-15 L 90,-15 L 100,0 L 90,15 L 15,15 Z" fill="#ffd43b" stroke="#f59f00" stroke-width="2"/><text x="55" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="white">A</text>`,
  T: `<path d="M 25,-15 L 80,-15 L 70,0 L 80,15 L 15,15 Z" fill="#b197fc" stroke="#845ef7" stroke-width="2"/><text x="45" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="white">T</text>`,
  U: `<path d="M 25,-15 L 80,-15 L 70,0 L 80,15 L 15,15 Z" fill="#74c0fc" stroke="#339af0" stroke-width="2"/><text x="45" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="white">U</text>`,
  G: `<path d="M 25,-15 L 90,-15 Q 100,0 90,15 L 15,15 Z" fill="#69db7c" stroke="#40c057" stroke-width="2"/><text x="55" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="white">G</text>`,
  C: `<path d="M 25,-15 L 80,-15 Q 70,0 80,15 L 15,15 Z" fill="#ff8787" stroke="#fa5252" stroke-width="2"/><text x="45" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="white">C</text>`
};

const SIMPLE_SUGAR_DEOXY = `<polygon points="0,-25 25,-15 15,15 -15,15 -25,-15" fill="#a5d8ff" stroke="#1971c2" stroke-width="2"/>`;
const SIMPLE_SUGAR_RIBOSE = `<polygon points="0,-25 25,-15 15,15 -15,15 -25,-15" fill="#ffc9c9" stroke="#fa5252" stroke-width="2"/>`;

const SIMPLE_PHOSPHATE = `<line x1="-25" y1="-15" x2="-40" y2="-40" stroke="#495057" stroke-width="2"/><circle cx="-40" cy="-40" r="14" fill="#66d9e8" stroke="#1098ad" stroke-width="2"/>`;

const ATOMIC_PHOSPHATE = `
  <line x1="-25" y1="-20" x2="-22" y2="-42" stroke="#495057" stroke-width="1"/>
  <circle cx="-40" cy="-60" r="14" fill="white" stroke="#e67700" stroke-width="2"/>
  <text x="-40" y="-56" text-anchor="middle" font-size="12" font-weight="bold" fill="#e67700">P</text>
  <line x1="-50" y1="-70" x2="-58" y2="-78" stroke="black" />
  <circle cx="-58" cy="-78" r="6" fill="white" />
  <text x="-58" y="-74" text-anchor="middle" font-size="10" fill="red">O</text>
  <line x1="-30" y1="-70" x2="-22" y2="-78" stroke="black" />
  <circle cx="-22" cy="-78" r="6" fill="white" />
  <text x="-22" y="-74" text-anchor="middle" font-size="10" fill="red">O</text>
  <line x1="-50" y1="-50" x2="-58" y2="-42" stroke="black" />
  <circle cx="-58" cy="-42" r="6" fill="white" />
  <text x="-58" y="-38" text-anchor="middle" font-size="10" fill="red">O</text>
  <line x1="-30" y1="-50" x2="-22" y2="-42" stroke="black" />
  <circle cx="-22" cy="-42" r="6" fill="white" />
  <text x="-22" y="-38" text-anchor="middle" font-size="10" fill="red">O</text>
`;

const ATOMIC_SUGAR_DEOXY = `
  <polygon points="0,-12 15,-2 10,18 -10,18 -15,-2" fill="none" stroke="#495057" stroke-width="2"/>
  <circle cx="0" cy="-15" r="6" fill="white" stroke="red" stroke-width="1"/>
  <text x="0" y="-11" text-anchor="middle" font-size="10" fill="red">O</text>
  <circle cx="15" cy="-5" r="6" fill="white" stroke="#343a40" stroke-width="1"/>
  <text x="15" y="-1" text-anchor="middle" font-size="10" fill="#343a40">C</text>
  <circle cx="10" cy="15" r="6" fill="white" stroke="#343a40" stroke-width="1"/>
  <text x="10" y="19" text-anchor="middle" font-size="10" fill="#343a40">C</text>
  <line x1="13" y1="20" x2="18" y2="28" stroke="#495057" stroke-width="1"/>
  <text x="18" y="38" text-anchor="middle" font-size="10" fill="#868e96">H</text>
  <circle cx="-10" cy="15" r="6" fill="white" stroke="#343a40" stroke-width="1"/>
  <text x="-10" y="19" text-anchor="middle" font-size="10" fill="#343a40">C</text>
  <line x1="-13" y1="20" x2="-18" y2="28" stroke="#495057" stroke-width="1"/>
  <text x="-18" y="38" text-anchor="middle" font-size="10" fill="red">OH</text>
  <circle cx="-15" cy="-5" r="6" fill="white" stroke="#343a40" stroke-width="1"/>
  <text x="-15" y="-1" text-anchor="middle" font-size="10" fill="#343a40">C</text>
  <line x1="-15" y1="-11" x2="-25" y2="-20" stroke="#495057" stroke-width="1"/>
  <circle cx="-25" cy="-20" r="6" fill="white" stroke="#343a40" stroke-width="1"/>
  <text x="-25" y="-16" text-anchor="middle" font-size="10" fill="#343a40">C</text>
`;

const ATOMIC_SUGAR_RIBOSE = ATOMIC_SUGAR_DEOXY
  .replace('<text x="18" y="38" text-anchor="middle" font-size="10" fill="#868e96">H</text>', '<text x="18" y="38" text-anchor="middle" font-size="10" fill="red">OH</text>');

const atomicRect = `
  <line x1="15" y1="-5" x2="25" y2="-5" stroke="#495057" stroke-width="2"/>
  <rect x="25" y="-22" width="25" height="44" fill="#ffffff" stroke="#495057" stroke-width="2" rx="4"/>`;

const ATOMIC_BASES = {
  A: `${atomicRect}
      <text x="37.5" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#862e9c">A</text>
      <line x1="50" y1="-10" x2="54" y2="-10" stroke="black"/>
      <line x1="66" y1="-10" x2="70" y2="-10" stroke="black"/>
      <text x="60" y="-6" text-anchor="middle" font-size="12" fill="blue">N</text>
      <text x="75" y="-6" text-anchor="middle" font-size="12" fill="#495057">H</text>
      <line x1="50" y1="10" x2="69" y2="10" stroke="black"/>
      <text x="75" y="14" text-anchor="middle" font-size="12" fill="blue">N</text>`,
  T: `${atomicRect}
      <text x="37.5" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#e67700">T</text>
      <line x1="50" y1="10" x2="69" y2="10" stroke="black"/>
      <text x="75" y="14" text-anchor="middle" font-size="12" fill="red">O</text>
      <line x1="50" y1="-10" x2="54" y2="-10" stroke="black"/>
      <line x1="66" y1="-10" x2="70" y2="-10" stroke="black"/>
      <text x="60" y="-6" text-anchor="middle" font-size="12" fill="blue">N</text>
      <text x="75" y="-6" text-anchor="middle" font-size="12" fill="#495057">H</text>`,
  U: `${atomicRect}
      <text x="37.5" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#c92a2a">U</text>
      <line x1="50" y1="10" x2="69" y2="10" stroke="black"/>
      <text x="75" y="14" text-anchor="middle" font-size="12" fill="red">O</text>
      <line x1="50" y1="-10" x2="54" y2="-10" stroke="black"/>
      <line x1="66" y1="-10" x2="70" y2="-10" stroke="black"/>
      <text x="60" y="-6" text-anchor="middle" font-size="12" fill="blue">N</text>
      <text x="75" y="-6" text-anchor="middle" font-size="12" fill="#495057">H</text>`,
  G: `${atomicRect}
      <text x="37.5" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#1864ab">G</text>
      <line x1="50" y1="-15" x2="69" y2="-15" stroke="black"/>
      <text x="75" y="-11" text-anchor="middle" font-size="12" fill="red">O</text>
      <line x1="50" y1="0" x2="54" y2="0" stroke="black"/>
      <line x1="66" y1="0" x2="70" y2="0" stroke="black"/>
      <text x="60" y="4" text-anchor="middle" font-size="12" fill="blue">N</text>
      <text x="75" y="4" text-anchor="middle" font-size="12" fill="#495057">H</text>
      <line x1="50" y1="15" x2="54" y2="15" stroke="black"/>
      <line x1="66" y1="15" x2="70" y2="15" stroke="black"/>
      <text x="60" y="19" text-anchor="middle" font-size="12" fill="blue">N</text>
      <text x="75" y="19" text-anchor="middle" font-size="12" fill="#495057">H</text>`,
  C: `${atomicRect}
      <text x="37.5" y="5" text-anchor="middle" font-size="16" font-weight="bold" fill="#2b8a3e">C</text>
      <line x1="50" y1="15" x2="54" y2="15" stroke="black"/>
      <line x1="66" y1="15" x2="70" y2="15" stroke="black"/>
      <text x="60" y="19" text-anchor="middle" font-size="12" fill="blue">N</text>
      <text x="75" y="19" text-anchor="middle" font-size="12" fill="#495057">H</text>
      <line x1="50" y1="0" x2="69" y2="0" stroke="black"/>
      <text x="75" y="4" text-anchor="middle" font-size="12" fill="blue">N</text>
      <line x1="50" y1="-15" x2="69" y2="-15" stroke="black"/>
      <text x="75" y="-11" text-anchor="middle" font-size="12" fill="red">O</text>`
};

const ringBond = `<line x1="15" y1="-5" x2="25" y2="0" stroke="#495057" stroke-width="2"/>`;

const pyrimidineShape = `
  <polygon points="25,0 35,-16 50,-16 60,0 50,16 35,16" fill="white" stroke="#495057" stroke-width="2"/>
`;

const purineShape = `
  <polygon points="25,0 35,-13 50,-10 50,10 35,13" fill="white" stroke="#495057" stroke-width="2"/>
  <polygon points="50,-10 65,-18 80,-10 80,10 65,18 50,10" fill="white" stroke="#495057" stroke-width="2"/>
`;

const RING_BASES = {
  A: `${ringBond}${purineShape}<text x="65" y="5" text-anchor="middle" font-size="14" font-weight="bold" fill="#862e9c">A</text>`,
  G: `${ringBond}${purineShape}<text x="65" y="5" text-anchor="middle" font-size="14" font-weight="bold" fill="#1864ab">G</text>`,
  T: `${ringBond}${pyrimidineShape}<text x="42.5" y="5" text-anchor="middle" font-size="14" font-weight="bold" fill="#e67700">T</text>`,
  C: `${ringBond}${pyrimidineShape}<text x="42.5" y="5" text-anchor="middle" font-size="14" font-weight="bold" fill="#0b7285">C</text>`,
  U: `${ringBond}${pyrimidineShape}<text x="42.5" y="5" text-anchor="middle" font-size="14" font-weight="bold" fill="#c92a2a">U</text>`
};

function getComplement(base) {
  if (base === 'A') return selectedSugar === 'ribose' ? 'U' : 'T';
  if (base === 'T' || base === 'U') return 'A';
  if (base === 'G') return 'C';
  if (base === 'C') return 'G';
}

function handleCustomCreation() {
  const rect = document.getElementById('workspace').getBoundingClientRect();
  let startX = (rect.width / 2 - panX) / zoom + (Math.random() - 0.5) * 100;
  let startY = (rect.height / 2 - panY) / zoom + (Math.random() - 0.5) * 100;

  let n = {
    id: nextId++,
    sugar: customBuilder.sugar,
    base: customBuilder.base === 'none' ? null : customBuilder.base,
    hasPhosphate: customBuilder.phosphate === 'yes',
    isCustom: true,
    x: startX, y: startY, rotation: 0,
    linked5: null, linked3: null, paired: null
  };

  nucleotides.push(n);
  render();
}

function handleBaseCreation(sugarType, base) {
  selectedSugar = sugarType;
  selectedBase = base;

  const rect = document.getElementById('workspace').getBoundingClientRect();
  let startX = (rect.width / 2 - panX) / zoom;
  if (sugarType === 'deoxy') startX -= 90; // Center DNA pair
  else startX += 180; // Offset RNA to the right

  let startY = (rect.height / 2 - panY) / zoom - 100;

  // Find the lowest nucleotide of the SAME sugar type in the normal orientation
  let normalNodes = nucleotides.filter(n => n.rotation === 0 && n.sugar === sugarType && !n.isCustom);
  let lastNormal = null;
  if (normalNodes.length > 0) {
    lastNormal = normalNodes.find(n => !n.linked3);
  }

  let newY = lastNormal ? lastNormal.y + 145 : startY;
  let newX = lastNormal ? lastNormal.x : startX;

  let n1 = {
    id: nextId++, sugar: sugarType, base: base,
    x: newX, y: newY, rotation: 0,
    linked5: null, linked3: null, paired: null
  };

  nucleotides.push(n1);

  if (lastNormal) {
    n1.linked5 = lastNormal.id;
    lastNormal.linked3 = n1.id;
  }

  // Only create complementary pair for DNA (double-stranded)
  if (sugarType === 'deoxy') {
    let compBase = getComplement(base);
    let n2 = {
      id: nextId++, sugar: sugarType, base: compBase,
      x: newX + 180, y: newY, rotation: 180,
      linked5: null, linked3: null, paired: null
    };

    n1.paired = n2.id;
    n2.paired = n1.id;

    if (lastNormal) {
      let lastComp = nucleotides.find(n => n.id === lastNormal.paired);
      if (lastComp) {
        lastComp.linked5 = n2.id;
        n2.linked3 = lastComp.id;
      }
    }
    nucleotides.push(n2);
  }

  render();
}

document.querySelectorAll('.dna-btn').forEach(btn => {
  btn.addEventListener('click', () => handleBaseCreation('deoxy', btn.dataset.base));
});

document.querySelectorAll('.rna-btn').forEach(btn => {
  btn.addEventListener('click', () => handleBaseCreation('ribose', btn.dataset.base));
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    render();
  });
});

document.getElementById('clear-btn').addEventListener('click', () => {
  nucleotides = [];
  document.getElementById('nucleotides_layer').innerHTML = '';
  document.getElementById('bonds_layer').innerHTML = '';
  render();
});

function createNucleotide(sugar, base, x, y) {
  const n = {
    id: nextId++, sugar, base,
    x: x, y: y,
    rotation: 0,
    linked5: null, linked3: null, paired: null
  };
  nucleotides.push(n);
  render();
}

function getStructure(n) {
  let simpleSugar = n.sugar === 'deoxy' ? SIMPLE_SUGAR_DEOXY : SIMPLE_SUGAR_RIBOSE;
  let atomicSugar = n.sugar === 'deoxy' ? ATOMIC_SUGAR_DEOXY : ATOMIC_SUGAR_RIBOSE;

  let pSimple = n.hasPhosphate !== false ? SIMPLE_PHOSPHATE : '';
  let pAtomic = n.hasPhosphate !== false ? ATOMIC_PHOSPHATE : '';

  let bSimple = n.base ? SIMPLE_BASES[n.base] : '';
  let bAtomic = n.base ? ATOMIC_BASES[n.base] : '';
  let bRing = n.base ? RING_BASES[n.base] : '';

  return `
    <g class="simple-group">
      ${pSimple}
      ${simpleSugar}
      ${bSimple}
    </g>
    <g class="atomic-group">
      ${pAtomic}
      ${bAtomic}
      ${atomicSugar}
    </g>
    <g class="ring-group">
      ${pAtomic}
      ${bRing}
      ${atomicSugar}
    </g>
  `;
}

function render() {
  const layer = document.getElementById('nucleotides_layer');
  const layer3d = document.getElementById('layer_3d');
  const bondsLayer = document.getElementById('bonds_layer');

  if (currentMode === '3d') {
    layer.style.display = 'none';
    bondsLayer.style.display = 'none';
    if (layer3d) layer3d.style.display = 'block';
    if (!animationFrameId) loop3D();
    return;
  } else {
    layer.style.display = 'block';
    bondsLayer.style.display = 'block';
    if (layer3d) layer3d.style.display = 'none';
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  nucleotides.forEach(n => {
    let g = document.getElementById('n-' + n.id);
    if (!g) {
      g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', 'n-' + n.id);
      g.setAttribute('class', 'nucleotide');
      g.innerHTML = getStructure(n);
      setupDrag(g, n);
      layer.appendChild(g);
    }

    g.setAttribute('transform', `translate(${n.x}, ${n.y}) rotate(${n.rotation})`);



    g.querySelector('.simple-group').style.display = currentMode === 'simple' ? 'block' : 'none';
    g.querySelector('.atomic-group').style.display = currentMode === 'atomic' ? 'block' : 'none';
    g.querySelector('.ring-group').style.display = currentMode === 'ring' ? 'block' : 'none';
  });

  // Remove deleted nucleotides
  Array.from(layer.children).forEach(g => {
    const id = parseInt(g.id.split('-')[1]);
    if (!nucleotides.find(n => n.id === id)) {
      layer.removeChild(g);
    }
  });

  drawBonds();
}

function drawBonds() {
  const bondsLayer = document.getElementById('bonds_layer');
  let bondsHTML = '';
  const drawnPairs = new Set();

  nucleotides.forEach(n => {
    if (n.paired && !drawnPairs.has(n.id)) {
      const p = nucleotides.find(x => x.id === n.paired);
      if (p) {
        drawnPairs.add(p.id);
        const normal = n.rotation === 0 ? n : p;

        let isAtomic = currentMode === 'atomic';
        let isRing = currentMode === 'ring';
        let normalIsPurine = normal.base === 'A' || normal.base === 'G';

        let x1, x2;
        if (isAtomic) {
          x1 = normal.x + 82;
          x2 = normal.x + 98;
        } else if (isRing) {
          x1 = normal.x + (normalIsPurine ? 60 : 40);
          x2 = normal.x + (normalIsPurine ? 140 : 120);
        } else {
          x1 = normal.x + (normalIsPurine ? 75 : 65);
          x2 = normal.x + (normalIsPurine ? 115 : 105);
        }
        let y = normal.y;

        let color = isAtomic ? '#ff6b6b' : '#adb5bd';
        let dash = isAtomic ? '4,4' : '4,3';

        if (normal.base === 'A' || normal.base === 'T' || normal.base === 'U') {
          let dy = isAtomic ? 10 : 5;
          bondsHTML += `<line x1="${x1}" y1="${y - dy}" x2="${x2}" y2="${y - dy}" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" />`;
          bondsHTML += `<line x1="${x1}" y1="${y + dy}" x2="${x2}" y2="${y + dy}" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" />`;
        } else {
          let dy = isAtomic ? 15 : 8;
          bondsHTML += `<line x1="${x1}" y1="${y - dy}" x2="${x2}" y2="${y - dy}" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" />`;
          bondsHTML += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" />`;
          bondsHTML += `<line x1="${x1}" y1="${y + dy}" x2="${x2}" y2="${y + dy}" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" />`;
        }
      }
    }

    if (n.linked3) {
      const bottomNode = nucleotides.find(x => x.id === n.linked3);
      if (bottomNode) {
        let isAtomic = currentMode === 'atomic' || currentMode === 'ring';
        if (n.rotation === 0) {
          let x1 = n.x - (isAtomic ? 22 : 15);
          let y1 = n.y + (isAtomic ? 42 : 15);
          let x2 = bottomNode.x - (isAtomic ? 22 : 40);
          let y2 = bottomNode.y - (isAtomic ? 78 : 40);
          bondsHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#495057" stroke-width="${isAtomic ? 2 : 2}" />`;
        } else {
          let x1 = n.x + (isAtomic ? 22 : 15);
          let y1 = n.y - (isAtomic ? 42 : 15);
          let x2 = bottomNode.x + (isAtomic ? 22 : 40);
          let y2 = bottomNode.y + (isAtomic ? 78 : 40);
          bondsHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#495057" stroke-width="${isAtomic ? 2 : 2}" />`;
        }
      }
    }
  });

  bondsLayer.innerHTML = bondsHTML;
}

// Dragging and Snapping Logic
function getConnectedNodes(startNodeId) {
  const visited = new Set();
  const queue = [startNodeId];
  while (queue.length > 0) {
    const currentId = queue.shift();
    if (!visited.has(currentId)) {
      visited.add(currentId);
      const node = nucleotides.find(n => n.id === currentId);
      if (node.linked5) queue.push(node.linked5);
      if (node.linked3) queue.push(node.linked3);
      if (node.paired) queue.push(node.paired);
    }
  }
  return Array.from(visited).map(id => nucleotides.find(n => n.id === id));
}

let isDraggingNode = false;

function setupDrag(element, node) {
  let dragGroup = [];
  let startX, startY;

  element.addEventListener('mousedown', startDrag);
  element.addEventListener('touchstart', startDrag, { passive: false });

  function startDrag(e) {
    if (e.target.tagName === 'button') return;
    e.preventDefault();
    e.stopPropagation();
    isDraggingNode = true;
    dragGroup = getConnectedNodes(node.id);

    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startY = e.touches ? e.touches[0].clientY : e.clientY;

    // Bring dragged elements to front
    dragGroup.forEach(n => {
      const el = document.getElementById('n-' + n.id);
      el.parentNode.appendChild(el);
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }

  function drag(e) {
    if (!isDraggingNode) return;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let dx = (clientX - startX) / zoom;
    let dy = (clientY - startY) / zoom;

    dragGroup.forEach(n => { n.x += dx; n.y += dy; });

    startX = clientX;
    startY = clientY;
    render();
  }

  function endDrag(e) {
    isDraggingNode = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);

    checkSnap(dragGroup);
  }
}

function isComplementary(b1, b2, s1, s2) {
  if (s1 === 'ribose' || s2 === 'ribose') return false; // RNA is single-stranded
  if (b1 === 'A' && (b2 === 'T' || b2 === 'U')) return true;
  if (b2 === 'A' && (b1 === 'T' || b1 === 'U')) return true;
  if ((b1 === 'G' && b2 === 'C') || (b1 === 'C' && b2 === 'G')) return true;
  return false;
}

function checkSnap(dragGroup) {
  let bestSnap = null;
  let minDist = 40;

  const others = nucleotides.filter(n => !dragGroup.includes(n) && !n.isCustom);

  dragGroup.forEach(a => {
    if (a.isCustom) return;

    others.forEach(b => {
      if (a.rotation === b.rotation && a.sugar === b.sugar) {
        let dist1 = Math.hypot(a.x - b.x, a.y - (b.y - 145));
        if (dist1 < minDist && ((a.rotation === 0 && !a.linked3 && !b.linked5) || (a.rotation === 180 && !a.linked5 && !b.linked3))) {
          minDist = dist1; bestSnap = { a, dx: b.x - a.x, dy: (b.y - 145) - a.y, flip: false };
        }
        let dist2 = Math.hypot(a.x - b.x, a.y - (b.y + 145));
        if (dist2 < minDist && ((a.rotation === 0 && !a.linked5 && !b.linked3) || (a.rotation === 180 && !a.linked3 && !b.linked5))) {
          minDist = dist2; bestSnap = { a, dx: b.x - a.x, dy: (b.y + 145) - a.y, flip: false };
        }
      }

      if (isComplementary(a.base, b.base, a.sugar, b.sugar) && !a.paired && !b.paired) {
        if (a.rotation !== b.rotation) {
          let targetX = b.rotation === 180 ? b.x - 180 : b.x + 180;
          let dist = Math.hypot(a.x - targetX, a.y - b.y);
          if (dist < minDist) {
            minDist = dist; bestSnap = { a, dx: targetX - a.x, dy: b.y - a.y, flip: false };
          }
        } else if (dragGroup.length === 1) { // Auto-flip single node
          let targetX = b.rotation === 0 ? b.x + 180 : b.x - 180;
          let dist = Math.hypot(a.x - targetX, a.y - b.y);
          if (dist < minDist) {
            minDist = dist; bestSnap = { a, dx: targetX - a.x, dy: b.y - a.y, flip: true };
          }
        }
      }
    });
  });

  if (bestSnap) {
    if (bestSnap.flip) {
      bestSnap.a.rotation = bestSnap.a.rotation === 0 ? 180 : 0;
    }
    dragGroup.forEach(n => {
      n.x += bestSnap.dx;
      n.y += bestSnap.dy;
    });

    autoPairAndStack();
  }
  render();
}

function autoPairAndStack() {
  for (let i = 0; i < nucleotides.length; i++) {
    for (let j = i + 1; j < nucleotides.length; j++) {
      let n1 = nucleotides[i];
      let n2 = nucleotides[j];

      if (n1.rotation === n2.rotation && n1.sugar === n2.sugar) {
        let dy = n2.y - n1.y;
        let dx = Math.abs(n1.x - n2.x);
        if (dx < 1) {
          if (Math.abs(dy - 145) < 1 && !n1.linked3 && !n2.linked5) {
            if (n1.rotation === 0) { n1.linked3 = n2.id; n2.linked5 = n1.id; }
            else { n1.linked5 = n2.id; n2.linked3 = n1.id; }
          }
          if (Math.abs(dy + 145) < 1 && !n1.linked5 && !n2.linked3) {
            if (n1.rotation === 0) { n2.linked3 = n1.id; n1.linked5 = n2.id; }
            else { n2.linked5 = n1.id; n1.linked3 = n2.id; }
          }
        }
      }

      if (n1.rotation !== n2.rotation && isComplementary(n1.base, n2.base, n1.sugar, n2.sugar) && !n1.paired && !n2.paired) {
        if (Math.abs(n1.y - n2.y) < 1) {
          let normal = n1.rotation === 0 ? n1 : n2;
          let flipped = n1.rotation === 0 ? n2 : n1;
          if (Math.abs(flipped.x - normal.x - 180) < 1) {
            n1.paired = n2.id;
            n2.paired = n1.id;
          }
        }
      }
    }
  }
}

// Canvas Pan & Zoom
const workspace = document.getElementById('workspace');
const canvas = document.getElementById('canvas');
let isPanning = false;
let panStartX, panStartY;

workspace.addEventListener('mousedown', (e) => {
  if (e.target.closest('.nucleotide')) return;
  isPanning = true;
  panStartX = e.clientX - panX;
  panStartY = e.clientY - panY;
  workspace.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = e.clientX - panStartX;
  panY = e.clientY - panStartY;
  updateCanvasTransform();
});

window.addEventListener('mouseup', () => {
  if (isPanning) {
    isPanning = false;
    workspace.style.cursor = 'grab';
  }
});

workspace.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomIntensity = 0.1;
  const wheel = e.deltaY < 0 ? 1 : -1;
  const zoomFactor = Math.exp(wheel * zoomIntensity);

  const rect = workspace.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  panX = mouseX - (mouseX - panX) * zoomFactor;
  panY = mouseY - (mouseY - panY) * zoomFactor;
  zoom *= zoomFactor;

  updateCanvasTransform();
}, { passive: false });

// Touch Pan & Zoom (Pinch)
let initialPinchDistance = null;
let initialZoom = 1;

workspace.addEventListener('touchstart', (e) => {
  if (e.target.closest('.nucleotide')) return;
  if (e.touches.length === 1) {
    isPanning = true;
    panStartX = e.touches[0].clientX - panX;
    panStartY = e.touches[0].clientY - panY;
  } else if (e.touches.length === 2) {
    isPanning = false;
    initialPinchDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    initialZoom = zoom;
  }
}, { passive: false });

workspace.addEventListener('touchmove', (e) => {
  if (e.target.closest('.nucleotide')) return;
  e.preventDefault();
  if (e.touches.length === 1 && isPanning) {
    panX = e.touches[0].clientX - panStartX;
    panY = e.touches[0].clientY - panStartY;
    updateCanvasTransform();
  } else if (e.touches.length === 2) {
    const currentDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    zoom = initialZoom * (currentDistance / initialPinchDistance);

    // Smooth pinch zoom around center for simplicity
    updateCanvasTransform();
  }
}, { passive: false });

workspace.addEventListener('touchend', () => {
  isPanning = false;
  initialPinchDistance = null;
});

function updateCanvasTransform() {
  canvas.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoom})`);
}

function zoomByCenter(factor) {
  const workspace = document.getElementById('workspace');
  const rect = workspace.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  panX = centerX - (centerX - panX) * factor;
  panY = centerY - (centerY - panY) * factor;
  zoom *= factor;
  updateCanvasTransform();
}

document.getElementById('zoom-in').addEventListener('click', () => zoomByCenter(1.2));
document.getElementById('zoom-out').addEventListener('click', () => zoomByCenter(1 / 1.2));
document.getElementById('reset-view').addEventListener('click', () => {
  panX = 0; panY = 0; zoom = 1;
  updateCanvasTransform();
});

// Init
updateCanvasTransform();

// 3D Rendering Logic
function loop3D() {
  if (currentMode !== '3d') {
    animationFrameId = null;
    return;
  }
  draw3D();
  animationFrameId = requestAnimationFrame(loop3D);
}

function draw3D() {
  let layer = document.getElementById('layer_3d');
  if (!layer) return;

  if (nucleotides.length === 0) {
    layer.innerHTML = '';
    return;
  }

  let minY = Math.min(...nucleotides.map(n => n.y));

  let t = performance.now() * 0.001;
  let rotationSpeed = 30;
  let globalTheta = t * rotationSpeed * Math.PI / 180;

  let primitives = [];
  let tilt = 15 * Math.PI / 180;
  let R = 120;

  function project(x, y, z) {
    return {
      x: x,
      y: y * Math.cos(tilt) - z * Math.sin(tilt),
      z: y * Math.sin(tilt) + z * Math.cos(tilt)
    };
  }

  const BASE_COLORS = { A: '#ffd43b', T: '#b197fc', U: '#74c0fc', G: '#69db7c', C: '#ff8787' };

  // First pass: Calculate 3D coordinates for all nucleotides
  nucleotides.forEach(n => {
    n.centerX = n.rotation === 0 ? n.x + 90 : n.x - 90;
    n.visualLevel = (n.y - minY) / 145;
    n.y3d = 100 + n.visualLevel * 45; // 45px vertical step per pair

    let baseAngle = n.rotation === 0 ? Math.PI : 0;
    n.angle3d = baseAngle + n.visualLevel * (34.28 * Math.PI / 180) + globalTheta;

    n.x3d = n.centerX + R * Math.cos(n.angle3d);
    n.z3d = R * Math.sin(n.angle3d);

    n.p1 = project(n.x3d, n.y3d, n.z3d);
    n.pc = project(n.centerX, n.y3d, 0);
  });

  // Second pass: Generate rendering primitives
  nucleotides.forEach(n => {
    // Base pair bond line (colored inward pointing line)
    if (n.base) {
      let isPurine = n.base === 'A' || n.base === 'G';
      let inwardR = isPurine ? -15 : 15;
      let cx3d = n.centerX + inwardR * Math.cos(n.angle3d);
      let cz3d = inwardR * Math.sin(n.angle3d);
      n.pc = project(cx3d, n.y3d, cz3d);

      primitives.push({
        z: (n.p1.z + n.pc.z) / 2,
        html: `<line x1="${n.p1.x}" y1="${n.p1.y}" x2="${n.pc.x}" y2="${n.pc.y}" stroke="${BASE_COLORS[n.base]}" stroke-width="14" stroke-linecap="round"/>`
      });
    }

    // Backbone sphere
    let sugarColor = n.sugar === 'deoxy' ? '#a5d8ff' : '#ffc9c9';
    primitives.push({
      z: n.p1.z + 2,
      html: `<circle cx="${n.p1.x}" cy="${n.p1.y}" r="12" fill="${sugarColor}" stroke="#495057" stroke-width="2"/>`
    });

    // Inter-nucleotide backbone link
    if (n.linked3) {
      let nextNode = nucleotides.find(x => x.id === n.linked3);
      if (nextNode) {
        primitives.push({
          z: (n.p1.z + nextNode.p1.z) / 2 - 1,
          html: `<line x1="${n.p1.x}" y1="${n.p1.y}" x2="${nextNode.p1.x}" y2="${nextNode.p1.y}" stroke="#adb5bd" stroke-width="6"/>`
        });
      }
    }
  });

  primitives.sort((a, b) => a.z - b.z);
  layer.innerHTML = primitives.map(p => p.html).join('');
}

// Custom Builder UI Logic
document.querySelectorAll('.builder-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    let type = e.target.dataset.btype;
    let val = e.target.dataset.val;
    customBuilder[type] = val;

    // update active state
    document.querySelectorAll(`.builder-btn[data-btype="${type}"]`).forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
  });
});

document.getElementById('spawn-custom-btn').addEventListener('click', handleCustomCreation);

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}

