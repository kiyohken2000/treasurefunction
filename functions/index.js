const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
admin.initializeApp();

const db = admin.firestore();
const expo = new Expo();

exports.sendMessage = functions.region('asia-northeast2').firestore
  .document('treasures/{treasure}')
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const email = newValue.createrEmail
    const treasureName = newValue.treasureName
    // console.log(name,text,members)

      const message = [];
      const userRef = db.collection('tokens').doc(email)
      userRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          const token = data.token
            message.push({
              to: token,
              sound: 'default',
              title: 'Someone picking up your treasure.',
              body: treasureName,
            });
          console.log(email, treasureName)
          expo.sendPushNotificationsAsync(message)
        } else { null }
      })
  });
