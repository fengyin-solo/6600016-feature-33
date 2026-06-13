<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- Quiz Panel -->
    <div class="bg-gray-900 rounded-xl p-4">
      <h3 class="text-amber-300 font-bold mb-3">听音/看码 猜字符</h3>
      <div v-if="!store.quizChar" class="text-center py-8">
        <button @click="store.generateQuiz()" class="bg-amber-500 text-black px-6 py-3 rounded-lg text-lg hover:bg-amber-400">
          开始训练
        </button>
      </div>
      <div v-else class="flex flex-col items-center gap-4">
        <div class="text-8xl font-bold text-amber-400">{{ store.quizChar }}</div>
        <button @click="store.playMorse(MORSE_TABLE[store.quizChar])" :disabled="store.isPlaying"
          class="bg-green-600 px-4 py-2 rounded hover:bg-green-500 disabled:opacity-50">
          {{ store.isPlaying ? '播放中...' : '🔊 播放音频' }}
        </button>
        <div class="text-2xl font-mono text-green-400">{{ MORSE_TABLE[store.quizChar] }}</div>
        <input v-model="store.userAnswer" @keyup.enter="store.checkAnswer()"
          class="bg-gray-800 rounded px-4 py-2 text-center text-xl w-48" placeholder="输入莫尔斯码" />
        <button @click="store.checkAnswer()" class="bg-amber-500 text-black px-6 py-2 rounded hover:bg-amber-400">
          确认
        </button>
      </div>
    </div>

    <!-- Score & History -->
    <div class="bg-gray-900 rounded-xl p-4 flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <h3 class="text-amber-300 font-bold">训练统计</h3>
        <button @click="store.resetScore()" class="text-red-400 text-sm hover:underline">重置</button>
      </div>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="bg-gray-800 rounded p-2">
          <div class="text-2xl font-bold text-green-400">{{ store.score.correct }}</div>
          <div class="text-xs text-gray-400">正确</div>
        </div>
        <div class="bg-gray-800 rounded p-2">
          <div class="text-2xl font-bold text-red-400">{{ store.score.total - store.score.correct }}</div>
          <div class="text-xs text-gray-400">错误</div>
        </div>
        <div class="bg-gray-800 rounded p-2">
          <div class="text-2xl font-bold text-amber-400">
            {{ store.score.total ? Math.round(store.score.correct / store.score.total * 100) : 0 }}%
          </div>
          <div class="text-xs text-gray-400">正确率</div>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto max-h-64">
        <div v-for="h in store.history.slice(0, 20)" :key="h.id"
          class="flex justify-between bg-gray-800 rounded p-2 mb-1 text-sm"
          :class="h.correct ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'">
          <span>{{ h.input }} → {{ h.output }}</span>
          <span>{{ h.correct ? '✓' : '✗' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMorseStore } from '../store/morse'
import { MORSE_TABLE } from '../utils/morse-code'

const store = useMorseStore()
</script>
