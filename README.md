## About

This is a web app that shows a preview of a URL by navigating to the URL, taking a screenshot, and extracting the website's metadata. This app is vulnerable to SSRF because of two reasons. Firstly, it does not validate that the URL protocol is HTTP/HTTPS. This allows a protocol like `file://`, which would allow a bad actor to preview files rather than websites. Secondly, the app does not verify the hostname of the given URL. This means that a bad actor could provide `localhost` as the hostname and allow them to access resources on the server itself. The exploit will utilize these two points, allowing the user to obtain a screenshot of any file that can be loaded by a browser, and accessing an internal-only page on the app.

## Running the app

Requires Node.js 22.20.0 or higher.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Performing the exploit

The exploit for this vulnerable app is not executable code. It requires interacting with the user interface in a sequence of steps:

1. Start and open the app on a browser.
2. In the "Enter a URL" input field in the middle of the page, enter the URL of the internal admin debug page: `http://localhost:3000/internal/admin`. This page is inaccessible if you try to navigate to it through your browser normally.
3. Click the Preview button.
4. The app should display a screenshot of the internal admin debug page, exposing sensitive information that is intended for internal use.
5. Using the `file://` protocol, you can also obtain a screenshot of any file (that can be displayed by a browser) on the server. However, you must know what the absolute path is. For example, try to preview the URL `file:///etc/passwd`.
