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

![First Load Boot](./1windowsBoot.png "That familiar Windows loading screen")

After the boot screen loads, you'll see the Language, Time & Currency, and Keyboard setup. Pick whatever matches your region.

![Language Setup](./2languageTimeKeyboardSet.png "Choose your language and region")

### Begin Installation

Click "Next" and you'll see the install screen. Hit "Install Now" to continue.

![Install Screen](./3installNow.png "The moment of truth - Install Now!")
![Setup Starting](./4setupStarting.png "Windows is waking up")

### Product Key

When the activation window appears, choose "I don't have a product key." We'll handle activation later.

![Activation Screen](./5activateWindows.png "Skip this for now")

### Select Windows Edition

At the OS selection screen, choose **Windows 10 Pro** for full features. Click "Next" and accept the license terms.

![OS Selection](./6windowsType.png "Pro is the way to go")
![License Terms](./7licenseTerms.png "The fine print nobody reads")

### Storage Configuration

For storage setup, I'm using the manual approach. You can just select the first partition if you want, but custom partitions give you better control.

![Partition Settings](./8partition.png "Time to get organized")
![Adding Partitions](./9addingPartition.png "Creating our custom layout")
![Partition Done](./10afterPartition.png "Looking good!")

### Installation Progress

Click "Next" and wait for the installation to complete. This takes some time depending on your hardware.

![Installation Progress](./11installationScreen.png "Windows is hard at work")
![Still Installing](./12installationScreen.png "Patience, young grasshopper")

### System Restart

When installation finishes, your computer will restart automatically. Don't touch anything during this process.

![Restart Time](./13waitingRestart.png "Off we go again")
![Getting Ready](./14gettingReady.png "Almost there...")

### Initial Setup

After the restart, you'll get setup screens for your region and keyboard layout. Configure them according to your preferences.

![Region Choice](./15chooseRegion.png "Where in the world are you?")
![Keyboard Layout](./16keyboardLayout.png "How do you type?")

Skip the additional keyboard layouts unless you really need them, and let the setup continue loading.

![Additional Keyboards](./17additionalKeyLayout.png "Skip this if you want")
![Setup Loading](./18setupLoading.png "Almost ready...")

### Updates Can Wait

When Windows asks about updates, feel free to skip this for now. We want to get you up and running first!

![Windows Updates](./19latestWinUpdate.png "Updates can wait")

### Personal Use It Is!

Choose "Set up for personal use" unless you're doing this for work.

![Personal Setup](./20personalSetup.png "Just for you")

### Microsoft Account Bypass

If you don't want to sign into a Microsoft account, you can bypass this step. Just enter a fake email and any password.

![Email Bypass](./21accountBypass.png "Fake email works fine")
![Password Bypass](./22accountBypass.png "Any password will do")

You'll get an error screen, which gives us a "Skip" option.

![Bypass Success](./23accountBypass.png "Perfect! Now we can skip")

### Create Your Local Account

Now create your local Windows username and password. Pick something you'll remember!

![User Account](./24PCuser.png "What should we call you?")
![User Password](./25PCuser.png "Pick a good password")

### Security Questions

Since we bypassed the Microsoft account, you need to set up three security questions for password recovery.

![Security Questions](./26SecQuestion.png "Security question setup")

### Privacy Settings

Configure these however you want, or just accept the defaults and tweak them later.

![Privacy Settings](./27privacySetting.png "Your privacy, your choice")

### Final Setup

Wait for the last bit of setup to finish.

![Final Setup](./28waitScreen.png "Final setup screen")
![Success!](./29win10Installed.png "Installation complete")

Windows 10 is now installed and ready to use.

[error_encrypted_permission_error]

## Bonus: Installing Autodesk EAGLE

For PCB design work, here's how to install EAGLE.

### Update Edge First

Since I've got the EAGLE installer on Google Drive and the default Edge might be too old:

1. **Download the latest Edge** from [Microsoft's site](https://www.microsoft.com/en-us/edge/business/download)

![Edge Download](./49updateEdge.png "Get the latest Edge")
![Edge Installer](./50updateEdge.png "Download in progress")

2. **Install it** and allow security prompts

![Edge SmartScreen](./51updateEdgeSmartScreen.png "Run the installer")
![Edge Permissions](./52edgeAccountControl.png "Allow permissions")

3. **Wait for installation to complete**

![Edge Installing](./53downloadWaiting.png "Installation progress")
![Edge Updated](./54edgeUpdated.png "Edge updated")

### Installing EAGLE

1. **Grab the installer** from my [Google Drive folder](https://drive.google.com/drive/folders/1-B_8SIAIRyWiv-xwQhL1SgjoSdvYtqef?usp=sharing)

![EAGLE Drive](./55autodeskEagleDriveDownload.png "Download from here")
![Downloading EAGLE](./56autodeskEagleDownloadDrive.png "Getting EAGLE")
![Download Complete](./57autodeskEagleDownloadDrive.png "Got it!")

2. **Run the installer** from your Downloads folder

![EAGLE Installer](./58installEagleInstaller.png "Time to install")
![EAGLE SmartScreen](./59eagleSmartScreen.png "Run it")
![EAGLE Permissions](./60eagleAccountControl.png "Allow it")

3. **Follow the installation wizard** with default settings

![EAGLE Wizard](./61eagleWizard.png "Installation wizard")
![License Agreement](./62eagleWizard.png "License terms")
![Installation Path](./63eagleWizard.png "Installation path")
![Components](./64eagleWizard.png "Component selection")
![Start Menu](./65eagleWizard.png "Start menu shortcuts")
![Installing](./66eagleWizard.png "Installing")

4. **Create an Autodesk account** when EAGLE launches

![EAGLE Launch](./67eagleOpen.png "EAGLE is starting up")
![Account Login](./68eagleAccount.png "Need an account")
![Create Account](./69eagleCreateAccount.png "Sign up here")

5. **Verify your email**

![Email Verification](./70accountVerif.png "Email verification")

### Troubleshooting EAGLE

**EAGLE crashing after the splash screen?** This is a known issue.

**The fix**: Navigate to EAGLE's installation folder, find `libeay32.dll`, and rename it to `libeay32.dll.bak`. Then try launching EAGLE again.

For more details, check out [Autodesk's official solution](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Eagle-crashes-seconds-after-launching-splash-screen.html).

EAGLE is now ready for PCB design work.

![EAGLE Working](./71eagleOpened.png "EAGLE running")

## Summary

What we've accomplished:

- Fully functional Windows 10 installation
- Complete Microsoft Office suite
- Autodesk EAGLE for electronics projects
- Everything activated properly

Windows 10 support ends this October, but you now have a working system that many people still prefer for compatibility and familiarity reasons.

If you got stuck anywhere or have questions, feel free to reach out. This setup should serve you well for your development and design work.
