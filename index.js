class Detection {
  domAction(dom, callback = () => { }) {
    let isExit = Boolean(document.querySelector(dom));
    if (isExit) callback();
    return isExit
  }
}

class Board extends Detection {
  // c畫布 、 cutEL截圖 、 eraser橡皮 、 clearEL清除 、 lineColor色筆 、 thicknessEL色筆粗細
  canvas = document.querySelector('canvas');
  c = this.canvas.getContext('2d');
  cutEL = document.querySelector('.cut');
  eraser = { el: document.querySelector('.eraser'), flag: true };
  clearEL = document.querySelector('#clear');
  lineColor = document.querySelectorAll('.container > .lineColor');
  thicknessEL = document.querySelector('#thickness');
  constructor() {
    super();
    this.init();
    this.bindEvent();
  }
  // 綁定事件
  bindEvent() {
    Board.prototype.drawLine = this.drawLine.bind(this);
    this.canvas.addEventListener('mousedown', this.bindDrawLine.bind(this));
    document.addEventListener('mouseup', this.drawStop.bind(this));
    this.clearEL.addEventListener('click', this.clear.bind(this));
    this.eraser.el.addEventListener('click', this.wipe.bind(this));
    this.cutEL.addEventListener('click', this.cut.bind(this));
    this.thicknessEL.addEventListener('change', this.thickness.bind(this));
  }

  // 按下滑鼠後綁定mousemove滑鼠移動事件
  bindDrawLine() {
    this.canvas.addEventListener('mousemove', this.drawLine);
  }

  // 畫線
  drawLine(event) {
    this.c.lineTo(event.offsetX, event.offsetY);
    this.c.stroke();
  }

  // 停止畫線
  drawStop() {
    this.c.beginPath();
    this.canvas.removeEventListener('mousemove', this.drawLine);
  }

  // 清除所有線條
  clear() {
    this.domAction('img:last-child', () => document.body.lastChild.remove());
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 設置黑板顏色
  setBgColor(color) {
    this.c.fillStyle = color;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 畫筆顏色
  setLineColor(event) {
    // 選取目標顏色為當前畫筆顏色，然後重置flag、innerText、lineWidth
    this.lineColor.forEach(el => el.style.border = '1px solid transparent');
    event.target.style.border = '1px solid #000';
    this.canvas.style.cursor = 'url("./yellowpen.ico"), auto';
    this.c.lineWidth = this.setlineWidth;
    this.eraser.el.innerText = '橡皮';
    this.eraser.flag = true;
    this.c.strokeStyle = event.target.style.background;
    this.thicknessEL.style.color = event.target.style.background;
    this.thicknessEL.querySelectorAll('option').forEach(el => el.style.color = event.target.style.background);
  }

  // 擦拭
  wipe() {
    this.eraser.flag = !this.eraser.flag;
    this.eraser.el.innerText = this.eraser.flag ? '橡皮' : '寫字';
    this.c.strokeStyle = this.eraser.flag ? '#fff' : this.c.fillStyle;
    this.c.lineWidth = this.eraser.flag ? 1 : 5;
  }

  // 截圖
  cut() {
    this.domAction('img:last-child', () => document.body.lastChild.remove());
    localStorage.setItem('cutImg', this.canvas.toDataURL('image/jpeg'));
    open('./cutBoard.html');
  }

  // 粗細
  thickness(event) {
    this.setlineWidth = parseInt(event.target.value);
    this.c.lineWidth = parseInt(event.target.value);
  }
  
  // 初始化
  init() {
    // 行內樣式設置的寬高給予canvas的畫布尺寸
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.c.beginPath();
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.strokeStyle = '#fff';
    this.clearEL.innerText = '清除';
    this.eraser.el.innerText = '橡皮';
    this.cutEL.innerText = '截圖';
    this.lineColor.forEach((el, i) => {
      let color = ['#8E44AD', '#F1C40F', '#16A085', '#E74C3C'];
      el.style.background = color[i];
      el.addEventListener('click', this.setLineColor.bind(this));
    });
  }
}