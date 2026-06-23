import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const svg = readFileSync(resolve(root, 'public/favicon.svg'), 'utf8')

for (const size of [192, 512]) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()
  const outPath = resolve(root, `public/icon-${size}.png`)
  writeFileSync(outPath, pngBuffer)
  console.log(`✓ icon-${size}.png (${pngBuffer.length} bytes)`)
}

console.log('Íconos PNG generados correctamente.')
