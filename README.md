# Ajay Patel — Personal Website

My personal website at [ajayppatel.com](https://ajayppatel.com). It's an iPhone home screen (iPad-style on wider screens): unlock it, open apps, or drive around a tiny Brooklyn.

## Editing content

Almost everything lives in **`js/config.js`**: bio, links, photos, places, projects, books, music, email and the contact form endpoint. Items marked `placeholder: true` show a "Placeholder" tag on the site.

- Photos: drop images in `images/` and add them to `photos` in the config.
- Contact form: set `formEndpoint` to a Formspree/Web3Forms URL so Messages actually delivers.
- Email: set `email: ['you', 'domain', 'com']`. It's assembled only when someone taps "Show email".

## Structure

- `index.html` — page shell
- `css/os.css` — iOS / iPadOS styling
- `js/os.js` — lock screen, home screen, apps
- `js/drive.js` — the Drive mini-game
- `classic/` — the previous plain version of the site
- `games/` — games hub at ajayppatel.com/games/ (e.g. Word Vistas)
- Deep links: `ajayppatel.com/#drive`, `#about`, `#messages`, etc.

## Deployment

Deployed via GitHub Pages. Push to `master` and it auto-deploys.
