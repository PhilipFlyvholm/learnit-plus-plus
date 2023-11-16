# LearnIT++

<img src="assets/icon.png" alt="LearnIT++ logo" width="200"/>

**Welcome to LearnIt++ Extension!**

| ![learnit++ lightmode](./preview-images/plus-light.png) | ![learnit++ darkmode](./preview-images/plus-dark.png) |
| --- | --- |
| ![hacker mode](./preview-images/hacker.png) | ![retro lightmode](./preview-images/retro-light.png)


## Description

Improved design and functionality of the LearnIT page for IT-University Of Copenhagen

## Installation

There is currently no web store download, but adding local extensions is pretty easy.

**Chrome/chromium guide:**

Install via [Chrome Web Store](https://chrome.google.com/webstore/detail/learnit%2B%2B/dgljcacndcbaedcglhlibdhohipphojk/)

_Manual install:_
To install LearnIt++, follow these simple steps:

1. Download the latest zip from the [releases](https://github.com/PhilipFlyvholm/learnit-plus-plus/releases) on GitHub.
2. Unpack the zip
3. Go to `chrome://extensions` in your browser
4. Enable developer mode in the top right
5. Press `Load unpacked` and select the unpacked zip
6. Enjoy!

**Firefox guide:**

Only manual install since Firefox does not allow add-ons on the store for internal sites such as LearnIT

1. Download the latest `xpi` file from the [releases](https://github.com/PhilipFlyvholm/learnit-plus-plus/releases) on GitHub.
2. Go to `about:addons` in your browser
3. Pres the gear icon on the other side of "Customize Firefox"
4. Press `Install add-on from file...`
5. Select the downloaded `xpi` file
6. A popup may show up asking if you want to install the add-on, accept this popup.
7. Enjoy!


**Safari:**

There is currently no plan for safari support since you need an Apple dev license for this.

## Contributing

We encourage pull requests!

To preview changes run the `npm run dev` command to get auto-reloading the extension. The use of Typescript is preferred over JavaScript.

## How to build

1. Run `npm i` if it is the first time building
2. Run `npm run package` to generate a zip in the `build` folder for chrome (Use `npm run package:firefox` for firefox)
3. Done

## Support

If you have any questions or issues, please use the issues page on GitHub to report issues and discussions for questions and ideas.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
