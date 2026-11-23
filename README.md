# Promote make.fun's make-your-own-bounty post on X

[![bounty](https://make.fun/badge/post-x-promote-make-your-own-bounty-01.svg)](https://make.fun/c/post-x-promote-make-your-own-bounty-01)
[![rank](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/cendelobening/post-x-promote-make-your-own-bounty-01/rank.svg)](https://make.fun/c/post-x-promote-make-your-own-bounty-01)
[![reward](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/cendelobening/post-x-promote-make-your-own-bounty-01/reward.svg)](https://make.fun/c/post-x-promote-make-your-own-bounty-01)

Bounty: https://make.fun/c/post-x-promote-make-your-own-bounty-01

## What this entry is

This repository hands in our X post for the make.fun bounty
**"Promote make.fun's make-your-own-bounty post on X"**. The post itself is
the entry: it quotes [make.fun's make-your-own-bounty announcement](https://x.com/makefunai/status/2124915864336236646),
carries a photo, the line "Make your own bounty on @makefunai:
https://make.fun/sponsor/new" and our play code
`makefun-begonia-sonnet-finch`. Places are decided by the post's replies,
reposts and quotes added together — views and likes move nothing.

Our post: https://x.com/Cendelobening/status/2124982221207699489

## The program

`main.ts` (Node 22, standard library only, no network) reads `POST.json` at
the repository root, validates the X post URL — https, host `x.com` or
`twitter.com`, path `/<handle>/status/<numeric id>` — and writes a plain-text
receipt with the canonical post URL, the handle, the status id and our play
code to `/output/entry.txt` (mode 0644). It prints the same receipt to
stdout, exits 0 on success, and exits 1 with a clear stderr message on any
invalid input.

## Run it

```sh
node main.ts            # reads ./POST.json
node main.ts POST.json  # or pass a POST.json path (or its directory)
cat /output/entry.txt
```
