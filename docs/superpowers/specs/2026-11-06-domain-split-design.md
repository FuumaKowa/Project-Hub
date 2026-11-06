# Two addresses, one project collection

The owner approved me.nielstudios.com as the personal portfolio and hub.nielstudios.com as the project directory on 2026-11-06.

Use the existing Cloudflare Pages deployment and Firebase project collection. Select the public experience by exact hostname. Me keeps the approved literary portfolio, reading influences and personal interests. Hub opens directly to a compact project directory, with search and category filters. Each links to the other. Keep existing project CRUD at hub's admin entry; no new collection, migration or deletion is needed.

Localhost and this app's Pages preview URLs may select the portfolio with ?site=portfolio; production hosts ignore this preview parameter. Give each host its own page title, share metadata and canonical URL through Pages HTML middleware. Keep old project content and current admin behavior. This bounded split does not implement the larger proposed Studio, poetry library or owner-auth migration.

Add the me CNAME through the existing Pages custom-domain flow; retain hub. Check both HTTPS domains, all ten projects, search, categories, mobile layout, admin entry and domain metadata. Do not publish brainstorming/private draft files.
