import {
  Dimensions,
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
import { firebase, storage } from "../../firebase";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useIsFocused } from "@react-navigation/native";

const ChatScreen = (props) => {
  const [chat, setChat] = useState({});
  const scrollViewRef = useRef();
  const isFocused = useIsFocused();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const [messageToBeSent, setMessageToBeSent] = useState("");
  useEffect(() => {
    setChat(props?.route?.params?.chat);
  }, []);

  useLayoutEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [props, isFocused]);

  const sendMessage = async (messageText, imageLink, type) => {
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
          type: type,
          sentByYou: true,
          text: messageText,
          timestamp: new Date(),
          image: imageLink,
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      console.log(result.assets[0].uri);

      const metadata = {
        contentType: "image/jpeg",
      };

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", result.assets[0].uri, true);
        xhr.send(null);
      });

      const storageRef = ref(
        storage,
        `public/message${chat.chatHistory.length + 1}`
      );
      const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;

            // ...

            case "storage/unknown":
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            sendMessage("", downloadURL, "image");
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

  const handleContentSizeChange = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
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
          <ScrollView
            style={styles.chatScrollView}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onContentSizeChange={handleContentSizeChange}
          >
            {chat?.chatHistory?.map((item, index) => {
              return (
                <View key={index}>
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
                    {item.type === "text" ? (
                      <Text style={styles.content}>{item.text}</Text>
                    ) : (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.imageContent}
                        placeholder={blurhash}
                        contentFit="cover"
                        transition={1000}
                      />
                    )}
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
              <TouchableOpacity onPress={() => sendImageMessage()}>
                <Image source={icons.imageIcon} style={styles.inputIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => sendMessage(messageToBeSent, "", "text")}
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
    maxWidth: Dimensions.get("window").width / 2,
    marginBottom: 5,
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
  imageContent: {
    resizeMode: "contain",
    width: Dimensions.get("window").width / 3,
    aspectRatio: 1,
    backgroundColor: "#7799b5",
    resizeMode: "contain",
    borderRadius: 5,
    margin: 5,
  },
});

export default ChatScreen;
