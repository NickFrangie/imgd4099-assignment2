import { default as seagulls } from './seagulls.js'
import { default as Video    } from './video.js'
import { default as Audio    } from './audio.js'

var mouseX = null;
var mouseY = null;
var mouseDown = null;
    
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
document.body.onmousedown = (e) => {mouseDown = 1;};
document.body.onmouseup = (e) => {mouseDown = 0;};

function onMouseUpdate(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
}

async function main() {
  let frame = 0

  document.body.onclick = Audio.start

  await Video.init()

  const sg = await seagulls.init()
  const frag = await seagulls.import( './frag.wgsl' );

  sg.uniforms({ 
    frame:0, 
    res:[window.innerWidth, window.innerHeight],
    audio:[0,0,0],
    mouse:[0,0,0],
  })
  .onframe( ()=> {
    sg.uniforms.frame = frame++;
    sg.uniforms.audio = [ Audio.low, Audio.mid, Audio.high ];
    sg.uniforms.mouse = [ mouseX, mouseY, mouseDown];
    console.log(Audio.low);
  })
  .textures([ Video.element ]) 
  .render( frag )
  .run()
}

main()
