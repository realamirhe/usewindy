let inspectorActive = false;
let lastHoveredElement = null;

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
    lastHoveredElement.classList.remove('tailwind-inspector-highlight');
  }
}

function handleMouseOver(e) {
  const target = e.target;
  if (!target || target === lastHoveredElement) return;
  target.classList.add('tailwind-inspector-highlight');
  lastHoveredElement = target;
}

function handleMouseOut(e) {
  if (e.target) {
    e.target.classList.remove('tailwind-inspector-highlight');
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
  chrome.runtime.sendMessage({ action: "DEACTIVATE_INSPECTOR" }); // Tell background to update UI

  try {
    const tailwindTree = convertDomToTailwindTree(clickedElement);
    if (!tailwindTree) throw new Error('Could not convert element.');

    // 🔽 NEW: Prettify the HTML before copying
    
    const prettyHTML = prettifyHTML(tailwindTree.outerHTML, 2);

    await navigator.clipboard.writeText(prettyHTML);
    console.log("Copied to clipboard:\n", prettyHTML);


    // Visual feedback for success
    clickedElement.classList.add('tailwind-inspector-copied');
    setTimeout(() => clickedElement.classList.remove('tailwind-inspector-copied'), 1500);
  } catch (error) {
    console.error('Failed to copy Tailwind HTML:', error);
  }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'TOGGLE_INSPECTOR') {
    request.isActive ? activateInspector() : deactivateInspector();
  }
});

// Check initial state on page load
chrome.storage.local.get('extensionIsActive', (result) => {
  if (result.extensionIsActive) {
    activateInspector();
  }
});