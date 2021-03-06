(() => {
  
  /**
   * WebRTCによるカメラアクセス
   */
  const video = document.getElementById('video')
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  
  let isVideoRun = true
  let isLoadedMetaData = false
  let constraints = { audio: false, video: {facingMode: 'user'} }


  function start(){
    isVideoRun = true
    navigator.mediaDevices.getUserMedia( constraints )
      .then( mediaStrmSuccess )
      .catch( mediaStrmFailed )
  }

  function mediaStrmSuccess( stream ){
    video.srcObject = stream

    // ウェブカムのサイズを取得し、canvasにも適用
    if(isLoadedMetaData) return
    isLoadedMetaData = true

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth  
      canvas.height = video.videoHeight

      requestAnimationFrame( draw )
    }, false)
  }

  function mediaStrmFailed( e ){
    console.log( e )
  }

  function stop(){
    isVideoRun = false
    let stream = video.srcObject
    let tracks = stream.getTracks()

    tracks.forEach( (track) => {
      track.stop()
    })
    video.srcObject = null
  }

  function draw(){
    if(!isVideoRun) return
    ctx.drawImage( video, 0, 0 )
    requestAnimationFrame( draw )
  }

  start()


  /**
   * ストリームのコントロール
   */
  const getBtn = document.getElementById('get')
  const stopBtn = document.getElementById('stop')
  const frontBtn = document.getElementById('front')
  const rearBtn = document.getElementById('rear')

  let ua = navigator.userAgent
  if(ua.indexOf('iPhone') < 0 && ua.indexOf('Android') < 0 && ua.indexOf('Mobile') < 0 && ua.indexOf('iPad') < 0){
    frontBtn.disabled = true
    rearBtn.disabled = true
  }

  stopBtn.addEventListener('click', () => {
    if(isVideoRun){
      stop()
      stopBtn.textContent = 'START'
    }else{
      start()
      stopBtn.textContent = 'STOP'
    }
  }, false)

  frontBtn.addEventListener('click', () => {
    stop()
    constraints.video.facingMode = 'user'
    setTimeout( () => {
      start()
    }, 500)
  }, false)

  rearBtn.addEventListener('click', () => {
    stop()
    constraints.video.facingMode = 'environment'
    setTimeout( () => {
      start()
    }, 500)
  }, false)


  getBtn.addEventListener('click', () => {
    let base64 = canvas.toDataURL()

    Vibrant.from(base64).getPalette().then( (palette) => {
      // console.log(palette)
      extractColor(palette)
    })
  }, false)


  /**
   * 色抽出
   */
  const output = document.querySelector('.output')

  function extractColor(data){
    output.textContent = null

    for(let k in data){
      // console.log(k, data[k])

      let item = document.createElement('div')
      item.classList.add('output_item')
      item.style.background = `rgb(${ data[k].r },${ data[k].g },${ data[k].b }`
      output.appendChild(item)
    }

  }


})()