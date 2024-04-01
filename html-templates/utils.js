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

export function renderStarrySky(canvas) {
  const ctx = canvas.getContext('2d')
  const canvas2 = document.createElement('canvas')
  const ctx2 = canvas2.getContext('2d');

  // 检查画布是否成功初始化
  if (!canvas || !ctx || !canvas2 || !ctx2) {
    console.error("Canvas initialization failed.");
    return;
  }

  // 设置画布大小为窗口大小，并定义颜色和最大星体数量
  const w = canvas.width
  const h = canvas.height
  const hue = 255
  const maxStars = 1400;

  // 设置第二个画布大小并创建径向渐变
  canvas2.width = 100;
  canvas2.height = 100;

  // 根据canvas2的宽度计算出中心点到圆心的距离
  const half = canvas2.width / 2
  // 创建一个径向渐变，从canvas中心点开始，半径为canvas宽度的一半
  const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);

  // 设置渐变的颜色停靠点
  // 0.025位置为白色
  gradient2.addColorStop(0.025, '#fff');
  // 0.1位置为基于hue值的特定颜色
  gradient2.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
  // 0.25位置为更暗的基于hue值的特定颜色
  gradient2.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
  // 1.0位置为透明色，渐变结束
  gradient2.addColorStop(1, 'transparent');

  // 设置填充样式为之前创建的渐变对象
  ctx2.fillStyle = gradient2;
  // 开始一个新的路径绘制
  ctx2.beginPath();
  // 绘制一个以(half, half)为圆心，半径为half的圆
  ctx2.arc(half, half, half, 0, Math.PI * 2);
  // 使用设置的填充样式填充圆
  ctx2.fill();

  /**
   * 生成一个介于min和max之间的随机数。
   * 如果只提供了一个参数，函数将返回0到该参数之间的随机数。
   * @param {number} min - 随机数的最小值。
   * @param {number} max - 随机数的最大值。
   * @returns {number} 生成的随机数。
   */
  function random(min, max) {
    if (arguments.length < 2) {
      max = min;
      min = 0;
    }

    if (min > max) {
      [min, max] = [max, min];
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 计算给定点的最大轨道半径。
   * @param {number} x - 点的x坐标。
   * @param {number} y - 点的y坐标。
   * @returns {number} 计算出的最大轨道半径。
   */
  function maxOrbit(x, y) {
    const max = Math.max(x, y);
    const diameter = Math.round(Math.sqrt(x * x + y * y));
    return diameter / 2;
  }

  /**
   * Star类用于创建和绘制星体。
   */
  class Star {
    constructor() {
      this.orbitRadius = random(maxOrbit(w, h)); // 星体的轨道半径
      this.radius = random(60, this.orbitRadius) / 12; // 星体的大小
      this.orbitX = w / 2; // 轨道的x中心点
      this.orbitY = h / 2; // 轨道的y中心点
      this.timePassed = random(0, maxStars); // 星体绕轨道的时间
      this.speed = random(this.orbitRadius) / 50000; // 星体绕轨道的速度
      this.alpha = random(2, 10) / 10; // 星体的透明度
    }

    /**
     * 绘制一个星体。
     * @param {number} i - 星体的索引，用于可能的优化或特定星体的处理。
     */
    draw(i) {
      const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
      const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
      const twinkle = random(10); // 星体闪烁的随机效果

      // 根据随机值调整星体的透明度，实现闪烁效果
      if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05;
      } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05;
      }

      ctx.globalAlpha = this.alpha;
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
      this.timePassed += this.speed; // 更新星体的时间位置
    }
  }

  // 创建所有星体实例
  const stars = [];
  for (let i = 0; i < maxStars; i++) {
    stars.push(new Star());
  }

  /**
   * 动画函数，用于持续更新和绘制星体。
   */
  function animation() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 2;
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, w, h); // 清除画布

    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0, l = stars.length; i < l; i++) {
      stars[i].draw(i); // 绘制每个星体
    }

    // window.requestAnimationFrame(animation); // 请求下一个动画帧
  }

  animation(); // 启动动画

}