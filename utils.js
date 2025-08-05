/* Convert URL to data URI */
async function toDataURI(url) {
  if (url.startsWith("data:") || url.startsWith("blob:")) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Failed to fetch:", url, e);
    return url;
  }
}

/* Get relevant CSS rules for an element */
function getRelevantStyles(element) {
  const computed = getComputedStyle(element);

  // Get only visually important properties
  const importantProps = [
    "display", "position", "top", "right", "bottom", "left", "z-index",
    "width", "height", "min-width", "min-height", "max-width", "max-height",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "border", "border-width", "border-style", "border-color", "border-radius",
    "background", "background-color", "background-image", "background-size",
    "background-position", "background-repeat", "background-attachment",
    "color", "font-family", "font-size", "font-weight", "font-style",
    "line-height", "text-align", "text-decoration", "text-transform",
    "letter-spacing", "word-spacing", "overflow", "overflow-x", "overflow-y",
    "visibility", "opacity", "transform", "transform-origin", "transition",
    "animation", "flex", "flex-direction", "flex-wrap", "justify-content",
    "align-items", "align-content", "grid", "grid-template-columns",
    "grid-template-rows", "grid-gap", "box-shadow", "text-shadow",
    "outline", "cursor", "pointer-events"
  ];

  let cssText = "";
  for (const prop of importantProps) {
    const value = computed.getPropertyValue(prop);
    if (value && value !== "initial" && value !== "normal") {
      cssText += `${prop}: ${value}; `;
    }
  }
  return cssText;
}

/* Clone element with styles and embedded assets for download */
async function cloneWithStylesAndAssets(node, visited = new WeakSet(), assetMap = new Map()) {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  // Create clone
  const clone = document.createElement(node.tagName);

  // Copy attributes
  for (const attr of node.attributes || []) {
    if (attr.name !== "style") {
      clone.setAttribute(attr.name, attr.value);
    }
  }

  // Apply computed styles
  const relevantStyles = getRelevantStyles(node);
  if (relevantStyles) {
    clone.style.cssText = relevantStyles;
  }

  // Handle images
  if (node.tagName === "IMG" && node.src) {
    if (!assetMap.has(node.src)) {
      assetMap.set(node.src, await toDataURI(node.src));
    }
    clone.src = assetMap.get(node.src);
  }

  // Handle shadow DOM
  if (node.shadowRoot && !visited.has(node.shadowRoot)) {
    visited.add(node.shadowRoot);
    try {
      const shadowClone = clone.attachShadow({ mode: "open" });

      // Clone shadow DOM children
      for (const child of node.shadowRoot.childNodes) {
        const clonedChild = await cloneWithStylesAndAssets(child, visited, assetMap);
        if (clonedChild) {
          shadowClone.appendChild(clonedChild);
        }
      }
    } catch (e) {
      console.warn("Could not clone shadow DOM:", e);
    }
  }

  // Clone light DOM children
  for (const child of node.childNodes) {
    const clonedChild = await cloneWithStylesAndAssets(child, visited, assetMap);
    if (clonedChild) {
      clone.appendChild(clonedChild);
    }
  }

  return clone;
}