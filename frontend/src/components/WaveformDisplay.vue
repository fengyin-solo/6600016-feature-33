<template>
  <div class="bg-gray-900 rounded-xl p-4">
    <h3 class="text-amber-300 font-bold mb-2">实时波形</h3>
    <canvas ref="canvasRef" class="w-full h-40 bg-black rounded" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMorseStore } from '../store/morse'
import { MORSE_TABLE } from '../utils/morse-code'

const store = useMorseStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  const w = canvas.width = canvas.offsetWidth * 2
  const h = canvas.height = canvas.offsetHeight * 2

  function draw() {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)

    const morse = store.morseOutput || 'HELLO WORLD'
    const dd = store.dotDuration
    let x = 20

    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    ctx.beginPath()

    const tokens = morse.split(' ')
    for (const token of tokens) {
      if (token === '/') { x += dd * 4; continue }
      for (const sym of token) {
        const len = sym === '.' ? dd : dd * 3
        ctx.moveTo(x, h / 2)
        ctx.lineTo(x + len * 2, h / 2)
        // draw peak
        ctx.moveTo(x, h / 2)
        ctx.lineTo(x + len, h / 4)
        ctx.lineTo(x + len * 2, h / 2)
        x += (len + dd) * 2
      }
      x += dd * 4
    }
    ctx.stroke()

    // center line
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()
    ctx.setLineDash([])

    animId = requestAnimationFrame(draw)
  }
  draw()
})

onUnmounted(() => cancelAnimationFrame(animId))
</script>
