# Muhammad Fahmi Isyraqi — Portfolio

A React + Vite personal portfolio starter with a dark editorial visual style, monochrome portrait, animated agent wireframes, responsive sections, and a Tour replay.

## Run locally

1. Install Node.js (LTS).
2. Open this folder in a terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL printed by Vite (http://localhost:3000). This address is only for this computer.

## Publish on Cloudflare Pages

1. Push this project to a GitHub repository.
2. In Cloudflare, open **Workers & Pages → Create application → Pages → Connect to Git**, then select the repository.
3. Use these build settings:
   - Framework preset: **Vite**
   - Production branch: **main**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (repository root)
   - Environment variable: `NODE_VERSION` = `22`
4. Save and deploy. Cloudflare Pages will build future pushes to `main` automatically.

The `public/_redirects` file supplies the SPA fallback. Root-relative paths for the source entry, headshot, flags, and PDFs work at the Pages site root. The existing `netlify.toml` is retained but is not used by Cloudflare Pages.

The older nested `fahmi-portfolio/` copy is preserved on disk and ignored by Git so only the current project at the repository root is uploaded.

### Upload this project to GitHub

Create an empty GitHub repository first, then run these commands from this project folder in PowerShell, replacing the URL with your repository URL:

```powershell
git init
git add .
git commit -m "Prepare portfolio for Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Git is not initialized in this folder. These commands create a new local repository; do not run `git init` if you later find an existing `.git` directory or existing history to preserve.

## Before publishing

- Add verified LinkedIn, GitHub, and Instagram links if you want them displayed.
- Review every project and skill description for accuracy.
- The portfolio deliberately does not invent contact details, sales, clients, or project traction.

## Notes

- The portrait is stored at `public/headshot.png`.
- Uploaded documents and language flag images are stored under `public/` and copied into the Cloudflare Pages build output.
- The Languages section lists Arabic (Beginner), English (Advanced), and Indonesian (Native), with circular flag images.
- Education dates are June 2020–April 2026; the school name links to the official admissions site.
- Contact links open the supplied WhatsApp number and Instagram profiles.
- SkillPass includes its pitch deck and plain-language guide PDFs. Uploaded certificates are linked in the Achievements & Certificates section.
- Each AI agent has its own cursor color.
- On entry, the page automatically scrolls through Hero to Contact, then returns to the top. Agents keep working across every section as you scroll. Press `T` or click **Tour** to replay the tour; click **Stop Tour** (or press `T` again) to stop. Press `A` to toggle agents and `P` to pause or resume.
- The intro respects `prefers-reduced-motion`; add `?agents=on` to force the animation.
- Build for production with `npm run build`.
