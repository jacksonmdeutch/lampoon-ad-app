import { db } from './firebase';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { ADS, ISSUES } from './data';

export async function seedDatabase() {
  console.log('Seeding database...');
  
  // Add all ads
  for (const ad of ADS) {
    const { id, ...adData } = ad;
    await addDoc(collection(db, 'ads'), adData);
  }

  // Add issues
  await setDoc(doc(db, 'meta', 'issues'), {
    list: ISSUES,
    printed: []
  });

  console.log('Done seeding!');
}