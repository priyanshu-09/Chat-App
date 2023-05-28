import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

import { Box } from "../components/Containers/Box";
import { Button } from "../components/Buttons/Button";
import { useEffect, useState } from "react";
import icons from "../../assets/icons/icons";
import { signInWithGoogle } from "../../GoogleAuth";

const ADMIN_USERNAME = "Priyanshu";
const ADMIN_PASS = "schmooze";

const Auth = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    props.navigation.navigate("ChatList");
    if (username === "" || password === "") {
      setError(true);
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASS) {
      props.navigation.navigate("ChatList");
    } else {
      setError(true);
      setUsername("");
      setPassword("");
    }
  };

  //   const handleGoogleSignIn = async () => {
  //     const result = await signInWithGoogle();
  //     console.log(result);
  //   };

  return (
    <LinearGradient colors={["#b6edfe", "#9fccff"]} style={styles.gradient}>
      <SafeAreaView style={styles.wrapper}>
        <Text style={styles.pageTitle}>Schmooze Task</Text>
        <Box>
          <TextInput
            value={username}
            placeholder="What do we call you"
            style={{
              ...styles.textInput,
              borderColor: error ? "red" : "black",
            }}
            onChangeText={(input) => {
              setUsername(input);
              setError(false);
            }}
          />
          <TextInput
            value={password}
            placeholder="Your secret key"
            secureTextEntry={true}
            style={{
              ...styles.textInput,
              borderColor: error ? "red" : "black",
            }}
            onChangeText={(input) => {
              setPassword(input);
              setError(false);
            }}
          />
          <Button text={"Login"} onClick={handleSubmit} />
        </Box>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.boxTitle}>Try other login options</Text>
          <Button
            // onClick={handleGoogleSignIn}
            text={"Sign In with Google"}
            icon={icons.googleIcon}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wrapper: {
    flex: 1,

    justifyContent: "space-between",
    display: "flex",
  },
  pageTitle: {
    color: "black",
    fontFamily: "Bold",
    textAlign: "center",
    fontSize: 30,
    letterSpacing: -3,
  },
  textInput: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 20,
    color: "black",
    fontFamily: "Bold",
    fontSize: 15,
    marginBottom: 10,
  },
  boxTitle: {
    color: "black",
    fontFamily: "Bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Auth;
