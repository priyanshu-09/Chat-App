import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { firebase } from "../../firebase";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { Box } from "../components/Containers/Box";
import images from "../../assets/images/images";
import moment from "moment";

const ChatList = (props) => {
  const [chatHistory, setChatHistory] = useState([]);
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  useEffect(() => {
    async function fetchData() {
      let tempArray = [];
      const db = getFirestore(firebase);
      const chatroomsList = collection(db, "Chatrooms");
      const chatrooms = await getDocs(chatroomsList);
      const chatroomsData = chatrooms.docs.map((doc) => doc.data());

      for (let i in chatroomsData) {
        const chatHistoryCollection = collection(
          db,
          "Chatrooms",
          `chatroom${parseInt(i) + 1}`,
          `Messages`
        );
        const chatHistoryDoc = await getDocs(chatHistoryCollection);
        const chatHistory = chatHistoryDoc.docs.map((doc) => doc.data());
        const lastMessageIndex = chatHistory.length - 1;
        let chatObject = {
          name: chatroomsData[i].name,
          chatroomId: `chatroom${parseInt(i) + 1}`,
          image: chatroomsData[i].image,
          lastMessageType: chatHistory[lastMessageIndex].type,
          lastMessageTimestamp: chatHistory[lastMessageIndex].timestamp,
          chatHistory: chatHistory,
          lastMessage: chatHistory[lastMessageIndex],
        };

        console.log(tempArray);
        tempArray.push(chatObject);
      }

      setChatHistory(tempArray);
    }
    fetchData();
  }, []);

  return (
    <LinearGradient colors={["#b6edfe", "#9fccff"]} style={styles.gradient}>
      <SafeAreaView style={styles.wrapper}>
        <Text style={styles.pageTitle}>Your Chats</Text>
        <Box style={styles.chatHistoryWrapper}>
          {chatHistory.map((item) => {
            return (
              <View style={styles.chatItem} key={item.chatroomId}>
                <View style={styles.chatImageContainer}>
                  <Image
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                    style={styles.chatImage}
                    source={images[item.chatroomId]}
                  />
                </View>
                <View style={styles.chatContentWrapper}>
                  <View style={styles.chatNameTime}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>
                      {moment
                        .unix(item.lastMessageTimestamp)
                        .format("DD MMM, h:mm a")}
                    </Text>
                  </View>
                  <Text style={styles.lastText}>{item.lastMessage.text}</Text>
                </View>
              </View>
            );
          })}
        </Box>
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
  chatHistoryWrapper: {
    flex: 1,
    marginTop: 20,
  },
  chatItem: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderBottomColor: "#7799b5",
  },
  chatImageContainer: {
    padding: 2,
    borderWidth: 2,
    borderRadius: "50%",

    marginRight: 10,
  },
  chatImage: {
    height: 50,
    width: 50,
    borderRadius: "50%",
    backgroundColor: "#7799b5",
  },
  chatContentWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    flex: 1,
  },
  chatNameTime: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "flex-end",
  },
  chatName: {
    fontFamily: "Bold",
    fontSize: 14,
  },
  chatTime: {
    fontFamily: "Regular",
    fontSize: 12,
    textAlign: "right",
  },
  chatContent: {
    fontFamily: "Medium",
    fontSize: 14,
  },
});

export default ChatList;
