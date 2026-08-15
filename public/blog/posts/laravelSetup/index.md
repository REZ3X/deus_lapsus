# Getting Started with Laravel on Debian Linux

This time we're looking at Laravel, a PHP framework that's changed how developers approach PHP development. Even if you're not typically a PHP fan, Laravel offers a different experience worth exploring. Let's walk through setting up Laravel on Debian Linux.

## What is Laravel?

Laravel is a modern PHP web framework created by Taylor Otwell in 2011 to simplify web application development using clean, expressive syntax. It follows the MVC (Model-View-Controller) pattern and includes built-in features like routing, authentication, templating (Blade), database ORM (Eloquent), and a command-line tool (Artisan), making development faster and more organized.

## Why Use Laravel?

Laravel makes web development faster, cleaner, and more secure. It handles low-level tasks like routing and authentication automatically. Tools like Eloquent (database ORM) and Artisan (CLI) streamline the development process.

Laravel includes official Starter Kits like Breeze and Jetstream with prebuilt authentication, session management, and frontend scaffolding. You can use React, Vue, or even SSR with Inertia.js.

This guide covers setting up a Laravel project using Laravel Starter Kit, Composer, and PHP on Linux Debian.

## Requirements

- Laptop/PC with Linux Debian OS
- Internet Connection
- Node.js (If you don't have it, check out my [Node.js NVM tutorial](https://rejaka.id/blog/nvmTutorial))

Let's get started.

## Laravel Project Setup

### PHP Installation

Before installing Laravel, we need PHP. This tutorial uses PHP 8.3 instead of the latest 8.4. The reason:

> "It's better to have one version older than latest because it's proved stable and already widely used."

Let’s go step-by-step:

1. Now for PHP 8.3 installation we need to refresh/update our package list and then install apt-transport-https lsb-release ca-certificates curl and gnupg.

```bash
sudo apt update
sudo apt install -y apt-transport-https lsb-release ca-certificates curl gnupg
```

2. Now for the PHP, we will use code repository maintain of Sury PPA actively maintain by Ondřej Surý’s. So now we will add the GPG key.

```bash
curl -fsSL https://packages.sury.org/php/apt.gpg | sudo gpg --dearmor -o /usr/share/keyrings/sury.gpg
```

3. After adding the source code repo then we list it to our source list of package manager.

```bash
echo "deb [signed-by=/usr/share/keyrings/sury.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/php.list
```

4. Let's update the package manager list and install PHP 8.3 by command:

```bash
sudo apt update
sudo apt install -y php8.3 php8.3-cli php8.3-mbstring php8.3-xml php8.3-curl php8.3-mysql php8.3-zip php8.3-readline unzip
```

5. After installation completes, verify the PHP version.

```bash
php -v
```

![PHP Version Checking](./phpcheck.png "PHP Version Checking")

PHP is now installed.

### Composer Installation

Now we install Composer. What's Composer?

> Composer is a dependency manager for PHP, similar to NPM for Node.js. It manages libraries, dependencies, and autoloading.

1. Download the Composer Installer (Composer Setup).

```bash
curl -sS https://getcomposer.org/installer -o composer-setup.php
```

2. Then install the Composer globally.

```bash
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
```

3. After the installation done, cleanup the setup file and validate bychecking the Composer version.

```bash
rm composer-setup.php
composer --version
```

![Composer Version Checking](./composercheck.png "Composer Version Checking")

Composer is now installed.

### Laravel Starter Kit & Project Creation

Now we'll create a Laravel project using the Laravel Installer.

The Laravel Installer (Starter Kit) simplifies project creation with faster setup and helpful scaffolding.

1. Let’s install it:

```bash
composer global require laravel/installer
```

2. Wait for the installation to complete.

![Laravel Version](./laravelversion.png "Laravel Version")

3. Create a folder for your project:

```bash
mkdir laravel_project && cd laravel_project
```

4. And finally, the magic command:

```bash
laravel new laravel_app
```

> Note: If you're using zsh terminal, you might encounter an error. Here's the solution.

![Laravel Error](./laravelerror.png "Laravel Error")

That’s because Zsh doesn’t know where the Laravel binary is. Let’s fix it.

### Add Laravel to PATH (For zsh users)

5. First, get the global binary path:

```bash
composer global config bin-dir --absolute
```

![Path Check](./pathcheck.png "Path Check")

6. Copy that path and open .zshrc:

```bash
nano ~/.zshrc
```

7. Add this line at the bottom:

```bash
export PATH="$HOME/.config/composer/vendor/bin:$PATH"
```

![zshrc Config](./zshrcconfig.png "zshrc Config")

8. Save and apply the changes:

```bash
source ~/.zshrc
```

9. Verify everything’s okay:

```bash
laravel --version
```

![Laravel Installer Version](./laravelversioncheck.png)

10. Now retry the project creation:

```bash
laravel new laravel_app
```

### Starter Kit Setup

The CLI will prompt you with several configuration questions.

1. **Choose Starter Kit**. I picked React because I’m used to it.

![Starter Kit Choice](./starterkit.png ""Starter Kit Choice")

12. **Auth Provider**. Select Laravel's Built-In Auth.

![Auth Provider](./authprovider.png "Auth Provider")

13. **Testing Framework**. Choose Pest for testing.

![Pest](./pest.png "Pest")

14. Wait for the setup to complete.

You’ll see the project folder:

![Folder Created](./foldercreated.png "Folder Created")

15. Then it’ll ask if you want to run "npm run dev" and "npm run build". Just type yes.

![NPM Prompt](./npmprompt.png "NPM Prompt")

This is why we needed Node.js earlier. Laravel uses Vite to build assets and handle frontend stuff.

16. After some time, everything will be done.

![Laravel Done](./laraveldone.png "Laravel Done")

17. Check out the structure:

![Laravel Files](./laravelfiles.png "Laravel Files")

## Summary

You've successfully installed PHP, Composer, and Laravel, and created your first Laravel project on Debian Linux.

You're now ready to start developing with Laravel. The project structure includes all necessary files for building modern web applications with React (or your chosen frontend framework).

If you have questions or run into issues, feel free to reach out.
