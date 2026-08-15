# IP Addressing and Subnetting: A Beginner's Guide That Actually Makes Sense

Every device on a network needs an address. Without one, there is no way to know where to send data or where it came from. That address is the IP address, and understanding how it works is the first real step into networking.

This guide covers IPv4 addressing from the ground up: what the numbers mean, how subnet masks work, how to calculate usable hosts, and how subnetting splits a network into smaller blocks. No assumed knowledge needed.

---

## What is an IP Address?

An IPv4 address is a 32-bit number, written as four groups of decimal numbers separated by dots. Each group is called an **octet** because it represents 8 bits.

```
192.168.10.25
 ^   ^   ^  ^
 |   |   |  |
Oct Oct Oct Oct
 1   2   3   4
```

Four octets, 8 bits each, 32 bits total.

Each octet can hold a value from 0 to 255, because the maximum 8-bit binary number is `11111111` which equals 255 in decimal.

So the full range of any single octet is always 0 to 255. That never changes.

---

## Network ID and Host ID

Every IP address is split into two parts:

- **Network ID**: identifies which network the device belongs to
- **Host ID**: identifies the specific device within that network

Think of it like a postal address. The city and street name is the Network ID (everyone on that street shares it), and the house number is the Host ID (unique to each house).

```
IP Address:   192.168.10.25
              |________| |__ Host ID
               Network ID    (unique per
               (fixed for    device)
               everyone
               on network)
```

The question is: how does a device know where the Network ID ends and the Host ID begins? That is exactly what the **subnet mask** answers.

---

## The Subnet Mask

The subnet mask is a 32-bit number that sits alongside your IP address and marks which bits belong to the Network ID and which belong to the Host ID.

All the `1` bits in the mask represent the Network ID portion. All the `0` bits represent the Host ID portion.

```
Subnet Mask:  255.255.255.0
Binary:       11111111.11111111.11111111.00000000
               |_______________________| |______|
                     Network bits        Host bits
```

Count the `1` bits: there are 24 of them. That is where the **prefix notation** comes from.

```
255.255.255.0  =  /24
```

The prefix `/24` just means "the first 24 bits are the Network ID."

---

## The Three Default Prefixes

IPv4 has three commonly used default subnet masks that align cleanly to octet boundaries.

### /8 (Class A)

```
Subnet Mask:  255.0.0.0
Binary:       11111111.00000000.00000000.00000000
Network bits: 8
Host bits:    24
```

Usable hosts per network: `2^24 - 2 = 16,777,214`

Example: `10.0.0.0/8`
- Network IP: `10.0.0.0`
- Broadcast IP: `10.255.255.255`
- Usable range: `10.0.0.1` to `10.255.255.254`

### /16 (Class B)

```
Subnet Mask:  255.255.0.0
Binary:       11111111.11111111.00000000.00000000
Network bits: 16
Host bits:    16
```

Usable hosts per network: `2^16 - 2 = 65,534`

Example: `172.16.0.0/16`
- Network IP: `172.16.0.0`
- Broadcast IP: `172.16.255.255`
- Usable range: `172.16.0.1` to `172.16.255.254`

### /24 (Class C)

```
Subnet Mask:  255.255.255.0
Binary:       11111111.11111111.11111111.00000000
Network bits: 24
Host bits:    8
```

Usable hosts per network: `2^8 - 2 = 254`

Example: `192.168.1.0/24`
- Network IP: `192.168.1.0`
- Broadcast IP: `192.168.1.255`
- Usable range: `192.168.1.1` to `192.168.1.254`

This is the most common one you will see in home and small office networks.

---

## The Host Formula

Every time you have a subnet, two IP addresses are reserved and cannot be assigned to any device:

- **Network IP**: the very first address (all host bits = 0), identifies the network itself
- **Broadcast IP**: the very last address (all host bits = 1), used to send data to every device on the network at once

So the formula for usable host addresses is always:

```
Usable hosts = 2^(host bits) - 2
```

For `/24`: `2^8 - 2 = 256 - 2 = 254 hosts`

For `/16`: `2^16 - 2 = 65536 - 2 = 65534 hosts`

For `/8`: `2^24 - 2 = 16777216 - 2 = 16777214 hosts`

The `-2` is always there. Never skip it.

---

## Non-Default Prefixes and Subnetting

Here is where it gets interesting. What happens when the prefix does not fall cleanly on an octet boundary?

Take `/25` as a starting example:

```
Subnet Mask:  255.255.255.128
Binary:       11111111.11111111.11111111.10000000
```

The fourth octet is `10000000` in binary = `128` in decimal. The mask is no longer a clean 255 or 0 in that octet. It is somewhere in between.

This is called subnetting: splitting a network into multiple smaller blocks.

For `192.168.1.0/25`:
- Usable hosts: `2^7 - 2 = 126`
- Block size in the fourth octet: `256 - 128 = 128`
- Two subnet blocks exist:
  - Block 1: `192.168.1.0` to `192.168.1.127`
  - Block 2: `192.168.1.128` to `192.168.1.255`

Each block has its own network IP and broadcast IP, and 126 usable hosts.

---

## How Block Size Works

When a subnet mask has a value that is not 0 or 255 in an octet, that octet is called the **special octet**. The block size in that octet is always:

```
Block size = 256 - (value of special octet in subnet mask)
```

This tells you how many IP addresses fit inside each subnet block.

### Practical Examples

**`/25` → 255.255.255.128**
- Special octet: 4th (value = 128)
- Block size: `256 - 128 = 128`
- Subnet blocks: 2 blocks per /24 space

**`/26` → 255.255.255.192**
- Special octet: 4th (value = 192)
- Block size: `256 - 192 = 64`
- Subnet blocks: 4 blocks per /24 space

**`/27` → 255.255.255.224**
- Special octet: 4th (value = 224)
- Block size: `256 - 224 = 32`
- Subnet blocks: 8 blocks per /24 space

**`/28` → 255.255.255.240**
- Special octet: 4th (value = 240)
- Block size: `256 - 240 = 16`
- Subnet blocks: 16 blocks per /24 space

**`/30` → 255.255.255.252**
- Special octet: 4th (value = 252)
- Block size: `256 - 252 = 4`
- Usable hosts: `2^2 - 2 = 2`
- Common for point-to-point links between two routers

---

## A Deeper Example: 20.10.24.35/22

This one trips people up because the special octet is the third one, not the fourth.

First, write out the subnet mask for /22:

```
/22 Binary:   11111111.11111111.11111100.00000000
Subnet Mask:  255      .255     .252     .0
```

The third octet is the special one. Its value is `252`.

**Block size in the third octet:**
```
256 - 252 = 4
```

Each subnet block spans 4 values in the third octet.

**Usable hosts per subnet block:**
```
2^(32 - 22) - 2 = 2^10 - 2 = 1024 - 2 = 1022 hosts
```

Now, to find which subnet block `20.10.24.35` belongs to, look at the third octet value: `24`.

Divide by the block size: `24 / 4 = 6` (exact), so `24` is the start of a block.

**The subnet block containing `20.10.24.35`:**
- Network IP: `20.10.24.0`
- Broadcast IP: `20.10.27.255`
- Usable range: `20.10.24.1` to `20.10.27.254`
- Usable hosts: 1022

Here are a few adjacent subnet blocks for context:

```
Subnet 1:  20.10.0.0   to 20.10.3.255    (network: 20.10.0.0,   broadcast: 20.10.3.255)
Subnet 2:  20.10.4.0   to 20.10.7.255    (network: 20.10.4.0,   broadcast: 20.10.7.255)
Subnet 3:  20.10.8.0   to 20.10.11.255   (network: 20.10.8.0,   broadcast: 20.10.11.255)
Subnet 4:  20.10.12.0  to 20.10.15.255   (network: 20.10.12.0,  broadcast: 20.10.15.255)
Subnet 5:  20.10.16.0  to 20.10.19.255   (network: 20.10.16.0,  broadcast: 20.10.19.255)
Subnet 6:  20.10.20.0  to 20.10.23.255   (network: 20.10.20.0,  broadcast: 20.10.23.255)
Subnet 7:  20.10.24.0  to 20.10.27.255   ← this is where 20.10.24.35 lives
Subnet 8:  20.10.28.0  to 20.10.31.255
...and so on
```

**How many total subnet blocks?**

The third octet has 256 possible values (0 to 255), and each block takes up 4 of them: `256 / 4 = 64 subnet blocks` total.

---

## More Non-Default Examples

### 10.0.0.0/10

```
Subnet Mask:  255.192.0.0
Binary:       11111111.11000000.00000000.00000000
```

Special octet: 2nd (value = 192)
Block size: `256 - 192 = 64`

Subnet blocks in the second octet:
```
10.0.0.0   to 10.63.255.255    subnet 1
10.64.0.0  to 10.127.255.255   subnet 2
10.128.0.0 to 10.191.255.255   subnet 3
10.192.0.0 to 10.255.255.255   subnet 4
```

Usable hosts per block: `2^22 - 2 = 4,194,302`

### 172.16.0.0/20

```
Subnet Mask:  255.255.240.0
Binary:       11111111.11111111.11110000.00000000
```

Special octet: 3rd (value = 240)
Block size: `256 - 240 = 16`

Subnet blocks in the third octet:
```
172.16.0.0   to 172.16.15.255    subnet 1
172.16.16.0  to 172.16.31.255    subnet 2
172.16.32.0  to 172.16.47.255    subnet 3
172.16.48.0  to 172.16.63.255    subnet 4
...
172.16.240.0 to 172.16.255.255   subnet 16
```

Usable hosts per block: `2^12 - 2 = 4,094`

### 192.168.5.0/26

```
Subnet Mask:  255.255.255.192
Binary:       11111111.11111111.11111111.11000000
```

Special octet: 4th (value = 192)
Block size: `256 - 192 = 64`

Subnet blocks:
```
192.168.5.0   to 192.168.5.63    subnet 1 (network: .0,   broadcast: .63)
192.168.5.64  to 192.168.5.127   subnet 2 (network: .64,  broadcast: .127)
192.168.5.128 to 192.168.5.191   subnet 3 (network: .128, broadcast: .191)
192.168.5.192 to 192.168.5.255   subnet 4 (network: .192, broadcast: .255)
```

Usable hosts per block: `2^6 - 2 = 62`

---

## Quick Reference: Common Prefixes

| Prefix | Subnet Mask     | Host Bits | Usable Hosts | Block Size   | Default? |
|--------|-----------------|-----------|--------------|--------------|----------|
| /8     | 255.0.0.0       | 24        | 16,777,214   | (1 block)    | Yes      |
| /10    | 255.192.0.0     | 22        | 4,194,302    | 64 (2nd oct) | No       |
| /16    | 255.255.0.0     | 16        | 65,534       | (1 block)    | Yes      |
| /20    | 255.255.240.0   | 12        | 4,094        | 16 (3rd oct) | No       |
| /22    | 255.255.252.0   | 10        | 1,022        | 4 (3rd oct)  | No       |
| /24    | 255.255.255.0   | 8         | 254          | (1 block)    | Yes      |
| /25    | 255.255.255.128 | 7         | 126          | 128 (4th)    | No       |
| /26    | 255.255.255.192 | 6         | 62           | 64 (4th)     | No       |
| /27    | 255.255.255.224 | 5         | 30           | 32 (4th)     | No       |
| /28    | 255.255.255.240 | 4         | 14           | 16 (4th)     | No       |
| /30    | 255.255.255.252 | 2         | 2            | 4 (4th)      | No       |

Default prefixes (/8, /16, /24) always produce a single subnet block. Every non-default prefix creates multiple subnet blocks, each with their own network and broadcast IP.

---

## The Mental Model to Keep

If you only remember one thing from this article, make it this:

```
1. The prefix tells you how many bits belong to the network.
2. The remaining bits belong to the host.
3. Two addresses in every subnet are always reserved (network + broadcast).
4. If the mask has a non-255, non-0 octet, that is the special octet.
5. Block size = 256 minus the value of the special octet.
6. Subnet blocks repeat at every multiple of the block size.
```

Walk through any IP address and prefix with those six steps and you can work out the network range, broadcast address, usable hosts, and which subnet block a given IP falls into.

---

## Summary

IP addressing is not as intimidating as it looks once you understand what the numbers actually represent. The IP address identifies a device. The subnet mask divides that address into a network portion and a host portion. The prefix is just a shorthand for counting the network bits.

Default prefixes (/8, /16, /24) keep things simple with one subnet block. Non-default prefixes introduce subnetting, which creates multiple smaller blocks from the same address space. The block size formula and the host formula handle all the math.

Practice with a few different IPs and prefixes using the steps above, and the pattern will click fast.

---

**Further Reading**

- [RFC 950 - Internet Subnetting Procedures](https://www.rfc-editor.org/rfc/rfc950)
- [RFC 1918 - Private Address Space](https://www.rfc-editor.org/rfc/rfc1918)
- [Subnet Calculator - Subnet Mask Calculator](https://www.subnet-calculator.com/)
- [Cisco Subnetting Guide](https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html)

---

*This article was written by Rejaka Abimanyu Susanto, a full-stack developer based in Yogyakarta, Indonesia. For more articles on networking and web development, visit [rejaka.id](https://rejaka.id).*