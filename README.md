# Nebula Host

Tous mes sites web au même endroit, publiés avec GitHub Pages.

## Ajouter un site

1. Ouvre le dossier [`sites`](sites) et clique sur **Add file → Upload files**.
2. Glisse le dossier de ton site. Il doit contenir un `index.html`.
3. Clique sur **Commit changes**.

Moins d'une minute plus tard, le site est en ligne à l'adresse `/sites/<nom-du-dossier>/` et apparaît sur le tableau de bord.

Le nom de la carte vient de la balise `<title>` de `index.html`. Tu peux aussi ajouter un fichier `site.json` dans le dossier :

```json
{ "title": "Mon portfolio", "description": "Site vitrine" }
```

## Aperçu en local

```
node scripts/build-sites.mjs
node scripts/serve.mjs
```

Puis ouvre http://localhost:4173

## Crédits

- Fond animé « Neuro Noise », adapté de [Paper Shaders](https://shaders.paper.design/neuro-noise), licence Apache-2.0
- Police Plus Jakarta Sans, SIL Open Font License (`fonts/OFL.txt`)
