import { initializeApp } from "firebase/app"
import {
  collection,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  where
} from "firebase/firestore/lite"

const firebaseConfig = {
  apiKey: "AIzaSyAyNN_bwmKNBIjigrcQf9cLpO58DfKb7lY",
  authDomain: "scrollweb-cc9b4.firebaseapp.com",
  projectId: "scrollweb-cc9b4",
  appId: "1:415080604113:web:5f1d71e08f587b06d200f0",
  measurementId: "G-2WJV2KL9PG",
  storageBucket: "scrollweb-cc9b4.appspot.com",
  databaseURL: "https://scrollweb-cc9b4.firebaseio.com/",
  messagingSenderId: "415080604113"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function getScrollbarEvents() {
  const eventsCollection = collection(db, "env/prod/events")
  const oneDayAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
  const eventsQuery = query(eventsCollection, where("start", ">=", oneDayAgo))

  const querySnapshot = await getDocs(eventsQuery)

  interface EventDocument {
    start: Timestamp
    end: Timestamp
    where: string
    displayName: string
    description: string
    published: boolean
  }

  const newEvents: EventDocument[] = querySnapshot.docs.map(
    (doc) => doc.data() as EventDocument
  )

  console.log("Scrollbar events", newEvents)

  return newEvents.map((event) => {
    return {
      title: event.displayName,
      start: event.start.toDate(),
      end: event.end.toDate(),
      url: "https://www.erdetfredag.dk/"
    }
  })
}
