---
title: "Installing Windows 10 (Bonus: Installing Autodesk EAGLE)"
description: "Step-by-step guide to installing Windows 10, plus bonus tips for installing Autodesk EAGLE."
date: "2025-07-20"
category: "Tutorial"
coverImage: "/blog/posts/windows10Tutorial/cover.jpeg"
lastModified: "2025-07-20"
tags: ["Windows 10", "Installation", "Tutorial", "Permssion Error", "Autodesk EAGLE"]
---

## Windows 10.. a bit old isn't it?

Still rocking Windows 10 while everyone's jumping to Windows 11? You're not alone.

This OS is getting older, and Microsoft's pulling the plug on support this October. But here's the thing - it's not really about the age. Plenty of people stick with Windows 10 because some programs just work better on it than Win 11.

Maybe you prefer Windows 10 because it's lighter, more familiar, or you've got that one crucial software that refuses to cooperate on Win 11. Whatever your reason, you need it - but do you actually know how to get it or install it properly?

I'll walk you through the whole process step by step. Grab a coffee and let's make this happen.

## Quick Heads Up!

> In this tutorial, I'll be using a VM inside VirtualBox for the demo, so the initial setup will look different from installing on a real device. That's why I'm giving you two different approaches—pick the one that fits your situation!

## Let's Get Started - First Setup

### Installing on Your Actual Computer/Laptop

**What you'll need:**

1. **Your target device**: Computer/Laptop with at least 8GB RAM and 512GB storage (SSD recommended)
2. **Rufus software**: Tool for creating bootable USBs
3. **Windows 10 ISO file**: The actual Windows installer that you can get [here](https://drive.google.com/drive/folders/1qaA_NPsajpY82GnisqL69DjZR6oYCKLf?usp=sharing)
4. **Empty USB drive**: At least 8GB (everything on it will be wiped)
5. **Another computer**: To create the bootable USB if your main one is the target

#### Creating Your Bootable USB

**Here's the process:**

1. **Get Rufus Ready**

   - Head over to [rufus.ie](https://rufus.ie) and download it
   - No installation needed—just run it directly!

2. **Prep Your USB Drive**

   - Plug in the USB drive
   - **Warning**: Everything on this USB will be erased, so back up anything important

3. **Configure Rufus**

   - Run Rufus as Administrator (right-click → "Run as administrator")
   - **Device**: Select your USB from the dropdown
   - **Boot selection**: Click "SELECT" and find your Windows 10 ISO
   - **Image option**: Keep it as "Standard Windows installation"
   - **Partition scheme**: Use "GPT" for modern systems
   - **Target system**: Choose "UEFI (non CSM)"
   - **File system**: NTFS

4. **Start the Process**
   - Hit "START" and confirm the warning
   - This usually takes 5-15 minutes
   - Safely eject when it's done

#### BIOS Setup

**Configure your computer to boot from USB:**

1. **Access BIOS**

   - Restart your computer
   - Press the BIOS key during startup (usually F2, F12, Delete, or Esc)
   - Watch for boot messages - they tell you which key to press

2. **Configure Settings**

   - Find the "Boot" section
   - **Disable Secure Boot**: Security → Secure Boot Control → Disabled
   - **Enable USB Boot**: Make sure USB devices can boot
   - **Set Boot Priority**: Move USB to the top of the list
   - Alternative: Use the Boot Menu (F11/F12) when starting up

3. **Save Changes**
   - Press F10 or find "Save & Exit"
   - Confirm your changes and restart
   - Your computer should now boot from USB

### VirtualBox VM

**What you'll need:**

1. **Host computer**: 8GB RAM, 512GB storage, decent CPU
2. **VirtualBox**: Download from [virtualbox.org](https://www.virtualbox.org)
3. **Windows 10 ISO**: Same file as above

#### Setting Up Your Virtual Machine

**Creating the VM:**

1. **Make a New VM**

   - Open VirtualBox, click "New"
   - **Name**: "Windows 10" (or whatever makes you happy)
   - **Type**: Microsoft Windows
   - **Version**: Windows 10 (64-bit)

2. **Give It Some Juice**

   - **CPU**: 2 cores minimum, 4 is sweet
   - **RAM**: 4GB minimum, 6-8GB if you can spare it
   - **Storage**: 50GB minimum, 80GB+ recommended
   - **Network**: NAT or Bridged for internet access

3. **Mount That ISO**
   - VM Settings → Storage
   - Click the CD icon, select your ISO
   - Make sure it's the primary boot device

## The Main Event - Windows 10 Installation

### Starting the Installation

![First Load Boot](/blog/posts/windows10Tutorial/1windowsBoot.png "That familiar Windows loading screen")

After the boot screen loads, you'll see the Language, Time & Currency, and Keyboard setup. Pick whatever matches your region.

![Language Setup](/blog/posts/windows10Tutorial/2languageTimeKeyboardSet.png "Choose your language and region")

### Begin Installation

Click "Next" and you'll see the install screen. Hit "Install Now" to continue.

![Install Screen](/blog/posts/windows10Tutorial/3installNow.png "The moment of truth - Install Now!")
![Setup Starting](/blog/posts/windows10Tutorial/4setupStarting.png "Windows is waking up")

### Product Key

When the activation window appears, choose "I don't have a product key." We'll handle activation later.

![Activation Screen](/blog/posts/windows10Tutorial/5activateWindows.png "Skip this for now")

### Select Windows Edition

At the OS selection screen, choose **Windows 10 Pro** for full features. Click "Next" and accept the license terms.

![OS Selection](/blog/posts/windows10Tutorial/6windowsType.png "Pro is the way to go")
![License Terms](/blog/posts/windows10Tutorial/7licenseTerms.png "The fine print nobody reads")

### Storage Configuration

For storage setup, I'm using the manual approach. You can just select the first partition if you want, but custom partitions give you better control.

![Partition Settings](/blog/posts/windows10Tutorial/8partition.png "Time to get organized")
![Adding Partitions](/blog/posts/windows10Tutorial/9addingPartition.png "Creating our custom layout")
![Partition Done](/blog/posts/windows10Tutorial/10afterPartition.png "Looking good!")

### Installation Progress

Click "Next" and wait for the installation to complete. This takes some time depending on your hardware.

![Installation Progress](/blog/posts/windows10Tutorial/11installationScreen.png "Windows is hard at work")
![Still Installing](/blog/posts/windows10Tutorial/12installationScreen.png "Patience, young grasshopper")

### System Restart

When installation finishes, your computer will restart automatically. Don't touch anything during this process.

![Restart Time](/blog/posts/windows10Tutorial/13waitingRestart.png "Off we go again")
![Getting Ready](/blog/posts/windows10Tutorial/14gettingReady.png "Almost there...")

### Initial Setup

After the restart, you'll get setup screens for your region and keyboard layout. Configure them according to your preferences.

![Region Choice](/blog/posts/windows10Tutorial/15chooseRegion.png "Where in the world are you?")
![Keyboard Layout](/blog/posts/windows10Tutorial/16keyboardLayout.png "How do you type?")

Skip the additional keyboard layouts unless you really need them, and let the setup continue loading.

![Additional Keyboards](/blog/posts/windows10Tutorial/17additionalKeyLayout.png "Skip this if you want")
![Setup Loading](/blog/posts/windows10Tutorial/18setupLoading.png "Almost ready...")

### Updates Can Wait

When Windows asks about updates, feel free to skip this for now. We want to get you up and running first!

![Windows Updates](/blog/posts/windows10Tutorial/19latestWinUpdate.png "Updates can wait")

### Personal Use It Is!

Choose "Set up for personal use" unless you're doing this for work.

![Personal Setup](/blog/posts/windows10Tutorial/20personalSetup.png "Just for you")

### Microsoft Account Bypass

If you don't want to sign into a Microsoft account, you can bypass this step. Just enter a fake email and any password.

![Email Bypass](/blog/posts/windows10Tutorial/21accountBypass.png "Fake email works fine")
![Password Bypass](/blog/posts/windows10Tutorial/22accountBypass.png "Any password will do")

You'll get an error screen, which gives us a "Skip" option.

![Bypass Success](/blog/posts/windows10Tutorial/23accountBypass.png "Perfect! Now we can skip")

### Create Your Local Account

Now create your local Windows username and password. Pick something you'll remember!

![User Account](/blog/posts/windows10Tutorial/24PCuser.png "What should we call you?")
![User Password](/blog/posts/windows10Tutorial/25PCuser.png "Pick a good password")

### Security Questions

Since we bypassed the Microsoft account, you need to set up three security questions for password recovery.

![Security Questions](/blog/posts/windows10Tutorial/26SecQuestion.png "Security question setup")

### Privacy Settings

Configure these however you want, or just accept the defaults and tweak them later.

![Privacy Settings](/blog/posts/windows10Tutorial/27privacySetting.png "Your privacy, your choice")

### Final Setup

Wait for the last bit of setup to finish.

![Final Setup](/blog/posts/windows10Tutorial/28waitScreen.png "Final setup screen")
![Success!](/blog/posts/windows10Tutorial/29win10Installed.png "Installation complete")

Windows 10 is now installed and ready to use.

[error_encrypted_permission_error]

## Bonus: Installing Autodesk EAGLE

For PCB design work, here's how to install EAGLE.

### Update Edge First

Since I've got the EAGLE installer on Google Drive and the default Edge might be too old:

1. **Download the latest Edge** from [Microsoft's site](https://www.microsoft.com/en-us/edge/business/download)

![Edge Download](/blog/posts/windows10Tutorial/49updateEdge.png "Get the latest Edge")
![Edge Installer](/blog/posts/windows10Tutorial/50updateEdge.png "Download in progress")

2. **Install it** and allow security prompts

![Edge SmartScreen](/blog/posts/windows10Tutorial/51updateEdgeSmartScreen.png "Run the installer")
![Edge Permissions](/blog/posts/windows10Tutorial/52edgeAccountControl.png "Allow permissions")

3. **Wait for installation to complete**

![Edge Installing](/blog/posts/windows10Tutorial/53downloadWaiting.png "Installation progress")
![Edge Updated](/blog/posts/windows10Tutorial/54edgeUpdated.png "Edge updated")

### Installing EAGLE

1. **Grab the installer** from my [Google Drive folder](https://drive.google.com/drive/folders/1-B_8SIAIRyWiv-xwQhL1SgjoSdvYtqef?usp=sharing)

![EAGLE Drive](/blog/posts/windows10Tutorial/55autodeskEagleDriveDownload.png "Download from here")
![Downloading EAGLE](/blog/posts/windows10Tutorial/56autodeskEagleDownloadDrive.png "Getting EAGLE")
![Download Complete](/blog/posts/windows10Tutorial/57autodeskEagleDownloadDrive.png "Got it!")

2. **Run the installer** from your Downloads folder

![EAGLE Installer](/blog/posts/windows10Tutorial/58installEagleInstaller.png "Time to install")
![EAGLE SmartScreen](/blog/posts/windows10Tutorial/59eagleSmartScreen.png "Run it")
![EAGLE Permissions](/blog/posts/windows10Tutorial/60eagleAccountControl.png "Allow it")

3. **Follow the installation wizard** with default settings

![EAGLE Wizard](/blog/posts/windows10Tutorial/61eagleWizard.png "Installation wizard")
![License Agreement](/blog/posts/windows10Tutorial/62eagleWizard.png "License terms")
![Installation Path](/blog/posts/windows10Tutorial/63eagleWizard.png "Installation path")
![Components](/blog/posts/windows10Tutorial/64eagleWizard.png "Component selection")
![Start Menu](/blog/posts/windows10Tutorial/65eagleWizard.png "Start menu shortcuts")
![Installing](/blog/posts/windows10Tutorial/66eagleWizard.png "Installing")

4. **Create an Autodesk account** when EAGLE launches

![EAGLE Launch](/blog/posts/windows10Tutorial/67eagleOpen.png "EAGLE is starting up")
![Account Login](/blog/posts/windows10Tutorial/68eagleAccount.png "Need an account")
![Create Account](/blog/posts/windows10Tutorial/69eagleCreateAccount.png "Sign up here")

5. **Verify your email**

![Email Verification](/blog/posts/windows10Tutorial/70accountVerif.png "Email verification")

### Troubleshooting EAGLE

**EAGLE crashing after the splash screen?** This is a known issue.

**The fix**: Navigate to EAGLE's installation folder, find `libeay32.dll`, and rename it to `libeay32.dll.bak`. Then try launching EAGLE again.

For more details, check out [Autodesk's official solution](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Eagle-crashes-seconds-after-launching-splash-screen.html).

EAGLE is now ready for PCB design work.

![EAGLE Working](/blog/posts/windows10Tutorial/71eagleOpened.png "EAGLE running")

## Summary

What we've accomplished:

- Fully functional Windows 10 installation
- Complete Microsoft Office suite
- Autodesk EAGLE for electronics projects
- Everything activated properly

Windows 10 support ends this October, but you now have a working system that many people still prefer for compatibility and familiarity reasons.

If you got stuck anywhere or have questions, feel free to reach out. This setup should serve you well for your development and design work.
