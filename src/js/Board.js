import Canvas from './Canvas.js';

class Board extends Canvas {
  // c畫布 、 cutEL截圖 、 eraser橡皮 、 clearEL清除 、 lineColor色筆 、 thicknessEL色筆粗細
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
    this.canvas.addEventListener('mouseup', this.logPush.bind(this));
    document.addEventListener('mouseup', this.drawStop.bind(this));
    this.clearEL.addEventListener('click', this.clear.bind(this));
    this.eraser.el.addEventListener('click', this.wipe.bind(this));
    this.cutEL.addEventListener('click', this.cut.bind(this));
    this.thicknessEL.addEventListener('change', this.thickness.bind(this));
    document.addEventListener('keydown', this.reset.bind(this, 'r'));
  }

  // 按下滑鼠後綁定mousemove滑鼠移動事件
  bindDrawLine(event) {
    let log = this.getLog();
    log.X = [];
    log.Y = [];
    this.log(event.offsetX, event.offsetY);
    this.canvas.addEventListener('mousemove', this.drawLine);
  }

  // 畫線
  drawLine(event) {
    let log = this.getLog();
    this.log(event.offsetX, event.offsetY);
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

  reset(keyWord, { key }) {
    this.log = '';
    this.log += key;
    if (this.log.includes(keyWord)) {
      this.log = ''
      super.reset(this.getOffset());
    }
    delete this.log;
  }

  // 設置黑板顏色
  setBgColor(color) {
    this.c.fillStyle = color;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  // 畫筆顏色
  setLineColor({ target }) {
    // 選取目標顏色為當前畫筆顏色，然後重置flag、innerText、lineWidth
    let cursorIMG = target.getAttribute('cursorICO');
    let { lineColor, canvas, c, eraser, thicknessEL, setLineWidth } = this;
    lineColor.forEach(el => {
      el.style.border = '1px solid transparent';
      el.style.cursor = `url('${cursorIMG}'), auto`;
    });
    target.style.border = '1px solid #000';
    canvas.style.cursor = `url('${cursorIMG}'), auto`;
    eraser.el.innerText = '橡皮';
    eraser.flag = true;
    c.lineWidth = setLineWidth;
    c.strokeStyle = target.style.background;
    thicknessEL.style.color = target.style.background;
    thicknessEL.querySelectorAll('option').forEach(el => el.style.color = target.style.background);
  }

  // 擦拭
  wipe() {
    this.eraser.flag = !this.eraser.flag;
    this.eraser.el.innerText = this.eraser.flag ? '橡皮' : '寫字';
    this.canvas.style.cursor = this.eraser.flag ? 'url("./img/whitepen.ico"), auto' : 'pointer';
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
    this.setLineWidth = parseInt(event.target.value);
    this.c.lineWidth = parseInt(event.target.value);
  }

  // 初始化
  init() {
    this.setLineWidth = 1;
    this.clearEL.innerText = '清除';
    this.eraser.el.innerText = '橡皮';
    this.cutEL.innerText = '截圖';
    this.lineColor.forEach((el, i) => {
      let values = [
        { color: '#8E44AD', cursor: './src/img/purplepen.ico' },
        { color: '#F1C40F', cursor: './src/img/yellowpen.ico' },
        { color: '#16A085', cursor: './src/img/greenpen.ico' },
        { color: '#E74C3C', cursor: './src/img/redpen.ico' }
      ];
      el.style.background = values[i].color;
      el.setAttribute('cursorICO', values[i].cursor);
      el.addEventListener('click', this.setLineColor.bind(this));
    });
  }
}

export default Board;