# Manage Go Versions Like a Pro with GVM on Linux

Managing multiple Go (Golang) versions can be challenging when you need to switch between them frequently. Manually uninstalling and reinstalling Go for each version change is time-consuming and inefficient.

**Go Version Manager (GVM)** solves this problem by allowing you to easily install, switch, and manage different Go versions on your system.

---

## Requirements

Before we get started, make sure your Linux system has the tools needed:

```bash
sudo apt-get update
sudo apt-get install curl git mercurial make binutils bison gcc
```

**Note:** If you're using Fedora or CentOS, replace `apt-get` with `dnf` or `yum`.

---

## Install GVM

To install GVM, run the following command:

```bash
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)
```

This will download and install GVM on your system.

---

## Load GVM into Your Shell

You need to configure your shell to recognize GVM.

For **bash**, add this line into your `~/.bashrc`:

```bash
[[ -s "$HOME/.gvm/scripts/gvm" ]] && source "$HOME/.gvm/scripts/gvm"
```

For **zsh** users → put it in your `~/.zshrc`.

Then reload your shell:

```bash
source ~/.bashrc
```

---

## Install a Go Version

To install a specific Go version, use the following command:

```bash
gvm install go1.21.6
```

Make it your default:

```bash
gvm use go1.21.6 --default
```

---

## Verify Installation

Verify which Go version is currently active:

```bash
go version
```

This should display the Go version you just installed.

---

## Optional: Remove System Go

If you already installed Go using system packages (`apt`, `dnf`, `yum`), better remove it to avoid conflicts:

```bash
sudo apt-get remove golang
```

(or `dnf remove golang` / `yum remove golang`).

---

## Useful GVM Commands

Here are some commonly used GVM commands:

```bash
gvm list                 # show installed Go versions
gvm listall              # list all available Go versions online
gvm install <version>    # install a specific version
gvm use <version>        # switch version
gvm uninstall <version>  # remove a version
```

---

## Conclusion

You've successfully installed and configured **GVM on Linux**. You can now easily manage multiple Go versions on your system and switch between them as needed.
