---
title: "Using GitHub as Shared Storage for Obsidian Across Devices"
description: "Obsidian Sync isn't the only way to keep a vault available everywhere. Here is how to use a private GitHub repository as shared storage for an Obsidian vault across desktop and mobile, using the Obsidian Git plugin."
date: "2026-08-18"
category: "Productivity"
coverImage: ""
lastModified: "2026-08-18"
tags: ["Obsidian", "Git", "GitHub", "Productivity", "Mobile", "Note-taking"]
---

Obsidian Sync works, but it's a paid subscription, and it's not the only option. If you already use Git, a private GitHub repository can serve as shared storage for a vault — the same folder, backed by the same repo, opened as a vault on every device. No dedicated sync service, no extra subscription, just a repo that every device pushes to and pulls from.

This walks through setting that up across desktop and mobile, using the **Obsidian Git** community plugin — including the parts that trip people up, like plugin authentication and getting a repo cloned on a phone.

---

## What You Need

- Git installed on desktop devices
- A private GitHub (or GitLab) repository
- The **Obsidian Git** plugin (by Vinzent03) — same plugin on desktop and mobile
- A GitHub Personal Access Token (PAT) for authentication

---

## 1. Install Git on Desktop

- **Windows:** download from [git-scm.com](https://git-scm.com/downloads), install with defaults
- **Mac:** run `git --version` in Terminal — it offers to install Xcode Command Line Tools if missing
- **Linux:** `sudo apt install git` (or your distro's equivalent)

Confirm with:

```bash
git --version
```

## 2. Create a Private Repository

On GitHub: **New repository** → name it (e.g. `obsidian-vault`) → set visibility to **Private** → leave it empty, no README, no `.gitignore` — you'll push an existing folder into it.

## 3. Push Your Existing Vault (Primary Device)

```bash
cd /path/to/your/vault
git init
git remote add origin https://github.com/yourusername/obsidian-vault.git
git add .
git commit -m "Initial vault commit"
git branch -M main
git push -u origin main
```

## 4. Install and Configure the Obsidian Git Plugin

Settings → Community plugins → Browse → search "Git" → install **Obsidian Git** → enable it.

Before anything else, set your commit identity inside the plugin — this is easy to skip and then wonder why commits show up with a generic or missing author. In the plugin settings, under the Git author fields:

- **Git commit author name** — set this to your name (or a handle), used for every commit the plugin makes
- **Git commit author email** — set this to match the email tied to your GitHub account, so commits are correctly attributed

You'll also need to authenticate. GitHub no longer accepts a plain account password for git operations, so the plugin needs a **Personal Access Token** instead:

1. GitHub → Settings → Developer settings → Personal access tokens → generate a new token (fine-grained or classic — classic with `repo` scope is the simplest choice)
2. Copy the token
3. In the Obsidian Git plugin settings, find the authentication field for HTTPS remotes and paste the token where it asks for a password — the token stands in for your GitHub password for every push/pull the plugin performs

Recommended sync-behavior settings, once identity and auth are set:

- **Auto pull on Obsidian startup** → on
- **Auto backup after file change** (or every ~10 minutes) → on
- **Auto push** → on

## 5. Set Up Additional Desktop Devices

```bash
git clone https://github.com/yourusername/obsidian-vault.git
```

In Obsidian: **Open folder as vault** → select the cloned folder. Install Obsidian Git here too, and repeat the commit name/email and PAT setup from step 4 — plugin settings are per-vault, so they don't carry over automatically.

## 6. Set Up Mobile

**Android and iOS** both run the same Obsidian Git plugin — there's no separate mobile version, just the same plugin working across platforms.

The clone step on mobile looks a bit different since there's no terminal. Instead:

1. Install the Obsidian Git plugin on your phone (Community plugins, same as desktop)
2. Open the **Command palette** (the search-icon button, or swipe/tap depending on your Obsidian mobile layout)
3. Search for **"Git: Clone an existing remote repo"**
4. Enter your repo URL when prompted, and authenticate with the same Personal Access Token
5. Obsidian will pull the repo down and you can open it as a vault directly from there

Set the same commit name, email, and auto-pull/auto-push options in the plugin settings on mobile as you did on desktop.

### The Tricky Part on iPhone

Android tends to just work — the plugin bundles its own git implementation, so cloning and syncing behave predictably. iOS is the one platform where this setup can get flaky, mainly because of how iOS sandboxes background app activity:

- **Background sync is unreliable.** iOS aggressively limits what apps can do when they're not actively open, so "auto push after X minutes" may not actually fire unless Obsidian is in the foreground. Don't assume a change made on iPhone has pushed until you've actually opened the app and let it run.
- **Manual push/pull is more dependable than auto settings.** On iPhone specifically, it's worth getting in the habit of manually triggering a pull when you open the app and a push before you close it, rather than trusting the automatic timers the way you might on desktop or Android.
- **If the plugin's own git implementation misbehaves**, a common workaround is using a dedicated git client app like **Working Copy**, which syncs the repo into the iOS Files app, and pointing Obsidian's vault at that same folder rather than letting Obsidian Git manage the repo directly. More moving parts, but more reliable if you're hitting sync failures.

If you're solely on Android and desktop, none of this applies — it's specifically an iPhone quirk.

---

## Using It Day to Day

Since this is shared storage rather than continuous sync, the habit that matters is: **pull before you start writing, push when you're done.** With auto-pull-on-open and auto-push-on-interval enabled, this mostly happens on its own — the manual habit is really just a fallback, and it matters most on iPhone, where the automatic timers are least reliable.

If you're the only person using the vault, there's effectively no risk of conflicts — the only way to hit one is editing the same note on two devices without pulling in between, which is easy to avoid once the auto-pull/auto-push habit is in place.

---

## Summary

A private GitHub repo plus the Obsidian Git plugin turns your vault into something backed by shared storage across every device you use — desktop, Android, and iPhone — without paying for a dedicated sync service. The setup is mostly identical everywhere: install the plugin, set your commit identity, authenticate with a token, and let auto-pull/auto-push handle the rest. The one place that needs extra attention is iPhone, where background restrictions mean a manual pull-before/push-after habit is worth keeping even with automation turned on.

---

**Further Reading**

- [Obsidian Git Plugin (GitHub)](https://github.com/denolehov/obsidian-git)
- [GitHub Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Working Copy (iOS Git Client)](https://workingcopyapp.com/)