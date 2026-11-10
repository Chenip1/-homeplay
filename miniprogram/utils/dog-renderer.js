const { dogParts } = require('../data/dog-models')

const vertexSource = `
attribute vec3 vertex;
uniform vec3 offset, size;
uniform vec2 partTurn, dogTurn, viewScale;
uniform float taper;
varying vec3 normal;
void main() {
  float taperScale = max(0.23, 1.0 - vertex.y * taper);
  vec3 p = vertex * size;
  p.xz *= taperScale;
  vec3 n = normalize(vertex / size);
  p.xy = mat2(partTurn.x, partTurn.y, -partTurn.y, partTurn.x) * p.xy;
  n.xy = mat2(partTurn.x, partTurn.y, -partTurn.y, partTurn.x) * n.xy;
  p += offset;
  p.xz = mat2(dogTurn.x, -dogTurn.y, dogTurn.y, dogTurn.x) * p.xz;
  n.xz = mat2(dogTurn.x, -dogTurn.y, dogTurn.y, dogTurn.x) * n.xz;
  normal = vec3(n.x, 0.984 * n.y - 0.178 * n.z, 0.178 * n.y + 0.984 * n.z);
  float y = 0.984 * p.y - 0.178 * p.z;
  float z = 0.178 * p.y + 0.984 * p.z;
  gl_Position = vec4(p.x * viewScale.x, (y + 0.045) * viewScale.y, -z * 0.21, 1.0);
}`

const fragmentSource = `
precision mediump float;
uniform vec3 color;
varying vec3 normal;
void main() {
  vec3 n = normalize(normal);
  vec3 sun = normalize(vec3(-0.46, 0.72, 0.57));
  float diffuse = max(0.0, dot(n, sun));
  float bounce = max(0.0, dot(n, vec3(0.87, -0.36, 0.33)));
  float softSpecular = pow(max(0.0, dot(n, normalize(sun + vec3(0.0, 0.0, 1.0)))), 21.0);
  vec3 shaded = color * (0.59 + diffuse * 0.44 + bounce * 0.12);
  gl_FragColor = vec4(shaded + vec3(1.0, 0.84, 0.66) * softSpecular * 0.11, 1.0);
}`

function sphereMesh() {
  const vertices = [], triangles = []
  const bands = 12, slices = 18
  for (let row = 0; row <= bands; row++) {
    const latitude = row * Math.PI / bands
    for (let col = 0; col <= slices; col++) {
      const longitude = col * Math.PI * 2 / slices
      vertices.push(Math.sin(latitude) * Math.cos(longitude), Math.cos(latitude), Math.sin(latitude) * Math.sin(longitude))
    }
  }
  for (let row = 0; row < bands; row++) {
    for (let col = 0; col < slices; col++) {
      const i = row * (slices + 1) + col
      const next = i + slices + 1
      triangles.push(i, next, i + 1, i + 1, next, next + 1)
    }
  }
  return { vertices: new Float32Array(vertices), triangles: new Uint16Array(triangles) }
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(error || 'Unable to compile dog shader')
  }
  return shader
}

function createDogRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, preserveDrawingBuffer: true })
  if (!gl) throw new Error('WebGL is unavailable')
  const program = gl.createProgram()
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(error || 'Unable to link dog shaders')
  }
  gl.useProgram(program)

  const mesh = sphereMesh()
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)
  const attribute = gl.getAttribLocation(program, 'vertex')
  gl.enableVertexAttribArray(attribute)
  gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0)
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, gl.STATIC_DRAW)
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.DEPTH_TEST)

  const uniforms = Object.fromEntries(['offset','size','partTurn','dogTurn','viewScale','taper','color']
    .map(name => [name, gl.getUniformLocation(program, name)]))
  let active = false, scheduled, breedId, outfit
  let lastDraw = 0
  const startedAt = Date.now()
  const nativeFrames = typeof canvas.requestAnimationFrame === 'function' && typeof canvas.cancelAnimationFrame === 'function'

  function draw(seconds) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const yaw = 0.54 + Math.sin(seconds * 0.92) * 0.28
    gl.uniform2f(uniforms.dogTurn, Math.cos(yaw), Math.sin(yaw))
    for (const part of dogParts(breedId, outfit, seconds)) {
      gl.uniform3f(uniforms.offset, part.x, part.y, part.z)
      gl.uniform3f(uniforms.size, part.sx, part.sy, part.sz)
      gl.uniform3f(uniforms.color, ...part.color)
      gl.uniform2f(uniforms.partTurn, Math.cos(part.angle), Math.sin(part.angle))
      gl.uniform1f(uniforms.taper, part.taper)
      gl.drawElements(gl.TRIANGLES, mesh.triangles.length, gl.UNSIGNED_SHORT, 0)
    }
  }

  function tick() {
    if (!active) return
    const now = Date.now()
    if (now - lastDraw >= 30) {
      draw((now - startedAt) / 1000)
      lastDraw = now
    }
    scheduled = nativeFrames ? canvas.requestAnimationFrame(tick) : setTimeout(tick, 33)
  }

  function pause() {
    active = false
    if (scheduled == null) return
    if (nativeFrames) canvas.cancelAnimationFrame(scheduled)
    else clearTimeout(scheduled)
    scheduled = null
  }

  return {
    resize(width, height, ratio) {
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      gl.viewport(0, 0, canvas.width, canvas.height)
      const pixelsPerUnit = Math.min(canvas.width / 2.48, canvas.height / 2.42)
      gl.uniform2f(uniforms.viewScale, 2 * pixelsPerUnit / canvas.width, 2 * pixelsPerUnit / canvas.height)
    },
    setDog(id, clothes) {
      breedId = id
      outfit = clothes
    },
    start() {
      if (active) return
      active = true
      tick()
    },
    pause,
    snapshot() {
      draw((Date.now() - startedAt) / 1000)
      const { width, height } = canvas
      const pixels = new Uint8Array(width * height * 4)
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      return { width, height, pixels }
    },
    dispose() {
      pause()
      gl.deleteBuffer(vertexBuffer)
      gl.deleteBuffer(indexBuffer)
      gl.deleteProgram(program)
    }
  }
}

module.exports = { createDogRenderer }
