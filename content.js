let inspectorActive = false;
let lastHoveredElement = null;

// Utility function to safely send messages to background script
function safeSendMessage(message) {
  try {
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage(message);
    }
  } catch (error) {
    if (error.message.includes('Extension context invalidated')) {
      console.warn('Extension was reloaded. Please refresh the page to continue using Windy.');
      showExtensionInvalidatedNotice();
    } else {
      console.error('Failed to send message:', error);
    }
  }
}

// Show a notice when extension context is invalidated
function showExtensionInvalidatedNotice() {
  if (document.getElementById('windy-invalidated-notice')) return;

  const notice = document.createElement('div');
  notice.id = 'windy-invalidated-notice';
  notice.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
  `;
  notice.innerHTML = `
    <strong>🌪️ Windy Extension</strong><br>
    Extension was reloaded. Please refresh this page to continue using Windy.
  `;

  document.body.appendChild(notice);
  setTimeout(() => {
    if (notice.parentNode) {
      notice.parentNode.removeChild(notice);
    }
  }, 10000);
}

function activateInspector() {
  if (inspectorActive) return;
  inspectorActive = true;
  document.body.addEventListener('mouseover', handleMouseOver);
  document.body.addEventListener('mouseout', handleMouseOut);
  document.body.addEventListener('click', handleElementClick, { capture: true });
}

function deactivateInspector() {
  if (!inspectorActive) return;
  inspectorActive = false;
  document.body.removeEventListener('mouseover', handleMouseOver);
  document.body.removeEventListener('mouseout', handleMouseOut);
  document.body.removeEventListener('click', handleElementClick, { capture: true });
  if (lastHoveredElement) {
    lastHoveredElement.classList.remove('windy-highlight');
  }
}

function handleMouseOver(e) {
  const target = e.target;
  if (!target || target === lastHoveredElement) return;
  target.classList.add('windy-highlight');
  lastHoveredElement = target;
}

function handleMouseOut(e) {
  if (e.target) {
    e.target.classList.remove('windy-highlight');
    lastHoveredElement = null;
  }
}

async function handleElementClick(e) {
  if (!inspectorActive) return;
  e.preventDefault();
  e.stopPropagation();

  const clickedElement = e.target;
  if (!clickedElement) return;

  deactivateInspector();
  safeSendMessage({ action: "DEACTIVATE_INSPECTOR" });

  try {
    console.log("🔄 Extracting element with styles...");
    await extractAndDownload(clickedElement);
    showSuccessFeedback(clickedElement);
  } catch (error) {
    console.error('Failed to extract element:', error);
    showErrorFeedback(clickedElement);
  }
}

async function extractAndDownload(element) {
  const visited = new WeakSet();
  const assetMap = new Map();

  // Clone element with inline styles and embedded assets
  const clonedElement = await cloneWithStylesAndAssets(element, visited, assetMap);

  // Detect if the element has dark theme
  const isDark = detectDarkTheme(element);

  // Collect CSS variables
  const cssVariables = collectCSSVariables();
  let variablesCSS = "";
  if (cssVariables.size > 0) {
    variablesCSS = ":root {\n";
    for (const [prop, value] of cssVariables) {
      variablesCSS += `  ${prop}: ${value};\n`;
    }
    variablesCSS += "}\n";
  }

  // Create complete HTML document with adaptive styling
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extracted Element</title>
  <style>
    ${variablesCSS}
    * {
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, sans-serif;
    }
    body {
      background: ${isDark ?
      'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' :
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .extracted-content {
      background: ${isDark ? 'rgba(45, 45, 65, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, ${isDark ? '0.3' : '0.1'});
      padding: 32px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      position: relative;
      backdrop-filter: blur(10px);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    }
    .extracted-content::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: ${isDark ?
      'linear-gradient(45deg, #1a1a2e, #16213e, #1a1a2e)' :
      'linear-gradient(45deg, #667eea, #764ba2, #667eea)'
      };
      border-radius: 18px;
      z-index: -1;
      opacity: 0.7;
    }
    .watermark {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${isDark ? 'rgba(45, 45, 65, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
      color: ${isDark ? '#e5e5e5' : '#666'};
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    }

    /* Ensure extracted content maintains its styling */
    .extracted-content > * {
      /* Preserve the original element's styling completely */
    }
  </style>
</head>
<body>
  <div class="extracted-content">
    ${clonedElement.outerHTML}
  </div>
  <div class="watermark">🌪️ Extracted with Windy</div>
</body>
</html>`;

  // Download the file
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "windy-extracted-element.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("✅ Element extracted and downloaded as windy-extracted-element.html");
  console.log("📊 File size:", Math.round(blob.size / 1024), "KB");
  console.log("🎨 Theme detected:", isDark ? "Dark" : "Light");
}

function showSuccessFeedback(element) {
  element.classList.add('windy-success');
  setTimeout(() => element.classList.remove('windy-success'), 1500);
}

function showErrorFeedback(element) {
  element.classList.add('windy-error');
  setTimeout(() => element.classList.remove('windy-error'), 1500);
}

chrome.runtime.onMessage.addListener((request) => {
  try {
    if (request.action === 'TOGGLE_INSPECTOR') {
      if (request.isActive) {
        activateInspector();
      } else {
        deactivateInspector();
      }
    }
  } catch (error) {
    if (error.message.includes('Extension context invalidated')) {
      console.warn('Extension was reloaded. Please refresh the page to continue using Windy.');
    } else {
      console.error('Error handling message:', error);
    }
  }
});

// Check initial state on page load
try {
  chrome.storage.local.get('extensionIsActive', (result) => {
    if (result.extensionIsActive) {
      activateInspector();
    }
  });
} catch (error) {
  console.warn('Could not check initial state:', error);
}