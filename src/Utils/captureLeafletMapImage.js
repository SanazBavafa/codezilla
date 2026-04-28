import html2canvas from 'html2canvas'

export async function captureLeafletMapImage(element, { delayMs = 800, scale = 2 } = {}) {
  if (!element) {
    return null
  }

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    scale,
  })

  return canvas.toDataURL('image/png')
}