#!/usr/bin/env sh

set -e

cd docs

yarn docs:build

cd .vuepress/dist

echo 'lammps.org.cn' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Roy-Kid/roy-kid.github.io.git master

cd -
