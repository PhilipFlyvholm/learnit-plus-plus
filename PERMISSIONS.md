# Which permissions do we use and why?

All permissions we request are defined in the `package.json` and are, at the time of writing, the following:
```json
"host_permissions": ["https://learnit.itu.dk/*"],
"permissions": ["storage", "scripting", "webNavigation"],
```

## Host permissions
From [mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions):
> Use the host_permissions key to request access for the APIs in your extension that read or modify host data, such as cookies, webRequest, and tabs. This key is an array of strings, and each string is a request for a permission.

Host permission is permission to a specific website. In this case [https://learnit.itu.dk/](https://learnit.itu.dk/), and all subpages.

## Permissions
We request extra permissions to do extra special things.

### Storage
We use the `storage` permission to store settings, such as dark mode and theme, for the extension. We do not modify the local or session storage of the pages, or any cookies.

### Scripting
This is the most important permission since it allows us to inject scripts and CSS into the page.
This is used in the following ways:
- Injecting the selected theme CSS, such that you don't need to load all the themes on every load, but only the one you have selected.
- Injecting a script to modify the root by adding a `dark` class, such that the dark mode is shown directly when the CSS is loaded and not after the page load.

### webNavigation
WebNavigation is used to be the first code to know that you are about to enter LearnIT. This sounds a bit weird, however, this is needed to ensure that the page does not flash white when loading in dark mode.
Some browsers may say that we access your browser history because of this. We do in theory have access to URLs on history change, however, we do not use this. We only inject scripts at the moment between page switching and we could in theory use this to get access to your browser history.
**We do not do this!** We only use the permission we need to use and only use the parts of the permissions we need. See [src/background.ts](src/background.ts) for the only usage of this permission to verify our usage.
Even if we tried to share the data about your browser history, we would not be allowed to because of our content security policy which blocks most outside network traffic from our extension.

### Content security policy
We use the default Content security policy: https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/#default-policy
