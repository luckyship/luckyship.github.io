---
layout: post
title: github、gitee自动部署hexo博客
tags: [hexo]
comments: true
date: 2023-06-14 11:57:13
---

使用 `hexo` 时，我们需要手动执行`hexo deploy`去部署博客代码，
使用 gitee 部署博客时，因为 gitee 博客不会自动部署，我们需要手动点击部署按钮

针对上面 2 个问题我们使用 github actions 自动去执行相关代码

<!-- more -->

## github 自动部署代码

在创建之前，我们先需要手动创建主题的`submodule`

```bash
# Add submodule
$ git submodule add https://github.com/theme-next/hexo-theme-next themes/next

# Get tags list
$ cd themes/next
$ git tag -l
…
v6.0.0
v6.0.1
v6.0.2
...

# Switch on v6.0.1 tagged release version
$ git checkout tags/v6.0.1
Note: checking out 'tags/v6.0.1'.
…
HEAD is now at da9cdd2... Release v6.0.1

# If you want to switch on latest release version without defining tag (optional)
$ git checkout $(git describe --tags $(git rev-list --tags --max-count=1))
```

> 如果没有打 tag，在 `git submodule add`之后， 直接提交代码即可

```yaml
name: Hexo Deploy Automatically and update gitee deploy

on:
  push:
    branches: [dev]
  workflow_dispatch:

jobs:
  deploy-blog:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Latest Version
        uses: actions/checkout@v2

      # 需要提交创建对应的theme的submodule
      - name: Checkout Theme
        run: |
          git submodule init
          git submodule update

      - name: Setup Node Env
        uses: actions/setup-node@v1

      # Caching dependencies to speed up workflows. (GitHub will remove any cache entries that have not been accessed in over 7 days.)
      - name: Cache Node Dependencies
        id: cache
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{runner.OS}}-npm-caches-${{ hashFiles('package-lock.json') }}

      - name: Install Dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: npm install

      # 填写自己的github username、email
      - name: Deploy
        env:
          SSH_KEY: ${{secrets.GITEE_RSA_PRIVATE_KEY}}
        run: |
          export TZ='Asia/Shanghai'

          mkdir -p ~/.ssh/
          echo "$SSH_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

          git config --global user.name '[username]'
          git config --global user.email '[email]'

          hexo clean
          hexo generate
          hexo deploy

      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@master
        env:
          # 注意在 Settings->Secrets 配置 GITEE_RSA_PRIVATE_KEY
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
        with:
          # 注意替换为你的 GitHub 源仓库地址
          source-repo: git@github.com:luckyship/luckyship.github.io.git
          # 注意替换为你的 Gitee 目标仓库地址
          destination-repo: git@gitee.com:luckyship/luckyship.git

      - name: Build Gitee Pages
        uses: yanglbme/gitee-pages-action@main
        with:
          # 注意替换为你的 Gitee 用户名
          gitee-username: luckyship
          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
          gitee-repo: luckyship/luckyship
          # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
          branch: main
```

> `GITEE_RSA_PRIVATE_KEY`使用的是私钥， 在`~/.ssh/id_rsa` 是私钥, 如何生成公钥和私钥，参考[git](/2021/05/15/2021-05-15-git-use/)

# 参考

[gitee-pages-action](https://github.com/marketplace/actions/gitee-pages-action)
[hexo-action](https://github.com/marketplace/actions/hexo-action)
