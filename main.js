import { default as seagulls } from './seagulls.js'
import { default as Video    } from './video.js'
import { default as Audio    } from './audio.js'

var shader = importText("wsgl.txt");

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

function importText(textFile) {
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("Get", textFile, false);
    rawFile.onreadystatechange = function()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

async function main() {
  let frame = 0

  document.body.onclick = Audio.start

  await Video.init()

  const sg = await seagulls.init()

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
  })
  .textures([ Video.element ]) 
  .render( shader, { uniforms: ['frame','res', 'audio', 'mouse' ] })
  .run()
}

main()
