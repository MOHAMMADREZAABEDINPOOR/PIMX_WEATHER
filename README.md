<div align="center">

<img src="assets/readme/hero.gif" width="1200" alt="PIMX WEATHER — rotating 3D geometry" />

**[English](README.md) · [فارسی](README.fa.md)**

<img src="assets/readme/identity.svg" width="1200" alt="space / English and Persian documentation" />

</div>

# PIMX WEATHER

A vanilla JavaScript weather dashboard with forecast views, localization, animated styling and astronomical/solar visualizations.

[GitHub](https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER) · [PIMX / Profile](https://github.com/MOHAMMADREZAABEDINPOOR) · [Static artwork](assets/readme/hero.png)

## Features

- Current weather and forecast information
- English/Persian interface through i18n.js
- Astronomical and solar visualization code
- Static deployment without a frontend build tool

## Stack

| Tool | Version / source |
|---|---|
| HTML / CSS / JavaScript | `static files` |

## Getting started

A modern browser; Python is optional for the local HTTP server.

```bash
git clone https://github.com/MOHAMMADREZAABEDINPOOR/PIMX_WEATHER.git
cd PIMX_WEATHER

python -m http.server 8000
```

## Configuration

No standard environment template is defined. Standalone exercises need no external configuration; inspect any service constants or paths in the source before running.

## Usage

Serve the directory, choose a location and browse the weather panels. Allow geolocation only if you want the current-location feature.

## Project structure

| Path | Role |
|---|---|
| [`assets/`](assets/) | Brand/media/README assets |
| [`index.html`](index.html) | Project entry/configuration file |

## Commands and checks

No automated test command is declared in a manifest. Verify behavior through a local example run.

## Deployment

Publish the directory to an HTTPS static host and verify file paths and external links.

## Limitations

Forecasts depend on external data providers and are not guaranteed observations. Location permissions, provider limits and network connectivity affect results.

## Troubleshooting

- Missing packages: install dependencies using the project’s package manager.
- API/network failure: check the configured origin, provider and hosting bindings.
- Old assets: rebuild when a build script exists, then clear the browser cache.

## Contributing

Create a focused branch, verify the affected behavior and explain the change clearly. Keep private data, build outputs and local databases out of commits.

## License

No repository-level license file is included in this snapshot. Public visibility alone does not grant reuse rights; contact the repository owner for terms.

---

Part of **PIMX** · Documentation in English and Persian.
