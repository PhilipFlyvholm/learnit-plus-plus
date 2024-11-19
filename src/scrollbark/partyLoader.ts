import { Database } from 'firebase-firestore-lite';

export async function getScrollbarEvents() {
    const db = new Database({ projectId: 'scrollweb-cc9b4' });
    
    const eventsCollection = db.ref('env/prod/events');
    
    const eventDocuments = await eventsCollection.list();
    
    interface EventDocument {
        start: number;
        end: number;
        where: string;
        displayName: string;
        discription: string;
        published: boolean;
    }
    
    const newEvents = eventDocuments.documents.filter((doc) => doc.start > Date.now()) as unknown as EventDocument[];
    console.log(newEvents);
    return newEvents.map((doc) => {
        return {
            title: doc.displayName,
            start: new Date(doc.start),
            end: new Date(doc.end),
            url: "https://www.erdetfredag.dk/"
        }
    });
}