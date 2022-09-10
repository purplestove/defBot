#### Discord Bot for the Technical Minecraft Discord Server KiwiTech using Discord.js v14

This bot aims to provide functionality to control and manage Minecraft servers, aswell as informational functionality for relevant discord-related topics.

Also, this is my first larger Coding Project and this repository will not only help me learn using GitHub, but also track the progess.

_This project will - at a later stage - most likely be split up in multiple bots, so it can be more useable for other people._

If you have any questions of want to discuss this project with me, consider joining my [Discord Server](https://discord.gg/wmJ3WBYcZF).

---

### Current features:

`/info server`:

Returns **Membercount**, **Guild Icon**, **Creation Time** and a **permanent Invite Link** for the Guild that Bot is in using an embed.

`/info members`:

Returns a list of **Members** of the Minecraft-Server with a **Membercount**.

`/info admins`:

Returns a list of **Admins** of the Minecraft-Server with a **Count**.

`/info user <username>`:

Queries the Discord API for Information about the User such as their **User ID**, **Account creation time**, **Avatar** and their **Roles**.

`/trialinfo <username>`:

Posts an embed with **information about the server** for new trial members. The user also gets pinged. It will also **check for admin permission** and the **correct channel**.
