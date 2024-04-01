import { createElement, appendChildren, renderStarrySky, setHTMLAttrs } from './utils'
import './horoscopes.scss'

// const baseSize = 28.8
// document.querySelector('html').style.fontSize = `${baseSize}px`

window.renderData = {
  "mood": { "stars": 3, "title": "情绪指数", "content": "今天的你可能会有些中性情绪，既不是特别高兴，也不是特别低落，处于一种平稳的状态中。" },
  "general": { "stars": 3.5, "title": "综合运势", "content": "今天你可能会遇到一些小困扰，比如丢失一些重要的物品，这可能会让你和家人忙乱一阵。不过，不要太过沮丧，最终你会在一个意想不到的地方找到它。这也提醒着你，有时候解决问题的关键在于换一个角度思考。" },
  "love": { "stars": 4, "title": "爱情", "content": "你的伴侣或潜在的伴侣可能会向你提出一个涉及到更深层次承诺的计划。这将是对你们关系的一次考验。如果你准备好迎接这样的安排，那你只需要勇敢地说出“是”。记得聆听你内心的声音。" },
  "career": { "stars": 3, "title": "事业", "content": "现在不是展示你独立和强大的时候，如果遇到难关，尽量寻求他人的帮助，不必执着于单打独斗。合作和寻求帮助会让你更轻松地克服困难。" },
  "wellness": { "stars": 2.5, "title": "健康", "content": "你总是能够展现出最佳状态，但这不代表你的身体也和你一样处于最佳。如果你最近一直在推动自己，请注意，你可能最需要的是休息。确保给你的身体足够的关爱，让它能够真正发光。" },
  "money": { "stars": 4, "title": "财富", "content": "本周你可能会感觉到舒适和受尊重，人们可能会就工作和报酬与你进行沟通。看向你的职业领域寻找新的灵感和想法，可能会有意想不到的财富收获。" }
}

render()

function render() {
  const cardEl = document.querySelector('#card')
  appendChildren(cardEl, [createHeader(), createContent(renderData)])
}

function createHeader() {
  const header = createElement('header', { class: 'card-header' }, `
    <canvas class="bg"></canvas>
    <h1 class="title">水瓶座</h1>
    <div class="date">2024-03-26</div>
  `)

  renderStarrySky(header.querySelector('.bg'))

  return header
}

function createContent(data) {
  const types = ['mood', 'general', 'love', 'money', 'career', 'wellness']

  const content = createElement('div', { class: 'card-content' })

  types.forEach(type => {
    const item = data[type]
    const el = createElement('div', { class: 'item' }, `
      <h2 class="title">${item.title}</h2>
      <div class="stars">
        ${Array.from({ length: item.stars }).map(() => '<span class="star">⭐️</span>').join('')}
      </div>
      <div class="text">${item.content}</div>
    `)

    appendChildren(content, el)
  })

  return content
}