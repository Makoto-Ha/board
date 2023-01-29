import Detection from './Detection.js';

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

export default Canvas