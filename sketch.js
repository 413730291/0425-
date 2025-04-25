let lavas = [];
let darkMode = false;
let blue, black;
let speedMod = 1;
let draggedLava = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

class Lava {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = r * 2;
    this.maxSize = this.d * 2;
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, -2);
    this.res = r < 25 ? 5 : 8;
    this.resF = this.res + 2;
    this.offsets = Array.from({ length: this.res }, () => random(-5, 5));
    this.noiseOffsets = Array.from({ length: this.res }, () => random(1000));
    this.layer = round(random(1, 4));
    this.hovered = false; // 初始化 hovered 狀態
    this.dragging = false; // 初始化 dragging 狀態
  }

  move() {
    if (!this.dragging) {
      this.x += this.xSpeed;
      this.y += this.ySpeed * speedMod;
      if (this.y < -this.maxSize) {
        this.x = random(width);
        this.y = height + this.d;
      }
    }

    for (let i = 0; i < this.offsets.length; i++) {
      this.offsets[i] = map(noise(this.noiseOffsets[i]), 0, 1, 0, this.d);
      this.noiseOffsets[i] += this.hovered ? 0.025 : 0.005;
    }
  }

  show() {
    push();
    if (darkMode) fill(183, 235, 255, 25 * this.layer);
    else fill(0, 25 * this.layer);

    if (this.hovered) strokeWeight(2);
    else strokeWeight(1);

    translate(this.x, this.y);

    beginShape();
    for (let i = 0; i <= this.resF; i++) {
      let rad = (i * TAU) / this.res;
      let r = this.r + this.offsets[i % this.offsets.length];
      curveVertex(r * cos(rad), r * sin(rad));
    }
    endShape();

    // 檢查滑鼠是否在 Lava 上方
    this.hovered = dist(mouseX, mouseY, this.x, this.y) < this.r;

    if (this.hovered && mouseIsPressed) {
      if (!draggedLava) {
        this.dragging = true;
        draggedLava = this;
        dragOffsetX = this.x - mouseX;
        dragOffsetY = this.y - mouseY;
        cursor('grabbing');
      }
    } else if (this.hovered) {
      cursor('grab');
    }

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let amount = floor(width / 40);
  for (let i = 0; i < amount; i++) {
    let l = new Lava(random(width), random(height), random(10, 100));
    lavas.push(l);
  }
  blue = color(183, 235, 255, 64);
  black = color(0, 64);
}

function draw() {
  darkMode = document.body.classList.contains('dark');
  background(darkMode ? black : blue);

  for (let l of lavas) {
    l.move();
    l.show();
  }
}

function mouseDragged() {
  if (draggedLava) {
    draggedLava.x = mouseX + dragOffsetX;
    draggedLava.y = mouseY + dragOffsetY;
    return false;
  }
}

function mouseReleased() {
  if (draggedLava) {
    draggedLava.dragging = false;
    draggedLava = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 動態加載 iframe 的內容
function loadIframe(url) {
  const iframe = document.getElementById('contentFrame');
  iframe.src = url; // 設置 iframe 的 src
  iframe.style.display = 'block'; // 顯示 iframe
  hideBubble(); // 隱藏氣泡
}

// 隱藏 iframe 並顯示氣泡
function hideIframe() {
  const iframe = document.getElementById('contentFrame');
  iframe.src = ''; // 清空 iframe 的 src
  iframe.style.display = 'none'; // 隱藏 iframe
  showBubble(); // 顯示氣泡
}

// 顯示氣泡
function showBubble() {
  const bubble = document.getElementById('bubble-container');
  if (bubble) {
    console.log('顯示氣泡');
    bubble.classList.remove('hidden'); // 移除隱藏類別
  }
}

// 隱藏氣泡
function hideBubble() {
  const bubble = document.getElementById('bubble-container');
  if (bubble) {
    console.log('隱藏氣泡');
    bubble.classList.add('hidden'); // 添加隱藏類別
  }
}

function showAbout() {
  const iframe = document.getElementById('contentFrame');
  iframe.style.display = 'block'; // 顯示 iframe
  iframe.srcdoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>自我介紹</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #007BFF;
            font-size: 48px; /* 調整標題字體大小 */
          }
          p {
            font-size: 24px; /* 調整段落字體大小 */
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>我是蔡宥淇</h1>
        <p>就讀淡江大學教育科技學系一A。</p>
      </body>
    </html>
  `;
  hideBubble(); // 隱藏氣泡
}

