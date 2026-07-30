import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Project } from '../types';

const PROJECTS_COLLECTION = 'projects';

export function subscribeToProjects(callback: (projects: Project[]) => void, onError?: (error: Error) => void) {
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    
    return onSnapshot(
      q,
      (snapshot) => {
        const projects: Project[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          
          return {
            id: doc.id,
            title: data.title || 'Untitled Project',
            url: data.url || '#',
            description: data.description || '',
            thumbnailUrl: data.thumbnailUrl || '',
            category: data.category || 'Web App',
            tags: Array.isArray(data.tags) ? data.tags : [],
            favicon: data.favicon || '',
            status: data.status === 'archived' ? 'archived' : 'active',
            isFavorite: Boolean(data.isFavorite),
            clickCount: Number(data.clickCount || 0),
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : (data.updatedAt || Date.now()),
            customThumbnail: Boolean(data.customThumbnail),
          };
        });
        callback(projects);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error('Error setting up snapshot:', err);
    if (onError) onError(err);
    return () => {};
  }
}

export async function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>): Promise<string> {
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
    ...projectData,
    clickCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function recordProjectClick(id: string): Promise<void> {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(docRef, {
      clickCount: increment(1),
      updatedAt: Timestamp.now(),
    });
  } catch (err) {
    console.error('Failed to record click count:', err);
  }
}

export async function toggleFavorite(id: string, currentStatus: boolean): Promise<void> {
  const docRef = doc(db, PROJECTS_COLLECTION, id);
  await updateDoc(docRef, {
    isFavorite: !currentStatus,
    updatedAt: Timestamp.now(),
  });
}
