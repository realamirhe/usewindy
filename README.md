# 🌪️ Windy - HTML/CSS Extractor <img align="right" src="https://github.com/user-attachments/assets/a3d00d31-c421-4a39-8143-01efb96bcff1" width="250px"/>
<p><small>A simple browser extension that extracts DOM elements with their inline CSS styles as beautiful HTML files.</small></p>

## ✨ Features

- **Visual Inspector**: Hover over elements to highlight them with blue borders
- **Click to Extract**: Click on any highlighted element to extract it
- **Beautiful Output**: Creates styled HTML files with centered, rounded content blocks
- **Embedded Assets**: Converts images to data URIs for standalone files
- **Shadow DOM Support**: Handles complex components with shadow DOM
- **Error Handling**: Graceful fallbacks and user-friendly error messages

## 🚀 How to Use

1. **Activate**: Click the Windy extension icon in your browser toolbar (shows "ON" badge when active)
2. **Select**: Hover over any element on the webpage - it will highlight with a blue border
3. **Extract**: Click on the highlighted element
4. **Download**: A beautiful HTML file will automatically download with your extracted element

## 🎨 Output Features

The extracted HTML files include:
- **Centered Layout**: Element is displayed in the center of the page
- **Rounded Container**: Beautiful rounded white container with gradient border
- **Gradient Background**: Professional purple gradient background
- **Inline Styles**: All CSS applied as inline styles for maximum portability
- **Embedded Images**: Images converted to data URIs (no external dependencies)
- **Shadow DOM Content**: Complete extraction including shadow DOM elements
- **Watermark**: Small "🌪️ Extracted with Windy" watermark

## 🛠️ Technical Details

### Extraction Process

1. **Element Selection**: Uses computed styles to capture the exact visual appearance
2. **Style Inlining**: Converts all computed CSS properties to inline styles
3. **Asset Embedding**: Fetches and converts images to base64 data URIs
4. **DOM Cloning**: Recursively clones the element and all its children
5. **HTML Generation**: Wraps in a complete HTML document with beautiful styling

### Supported Elements

- All standard HTML elements
- Custom components and web components
- Shadow DOM content
- Images (automatically embedded)
- Complex nested structures
- Elements with transforms, animations, and effects

### Error Handling

- **Extension Context Invalidated**: Shows notification if extension is reloaded
- **Network Errors**: Images that can't be fetched use their original URLs
- **DOM Access Errors**: Graceful handling when elements can't be accessed
- **Visual Feedback**: Green outline for success, red for errors

## Installation

This extension is not on the Chrome Web Store. To install it locally:

1. **Download**: Clone or download all project files to a folder
2. **Open Extensions**: Go to `chrome://extensions` in Chrome
3. **Developer Mode**: Enable "Developer mode" toggle in top-right
4. **Load Extension**: Click "Load unpacked" and select the project folder

The extension icon will appear in your toolbar. Click to activate/deactivate.

### Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium)
- Other Chromium-based browsers

## 🔧 Development

### File Structure
```
├── manifest.json     # Extension configuration
├── background.js     # Service worker (handles activation)
├── content.js        # Main content script (inspector logic)
├── utils.js          # Extraction utilities
├── style.css         # Inspector highlight styles
└── icons/            # Extension icons
```

### Key Functions

- `cloneWithStylesAndAssets()` - Main extraction function
- `getRelevantStyles()` - Extracts computed CSS properties  
- `toDataURI()` - Converts images to base64 data URIs
- `safeSendMessage()` - Handles extension context validation

### Troubleshooting

**"Extension context invalidated" Error**: 
- Occurs when extension is reloaded while active
- Refresh the webpage to restore functionality
- Notification will appear when this happens

**Inspector not working**:
- Click the extension icon to toggle on/off
- Look for "ON" badge to confirm it's active
- Try refreshing the page if recently installed

**Elements not highlighting**:
- Some elements may have CSS preventing highlighting
- Try hovering over parent or child elements
- Ensure inspector is activated (extension badge shows "ON")

## 📋 Changelog

### v1.0 - Simplified HTML/CSS Extractor
- Removed complex popup interface and Tailwind functionality
- Single-click extraction workflow
- Beautiful centered output with gradient backgrounds
- Embedded asset support with data URIs
- Improved error handling and user feedback
- Simplified codebase focused on HTML/CSS extraction only
