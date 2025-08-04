// A set of standard HTML tags for quick lookup.
const STANDARD_TAGS = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist',
  'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr',
  'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map',
  'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section',
  'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table',
  'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u',
  'ul', 'var', 'video', 'wbr', 'path'
]);


function mapStyleToTailwind(style) {
  // This function's content remains the same as before...
  const tw = [];

  // --- Layout ---
  const displayMap = {
    flex: "flex", "inline-flex": "inline-flex", grid: "grid", "inline-grid": "inline-grid",
    block: "block", "inline-block": "inline-block", none: "hidden", table: "table",
    "table-row": "table-row", "table-cell": "table-cell",
  };
  if (displayMap[style.display]) tw.push(displayMap[style.display]);

  const positionMap = { static: "static", relative: "relative", absolute: "absolute", fixed: "fixed", sticky: "sticky" };
  if (positionMap[style.position]) tw.push(positionMap[style.position]);

  if (style.top !== "auto") tw.push(`top-[${style.top}]`);
  if (style.right !== "auto") tw.push(`right-[${style.right}]`);
  if (style.bottom !== "auto") tw.push(`bottom-[${style.bottom}]`);
  if (style.left !== "auto") tw.push(`left-[${style.left}]`);
  if (style.zIndex !== "auto") tw.push(`z-[${style.zIndex}]`);

  // --- Flexbox & Grid ---
  if (style.display.includes("flex")) {
    const flexDirectionMap = { row: "flex-row", "row-reverse": "flex-row-reverse", column: "flex-col", "column-reverse": "flex-col-reverse" };
    if (flexDirectionMap[style.flexDirection]) tw.push(flexDirectionMap[style.flexDirection]);
    const flexWrapMap = { nowrap: "flex-nowrap", wrap: "flex-wrap", "wrap-reverse": "flex-wrap-reverse" };
    if (flexWrapMap[style.flexWrap]) tw.push(flexWrapMap[style.flexWrap]);
    const justifyContentMap = { "flex-start": "justify-start", "flex-end": "justify-end", center: "justify-center", "space-between": "justify-between", "space-around": "justify-around", "space-evenly": "justify-evenly" };
    if (justifyContentMap[style.justifyContent]) tw.push(justifyContentMap[style.justifyContent]);
    const alignItemsMap = { "flex-start": "items-start", "flex-end": "items-end", center: "items-center", baseline: "items-baseline", stretch: "items-stretch" };
    if (alignItemsMap[style.alignItems]) tw.push(alignItemsMap[style.alignItems]);
  }
  if (style.gap !== 'normal' && style.gap !== '0px') tw.push(`gap-[${style.gap}]`);

  // --- Sizing ---
  if (style.width && style.width !== "auto") tw.push(`w-[${style.width}]`);
  if (style.height && style.height !== "auto") tw.push(`h-[${style.height}]`);

  // --- Spacing ---
  if (style.paddingTop !== '0px') tw.push(`pt-[${style.paddingTop}]`);
  if (style.paddingRight !== '0px') tw.push(`pr-[${style.paddingRight}]`);
  if (style.paddingBottom !== '0px') tw.push(`pb-[${style.paddingBottom}]`);
  if (style.paddingLeft !== '0px') tw.push(`pl-[${style.paddingLeft}]`);
  if (style.marginTop !== '0px') tw.push(`mt-[${style.marginTop}]`);
  if (style.marginRight !== '0px') tw.push(`mr-[${style.marginRight}]`);
  if (style.marginBottom !== '0px') tw.push(`mb-[${style.marginBottom}]`);
  if (style.marginLeft !== '0px') tw.push(`ml-[${style.marginLeft}]`);

  // --- Typography ---
  if (style.fontSize) tw.push(`text-[${style.fontSize}]`);
  if (style.color && style.color !== "rgba(0, 0, 0, 0)") tw.push(`text-[${style.color}]`);
  const fontWeightMap = { 100: "font-thin", 200: "font-extralight", 300: "font-light", 400: "font-normal", 500: "font-medium", 600: "font-semibold", 700: "font-bold", 800: "font-extrabold", 900: "font-black" };
  if (fontWeightMap[style.fontWeight]) tw.push(fontWeightMap[style.fontWeight]);
  if (style.fontStyle === "italic") tw.push("italic");
  if (style.textAlign && style.textAlign !== "start") tw.push(`text-${style.textAlign}`);
  if (style.lineHeight !== "normal") tw.push(`leading-[${style.lineHeight}]`);
  if (style.textTransform !== "none") tw.push(style.textTransform);
  if (style.textDecorationLine.includes("underline")) tw.push("underline");
  if (style.textDecorationLine.includes("line-through")) tw.push("line-through");

  // --- Backgrounds & Borders ---
  if (style.backgroundColor && style.backgroundColor !== "rgba(0, 0, 0, 0)") tw.push(`bg-[${style.backgroundColor}]`);
  if (style.borderRadius !== "0px") tw.push(`rounded-[${style.borderRadius}]`);
  if (style.borderWidth !== "0px") tw.push(`border-[${style.borderWidth}]`);
  if (style.borderColor && style.borderColor !== "rgb(0, 0, 0)") tw.push(`border-[${style.borderColor}]`);

  // --- Effects ---
  if (style.opacity !== "1") tw.push(`opacity-[${style.opacity}]`);
  if (style.cursor && style.cursor !== "auto") tw.push(`cursor-${style.cursor}`);

  return tw.join(" ");
}

function cloneNodeWithTailwind(node) {
  if (!(node instanceof Element)) return null;

  const tagName = node.tagName.toLowerCase();
  const isStandardTag = STANDARD_TAGS.has(tagName);

  // 🔽 NEW: If not a standard tag, create a div. Otherwise, use the original tag.
  const cloned = document.createElement(isStandardTag ? tagName : 'div');
  if (!isStandardTag) {
    cloned.setAttribute('data-component', tagName);
  }

  const computedStyle = getComputedStyle(node);
  const twClass = mapStyleToTailwind(computedStyle);
  if (twClass) {
    cloned.className = twClass;
  }

  // 🔽 NEW: Loop and clean attributes
  for (const attr of node.attributes) {
    const attrName = attr.name.toLowerCase();
    // Skip style, class, and framework-specific attributes
    if (attrName === 'style' || attrName === 'class' || attrName.startsWith('_ng') || attrName.startsWith('data-v-')) {
      continue;
    }
    cloned.setAttribute(attr.name, attr.value);
  }

  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.textContent.trim().length > 0) {
        cloned.appendChild(document.createTextNode(child.textContent.trim()));
      }
    } else {
      const childClone = cloneNodeWithTailwind(child);
      if (childClone) cloned.appendChild(childClone);
    }
  }
  return cloned;
}

function convertDomToTailwindTree(rootNode) {
  if (!rootNode) return null;
  return cloneNodeWithTailwind(rootNode);
}

// 🔽 NEW: Function to format HTML with indentation
function prettifyHTML(htmlString, indentSize = 2) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlString;

  function formatNode(node, level) {
    const indent = ' '.repeat(level * indentSize);
    // Element Node
    if (node.nodeType === 1) {
      const tagName = node.tagName.toLowerCase();
      let attributes = '';
      for (const attr of node.attributes) {
        attributes += ` ${attr.name}="${attr.value}"`;
      }
      // If the element has no children, return a self-closing style line (for simplicity)
      if (node.childNodes.length === 0) {
        return `\n${indent}<${tagName}${attributes}></${tagName}>`;
      }
      // If the only child is a text node, keep it on one line
      if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3) {
        return `\n${indent}<${tagName}${attributes}>${node.childNodes[0].textContent.trim()}</${tagName}>`;
      }
      // Otherwise, process children recursively
      let childrenHTML = '';
      node.childNodes.forEach(child => {
        childrenHTML += formatNode(child, level + 1);
      });
      return `\n${indent}<${tagName}${attributes}>${childrenHTML}\n${indent}</${tagName}>`;
    }
    // Text Node
    if (node.nodeType === 3) {
      const text = node.textContent.trim();
      return text ? `\n${indent}${text}` : '';
    }
    return '';
  }

  let formattedHTML = '';
  wrapper.childNodes.forEach(node => {
    formattedHTML += formatNode(node, 0);
  });

  return formattedHTML.trim();
}