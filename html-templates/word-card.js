import rough from 'roughjs';
import { Svg2Roughjs } from 'svg2roughjs'
import './word-card.scss'
import _mock from '../dist/english-words/from/data.json'
import wait from 'wait'

const [wordInfo, ...mock] = _mock

const baseSize = 28.8
const primary_color = 'red'
const title_item_width = 4.2 * baseSize
const title_item_height = 4.2 * baseSize

const container_width = 37.5

window.render = render;
document.querySelector('html').style.fontSize = `${baseSize}px`

mock.forEach(item => {
  sessionStorage.setItem('card-data', JSON.stringify(item))
  sessionStorage.setItem('word-info', JSON.stringify(wordInfo))
  render()
})

async function render() {
  const app = document.querySelector('#cover')
  const data = JSON.parse(sessionStorage.getItem('card-data'))
  const wordInfo = JSON.parse(sessionStorage.getItem('word-info'))

  const card = createElement('div', { class: 'card container' })
  card.style.width = `${container_width}rem`
  card.style.position = 'relative'

  appendChildren(app, card)

  const header = createHeader(wordInfo)
  const content = createContent(data)

  appendChildren(card, [header, content])

  await wait(300)

  const boxes = content.querySelectorAll('.box')
  boxes.forEach((box, index) => {
    if (index === boxes.length - 1) return

    renderBackground(box, ({ width }) => {
      const height = 16;
      const canvas = createElement('canvas', { width, height })
      const rc = rough.canvas(canvas)

      rc.line(0, height / 2, width, height / 2, {
        stroke: primary_color,
        roughness: 0.5,
        bowing: 2.5
      });

      return canvas
    })
  })

  renderBackground(content, ({ width, height }) => {
    const canvas = createElement('canvas', { width, height, class: "bg" })
    const rc = rough.canvas(canvas)
    const p = 10

    rc.rectangle(p, p, width - p * 2, height - p * 2, {
      roughness: 2.5,
      bowing: 0.7,
      stroke: primary_color, strokeWidth: 2,
      fill: 'white',
      fillStyle: 'solid'
    });

    return canvas
  })

  renderBackground(card, ({ width, height }) => {
    const canvas = createElement('canvas', { width, height, class: "bg" })
    console.log(`🚀 > renderBackground > height:`, height);
    const rc = rough.canvas(canvas)

    const fillStyles = ['zigzag-line', 'dashed', 'hachure', 'cross-hatch']

    rc.rectangle(5, 5, width - 10, height - 10, {
      fill: primary_color,

      fillStyle: fillStyles[wordInfo.word.length % fillStyles.length],

      // 线的角度
      hachureAngle: 70,

      // 线的间隙
      hachureGap: 5,

      roughness: 2
    });

    return canvas
  })
}

function renderBackground(el, render) {
  const width = el.offsetWidth
  const height = el.offsetHeight

  const bg = render({ width, height })

  appendChildren(el, bg)
}

// 创建标题栏
function createTitle(title) {
  const arr = title?.split?.('')
  if (!arr?.length) return

  const el = createElement('div', { class: 'title-bar' })
  appendChildren(el, arr.map(createTitleItem))

  return el
}

// 创建标题栏的文字
function createTitleItem(text) {
  const el = createElement('div', { class: 'title-bar__item' })
  appendChildren(el, [createStar(), `<span>${text}</span>`])

  // 随机旋转 -35 ~ 35 度
  el.style.transform = `rotate(${Math.random() * 70 - 35}deg)`

  return el
}

function createHeader(wordInfo) {
  return createElement('header', { class: 'header' }, `
    <h1>${wordInfo.word}</h1>
    <div>
      <span>${wordInfo.content[0][0]} ${wordInfo.content[0][1]}</span>
      <span>${wordInfo.content[1][0]} ${wordInfo.content[1][1]}</span>
    </div>
  `)
}

// 创建内容
function createContent(data) {
  const { title, content } = data
  if (!title) return;

  let children

  if (title === '词义简析') {
    children = content.reduce((prev, item) => {
      return prev += `<div class="box">
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
      </div>`
    }, '')
  }

  if (title === '场景例句') {
    children = content.reduce((prev, item) => {
      return prev += `<div class="box">
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
        <p><b style="color: red">译：</b>${item[2]}</p>
      </div>`
    }, '')
  }

  if (title === '相关单词') {
    children = content.reduce((prev, item) => {
      return prev += `<div class="box">
        <h3>${item[0]} - ${item[1]}</h3>
        <p>${item[2]}</p>
        <p><b style="color: red">译：</b>${item[3]}</p>
      </div>`
    }, '')
  }

  if (title.includes('小贴士')) {
    children = content.reduce((prev, item) => {
      return prev += `<div class="box p2" style="font-size: 1.7rem;">${item}</div>`
    }, '')
  }

  if (title === '今日鼓励') {
    children = `<p class="p2">${content}</p>`
  }

  const el = createElement('div', { class: 'content' })
  appendChildren(el, [createTitle(title), children])

  return el
}

// 创建一个五角星
function createStar(options) {
  const { width, height, fill } = { width: title_item_width, height: title_item_height, fill: primary_color, ...options }
  const canvas = createElement('canvas')

  const svgConverter = new Svg2Roughjs(canvas)

  svgConverter.svg = createSVGByHTML(`<svg t="1708336352673" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M959.24224 401.32608c-7.36256-24.57088-28.78976-43.22304-63.6928-55.43936a15.36 15.36 0 0 0-1.3824-0.43008l-189.54752-51.4304c-41.09824-62.68416-82.25792-125.34272-123.40736-188.01664-0.17408-0.24576-0.54272-0.8192-0.7168-1.06496-19.79904-27.68896-44.48256-42.94656-69.46304-42.94656-18.06336 0-44.544 7.78752-68.38784 45.2096L337.08032 278.69184c-47.27296 14.32576-94.54592 28.71808-141.84448 43.10016L126.1056 342.81984C93.91104 353.28 73.56928 370.2016 65.64864 393.12896c-8.30976 24.0896-2.46784 52.1728 17.87904 85.87264 0.49152 0.82432 1.03424 1.60768 1.61792 2.34496a203168.54272 203168.54272 0 0 1 124.05248 157.1584c-2.11968 75.5712-4.2752 151.2192-6.47168 226.87232-3.15392 36.21888 2.08896 61.74208 16 78.0288 10.54208 12.3392 25.20064 18.59072 43.5712 18.59072 14.07488 0 30.7712-3.67616 53.2992-11.86816l182.52288-74.2912a116757.43744 116757.43744 0 0 0 207.60064 77.18912c13.62432 4.38784 26.23488 6.60992 37.49888 6.60992 25.68192 0 69.27872-11.81184 72.76544-90.96192a21.24288 21.24288 0 0 0-0.02048-2.42176c-3.81952-67.45088-7.68-134.74304-11.53536-202.08128l-0.0512-0.88576 134.43584-180.78208c20.74112-29.82912 27.61728-57.15968 20.4288-81.1776z" fill="${fill}" p-id="10569"></path><path d="M905.0112 455.04l-139.04896 186.95168a23.63904 23.63904 0 0 0-4.55168 15.43168l0.5376 9.51808c3.82976 66.90304 7.67488 133.7856 11.4688 200.8064-2.35008 46.63296-20.44416 46.63296-30.20288 46.63296-7.08096 0-15.54432-1.56672-24.31488-4.36736a142424.4224 142424.4224 0 0 1-214.05696-79.63136 20.1984 20.1984 0 0 0-14.63808 0.21504l-189.06624 76.9792c-16.9984 6.1696-29.70624 9.1648-38.8352 9.1648-8.85248 0-11.20256-2.74944-12.08832-3.77344-2.45248-2.87744-7.85408-12.90752-5.05344-44.02688 0.03584-0.4864 0.07168-0.96768 0.08704-1.4592 2.2784-78.78656 4.52608-157.55264 6.7328-236.23168a23.6032 23.6032 0 0 0-4.97152-15.21664 163892.8896 163892.8896 0 0 0-128.37376-162.66752c-11.77088-19.80928-16.2816-35.2256-13.02016-44.63616 3.82976-11.10528 20.0192-18.432 32.5632-22.50752L206.9504 365.312c49.8432-15.16544 99.62496-30.3104 149.43232-45.40928a21.36064 21.36064 0 0 0 11.96032-9.3696l109.7216-178.2272c7.27552-11.42272 18.91328-25.05216 32.98304-25.05216 11.37664 0 24.01792 8.91904 35.29216 24.6784 42.65472 64.95744 85.31456 129.90464 127.91296 194.87744a21.28896 21.28896 0 0 0 12.1856 8.98048L882.90816 389.12c20.21888 7.17312 32.91648 16.37376 35.78368 25.93792 2.7392 9.14432-2.2784 23.54176-13.68064 39.98208z" fill="${fill}" p-id="10570"></path></svg>`, { width, height })

  svgConverter.sketch()

  return canvas
}

// 通过 html 字符串创建 svg 元素
function createSVGByHTML(html, attrs = {}) {
  const container = createElement('div')
  container.innerHTML = html

  const el = container.lastChild
  setHTMLAttrs(el, attrs)

  return el
}

// 创建元素
function createElement(tag, attrs = {}, html) {
  const el = document.createElement(tag)
  setHTMLAttrs(el, attrs)

  if (typeof html === 'string') el.innerHTML = html

  return el
}

function setHTMLAttrs(el, attrs) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}

function appendChildren(parent, children,) {
  if (!children) return;

  if (typeof children === 'string') {
    const temp = document.createElement('div')
    temp.innerHTML = children
    appendChildren(parent, temp.children)
    return parent
  }

  if (typeof children !== 'string' && children.length || Array.isArray(children)) {
    Array.from(children).forEach(child => {
      appendChildren(parent, child)
    })

    return parent
  }

  parent.appendChild(children)

  return parent
}
