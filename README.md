[![Node.js version support][shield-node]][info-node]
[![codecov](https://codecov.io/gh/locr-company/js-vms2-tile-db-reader/graph/badge.svg?token=P6F0rV99ym)](https://codecov.io/gh/locr-company/js-vms2-tile-db-reader)
[![github_workflow_status](https://img.shields.io/github/actions/workflow/status/locr-company/js-progress/node.js.yml)](https://github.com/locr-company/js-vms2-tile-db-reader/actions/workflows/node.js.yml)

# 1. Installation

```bash
npm install @locr-company/vms2-tile-db-reader
```

# 2. How to use

```js
import { SQLite } from '@locr-company/vms2-tile-db-reader';

const progress = new Progress(1_000);
progress.incrementCounter();
console.log(progress.Counter); // 1
console.log(progress.PercentageCompleted); // 0.1
console.log(progress.toFormattedString()); // progress => 1/1000 (0.10%); elapsed: 00:00:01; ete: 00:16:39; eta: 2021-10-10 20:00:01
progress.setCounter(1000);
console.log(progress->PercentageCompleted); // 100
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