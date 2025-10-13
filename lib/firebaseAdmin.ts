import admin from "firebase-admin";

function initializeFirebaseAdmin(): void {
  if (admin.apps.length > 0) return;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    // Defer initialization until runtime when env vars are present
    throw new Error("Missing Firebase Admin credentials environment variables");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getAdminAuth() {
  if (!admin.apps.length) {
    initializeFirebaseAdmin();
  }
  return admin.auth();
}
