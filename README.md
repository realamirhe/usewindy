# DOM to Tailwind Converter

A developer tool to instantly convert DOM elements into clean, Tailwind CSS-based HTML, right from your browser.

---

## Features

-   **Live Element Inspection**: Activate the inspector to highlight and select any element on any webpage.
-   **Computed Styles to Tailwind**: Intelligently converts final computed CSS into corresponding Tailwind utility classes, including arbitrary values.
-   **Component-Aware**: Translates custom HTML tags (e.g., `<app-root>`) into standard `divs` with a `data-component` attribute for clarity.
-   **Attribute Cleanup**: Automatically removes cluttered, framework-specific attributes from the final markup.
-   **One-Click Copy**: Generates and copies a beautified HTML structure to your clipboard, ready to be pasted directly into your project.

---

## How It Works

1.  **Activate**: Click the extension icon in your toolbar to toggle the inspector mode. A badge will show 'ON'.
2.  **Select**: Hover over the webpage. Elements will be highlighted with a red border.
3.  **Copy**: Click on any highlighted element. The generated Tailwind HTML is instantly copied to your clipboard, and the inspector deactivates.

---

## Installation

This extension is not on the Chrome Web Store. To install it locally, follow these steps:

1.  **Download the Code**: Download or clone all the project files into a single folder on your computer.
2.  **Open Chrome Extensions**: Open Google Chrome and navigate to the extensions page by entering `chrome://extensions` in the address bar.
3.  **Enable Developer Mode**: In the top-right corner of the Extensions page, turn on the **Developer mode** toggle switch.
4.  **Load the Extension**: Click the **Load unpacked** button that appears.
5.  **Select the Folder**: In the file selection dialog, navigate to and select the root folder of the extension (the one containing `manifest.json`).

The extension icon will now appear in your browser's toolbar. You may need to pin it by clicking the puzzle piece icon.