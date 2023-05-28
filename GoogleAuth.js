// import * as WebBrowser from "expo-web-browser";
// import * as AppAuth from "expo-app-auth";
// import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
// import React from "react";
// import { View, Button } from "react-native";
// import { GoogleSignin, statusCodes } from "react-native-google-signin";

// const discovery = {
//   authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
//   tokenEndpoint: "https://oauth2.googleapis.com/token",
// };

// let androidClientId =
//   "786095298525-eim74b7sdb2borvnov1ob5ru6coqakp0.apps.googleusercontent.com";
// let iosClientId =
//   "786095298525-uhh8o99ih62dld36h9o2pk53jgn5hl95.apps.googleusercontent.com";

// GoogleSignin.configure({
//   webClientId:
//     "786095298525-eim74b7sdb2borvnov1ob5ru6coqakp0.apps.googleusercontent.com",
//   offlineAccess: true,
// });

// export const signInWithGoogle = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const userInfo = await GoogleSignin.signIn();

//     // Use userInfo.idToken and userInfo.accessToken for further authentication
//     // or send them to your server for verification.
//     // You can also retrieve user information using userInfo.*

//     console.log("Google sign-in successful");
//   } catch (error) {
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       console.log("Google sign-in canceled");
//     } else {
//       console.log("An error occurred during Google sign-in", error);
//     }
//   }
// };
