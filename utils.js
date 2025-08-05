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

  // Comprehensive list of CSS properties to preserve styling
  const importantProps = [
    // Layout & Positioning
    "display", "position", "top", "right", "bottom", "left", "z-index",
    "float", "clear", "visibility", "overflow", "overflow-x", "overflow-y",

    // Box Model
    "width", "height", "min-width", "min-height", "max-width", "max-height",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "box-sizing",

    // Borders
    "border", "border-width", "border-style", "border-color", "border-radius",
    "border-top", "border-right", "border-bottom", "border-left",
    "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
    "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
    "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
    "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius",

    // Background
    "background", "background-color", "background-image", "background-size",
    "background-position", "background-repeat", "background-attachment",
    "background-origin", "background-clip", "background-blend-mode",

    // Typography
    "color", "font", "font-family", "font-size", "font-weight", "font-style",
    "font-variant", "font-stretch", "line-height", "text-align", "text-decoration",
    "text-decoration-line", "text-decoration-color", "text-decoration-style",
    "text-transform", "text-indent", "text-shadow", "letter-spacing", "word-spacing",
    "white-space", "word-break", "word-wrap", "text-overflow",

    // Flexbox
    "flex", "flex-direction", "flex-wrap", "flex-flow", "justify-content",
    "align-items", "align-content", "align-self", "flex-grow", "flex-shrink", "flex-basis",
    "order",

    // Grid
    "grid", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows",
    "grid-area", "grid-column", "grid-row", "grid-gap", "grid-column-gap", "grid-row-gap",
    "justify-items", "align-items", "place-items", "justify-self", "align-self",

    // Transform & Animation
    "transform", "transform-origin", "transform-style", "perspective", "perspective-origin",
    "backface-visibility", "transition", "transition-property", "transition-duration",
    "transition-timing-function", "transition-delay", "animation", "animation-name",
    "animation-duration", "animation-timing-function", "animation-delay",
    "animation-iteration-count", "animation-direction", "animation-fill-mode",
    "animation-play-state",

    // Effects
    "opacity", "box-shadow", "filter", "backdrop-filter", "mix-blend-mode",
    "isolation", "clip-path", "mask", "mask-image", "mask-size", "mask-position",

    // Interaction
    "cursor", "pointer-events", "user-select", "resize", "outline", "outline-color",
    "outline-style", "outline-width", "outline-offset",

    // Table
    "table-layout", "border-collapse", "border-spacing", "caption-side", "empty-cells",

    // Content
    "content", "quotes", "counter-reset", "counter-increment",

    // Scroll
    "scroll-behavior", "scroll-margin", "scroll-padding", "overscroll-behavior"
  ];

  let cssText = "";
  for (const prop of importantProps) {
    const value = computed.getPropertyValue(prop);
    if (value && value !== "initial" && value !== "normal" && value !== "auto" && value !== "none" && value !== "") {
      cssText += `${prop}: ${value}; `;
    }
  }
  return cssText;
}

/* Collect CSS custom properties (variables) from the document */
function collectCSSVariables() {
  const variables = new Map();

  // Get variables from :root
  const rootStyles = getComputedStyle(document.documentElement);
  for (let i = 0; i < rootStyles.length; i++) {
    const prop = rootStyles[i];
    if (prop.startsWith("--")) {
      variables.set(prop, rootStyles.getPropertyValue(prop));
    }
  }

  // Get variables from body
  const bodyStyles = getComputedStyle(document.body);
  for (let i = 0; i < bodyStyles.length; i++) {
    const prop = bodyStyles[i];
    if (prop.startsWith("--")) {
      variables.set(prop, bodyStyles.getPropertyValue(prop));
    }
  }

  return variables;
}

/* Detect if element has dark theme */
// Enhanced function to detect if an element uses dark theme
function detectDarkTheme(element) {
  const computedStyle = window.getComputedStyle(element);
  const bgcolor = computedStyle.backgroundColor;
  const color = computedStyle.color;

  // Check background color
  if (bgcolor && bgcolor !== 'rgba(0, 0, 0, 0)' && bgcolor !== 'transparent') {
    const rgb = bgcolor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness < 128) return true;
    }
  }

  // Check text color (inverse logic - light text suggests dark background)
  if (color && color !== 'rgba(0, 0, 0, 0)') {
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness > 200) return true; // Light text suggests dark theme
    }
  }

  // Check parent elements
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    const parentStyle = window.getComputedStyle(parent);
    const parentBg = parentStyle.backgroundColor;
    if (parentBg && parentBg !== 'rgba(0, 0, 0, 0)' && parentBg !== 'transparent') {
      const rgb = parentBg.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 128) return true;
      }
    }
    parent = parent.parentElement;
  }

  // Check for dark theme indicators in classes
  const classes = element.className.toLowerCase();
  if (classes.includes('dark') || classes.includes('night') || classes.includes('black')) {
    return true;
  }

  return false;
}

// Function to collect CSS variables from the document
function collectCSSVariables() {
  const cssVars = new Map();

  // Get computed styles from root element
  const rootStyle = window.getComputedStyle(document.documentElement);

  // Iterate through all CSS properties
  for (let i = 0; i < rootStyle.length; i++) {
    const prop = rootStyle[i];
    if (prop.startsWith('--')) {
      const value = rootStyle.getPropertyValue(prop).trim();
      if (value) {
        cssVars.set(prop, value);
      }
    }
  }

  // Also check for CSS variables in stylesheets
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || sheet.rules || []) {
          if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop.startsWith('--')) {
                const value = rule.style.getPropertyValue(prop).trim();
                if (value && !cssVars.has(prop)) {
                  cssVars.set(prop, value);
                }
              }
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheets might not be accessible
        console.warn('Could not access stylesheet:', e);
      }
    }
  } catch (e) {
    console.warn('Error collecting CSS variables:', e);
  }

  return cssVars;
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