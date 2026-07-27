import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

export interface LearningSnapshot {
  courseId: string;
  activeModuleIndex: number;
  activeLessonIndex: number;
  activeLessonId: string;
  scrollPosition: number;
  activeTab: string;
  unsavedNotes?: string;
  timestamp: number;
  deviceInfo?: string;
}

const LOCAL_KEY_PREFIX = 'zal_learning_snapshot_';

export class SnapshotService {
  /**
   * Save a snapshot of the student's learning environment to Firestore & localStorage
   */
  static async saveSnapshot(snapshot: LearningSnapshot): Promise<void> {
    const localKey = `${LOCAL_KEY_PREFIX}${snapshot.courseId}`;
    try {
      localStorage.setItem(localKey, JSON.stringify(snapshot));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    const userId = auth.currentUser?.uid;
    if (!userId) return; // Unauthenticated uses localStorage

    const docPath = `users/${userId}/progress/${snapshot.courseId}`;
    try {
      await setDoc(doc(db, 'users', userId, 'progress', snapshot.courseId), {
        ...snapshot,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.warn('Firestore snapshot save failed:', error);
      handleFirestoreError(error, OperationType.WRITE, docPath);
    }
  }

  /**
   * Load the most recent learning snapshot for a course
   */
  static async loadSnapshot(courseId: string): Promise<LearningSnapshot | null> {
    const localKey = `${LOCAL_KEY_PREFIX}${courseId}`;
    let localData: LearningSnapshot | null = null;
    try {
      const raw = localStorage.getItem(localKey);
      if (raw) localData = JSON.parse(raw);
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }

    const userId = auth.currentUser?.uid;
    if (!userId) return localData;

    const docPath = `users/${userId}/progress/${courseId}`;
    try {
      const snapDoc = await getDoc(doc(db, 'users', userId, 'progress', courseId));
      if (snapDoc.exists()) {
        const firestoreData = snapDoc.data() as LearningSnapshot;
        if (!localData || firestoreData.timestamp > (localData.timestamp || 0)) {
          return firestoreData;
        }
      }
    } catch (error) {
      console.warn('Firestore snapshot load failed, using local fallback:', error);
    }

    return localData;
  }
}
