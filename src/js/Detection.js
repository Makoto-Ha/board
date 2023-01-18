class Detection {
  domAction(dom, callback = () => { }) {
    return Boolean(document.querySelector(dom)) || callback();
  }
}

export default Detection;