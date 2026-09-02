# SteveWolfExpertWitness.com

Static single-page site published to Netlify (site id `eb096cc0-ac66-499a-aec0-44912d841461`).

Case list is data-driven: `index.html` fetches `cases.json` at page load and renders `#caseTableBody`. Publishes originate from the `sw-expert-dashboard` Settings > Website Cases panel, which commits an updated `cases.json` here; Netlify auto-deploys on push to `main`.
