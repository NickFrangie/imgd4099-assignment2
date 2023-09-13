@group(0) @binding(0) var<uniform> time: f32;
@group(0) @binding(1) var<uniform> res:   vec2f;
@group(0) @binding(2) var<uniform> audio: vec3f;
@group(0) @binding(3) var<uniform> mouse: vec3f;
@group(0) @binding(4) var<uniform> mixer: f32;
@group(0) @binding(5) var backSampler:    sampler;
@group(0) @binding(6) var backBuffer:     texture_2d<f32>;
@group(0) @binding(7) var videoSampler:   sampler;
@group(1) @binding(0) var videoBuffer:    texture_external;

fn random2(p : vec2f) -> vec2f {
    return fract(sin(vec2(dot(p,vec2f(127.1,311.7)),dot(p,vec2f(269.5,183.3))))*43758.5453);
}

@vertex 
fn vs( @location(0) input : vec2f ) ->  @builtin(position) vec4f {
  return vec4f( input, 0., 1.); 
}

@fragment 
fn fs( @builtin(position) pos : vec4f ) -> @location(0) vec4f {
  // Fit position to standardized coordinates (0-1)
  let st : vec2f = pos.xy / res;

  // Scale standardized coordinates (0-scalar)
  let scalar : f32 = 4.0;
  let sc : vec2f = st * scalar;
  
  // Get the tile and position within the tile
  let tile : vec2f = floor(sc);
  let fract : vec2f = fract(sc);
  
  // Cellular Noise
  var m_dist : f32 = 1.;
  for (var y = -1; y <= 1; y++) {
    for (var x = -1; x <= 1; x++) {
      // Find difference between neighbor and fract
      let neighbor : vec2f = vec2(f32(x),f32(y));
      var point : vec2f = random2(tile + neighbor);
      
      // Animate the neighbor point
      point = 0.5 + 0.5 * sin(time + 6.2831 * point);
      
      // Keep minimum distances
      let diff : vec2f = (neighbor + point) - fract;
      let dist : f32 = length(diff);
      if (dist < m_dist) {
          m_dist = dist;
      }     
    }
  }
  let noise = vec4f(m_dist, m_dist, m_dist, 1.);

  // Camera
  let vid = textureSampleBaseClampToEdge( videoBuffer, videoSampler, st );
  let fb = textureSample( backBuffer, backSampler, st );
  let cam = vid * .05 + fb * .975;

  // Output
  let out = mix(cam, noise, mixer); 
  return vec4f( out.rgb, 1. );
}