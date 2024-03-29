// 创建元素
export function createElement(tag, attrs = {}, html) {
  const el = document.createElement(tag)
  setHTMLAttrs(el, attrs)

  if (typeof html === 'string') el.innerHTML = html

  return el
}

export function setHTMLAttrs(el, attrs) {
  for (let key in attrs) {
    el.setAttribute(key, attrs[key])
  }
}

export function appendChildren(parent, children,) {
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
