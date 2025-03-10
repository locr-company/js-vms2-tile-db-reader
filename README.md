[![Node.js version support][shield-node]][info-node]
[![codecov](https://codecov.io/gh/locr-company/js-vms2-tile-db-reader/graph/badge.svg?token=P6F0rV99ym)](https://codecov.io/gh/locr-company/js-vms2-tile-db-reader)
[![github_workflow_status](https://img.shields.io/github/actions/workflow/status/locr-company/js-progress/node.js.yml)](https://github.com/locr-company/js-vms2-tile-db-reader/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=locr-company_js-vms2-tile-db-reader&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=locr-company_js-vms2-tile-db-reader)
[![github_tag](https://img.shields.io/github/v/tag/locr-company/js-vms2-tile-db-reader)](https://github.com/locr-company/js-vms2-tile-db-reader/tags)
[![NPM Version](https://img.shields.io/npm/v/%40locr-company%2Fvms2-tile-db-reader)](https://www.npmjs.com/package/@locr-company/vms2-tile-db-reader)
[![JSR Version](https://img.shields.io/jsr/v/%40locr-company/js-vms2-tile-db-reader)](https://jsr.io/@locr-company/js-vms2-tile-db-reader)

# 1. Installation

```bash
npm install @locr-company/vms2-tile-db-reader
```

# 2. How to use

```js
import { SQLite } from '@locr-company/vms2-tile-db-reader';

const tileDb = new SQLite('data/world.sqlite');
const tileData = tileDb.getRawData(34686, 21566, 16, 'building', '*', 'polygons');

// tileData is a Buffer object, that you output in a http response.
```

# 3. Development

Clone the repository

```bash
git clone git@github.com:locr-company/js-vms2-tile-db-reader.git
cd js-vms2-tile-db-reader/.git/hooks && ln -s ../../git-hooks/* . && cd ../..
npm install
```

# 4. Publish a new version

```bash
# update CHANGELOG.md file

npm version <major>.<minor>.<patch>
git push && git push origin --tags
```

[info-node]: package.json
[shield-node]: https://img.shields.io/node/v/@locr-company/vms2-tile-db-reader.svg