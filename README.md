# solo-6600016: 莫尔斯码实时训练与通讯器

## 技术栈
- Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS
- Web Audio API (OscillatorNode + GainNode)
- Canvas 2D 波形绘制

## 核心特性
1. **实时编码/解码**：英文文本 ⇄ 莫尔斯码双向转换
2. **音频播放**：Web Audio API 生成正弦波，支持 WPM 速度/频率/音量调节
3. **波形可视化**：Canvas 2D 实时绘制莫尔斯码波形
4. **训练模式**：听音/看码猜字符，正确率统计，历史记录
5. **速查表**：完整的国际莫尔斯码对照表（字母+数字+标点）

## 启动
```bash
cd frontend && npm install && npm run dev
```
