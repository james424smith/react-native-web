import requestAnimationFrame from 'fbjs/lib/requestAnimationFrame';
import setValueForStyles from '../../vendor/setValueForStyles';

const getRect = node => {
  const height = node.offsetHeight;
  const width = node.offsetWidth;
  let left = 0;
  let top = 0;
  while (node && node.nodeType === 1 /* Node.ELEMENT_NODE */) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return { height, left, top, width };
};

const measureLayout = (node, relativeToNativeNode, callback) => {
  requestAnimationFrame(() => {
    const relativeNode = relativeToNativeNode || (node && node.parentNode);
    if (node && relativeNode) {
      const relativeRect = getRect(relativeNode);
      const { height, left, top, width } = getRect(node);
      const x = left - relativeRect.left;
      const y = top - relativeRect.top;
      callback(x, y, width, height, left, top);
    }
  });
};

const UIManager = {
  blur(node) {
    try {
      node.blur();
    } catch (err) {}
  },

  focus(node) {
    try {
      node.focus();
    } catch (err) {}
  },

  measure(node, callback) {
    measureLayout(node, null, callback);
  },

  measureInWindow(node, callback) {
    requestAnimationFrame(() => {
      if (node) {
        const { height, left, top, width } = getRect(node);
        callback(left, top, width, height);
      }
    });
  },

  measureLayout(node, relativeToNativeNode, onFail, onSuccess) {
    measureLayout(node, relativeToNativeNode, onSuccess);
  },

  updateView(node, props, component /* only needed to surpress React errors in development */) {
    for (const prop in props) {
      if (!Object.prototype.hasOwnProperty.call(props, prop)) {
        continue;
      }

      const value = props[prop];
      switch (prop) {
        case 'style': {
          setValueForStyles(node, value, component._reactInternalInstance);
          break;
        }
        case 'class':
        case 'className': {
          node.setAttribute('class', value);
          break;
        }
        case 'text':
        case 'value':
          // native platforms use `text` prop to replace text input value
          node.value = value;
          break;
        default:
          node.setAttribute(prop, value);
      }
    }
  }
};

module.exports = UIManager;
