<template>
  <div class="min-h-screen p-4 flex flex-col gap-4 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-amber-400">莫尔斯码实时训练与通讯器</h1>

    <!-- Tabs -->
    <div class="flex gap-2">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        class="px-4 py-2 rounded text-sm font-medium"
        :class="activeTab === tab.id ? 'bg-amber-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Encode/Decode Mode -->
    <div v-if="activeTab === 'translate'" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-900 rounded-xl p-4">
          <h3 class="text-amber-300 font-bold mb-2">文本输入</h3>
          <textarea v-model="store.inputText" class="w-full h-32 bg-gray-800 rounded p-3 text-white resize-none"
            placeholder="输入英文文本..." @input="store.encode()" />
          <button @click="store.playMorse(store.morseOutput)" :disabled="store.isPlaying"
            class="mt-2 bg-amber-500 text-black px-4 py-2 rounded hover:bg-amber-400 disabled:opacity-50">
            {{ store.isPlaying ? '播放中...' : '▶ 播放音频' }}
          </button>
        </div>
        <div class="bg-gray-900 rounded-xl p-4">
          <h3 class="text-amber-300 font-bold mb-2">莫尔斯码输出</h3>
          <div class="w-full h-32 bg-gray-800 rounded p-3 overflow-y-auto text-green-400 font-mono text-lg">
            {{ store.morseOutput || '编码结果...' }}
          </div>
          <button @click="store.decode()" class="mt-2 bg-green-600 px-4 py-2 rounded hover:bg-green-500">
            反向解码
          </button>
          <p class="mt-1 text-gray-400 text-sm">解码: {{ store.decodedText }}</p>
        </div>
      </div>
      <WaveformDisplay />
    </div>

    <!-- Training Mode -->
    <div v-if="activeTab === 'train'" class="flex flex-col gap-4">
      <TrainingMode />
    </div>

    <!-- Reference Table -->
    <div v-if="activeTab === 'ref'" class="bg-gray-900 rounded-xl p-4">
      <h3 class="text-amber-300 font-bold mb-3">莫尔斯码速查表</h3>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
        <div v-for="(code, char) in morseTable" :key="char"
          class="bg-gray-800 rounded p-2 text-center">
          <div class="text-xl font-bold text-amber-400">{{ char }}</div>
          <div class="font-mono text-green-400 text-sm">{{ code }}</div>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="bg-gray-900 rounded-xl p-4 grid grid-cols-3 gap-4">
      <div>
        <label class="text-gray-400 text-sm">速度 (WPM): {{ store.wpm }}</label>
        <input type="range" v-model.number="store.wpm" min="5" max="40" class="w-full" />
      </div>
      <div>
        <label class="text-gray-400 text-sm">频率 (Hz): {{ store.frequency }}</label>
        <input type="range" v-model.number="store.frequency" min="300" max="1200" class="w-full" />
      </div>
      <div>
        <label class="text-gray-400 text-sm">音量: {{ store.volume.toFixed(1) }}</label>
        <input type="range" v-model.number="store.volume" min="0" max="1" step="0.1" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMorseStore } from './store/morse'
import { MORSE_TABLE } from './utils/morse-code'
import WaveformDisplay from './components/WaveformDisplay.vue'
import TrainingMode from './components/TrainingMode.vue'

const store = useMorseStore()
const morseTable = MORSE_TABLE

const tabs = [
  { id: 'translate', label: '编码/解码' },
  { id: 'train', label: '训练模式' },
  { id: 'ref', label: '速查表' },
]
const activeTab = ref('translate')
</script>
