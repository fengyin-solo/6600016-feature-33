import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { MORSE_TABLE, REVERSE_TABLE, textToMorse, morseToText } from '../utils/morse-code'
import type { TrainMode, HistoryEntry } from '../types'

const STORAGE_KEY = 'morse-trainer-data'

interface PersistedData {
  score: { correct: number; total: number }
  history: HistoryEntry[]
  wpm: number
  frequency: number
  volume: number
  trainMode: TrainMode
}

function loadFromStorage(): Partial<PersistedData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load training data from localStorage')
  }
  return {}
}

function saveToStorage(data: PersistedData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save training data to localStorage')
  }
}

export const useMorseStore = defineStore('morse', () => {
  const saved = loadFromStorage()

  const inputText = ref('')
  const morseOutput = ref('')
  const decodedText = ref('')
  const wpm = ref(saved.wpm ?? 15)
  const frequency = ref(saved.frequency ?? 700)
  const volume = ref(saved.volume ?? 0.6)
  const trainMode = ref<TrainMode>(saved.trainMode ?? 'charToCode')
  const history = ref<HistoryEntry[]>(saved.history ?? [])
  const quizChar = ref('')
  const userAnswer = ref('')
  const score = ref(saved.score ?? { correct: 0, total: 0 })
  const isPlaying = ref(false)
  let audioCtx: AudioContext | null = null
  let currentOscillator: OscillatorNode | null = null

  const dotDuration = computed(() => 1200 / wpm.value)

  function getAudioCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext()
    return audioCtx
  }

  function playTone(duration: number): Promise<void> {
    return new Promise(resolve => {
      const ctx = getAudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = frequency.value
      gain.gain.value = volume.value
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      currentOscillator = osc
      setTimeout(() => { osc.stop(); currentOscillator = null; resolve() }, duration)
    })
  }

  async function playMorse(morse: string) {
    isPlaying.value = true
    const dd = dotDuration.value
    for (const token of morse.split(' ')) {
      if (token === '/') { await sleep(dd * 7); continue }
      for (const sym of token) {
        await playTone(sym === '.' ? dd : dd * 3)
        await sleep(dd)
      }
      await sleep(dd * 2)
    }
    isPlaying.value = false
  }

  function sleep(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms))
  }

  function encode() {
    morseOutput.value = textToMorse(inputText.value)
  }

  function decode() {
    decodedText.value = morseToText(inputText.value)
  }

  function generateQuiz() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    quizChar.value = chars[Math.floor(Math.random() * chars.length)]
    userAnswer.value = ''
  }

  function checkAnswer() {
    const correct = userAnswer.value.trim() === MORSE_TABLE[quizChar.value]
    score.value.total++
    if (correct) score.value.correct++
    history.value.unshift({
      id: Date.now(), input: quizChar.value, output: userAnswer.value,
      correct, timestamp: Date.now()
    })
    generateQuiz()
  }

  function resetScore() {
    score.value = { correct: 0, total: 0 }
    history.value = []
  }

  watch(
    [score, history, wpm, frequency, volume, trainMode],
    () => {
      saveToStorage({
        score: { ...score.value },
        history: history.value,
        wpm: wpm.value,
        frequency: frequency.value,
        volume: volume.value,
        trainMode: trainMode.value
      })
    },
    { deep: true }
  )

  return {
    inputText, morseOutput, decodedText, wpm, frequency, volume,
    trainMode, history, quizChar, userAnswer, score, isPlaying,
    dotDuration, encode, decode, playMorse, playTone,
    generateQuiz, checkAnswer, resetScore
  }
})
