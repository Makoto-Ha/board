class Detection {
  domAction(dom, callback = () => { }) {
    return Boolean(document.querySelector(dom)) || callback();
  }
}

class Canvas extends Detection {
  canvas = document.querySelector('canvas');
  c = this.canvas.getContext('2d');
  offset = this.offsetXY(); 
  constructor() {
    super();
    // 行內樣式設置的寬高給予canvas的畫布尺寸
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  offsetXY() {
    let offset = {
      X: [],
      Y: [],
      logX: [],
      logY: []
    }
    return (x, y) => {
      if (typeof x === 'undefined') return offset;
      offset.X.push(x);
      offset.Y.push(y);
      return offset;
    }
  }

  reset({ X, Y }) { 
    // 還沒開始畫就直接返回
    if (X.length === 0) return '還沒開始畫線';
    // 清除六次
    let tempColor = this.c.strokeStyle;
    let resetX = X[X.length-1];
    let resetY = Y[Y.length-1];

    this.c.strokeStyle = this.c.fillStyle;
    this.c.lineWidth += 2; 
    console.log(resetX);
    
    for (let i = 1; i <= resetX.length; i++) {
  
      this.c.lineTo(resetX[resetX.length - i], resetY[resetY.length - i]);
      this.c.stroke();
    }
    // 抬起筆後，原本畫的顏色才不會被修改
    this.c.beginPath();
    this.c.lineWidth -= 2;
    // 還原原本筆的顏色
    this.c.strokeStyle = tempColor;  
    X.pop();
    Y.pop();
  }
}

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
    document.addEventListener('mouseup', this.drawStop.bind(this));
    this.clearEL.addEventListener('click', this.clear.bind(this));
    this.eraser.el.addEventListener('click', this.wipe.bind(this));
    this.cutEL.addEventListener('click', this.cut.bind(this));
    this.thicknessEL.addEventListener('change', this.thickness.bind(this));
    document.addEventListener('keydown', this.reset.bind(this, 'r')());
  }

  // 按下滑鼠後綁定mousemove滑鼠移動事件
  bindDrawLine() {
    this.offset().logX = [];
    this.offset().logY = [];
    this.canvas.addEventListener('mousemove', this.drawLine);
  }

  // 畫線
  drawLine(event) { 
    this.offset().logX.push(event.offsetX);
    this.offset().logY.push(event.offsetY);

    this.c.lineTo(event.offsetX, event.offsetY);
    this.c.stroke();
  }

  // 停止畫線
  drawStop() {
    this.c.beginPath();
    let offset = this.offset();
    offset.X.push(offset.logX);
    offset.Y.push(offset.logY);
    this.canvas.removeEventListener('mousemove', this.drawLine);
  }

  // 清除所有線條
  clear() {
    this.domAction('img:last-child', () => document.body.lastChild.remove());
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  reset(keyWord) {
    let log = '', target = keyWord;
    return ({ key }) => {
      log += key;
      if (log.includes(target)) {
        log = ''
        super.reset(this.offset());
      }
    }
  }

  // 設置黑板顏色
  setBgColor(color) {
    this.c.fillStyle = color;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  // 畫筆顏色
  setLineColor(event) {
    // 選取目標顏色為當前畫筆顏色，然後重置flag、innerText、lineWidth
    this.lineColor.forEach(el => {
      el.style.border = '1px solid transparent';
      el.style.cursor = `url('${event.target.getAttribute('cursorICO')}'), auto`;
    });
    event.target.style.border = '1px solid #000';
    this.canvas.style.cursor = `url('${event.target.getAttribute('cursorICO')}'), auto`;
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
    this.setlineWidth = parseInt(event.target.value);
    this.c.lineWidth = parseInt(event.target.value);
  }

  // 初始化
  init() {
    this.setlineWidth = 1;
    this.c.beginPath();
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.strokeStyle = '#fff';
    this.clearEL.innerText = '清除';
    this.eraser.el.innerText = '橡皮';
    this.cutEL.innerText = '截圖';
    this.lineColor.forEach((el, i) => {
      let values = [
        { color: '#8E44AD', cursor: './img/purplepen.ico' },
        { color: '#F1C40F', cursor: './img/yellowpen.ico' },
        { color: '#16A085', cursor: './img/greenpen.ico' },
        { color: '#E74C3C', cursor: './img/redpen.ico' }
      ];
      el.style.background = values[i].color;
      el.setAttribute('cursorICO', values[i].cursor);
      el.addEventListener('click', this.setLineColor.bind(this));
    });
  }
}