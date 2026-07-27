import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface AnalyticsEvent {
  id?: number;
  userId: string;
  courseId: string;
  lessonId: string;
  metricType: 'time_on_page' | 'interaction';
  value: number; // e.g. seconds for time_on_page, count for interaction
  timestamp: string;
  synced: number; // 0 for false, 1 for true
}

class OfflineAnalyticsService {
  private dbName = 'zalamati_analytics_db';
  private storeName = 'engagement_events';
  private idbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initDB();
      // Listen for browser restoration of connection
      window.addEventListener('online', () => {
        console.log('📶 Online status restored! Bootstrapping background telemetry synchronization...');
        this.syncPendingEvents();
      });
    }
  }

  // Initialize native IndexedDB
  private initDB(): Promise<IDBDatabase> {
    if (this.idbPromise) return this.idbPromise;

    this.idbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', request.error);
        reject(request.error);
      };
    });

    return this.idbPromise;
  }

  // Save an engagement event locally via IndexedDB
  public async trackEvent(
    courseId: string,
    lessonId: string,
    metricType: 'time_on_page' | 'interaction',
    value: number
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      const userId = user?.uid || 'anonymous_guest';
      
      const newEvent: AnalyticsEvent = {
        userId,
        courseId,
        lessonId,
        metricType,
        value,
        timestamp: new Date().toISOString(),
        synced: 0
      };

      const idb = await this.initDB();
      const transaction = idb.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      store.add(newEvent);

      transaction.oncomplete = () => {
        // Attempt immediate synchronization if browser is online
        if (navigator.onLine) {
          this.syncPendingEvents();
        }
      };
    } catch (err) {
      console.error('Failed to write offline telemetry to IndexedDB:', err);
    }
  }

  // Sync pending events to Cloud Firestore
  public async syncPendingEvents(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      const idb = await this.initDB();
      const transaction = idb.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.getAll();

      request.onsuccess = async () => {
        const allEvents: AnalyticsEvent[] = request.result || [];
        const unsynced = allEvents.filter(e => e.synced === 0);

        if (unsynced.length === 0) return;

        console.log(`🌐 Synchronizing ${unsynced.length} offline engagement event records to Firestore...`);

        for (const event of unsynced) {
          try {
            // Write each record to cloud firestore
            const analyticsCol = collection(db, 'studentAnalytics');
            await addDoc(analyticsCol, {
              userId: event.userId,
              courseId: event.courseId,
              lessonId: event.lessonId,
              metricType: event.metricType,
              value: event.value,
              timestamp: event.timestamp,
              syncedAt: new Date().toISOString()
            });

            // Delete synced event from local IndexedDB or update synced flag
            if (event.id !== undefined) {
              const deleteTx = idb.transaction(this.storeName, 'readwrite');
              const deleteStore = deleteTx.objectStore(this.storeName);
              deleteStore.delete(event.id);
            }
          } catch (fireErr) {
            console.error('Failed to sync event to Firestore:', fireErr);
            // Break loop if there are Firestore permission/offline errors to retry later
            break;
          }
        }
        console.log('✅ Offline telemetry synchronization sequence complete.');
      };
    } catch (syncErr) {
      console.error('Telemetry synchronization routine failed:', syncErr);
    }
  }

  // Helper to query all cached events (for debug analytics view)
  public async getLocalCachedEventsCount(): Promise<number> {
    try {
      const idb = await this.initDB();
      return new Promise<number>((resolve) => {
        const transaction = idb.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(0);
      });
    } catch {
      return 0;
    }
  }
}

export const OfflineAnalyticsTracker = new OfflineAnalyticsService();
