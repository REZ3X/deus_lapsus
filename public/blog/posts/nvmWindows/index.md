# Node Version Manager (NVM) for Windows

If you work with JavaScript, you've probably dealt with multiple projects requiring different Node.js versions. Installing each version manually is tedious and time-consuming. That's where Node Version Manager (NVM) comes in.

NVM is a tool that lets you install, manage, and switch between different Node.js versions easily. Instead of being stuck with one global version, you can quickly switch versions depending on your project needs.

This guide will walk you through installing and configuring NVM on Windows.

> This tutorial is for Windows only. But if you're a Linux user, I already made a guide for Debian below:

[Node Version Manager (NVM) Tutorial Linux](https://rejaka.id/blog/nvmTutorial).

---

## Requirements

1. Laptop/PC with Windows OS (10/11)
2. Internet Connection
3. Web browser

---

## NVM Installation

### Download NVM Setup

1. Download from Corey Butler’s repository [here](https://github.com/coreybutler/nvm-windows).
2. Scroll to the bottom, find “Install Now” or go directly to the [Releases](https://github.com/coreybutler/nvm-windows/releases).
3. Download the latest `nvm-setup.exe`.

![Download NVM Setup](./nvmsetup.png "Download NVM Setup")

### Install NVM

1. Run the installer from File Explorer > Downloads.

![File Explorer](./dooubleclick.png "File Explorer")
![Smart Screen](./smartscreen.png "Smart Screen")
![Account Control](./accountcontrol.png "Account Control")

2. Accept the agreement and click “Next”.

![Agreement](./agreement.png "Agreement")

3. Use the default installation paths.

![NVM Installation Folder](./nvminstallfolder.png "NVM Installation Folder")
![Active Version](./activeversion.png "Active Version")

4. For notification settings, stick with the default.

![Notification Setting](./notification.png "Notification Setting")

5. Wait for installation.
6. Finish (don’t tick “Open with PowerShell”).

![Finish](./finish.png "Finish")

7. Validate by running this command in Command Prompt:

```bash
nvm -v
```

![nvm -v](./nvmv.png "nvm -v")

NVM is now installed and ready to use.

---

## Node.js Installation

Now you can install Node.js versions using NVM.

### Install Node.js

```bash
nvm install <node-version>
```

Example:

```bash
nvm install 22.15.0
```

Or for latest LTS:

```bash
nvm install lts
```

![nvm install](./nvminstall.png "nvm install")

### Activate Node Version

```bash
nvm use 22.15.0
```

You might encounter an error here:

![nvm use error](./nvmerror.png "nvm use error")

It’s because of spaces in the username path I use e.g., `Windows User`.

---

> If you don't have the same problem you could skip the next part and go for the "Reactivate Node.js"

## Fix NVM Node.js Activation Error

1. Move the `nvm` folder from your earlier default nvm installation path:
   ```bash
   C:\Users\<space username>\AppData\Local\nvm
   ```
   to:
   ```bash
   C:\nvm
   ```

If you forgot where the nvm installation take place, type this command in command prompt:

```bash
nvm root
```

![NVM Root Path](./nvmrootpath.png "NVM Root Path")

_If AppData is hidden, enable "Hidden items" from View tab._

![NVM Moved](./nvmmoved.png "NVM Moved")

2. Edit `C:\nvm\settings.txt`:

```txt
root: C:\nvm
```

![settings.txt](./settings.png "settings.txt")

3. Open Environment Variables, update all `nvm`-related paths to `C:\nvm`.

![Environment Variable](./envvar.png "Environment Variable")
![Environment Path Change](./env1.png "Environment Path Change")
![Environment Path Change](./env2.png "Environment Path Change")

Click OK to save.

---

## Reactivate Node.js

```bash
nvm use 22.15.0
```

![nvm use rerun](./nvmuse1.png)
![nvm use rerun](./nvmuse2.png)
![nvm use rerun](./nvmuse3.png)

Then check Node.js:

```bash
node -v
```

![Node Checking](./nodecheck.png "Node Checking")

Node.js is now active and ready to use.

---

## Useful NVM Commands

```bash
nvm ls                      # list installed Node versions
nvm list available          # show available versions online
nvm use <node-version>      # switch version
nvm alias default <version> # set default version
nvm uninstall <version>     # remove a version
```

---

## Summary

You now have NVM installed and configured on Windows. You can easily switch between different Node.js versions for your projects. Use `nvm list` to see installed versions and `nvm use <version>` to switch between them as needed.
