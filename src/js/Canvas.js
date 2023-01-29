import Detection from './Detection.js';

class Canvas extends Detection {
  canvas = document.querySelector('canvas');
  c = this.canvas.getContext('2d');
  offsetInput = this.createOffset();
  constructor() {
    super();
    // 行內樣式設置的寬高給予canvas的畫布尺寸
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.c.beginPath();
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.c.strokeStyle = '#fff';
  }

  createOffset() {
    // 紀錄所有筆的X和Y
    let offset = {
      X: [],
      Y: []
    }
    // 紀錄單筆的X和Y
    let log = {
      X: [],
      Y: []
    }
    // 只給予getOffset和getLog兩函數開放offset和log變數
    this.getOffset = () => offset;
    this.getLog = () => log;
    return (x, y) => {
      if (typeof x === 'undefined') return new Error('必須傳入X和Y兩個參數');
      offset.X.push(x);
      offset.Y.push(y);
    }
  }

  log(x, y) {
    let log = this.getLog();
    log.X.push(x);
    log.Y.push(y);
  }

  logPush() {
    let log = this.getLog();    
    this.offsetInput(log.X, log.Y);
  }

  reset({ X, Y }) {
    // 還沒開始畫就直接返回
    if (X.length === 0) return '還沒開始畫線';
    let originalColor = this.c.strokeStyle;
    let resetX = X[X.length - 1];
    let resetY = Y[Y.length - 1];

    this.c.strokeStyle = this.c.fillStyle;
    this.c.lineWidth += 2;
    // 反向畫背景色，清除線條
    for (let i = 1; i <= resetX.length; i++) {
      this.c.lineTo(resetX[resetX.length - i], resetY[resetY.length - i]);
      this.c.stroke();
    }
    // 抬起筆後，原本畫的顏色才不會被修改
    this.c.beginPath();
    this.c.lineWidth -= 2;
    // 還原原本筆的顏色
    this.c.strokeStyle = originalColor;
    X.pop(); Y.pop();
  }
}

export default Canvas;