# Load Config Action

[![CI Status](https://github.com/technote-space/load-config-action/workflows/CI/badge.svg)](https://github.com/technote-space/load-config-action/actions)
[![codecov](https://codecov.io/gh/technote-space/load-config-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/load-config-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/load-config-action/badge)](https://www.codefactor.io/repository/github/technote-space/load-config-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/load-config-action/blob/master/LICENSE)

GitHub Actions to load config.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Author](#author)

*generated with [TOC Generator](https://github.com/technote-space/toc-generator)*

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
e.g. `test.yml`  
```yaml
on: push
name: Example
jobs:
  triage:
    name: Load config example
    runs-on: ubuntu-latest
    steps:
      - uses: technote-space/load-config-action@v1
        with:
          CONFIG_FILENAME: config.yml
      - name: Dump
        run: |
          echo ${{ env.test1 }}
          echo ${{ env.test2 }}
          echo ${{ env.test3 }}
```

`.github/config.yml`
```yaml
test1: test1
test2:
  - test1
  - test2
test3:
  test4: test5
```

result:

```
test1
[test1,test2]
{test4:test5}
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
