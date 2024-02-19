import rough from 'roughjs';
import './word-card.scss'

const data = [
  {
    "title": "单词",
    "content": "greasy"
  },
  {
    "title": "发音",
    "content": [
      ["英式", "/ˈɡriː.si/"],
      ["美式", "/ˈɡriː.si/"]
    ]
  },
  {
    "title": "词义简析",
    "content": [
      ["形容词(adj.)", "表面滑腻，常为油脂所覆盖"],
      ["形容词(adj.)", "含有大量油脂或脂肪，常指食物"],
      ["形容词(adj.)", "不正当的；反面意义上的狡猾、令人厌恶"],
      ["形容词(adj.)", "形容人体胖大"],
      ["形容词(adj.)", "下流的；不雅的"],
      ["形容词(adj.)", "（马）患有“grease”病"]
    ]
  },
  {
    "title": "场景例句",
    "content": [
      ["描述物体表面", "The mechanic’s hands were covered in greasy oil.", "那名机械师的手上沾满了滑腻的机油。"],
      ["讨论食品", "I try to avoid greasy foods as part of my diet.", "为了饮食健康，我尽量避免吃含有很多油脂的食物。"],
      ["形容可疑行为", "He seems nice but has a greasy reputation.", "他看起来不错，但名声有些不正当。"],
      ["描述体型", "People shouldn't use the term 'greasy' to describe someone's body.", "人们不应该用'greasy'这个词来形容某人的体型。"],
      ["在文学中", "The novel had a few greasy jokes that made me uncomfortable.", "那本小说有一些下流笑话，让我感到不舒服。"],
      ["特指马病", "The old mare is greasy and needs veterinary care.", "那匹老母马患有grease，需要兽医照料。"]
    ]
  },
  {
    "title": "相关单词",
    "content": [
      ["oily", "油腻的，通常指有油光或油质感的", "Her skin felt oily after using the cream.", "她用了那个乳霜后，皮肤感觉油腻腻的。"],
      ["slick", "光滑的，油腻的；精明的", "He slicked his hair back with some greasy gel.", "他用一些油腻的发胶把头发向后梳了梳。"],
      ["slippery", "滑的，容易滑倒的", "After the spill, the floor was greasy and slippery.", "溢出的液体后，地板变得油腻而滑。"]
    ]
  },
  {
    "title": "使用小贴士",
    "content": [
      "尽量避免在形容健康食品时使用'greasy'，以免误会。",
      "在描述某人声誉时使用'greasy'，要小心区分文化差异。",
      "连用'greasy'和'slippery'可以强调表面的极端滑腻。",
      "注意不同语境下'greasy'的贬义与褒义使用。"
    ]
  },
  {
    "title": "今日鼓励",
    "content": "每个词汇都有它的故事与色彩🎨，探究它们能够让语言生动起来。像'greasy'一样，它不仅仅是油滑，它的层次和使用也是多面的。掌握这样的词汇，就是在语言世界中增添了更多维度。不断学习吧，你会发现更多奇妙之处。加油✨！"
  }
]

function render() {
  const cover = document.querySelector('#cover')
  const dataJson = sessionStorage.getItem('card-data')
  cover.innerHTML = `<div class="content">${dataJson}</div>`
}

function createContent(data) {
  const { title, content } = data
  const titleEl = `<h2 class="title">${data.title}</h2>`
}
