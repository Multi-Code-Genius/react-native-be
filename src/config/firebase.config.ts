import admin from "firebase-admin";

const serviceAccount =
  process.env.NODE_ENV === "development"
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)
    : require("../../firebase-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
