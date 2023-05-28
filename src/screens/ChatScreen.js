import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { firebase } from "../../firebase";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { Box } from "../components/Containers/Box";
import images from "../../assets/images/images";
import moment from "moment";

const ChatScreen = (props) => {
  const [chat, setChat] = useState({});
  useEffect(() => {
    setChat(props?.route?.params?.chat);
  }, []);

  return (
    <LinearGradient colors={["#b6edfe", "#9fccff"]} style={styles.gradient}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.chatNameImage}>
          <View style={styles.chatImageContainer}>
            <Image
              contentFit="cover"
              transition={1000}
              style={styles.chatImage}
              source={images[chat.chatroomId]}
            />
          </View>
          <Text style={styles.pageTitle}>{chat.name}</Text>
        </View>
        <KeyboardAvoidingView>
          <ScrollView style={styles.chatScrollView}>
            {chat?.chatHistory?.map((item, index) => {
              return (
                <View>
                  {(index === 0 ||
                    moment.unix(item.timestamp).format("DD MMM") !==
                      moment
                        .unix(chat[index - 1]?.timestamp)
                        .format("DD MMM")) && (
                    <Text style={styles.date}>
                      {moment.unix(item.timestamp).format("ddd, DD MMM")}
                    </Text>
                  )}
                  <View
                    style={{
                      ...styles.contentWrapper,
                      alignSelf: item.sentByYou ? "flex-end" : "flex-start",
                    }}
                  >
                    <Text style={styles.content}>{item.text}</Text>
                    <Text
                      style={{
                        ...styles.timestamp,
                        textAlign: item.sentByYou ? "right" : "left",
                      }}
                    >
                      {moment.unix(item.timestamp).format(" h:mm a")}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <TextInput />
        </KeyboardAvoidingView>
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

    display: "flex",
  },
  chatNameImage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    color: "black",
    fontFamily: "Bold",
    textAlign: "center",
    fontSize: 25,
    letterSpacing: -3,
  },
  chatImageContainer: {
    padding: 2,
    borderWidth: 2,
    borderRadius: 17,

    marginRight: 10,
  },
  chatImage: {
    height: 40,
    width: 40,
    borderRadius: 15,
    backgroundColor: "#7799b5",
  },
  chatScrollView: {
    marginTop: 20,
  },

  date: {
    fontFamily: "Medium",
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: "hidden",
    width: "auto",
    marginBottom: 10,

    alignSelf: "center",
  },
  contentWrapper: {
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: "hidden",
    width: "auto",
    marginBottom: 20,
  },
  content: {
    fontFamily: "Medium",
    fontSize: 14,
  },
  timestamp: {
    textAlign: "right",
  },
});

export default ChatScreen;
