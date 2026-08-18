---
title: "Automating Network and Server Configuration with Ansible"
description: "Manually configuring routers and servers one by one does not scale. Here is how Ansible automates both — from pushing IP configuration to a MikroTik router to deploying NGINX across multiple Linux servers with one playbook."
date: "2026-08-18"
category: "Networking"
coverImage: ""
lastModified: "2026-08-18"
tags: ["Networking", "Ansible", "Automation", "DevOps", "MikroTik", "NGINX", "SSH"]
---

Configuring one router or one server by hand is manageable. Configuring ten, or fifty, the same way is not. At some point the manual process breaks down — not because the task is hard, but because doing it correctly and consistently, over and over, by hand, is where mistakes creep in.

This is the problem Ansible solves. It is a configuration management and automation tool that lets you describe the state you want a system to be in, then pushes that state out to as many machines as you target — all from one control node, over SSH, with no agent needed on the target machines.

This guide walks through two real setups: using Ansible to push IP configuration to a MikroTik router, and using Ansible to install and configure NGINX across multiple Linux servers at once. Same tool, two very different targets, same underlying idea.

---

## Why Ansible Instead of Manual Configuration

Before getting into the setup, it is worth being specific about what automation actually buys you over doing it by hand:

- **Time and effort.** One playbook can push a configuration to many servers at once. Manual configuration has to be repeated on every single device.
- **Fewer human errors.** Manual configuration is where typos, skipped steps, and inconsistent settings between servers happen. Ansible runs the exact same instructions every time, so the result is uniform.
- **Consistency.** Every server configured through the same playbook ends up with the same package versions, same services, same settings — no drift between machines.
- **Reusability.** A playbook written once can be reused on a different server, or a different environment, without redoing the work from scratch.
- **Documentation, by default.** Playbooks are YAML files. They are human-readable, version-controllable, and effectively double as documentation for what your infrastructure looks like.
- **Scales without getting harder.** Managing 3 servers manually is annoying. Managing 30 manually is close to unmanageable. Ansible does not care how many targets are in the inventory — the process is the same either way.
- **No agent required on target machines.** Ansible only needs SSH access to the target. There is nothing to install or maintain on the machines being managed, which keeps the targets lighter and reduces what can go wrong.

---

## Part 1: Pushing IP Configuration to a MikroTik Router

### The Setup

The lab network for this part:

```
Ansible Controller (Ubuntu): DHCP internal network + NAT
MikroTik CHR:                Bridged DHCP + static internal IP (172.20.20.1)
```

The controller and the router sit on the same internal segment, `172.20.20.0/24`.

### Installing Ansible on the Controller

Everything starts on the Ubuntu machine that will run the playbooks. Standard update-and-install flow first:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install software-properties-common -y
sudo apt install python3 python3-pip -y
sudo apt install sshpass -y
```

`sshpass` matters here because the controller will need to authenticate over SSH-like connections to network devices during setup — it lets Ansible pass a password non-interactively where key-based auth is not already configured.

Ansible itself is installed from its official PPA rather than the default Ubuntu repo, which tends to lag behind on version:

```bash
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible -y
```

Confirm the install:

```bash
ansible --version
```

```
ansible [core 2.20.2]
  config file = /etc/ansible/ansible.cfg
  ...
```

### Configuring the Inventory

Ansible needs to know what it's managing. That list lives in the inventory file, `/etc/ansible/hosts`:

```bash
sudo nano /etc/ansible/hosts
```

```ini
[lab_sija]
172.20.20.1 ansible_user=admin ansible_password=<password> ansible_network_os=routeros ansible_connection=network_cli ansible_port=22
```

A few things worth calling out in that line:

- `ansible_network_os=routeros` tells Ansible this target is a MikroTik device, not a regular Linux host — it changes how Ansible talks to it.
- `ansible_connection=network_cli` uses Ansible's network CLI connection plugin instead of the standard SSH module, since network devices like RouterOS don't behave like a normal Linux shell.
- Since RouterOS support isn't part of Ansible's core install, the `community.network` collection has to be added separately:

```bash
ansible-galaxy collection install community.network
```

### Writing the Playbook

```bash
nano set-ip.yml
```

```yaml
- name: Konfigurasi IP Address ether3 di MikroTik
  hosts: lab_sija
  gather_facts: no
  tasks:
    - name: Set IP Address pada ether3
      community.network.routeros_command:
        commands:
          - /ip address add address=172.20.20.2/24 interface=ether3
```

Two details worth noting: `gather_facts: no` is set because fact-gathering (which assumes a normal Linux shell to run discovery commands) doesn't apply cleanly to network devices. And `routeros_command` sends raw RouterOS CLI commands directly — the same command you'd type manually into a MikroTik terminal, just issued remotely through Ansible.

### Running It

A quick connectivity check first:

```bash
ansible -m ping lab_sija
```

```
172.20.20.1 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

Then the actual playbook:

```bash
ansible-playbook set-ip.yml
```

```
PLAY [Konfigurasi IP Address ether3 di MikroTik] ***********************
TASK [Set IP Address pada ether3] ***************************************
changed: [172.20.20.1]

PLAY RECAP ***************************************************************
172.20.20.1        : ok=1  changed=1  unreachable=0  failed=0
```

### Verifying on the Router

Logging into the MikroTik directly confirms the new address landed correctly:

```
[admin@MikroTik] > ip address print
Flags: D - DYNAMIC
Columns: ADDRESS, NETWORK, INTERFACE
#   ADDRESS          NETWORK        INTERFACE
0   172.20.20.1/24   172.20.20.0    ether2
1 D 10.200.15.68/16  10.200.0.0     ether1
2   172.20.20.2/24   172.20.20.0    ether3
```

`ether3` now carries the address Ansible pushed — no manual login to the router required for the actual configuration step.

---

## Part 2: Deploying NGINX Across Multiple Linux Servers

The second setup scales the same idea up — one Ansible controller managing three separate Linux servers, installing and configuring NGINX on all of them from a single playbook run.

### The Network Layout

```
Ansible Controller: Static internal (10.16.17.10) + NAT
PC 1:                Static internal (10.16.17.50) + NAT
PC 2:                Static internal (10.16.17.51) + NAT
PC 3:                Static internal (10.16.17.52) + NAT
```

Each target machine has a static address configured through its own network config file — for example, on Debian-based systems:

```
allow-hotplug enp0s3
iface enp0s3 inet static
address 10.16.17.50
```

(repeated per machine with `.51` and `.52`).

### Setting Up Passwordless SSH

This is the part that makes real automation possible. Without it, Ansible would prompt for a password on every single task, on every single host, which defeats the purpose of automating anything.

Generate a key pair on the controller:

```bash
ssh-keygen -t rsa -b 4096
```

Then copy the public key to each target server:

```bash
ssh-copy-id rez3x@10.16.17.50
ssh-copy-id rez3x@10.16.17.51
ssh-copy-id rez3x@10.16.17.52
```

Each one prompts for the account password exactly once, to install the key. After that, the connection is authenticated by key, not password:

```
Number of key(s) added: 1

Now try logging into the machine, with: "ssh 'rez3x@10.16.17.50'"
and check to make sure that only the key(s) you wanted were added.
```

Confirm it works without a password prompt:

```bash
ssh rez3x@10.16.17.50
```

If it drops straight into a shell with no password prompt, key-based auth is working correctly.

### Building the Inventory

```bash
nano hosts.ini
```

```ini
[nginx_servers]
10.16.17.50 ansible_user=rez3x ansible_become_password=<password>
10.16.17.51 ansible_user=rez3x ansible_become_password=<password>
10.16.17.52 ansible_user=rez3x ansible_become_password=<password>
```

`ansible_become_password` is still needed here even with passwordless SSH, because SSH login and `sudo` privilege escalation are two separate authentication steps — the key handles the first, this handles the second.

### The Playbook

```bash
nano install_nginx.yml
```

```yaml
- name: Install Nginx on Linux servers
  hosts: nginx_servers
  become: true
  tasks:
    - name: Update package index
      ansible.builtin.package:
        update_cache: yes

    - name: Install Nginx
      ansible.builtin.package:
        name: nginx
        state: present

    - name: Ensure Nginx is running and enabled
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: yes
```

Three tasks, each doing exactly one thing: refresh the package index, install NGINX, then make sure the service is both running now and set to start on boot. `become: true` at the play level means every task runs with elevated privileges, since installing packages and managing services both require it.

### Running It Against All Three Servers

```bash
ansible-playbook -i hosts.ini install_nginx.yml
```

```
PLAY [Install Nginx on Linux servers] ************************************

TASK [Gathering Facts] ****************************************************
ok: [10.16.17.51]
ok: [10.16.17.52]
ok: [10.16.17.50]

TASK [Update package index] ************************************************
changed: [10.16.17.50]
changed: [10.16.17.51]
changed: [10.16.17.52]

TASK [Install Nginx] ********************************************************
changed: [10.16.17.52]
changed: [10.16.17.51]
changed: [10.16.17.50]

TASK [Ensure Nginx is running and enabled] ***********************************
ok: [10.16.17.51]
ok: [10.16.17.52]
ok: [10.16.17.50]

PLAY RECAP *********************************************************************
10.16.17.50   : ok=4  changed=2  unreachable=0  failed=0
10.16.17.51   : ok=4  changed=2  unreachable=0  failed=0
10.16.17.52   : ok=4  changed=2  unreachable=0  failed=0
```

All three servers, one command, same result on every machine.

### Verifying the Result

On any of the target servers, the service should be active:

```bash
sudo systemctl status nginx
```

```
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running)
```

And hitting the server's IP in a browser shows NGINX's default landing page — confirmation that the install, service start, and boot-enable all landed correctly across every target.

---

## Why Passwordless SSH Matters for Automation

Beyond just being convenient, SSH key-based auth is what actually makes unattended automation possible. With password auth, Ansible either has to prompt interactively (breaking any kind of scheduled or hands-off run) or store a plaintext password somewhere insecure. A key pair lets the controller authenticate automatically, without any manual input, while also being harder to compromise than a password — a private key isn't something that can be guessed, and it's never transmitted over the network the way a password is.

## Why Ansible Scales Better Than Manual Setup

The NGINX example makes the core argument concrete: one playbook, three servers, identical result on each — versus SSH-ing into three machines separately and typing the same install commands three times, with three chances to fat-finger something differently on each one. The gap only widens as the server count grows. Ten servers configured manually means ten separate opportunities for drift. Ten servers through Ansible means one playbook run.

## Keeping Playbooks Reusable

A playbook stays reusable across different servers or environments when it avoids hardcoding anything environment-specific — no IPs, no server-specific values written directly into the task file. That information belongs in the inventory instead, not the playbook. Combined with variables, host groups, and a clean task structure, the same playbook can be pointed at a completely different set of servers with no changes to the playbook itself, only the inventory.

---

## The Mental Model to Keep

```
1. The controller needs Ansible installed; the targets need nothing extra.
2. The inventory defines what you're managing and how to reach it.
3. Passwordless SSH (key-based auth) is what makes automation actually unattended.
4. A playbook describes the desired end state, not a sequence of manual steps.
5. Specialized targets (like network devices) need the right connection type and collection — routeros_command isn't the same as a regular Linux module.
6. One playbook run can target one host or a hundred — the process doesn't change.
```

---

## Summary

Ansible's value isn't really about any single command it runs — `apt install nginx` is not complicated on its own. The value is in what happens when that one task needs to run identically across many machines, or needs to be repeatable months later without remembering every manual step taken the first time. Push IP configuration to a router, install and enable a service across a fleet of servers — same tool, same YAML-based approach, same guarantee that every target ends up in the same state.

Start small: one playbook, a handful of targets, one task. The pattern scales up cleanly once it's understood at that size.

---

**Further Reading**

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible community.network Collection](https://docs.ansible.com/ansible/latest/collections/community/network/)
- [NGINX Documentation](https://nginx.org/en/docs/)
- [SSH Key-Based Authentication Guide](https://www.ssh.com/academy/ssh/copy-id)

---

*This article was written by Rejaka Abimanyu Susanto, a full-stack developer based in Yogyakarta, Indonesia. For more articles on networking and web development, visit [rejaka.id](https://rejaka.id).*