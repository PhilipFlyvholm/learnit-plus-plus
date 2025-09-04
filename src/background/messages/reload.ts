import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
      let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log("found the tab", tab);

    res.send(req.body)
}

export default handler