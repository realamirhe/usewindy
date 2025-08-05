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

/* Extract pseudo-element styles for an element */
function getPseudoElementStyles(element) {
  let pseudoStyles = "";
  const uniqueId = `windy-extracted-${Math.random().toString(36).substr(2, 9)}`;

  // Add unique identifier to the element
  element.setAttribute('data-windy-id', uniqueId);

  try {
    // Get ::before styles
    const beforeStyles = window.getComputedStyle(element, '::before');
    const beforeContent = beforeStyles.getPropertyValue('content');

    console.log(`🎭 Checking ::before for element:`, element.tagName, 'content:', beforeContent);

    if (beforeContent && beforeContent !== 'none' && beforeContent !== 'normal' && beforeContent !== '""') {
      const beforeProps = [
        'content', 'display', 'position', 'top', 'right', 'bottom', 'left',
        'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border', 'border-width', 'border-style', 'border-color', 'border-radius',
        'background', 'background-color', 'background-image', 'background-size',
        'background-position', 'background-repeat', 'background-attachment',
        'color', 'font', 'font-family', 'font-size', 'font-weight', 'font-style',
        'line-height', 'text-align', 'text-decoration', 'text-transform',
        'transform', 'transform-origin', 'opacity', 'z-index', 'box-shadow',
        'text-shadow', 'overflow', 'visibility', 'cursor', 'pointer-events',
        'flex', 'align-self', 'justify-self', 'order',
        'clip-path', 'mask', 'filter', 'backdrop-filter',
        'transition', 'animation'
      ];

      let beforeCss = "";
      for (const prop of beforeProps) {
        const value = beforeStyles.getPropertyValue(prop);
        if (value && value !== 'initial' && value !== 'normal' && value !== 'auto' && value !== 'none' && value !== '' && value !== '0px') {
          beforeCss += `${prop}: ${value}; `;
        }
      }

      if (beforeCss) {
        pseudoStyles += `[data-windy-id="${uniqueId}"]::before { ${beforeCss} }\n`;
        console.log(`✅ Added ::before styles for ${element.tagName}:`, beforeCss);
      }
    }

    // Get ::after styles
    const afterStyles = window.getComputedStyle(element, '::after');
    const afterContent = afterStyles.getPropertyValue('content');

    console.log(`🎭 Checking ::after for element:`, element.tagName, 'content:', afterContent);

    if (afterContent && afterContent !== 'none' && afterContent !== 'normal' && afterContent !== '""') {
      const afterProps = [
        'content', 'display', 'position', 'top', 'right', 'bottom', 'left',
        'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'border', 'border-width', 'border-style', 'border-color', 'border-radius',
        'background', 'background-color', 'background-image', 'background-size',
        'background-position', 'background-repeat', 'background-attachment',
        'color', 'font', 'font-family', 'font-size', 'font-weight', 'font-style',
        'line-height', 'text-align', 'text-decoration', 'text-transform',
        'transform', 'transform-origin', 'opacity', 'z-index', 'box-shadow',
        'text-shadow', 'overflow', 'visibility', 'cursor', 'pointer-events',
        'flex', 'align-self', 'justify-self', 'order',
        'clip-path', 'mask', 'filter', 'backdrop-filter',
        'transition', 'animation'
      ];

      let afterCss = "";
      for (const prop of afterProps) {
        const value = afterStyles.getPropertyValue(prop);
        if (value && value !== 'initial' && value !== 'normal' && value !== 'auto' && value !== 'none' && value !== '' && value !== '0px') {
          afterCss += `${prop}: ${value}; `;
        }
      }

      if (afterCss) {
        pseudoStyles += `[data-windy-id="${uniqueId}"]::after { ${afterCss} }\n`;
        console.log(`✅ Added ::after styles for ${element.tagName}:`, afterCss);
      }
    }
  } catch (e) {
    console.warn('Error extracting pseudo-element styles:', e);
  }

  return pseudoStyles;
}

/* Recursively collect pseudo-element styles for element and its children */
function collectAllPseudoStyles(element) {
  let allPseudoStyles = "";

  // Get pseudo styles for current element
  allPseudoStyles += getPseudoElementStyles(element);

  // Recursively get pseudo styles for all children
  const children = element.querySelectorAll('*');
  for (const child of children) {
    allPseudoStyles += getPseudoElementStyles(child);
  }

  // Also try to extract pseudo-element CSS from stylesheets
  allPseudoStyles += extractPseudoElementFromStylesheets(element);

  console.log('🎭 Total pseudo-element styles collected:', allPseudoStyles.length, 'characters');
  if (allPseudoStyles) {
    console.log('🎭 Pseudo-styles preview:', allPseudoStyles.substring(0, 200) + '...');
  }

  return allPseudoStyles;
}

/* Extract pseudo-element rules from stylesheets */
function extractPseudoElementFromStylesheets(rootElement) {
  let pseudoRules = "";

  try {
    // Get all elements in the subtree
    const allElements = [rootElement, ...rootElement.querySelectorAll('*')];

    // Create a set of selectors to look for
    const selectorsToCheck = new Set();

    for (const element of allElements) {
      // Add class-based selectors
      if (element.className) {
        const classes = element.className.split(/\s+/);
        for (const cls of classes) {
          if (cls.trim()) {
            selectorsToCheck.add(`.${cls.trim()}::before`);
            selectorsToCheck.add(`.${cls.trim()}::after`);
            selectorsToCheck.add(`.${cls.trim()}:before`);
            selectorsToCheck.add(`.${cls.trim()}:after`);
          }
        }
      }

      // Add ID-based selectors
      if (element.id) {
        selectorsToCheck.add(`#${element.id}::before`);
        selectorsToCheck.add(`#${element.id}::after`);
        selectorsToCheck.add(`#${element.id}:before`);
        selectorsToCheck.add(`#${element.id}:after`);
      }

      // Add tag-based selectors
      const tagName = element.tagName.toLowerCase();
      selectorsToCheck.add(`${tagName}::before`);
      selectorsToCheck.add(`${tagName}::after`);
      selectorsToCheck.add(`${tagName}:before`);
      selectorsToCheck.add(`${tagName}:after`);
    }

    // Check all stylesheets
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selectorText = rule.selectorText.toLowerCase();

            // Check if this rule contains pseudo-elements
            if (selectorText.includes('::before') || selectorText.includes('::after') ||
              selectorText.includes(':before') || selectorText.includes(':after')) {

              // Check if any of our elements might match this selector
              for (const selector of selectorsToCheck) {
                if (selectorText.includes(selector.toLowerCase()) ||
                  matchesElementContext(selectorText, allElements)) {
                  pseudoRules += `${rule.cssText}\n`;
                  console.log('📋 Found stylesheet pseudo-rule:', rule.cssText);
                  break;
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn('Could not access stylesheet rules:', e);
      }
    }
  } catch (e) {
    console.warn('Error extracting pseudo-element rules from stylesheets:', e);
  }

  return pseudoRules;
}

/* Helper function to check if a CSS selector might match our elements */
function matchesElementContext(selectorText, elements) {
  // Simple heuristic to check if selector might apply to our elements
  for (const element of elements) {
    try {
      // Check if element matches the selector (without pseudo-elements)
      const baseSelector = selectorText.replace(/::(before|after)|:(before|after)/g, '');
      if (element.matches && element.matches(baseSelector)) {
        return true;
      }
    } catch (e) {
      // Invalid selector, continue
    }
  }
  return false;
}

/* Collect CSS custom properties (variables) from the document */
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

/* Detect if element has dark theme */
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

/* Clone element with styles and embedded assets for download */
async function cloneWithStylesAndAssets(node, visited = new WeakSet(), assetMap = new Map(), pseudoStylesMap = new Map()) {
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

  // Collect pseudo-element styles if not already collected
  const pseudoStyles = getPseudoElementStyles(node);
  if (pseudoStyles && !pseudoStylesMap.has(node)) {
    pseudoStylesMap.set(node, pseudoStyles);
  }

  // Copy the data-windy-id if it was added during pseudo-element extraction
  const windyId = node.getAttribute('data-windy-id');
  if (windyId) {
    clone.setAttribute('data-windy-id', windyId);
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
        const clonedChild = await cloneWithStylesAndAssets(child, visited, assetMap, pseudoStylesMap);
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
    const clonedChild = await cloneWithStylesAndAssets(child, visited, assetMap, pseudoStylesMap);
    if (clonedChild) {
      clone.appendChild(clonedChild);
    }
  }

  return clone;
}