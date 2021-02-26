const msgBox = document.getElementById('msg-need-send')
const sendBtn = document.getElementById('send-btn')
const exit = document.getElementById('exit')
const receiveBox = document.getElementById('receive-box')

// const ws = new WebSocket('ws://127.0.0.1:3000/websocket/test')
const ws = new WebSocket('ws://127.0.0.1:3000/12345')
ws.onopen = e => {
  console.log(`WebSocket 连接状态： ${ws.readyState}`)
}

ws.onmessage = data => {
  let _data = data.data || '';
  if (_data) {
    let obj = JSON.parse(_data);
    console.log('收到：obj：：', obj);
  }
  console.log('收到：：：', _data);
}

ws.onclose = data => {
  console.log('WebSocket连接已关闭')
  console.log(data);
}


sendBtn.onclick = () => {
  let params = {
    from: '',
    to: 123,
    type: 'ttttt222',
    message: '我要发给js...'
  };
  ws.send(JSON.stringify(params));
}
exit.onclick = () => {
  ws.close()
}
