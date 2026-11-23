// post-x-promote-make-your-own-bounty-01 — entry program.
//
// Reads POST.json (the address of our X post promoting make.fun's
// make-your-own-bounty post), validates the post URL, and writes a
// plain-text receipt to /output/entry.txt.
//
// Node 22, standard library only, no network access.

const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const PLAY_CODE = "makefun-begonia-sonnet-finch";
const OUTPUT_PATH = "/output/entry.txt";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The POST.json to read: an explicit argv path wins (a file, or a
// directory containing POST.json); otherwise the POST.json that sits
// next to this program at the repository root.
function resolvePostJsonPath(argv) {
  const arg = argv[2];
  if (arg) {
    const resolved = path.resolve(arg);
    try {
      if (fs.statSync(resolved).isDirectory()) {
        return path.join(resolved, "POST.json");
      }
    } catch {
      // Not an existing directory — treat the argument as the file.
    }
    return resolved;
  }
  return path.join(__dirname, "POST.json");
}

function readPostUrl(postJsonPath) {
  let raw;
  try {
    raw = fs.readFileSync(postJsonPath, "utf8");
  } catch {
    fail(`cannot read POST.json at ${postJsonPath}`);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    fail(`POST.json at ${postJsonPath} is not valid JSON`);
  }
  if (!data || typeof data.url !== "string" || data.url.length === 0) {
    fail("POST.json must carry a non-empty string field \"url\"");
  }
  return data.url;
}

// Validate an X post URL and split it into handle + status id.
// Accepted shape: https://x.com/<handle>/status/<numeric id>
// (twitter.com works too). Anything else is rejected.
function parsePostUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    fail(`not a valid URL: ${rawUrl}`);
  }
  if (url.protocol !== "https:") {
    fail(`post URL must use https: ${rawUrl}`);
  }
  if (url.hostname !== "x.com" && url.hostname !== "twitter.com") {
    fail(`post URL host must be x.com or twitter.com: ${rawUrl}`);
  }
  if (url.username || url.password || url.port) {
    fail(`post URL must not carry credentials or a port: ${rawUrl}`);
  }
  const match = url.pathname.match(/^\/([^/]+)\/status\/(\d+)\/?$/);
  if (!match) {
    fail(`post URL path must be /<handle>/status/<id>: ${rawUrl}`);
  }
  const handle = match[1];
  const statusId = match[2];
  // X handles are 1-15 characters of letters, digits and underscores;
  // a status id is a positive integer of at most 25 digits.
  if (!/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
    fail(`not a valid X handle: ${handle}`);
  }
  if (statusId.length > 25 || /^0+$/.test(statusId)) {
    fail(`not a valid X status id: ${statusId}`);
  }
  return { handle, statusId };
}

function main() {
  const postJsonPath = resolvePostJsonPath(process.argv);
  const rawUrl = readPostUrl(postJsonPath);
  const { handle, statusId } = parsePostUrl(rawUrl);

  const canonicalUrl = `https://x.com/${handle}/status/${statusId}`;
  const receipt = [
    "make.fun X post entry receipt",
    "bounty: post-x-promote-make-your-own-bounty-01",
    `post_url: ${canonicalUrl}`,
    `handle: @${handle}`,
    `status_id: ${statusId}`,
    `play_code: ${PLAY_CODE}`,
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, receipt, { mode: 0o644 });
  fs.chmodSync(OUTPUT_PATH, 0o644);

  process.stdout.write(receipt);
}

main();
