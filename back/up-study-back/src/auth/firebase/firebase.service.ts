import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService  {
  private app: admin.app.App;

  constructor() {
      if (admin.apps.length > 0) {
        this.app = admin.app();
        return;
      }

      if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
      ) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

        const credential = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        };

        this.app = admin.initializeApp({
          credential: admin.credential.cert(credential as admin.ServiceAccount),
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });

        return;
      }

    

    throw new Error(
      'Firebase service account not configured. Set FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in .env or mount GOOGLE_APPLICATION_CREDENTIALS.'
    );
  }

  getAuth() {
    return this.app.auth();
  }

  getStorage() {
    return this.app.storage().bucket();
  }

  async verifyIdToken(idToken: string) {
    try{
      return await this.getAuth().verifyIdToken(idToken);

    }catch(err)
    {
      throw new Error('invalid firebase id tokes:'+ (err as Error).message);
    }
  }
}
