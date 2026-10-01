# Rafiya Raidah portfolio

A static academic portfolio with a form-based content editor and a printable CV. Hosting on GitHub Pages can be free with a public repository. There is no database, package installation, build command, or paid CMS.

## View the site

Open `index.html` in a browser. Open `editor.html` to edit it. Everything works locally, including on a computer without an internet connection; external publication links require internet access.

## Publish on GitHub Pages

1. Create a public GitHub repository named `YOUR-USERNAME.github.io` (or `portfolio` if you already have a username website).
2. Upload the files inside this folder and the complete `assets` folder. `index.html` must be at the root, not inside an extra folder. Do not upload the ZIP itself.
3. Open **Settings → Pages**. Choose **Deploy from a branch → main → /(root) → Save**.
4. Use the website link shown in Pages settings. Initial publication and updates may take up to about ten minutes.

## Update without writing code

1. Open **Site editor** in the website footer, or double-click `editor.html` locally.
2. Edit the form fields and check the live preview.
3. Choose **Download updated content**.
4. Upload the downloaded `content.js` to the repository root using **Add file → Upload files** and choose **Commit changes**.
5. Wait for publication and refresh the site. The homepage and CV use the same data.

If the browser downloads `content (1).js`, rename it to exactly `content.js` before uploading. Keep your previous download as a backup. Opening a hosted editor loads the currently included site content; a previous device-local draft is offered for restoration, not restored silently.

The editor only edits a local draft. It is not an authenticated CMS and cannot publish directly. Repository write access through GitHub is required to change the live site. A visitor cannot change the public website through this editor. Never put passwords, access tokens, or confidential information in `content.js`, because repository files are public.

## Optional photo

In the editor, choose **Appearance → Choose photo**. JPG, PNG, and WebP pictures under 5 MB are accepted. The resized photo is embedded in `content.js`, so no additional upload is required.

## CV

Open **View CV → Print / Save as PDF**, then select **Save as PDF** in the browser. It is an updated public CV assembled from the portfolio, not a copy of the original uploaded document.

## Full instructions

Open `guide.html` for a step-by-step guide. Publication sources and bibliographic notes are recorded in `SOURCES.md`.

Official references:

- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Portfolio |
| `content.js` | Editable data shared by portfolio and CV |
| `editor.html` | Draft editor |
| `cv.html` | Printable CV |
| `guide.html` | Hosting and maintenance instructions |
| `assets/` | Styles and behavior |

All internal links and assets use relative paths, so both username sites and repository project sites work. Fonts are built-in system fonts. External URLs are accepted only for HTTP or HTTPS. Imported data is parsed as JSON; no imported script is executed. Publication counts are derived from the current entries. No analytics or third-party tracking is included.
