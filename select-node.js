// Set your target element selector here
const TARGET_SELECTOR = "#your-element-id"; // Change this to your element selector

(async () => {
  const startEl = document.querySelector(TARGET_SELECTOR);
  if (!startEl) {
    console.error("Element not found:", TARGET_SELECTOR);
    return;
  }

  const visited = new WeakSet();
  const assetMap = new Map();

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
    const styles = new Set();
    const computed = getComputedStyle(element);

    // Get only visually important properties
    const importantProps = [
      "display",
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "width",
      "height",
      "min-width",
      "min-height",
      "max-width",
      "max-height",
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "border",
      "border-width",
      "border-style",
      "border-color",
      "border-radius",
      "background",
      "background-color",
      "background-image",
      "background-size",
      "background-position",
      "background-repeat",
      "background-attachment",
      "color",
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "line-height",
      "text-align",
      "text-decoration",
      "text-transform",
      "letter-spacing",
      "word-spacing",
      "overflow",
      "overflow-x",
      "overflow-y",
      "visibility",
      "opacity",
      "transform",
      "transform-origin",
      "transition",
      "animation",
      "flex",
      "flex-direction",
      "flex-wrap",
      "justify-content",
      "align-items",
      "align-content",
      "grid",
      "grid-template-columns",
      "grid-template-rows",
      "grid-gap",
      "box-shadow",
      "text-shadow",
      "outline",
      "cursor",
      "pointer-events",
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

  /* Clone element with inline styles */
  async function cloneWithStyles(node) {
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
          const clonedChild = await cloneWithStyles(child);
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
      const clonedChild = await cloneWithStyles(child);
      if (clonedChild) {
        clone.appendChild(clonedChild);
      }
    }

    return clone;
  }

  /* Collect relevant CSS from stylesheets */
  function collectRelevantCSS(element) {
    const relevantCSS = new Set();

    // Get CSS custom properties (CSS variables) from document
    const rootStyles = getComputedStyle(document.documentElement);
    let customProps = "";
    for (let i = 0; i < rootStyles.length; i++) {
      const prop = rootStyles[i];
      if (prop.startsWith("--")) {
        customProps += `${prop}: ${rootStyles.getPropertyValue(prop)}; `;
      }
    }

    if (customProps) {
      relevantCSS.add(`:root { ${customProps} }`);
    }

    // Add basic reset styles
    relevantCSS.add(`
      * { box-sizing: border-box; }
      body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
    `);

    return Array.from(relevantCSS).join("\n");
  }

  console.log("🔄 Cloning element and styles...");

  // Clone the element
  const clonedElement = await cloneWithStyles(startEl);

  // Collect CSS
  const css = collectRelevantCSS(startEl);

  // Create final HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extracted Element</title>
  <style>
${css}
  </style>
</head>
<body style="display: flex; height: 100vh; width: 100vw; justify-content: center; align-items: center; background-color: var(--background-color, tomato);">
  ${clonedElement.outerHTML}
</body>
</html>`;

  // Download the file
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "extracted-element.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("✅ Element extracted and downloaded as extracted-element.html");
  console.log("📊 File size:", Math.round(blob.size / 1024), "KB");
})();
