import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { useEffect, useRef, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore/lite";
import { Box } from "../components/Containers/Box";
import images from "../../assets/images/images";
import moment from "moment";
import icons from "../../assets/icons/icons";

const ChatScreen = (props) => {
  const [chat, setChat] = useState({});

  const [messageToBeSent, setMessageToBeSent] = useState("");
  useEffect(() => {
    setChat(props?.route?.params?.chat);
  }, []);

  const sendTextMessage = async (messageText) => {
    const db = getFirestore(firebase);

    try {
      await setDoc(
        doc(
          db,
          "Chatrooms",
          chat.chatroomId,
          `Messages`,
          `message${chat.chatHistory.length + 1}`
        ),
        {
          type: "text",
          sentByYou: true,
          text: messageText,
          timestamp: new Date(),
          image: "",
        }
      );
      setMessageToBeSent("");
      console.log("Document written  ");
      fetchData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const sendImageMessage = async () => {
    // Get image from the device
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      // Handle permission denied
      return;
    }

    const image = await ImagePicker.launchImageLibraryAsync();

    if (!image.cancelled) {
      const { uri } = image;
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);

      // Upload the image to Firebase Storage
      const storageRef = firebase.storage().ref().child(`images/${imageName}`);
      const uploadTask = storageRef.putFile(uri);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // Handle upload progress if required
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress:", progress);
        },
        (error) => {
          // Handle upload error
          console.log("Error uploading image:", error);
        },
        () => {
          // Image uploaded successfully
          storageRef.getDownloadURL().then((downloadURL) => {
            // Save the image details in Firestore
            const messagesRef = firebase.firestore().collection("messages");
            messagesRef
              .add({
                type: "image",
                imageUrl: downloadURL,
                senderId: "USER_ID", // Set the sender ID accordingly
                timestamp: new Date(),
              })
              .then(() => {
                console.log("Image message sent successfully");
              })
              .catch((error) => {
                console.log("Error sending image message:", error);
              });
          });
        }
      );
    }
  };

  const fetchData = async () => {
    const db = getFirestore(firebase);
    const chatHistoryCollection = collection(
      db,
      "Chatrooms",
      chat.chatroomId,
      `Messages`
    );
    const chatHistoryDoc = await getDocs(chatHistoryCollection);
    const chatHistory = chatHistoryDoc.docs.map((doc) => doc.data());
    const lastMessageIndex = chatHistory.length - 1;
    let chatObject = {
      name: chat.name,
      chatroomId: chat.chatroomId,
      image: chat.image,
      lastMessageType: chatHistory[lastMessageIndex].type,
      lastMessageTimestamp: chatHistory[lastMessageIndex].timestamp,
      chatHistory: chatHistory,
      lastMessage: chatHistory[lastMessageIndex],
    };
    setChat(chatObject);
  };

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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView style={styles.chatScrollView}>
            {chat?.chatHistory?.map((item, index) => {
              return (
                <View>
                  {(index === 0 ||
                    moment.unix(item.timestamp).format("DD MMM ") !==
                      moment
                        .unix(chat?.chatHistory[index - 1]?.timestamp)
                        .format("DD MMM ")) && (
                    <Text style={styles.date}>
                      {moment.unix(item.timestamp).format("ddd, DD MMM")}
                    </Text>
                  )}
                  <View
                    style={{
                      ...styles.contentWrapper,
                      alignSelf: item.sentByYou ? "flex-end" : "flex-start",
                      alignItems: item.sentByYou ? "flex-end" : "flex-start",
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
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={messageToBeSent}
              onChangeText={(e) => setMessageToBeSent(e)}
            />
            {messageToBeSent === "" ? (
              <Image source={icons.imageIcon} style={styles.inputIcon} />
            ) : (
              <TouchableOpacity
                onPress={() => sendTextMessage(messageToBeSent)}
              >
                <Image source={icons.sendIcon} style={styles.inputIcon} />
              </TouchableOpacity>
            )}
          </View>
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
    fontSize: 10,
    fontFamily: "Regular",
  },

  textInputWrapper: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  textInput: {
    color: "black",
    fontFamily: "Bold",
    fontSize: 15,
    flex: 1,
  },
  inputIcon: {
    height: 25,
    width: 25,
  },
});

export default ChatScreen;
