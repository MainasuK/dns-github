#!/usr/bin/env zx

/* global $, fs, path */

const writer = async (arr) => {
  let temp = {};
  const list = [];

  for (const url of arr) {
    if (/^\.*\//.test(url)) {
      list.push(
        (temp = {
          file: path.resolve(url),
          contents: [],
          content: "",
        })
      );
      continue;
    }

    if (temp.contents) {
      temp.contents.push(url);
    }
  }

  for (const temp of list) {
    temp.content = await updater(temp.contents);
  }

  for (const temp of list) {
    fs.ensureFileSync(temp.file);
    fs.writeFile(temp.file, temp.content);
  }
};

const updater = async (arr) => {
  const templates = [];
  const datetime = new Date().toUTCString();

  templates.push(`# Update: ${datetime}\n`);

  for (const url of arr) {
    if (url) {
      const ip = await nslookup(url);
      const dns = `${ip}\t\t${url}`;

      if (ip) {
        templates.push(dns);
      }
    }
  }

  templates.sort((next, prev) => {
    const nexts = next.split(/\s/);
    const prevs = prev.split(/\s/);
    return nexts[0].length < prevs[0].length ? -1 : 1;
  });

  return templates.join("\n");
};

const nslookup = async (url) => {
  try {
    const regex = new RegExp(
      `.*Name:\\s*[\\S]+\\s*Address:\\s*([0-9.]+)\\s*.*`,
      "ims"
    );
    const dns = (await $`nslookup ${url}`).stdout;
    const ip = dns.replace(regex, "$1");

    if (!/\d+\.\d+\.\d+\.\d+/.test(ip)) {
      return "";
    }

    if (ip === "127.0.0.1") {
      return "";
    }

    if (ip === "0.0.0.0") {
      return "";
    }

    if (ip) {
      return ip;
    }
  } catch {}

  return "";
};

writer([
  "./public/host.txt",
  "alive.github.com",
  "api.github.com",
  "avatars.githubusercontent.com",
  "avatars0.githubusercontent.com",
  "avatars1.githubusercontent.com",
  "avatars2.githubusercontent.com",
  "avatars3.githubusercontent.com",
  "avatars4.githubusercontent.com",
  "avatars5.githubusercontent.com",
  "camo.githubusercontent.com",
  "central.github.com",
  "cloud.githubusercontent.com",
  "codeload.github.com",
  "collector.github.com",
  "desktop.githubusercontent.com",
  "education.github.com",
  "favicons.githubusercontent.com",
  "gist.github.com",
  "github-cloud.s3.amazonaws.com",
  "github-com.s3.amazonaws.com",
  "github-production-release-asset-2e65be.s3.amazonaws.com",
  "github-production-repository-file-5c1aeb.s3.amazonaws.com",
  "github-production-user-asset-6210df.s3.amazonaws.com",
  "github.blog",
  "github.com",
  "github.community",
  "github.githubassets.com",
  "github.global.ssl.fastly.net",
  "github.io",
  "github.map.fastly.net",
  "githubstatus.com",
  "live.github.com",
  "media.githubusercontent.com",
  "objects.githubusercontent.com",
  "pipelines.actions.githubusercontent.com",
  "private-user-images.githubusercontent.com",
  "raw.githubusercontent.com",
  "user-images.githubusercontent.com",
  "vscode.dev",
  "particle.network",
  "static.particle.network",
]);
