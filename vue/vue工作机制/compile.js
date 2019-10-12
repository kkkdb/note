class Complie {
  constructor(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    if (this.el) {
      //将node转化为fragment
      this.fragment = this.node2fragment(this.el);
      //解析fragment依赖
      this.compile(this.fragment);
      //讲解析过得fragment添加到el
      this.el.appendChild(this.fragment);
    }
  }
  node2fragment(el) {
    let fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // console.log(node.nodeType, node.textContent);
      if (this.isElement(node)) {
        //元素
        this.compileElement(node);
      }
      if (this.isInterpolation(node)) {
        //文本
        this.complieText(node);
      }

      //递归
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }
  complieText(node) {
    this.update(node, this.vm, RegExp.$1, "text");
  }
  compileElement(node) {
    let attrs = node.attributes;
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name,
        attrValue = attr.value;
      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2);
        this.update(node, this.vm, attrValue, dir);
        //对输入框进行输入监听
        if (node.nodeName === "INPUT" || node.nodeName === "TEXTAREA") {
          node.addEventListener("input", e => {
            this.vm[attrValue] = e.target.value;
          });
        }
      }
      if (this.isEvent(attrName)) {
        const dir = attrName.substring(1);
        const fn = this.vm.$options.methods[attrValue].bind(this.vm);
        if (dir && fn) {
          node.addEventListener(dir, fn, false);
        }
      }
    });
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  isDirective(name) {
    return name.indexOf("k-") === 0;
  }
  isEvent(name) {
    return name.indexOf("@") === 0;
  }
  /**
   *
   * @param {Node} node node节点
   * @param {Vue} vm vm实例
   * @param {string} exp 表达式
   * @param {string} dir 指令（text、model）
   */
  update(node, vm, exp, dir) {
    const updateFn = this[dir + "Update"];
    // 初始化
    updateFn && updateFn(node, vm[exp]);
    // 依赖收集
    new Watch(vm, exp, function(value) {
      updateFn && updateFn(node, value);
    });
  }
  textUpdate(node, value) {
    node.textContent = value;
  }
  htmlUpdate(node, value) {
    node.innerHTML = value;
  }
  modelUpdate(node, value) {
    node.value = value;
  }
}
