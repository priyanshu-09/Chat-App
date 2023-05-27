import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { TextShadow } from "../components/Text/TextShadow";
import { Box } from "../components/Containers/Box";
import { Button } from "../components/Buttons/Button";
import { useState } from "react";

const ADMIN_USERNAME = "T";
const ADMIN_PASS = "t";

const Auth = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
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
        <View>
          <Text style={styles.boxTitle}>Try other login options</Text>
          <Button text={"Sign In with Google"} />
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
