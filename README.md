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

## Exploit

The exploit for this vulnerable app is not executable code. It requires interacting with the user interface in a sequence of steps.

1. Start and open the app on a browser.
2. In the "Enter a URL" input field in the middle of the page, enter the URL of the internal admin debug page: `http://localhost:3000/internal/admin`. This page is inaccessible if you try to navigate to it through your browser normally.
3. Click the Preview button.
4. The app should display a screenshot of the internal admin debug page, exposing sensitive information that is intended for internal use.
5. You can also obtain a screenshot of any file (that can be displayed by a browser) on the server. However, you must know what the absolute path is. For example, try to preview the URL `file:///etc/passwd`.
