import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("Received message", req);
  res.send("Im awake!");
}

export default handler