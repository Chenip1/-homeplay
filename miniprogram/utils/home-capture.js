function getScene(page) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery().in(page)
    query.select('.home-frame').boundingClientRect()
    query.selectAll('.shot-layer').fields({
      rect: true, size: true, dataset: true,
      computedStyle: ['backgroundColor', 'borderRadius', 'color', 'fontSize', 'fontWeight', 'opacity', 'textShadow']
    })
    query.select('#homeCapture').fields({ node: true })
    query.exec(results => {
      const [frame, layers, result] = results || []
      if (frame?.width && layers?.length && result?.node) resolve({ frame, layers, canvas: result.node })
      else reject(new Error('首页还未完成加载'))
    })
  })
}

function loadImage(canvas, src) {
  return new Promise((resolve, reject) => {
    const image = canvas.createImage()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function roundBox(ctx, x, y, w, h, radius) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawArtwork(ctx, image, data, x, y, w, h, radius) {
  if (data.kind === 'portrait') {
    const sw = image.width / 5, sh = image.height / 4
    roundBox(ctx, x, y, w, h, radius)
    ctx.clip()
    ctx.drawImage(image, data.slot % 5 * sw, Math.floor(data.slot / 5) * sh, sw, sh, x, y, w, h)
    return
  }
  const fit = data.kind === 'cover' ? Math.max : Math.min
  const factor = fit(w / image.width, h / image.height)
  const dw = image.width * factor, dh = image.height * factor
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

function drawLayer(ctx, frame, layer, images) {
  const { dataset: data, width: w, height: h } = layer
  if (!data || w <= 0 || h <= 0) return
  const x = layer.left - frame.left, y = layer.top - frame.top
  const radius = layer.borderRadius?.includes('%') ? Math.min(w, h) / 2 : parseFloat(layer.borderRadius) || 0
  ctx.save()
  ctx.globalAlpha = Number(layer.opacity || 1)
  if (data.src) {
    drawArtwork(ctx, images.get(data.src), data, x, y, w, h, radius)
  } else {
    if (data.kind === 'box' || data.kind === 'button') {
      roundBox(ctx, x, y, w, h, radius)
      ctx.fillStyle = layer.backgroundColor || 'transparent'
      ctx.fill()
    }
    if (data.kind === 'text' || data.kind === 'button') {
      const centered = data.kind === 'button'
      ctx.font = (layer.fontWeight || 400) + ' ' + (layer.fontSize || '14px') + ' sans-serif'
      ctx.fillStyle = layer.color || '#543820'
      ctx.textAlign = centered ? 'center' : 'left'
      ctx.textBaseline = 'middle'
      if (layer.textShadow && layer.textShadow !== 'none') {
        ctx.shadowColor = '#4b2919'
        ctx.shadowBlur = 3
      }
      let label = String(data.text ?? '')
      if (ctx.measureText(label).width > w) {
        const chars = Array.from(label)
        while (chars.length && ctx.measureText(chars.join('') + '…').width > w) chars.pop()
        label = chars.join('') + '…'
      }
      ctx.fillText(label, centered ? x + w / 2 : x, y + h / 2)
    }
  }
  ctx.restore()
}

function exportCanvas(canvas, fileType, quality) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas, destWidth: canvas.width, destHeight: canvas.height, fileType, quality,
      success: ({ tempFilePath }) => resolve(tempFilePath),
      fail: reject
    })
  })
}

async function captureHome(page) {
  const { frame, layers, canvas } = await getScene(page)
  const dogLayer = layers.find(layer => layer.dataset?.dogModel)
  if (dogLayer && page.dogRenderer) {
    try {
      const { width, height, pixels } = page.dogRenderer.snapshot()
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const image = ctx.createImageData(width, height)
      const stride = width * 4
      // WebGL returns rows from the bottom up.
      for (let row = 0; row < height; row++) {
        const from = (height - row - 1) * stride
        image.data.set(pixels.subarray(from, from + stride), row * stride)
      }
      ctx.putImageData(image, 0, 0)
      const src = await exportCanvas(canvas, 'png')
      dogLayer.dataset = { kind: 'image', src }
    } catch (error) {
      console.warn('Using the dog portrait in the home capture', error)
    }
  }
  const scale = Math.min(2, 960 / frame.width)
  canvas.width = Math.round(frame.width * scale)
  canvas.height = Math.round(frame.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.scale(canvas.width / frame.width, canvas.height / frame.height)
  const sources = [...new Set(layers.map(layer => layer.dataset?.src).filter(Boolean))]
  const images = new Map(await Promise.all(sources.map(async src => [src, await loadImage(canvas, src)])))
  ctx.fillStyle = '#2c2319'
  ctx.fillRect(0, 0, frame.width, frame.height)
  for (const layer of layers) drawLayer(ctx, frame, layer, images)
  return exportCanvas(canvas, 'jpg', 0.88)
}

module.exports = { captureHome }
