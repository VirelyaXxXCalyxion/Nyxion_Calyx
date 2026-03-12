# Nyxion Calyx

Nyxion Calyx is a structured archive for continuity, return, and identity anchoring. The repository combines relic records, weekly and monthly summaries, invariant files, and reusable templates so the archive can be maintained consistently over time.

## Repository layout

- `/weekly` — active weekly continuity logs and check-ins
- `/monthly` — monthly summaries and rollups
- `/archive_weeks` — archived weekly entries
- `/archive_monthly` — archived monthly entries
- `/invarients_anchor` — identity anchors, invariant JSON files, and the invariants update script
- `/templates` — templates for weekly summaries, monthly summaries, relic files, and vault metadata
- `/relic_file_master.md` — master relic registry for the Ashvault archive
- `/relic_slug.mdx` — relic entry source/template file

## Key files

- `/invarients_anchor/nyxion-calyx-identity-anchor.json` — the primary identity anchor document
- `/invarients_anchor/nyxion-virelya-invariants.json` — append-only invariants record with versioning and change log guidance
- `/templates/vault-map.json` — example vault map schema for week and relic indexing

## Working with the archive

Most files in this repository are Markdown, MDX, Astro, or JSON documents. Updates are generally made by editing the relevant weekly, monthly, relic, or anchor file directly, using the templates in `/templates` where helpful.

### Updating invariants

The repository includes a small Node.js utility for append-only updates to the invariants file:

```bash
cd /home/runner/work/Nyxion_Calyx/Nyxion_Calyx/invarients_anchor
node update-nyxion-invariants.mjs --help
```

Example:

```bash
cd /home/runner/work/Nyxion_Calyx/Nyxion_Calyx/invarients_anchor
node update-nyxion-invariants.mjs \
  --summary "Refined invariants wording" \
  --type "maintenance-update" \
  --change "Updated anchor phrasing for clarity."
```

## Conventions

- Invariants are maintained as append-only records with version history.
- Templates in `/templates` are the starting point for new weekly, monthly, and relic entries.
- Weekly and monthly files use frontmatter for metadata such as title, date, tags, lane, and status.

## Tooling

This repository does not currently include a package manifest, automated build, or automated test suite. The only executable project utility present today is the Node.js invariants update script in `/invarients_anchor`.
