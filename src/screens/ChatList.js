import {
  BackHandler,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { firebase } from "../../firebase";
import { useEffect, useRef, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { Box } from "../components/Containers/Box";
import images from "../../assets/images/images";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import icons from "../../assets/icons/icons";
import LottieView from "lottie-react-native";

const ChatList = (props) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInfo, setUserInfo] = useState(undefined);
  const animation = useRef(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  useEffect(() => {
    animation.current?.play();
    async function fetchData() {
      setLoading(true);
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

        tempArray.push(chatObject);
      }

      setChatHistory(tempArray);
      setLoading(false);
    }
    fetchData();
  }, [props, isFocused]);

  useEffect(() => {
    if (props?.route?.params?.user) setUserInfo(props?.route?.params?.user);
  }, []);

  useEffect(() => {
    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => {
      handler.remove();
    };
  }, []);

  const handleBackButtonClick = () => {
    console.log("Back Button Triggered");
    return true;
  };

  return (
    <LinearGradient colors={["#b6edfe", "#9fccff"]} style={styles.gradient}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          {userInfo && (
            <View style={styles.headerImageContainer}>
              <Image
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                style={styles.headerImage}
                source={{ uri: userInfo.picture }}
              />
            </View>
          )}
          <Text style={styles.pageTitle}>
            {userInfo ? `${userInfo.given_name}'s Chats` : "Your Chats"}
          </Text>
        </View>
        <Box style={styles.chatHistoryWrapper}>
          {loading && (
            <LottieView
              autoPlay
              speed={1}
              ref={animation}
              resizeMode="contain"
              loop={true}
              source={require("../../assets/loading.json")}
            />
          )}
          {!loading &&
            chatHistory.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    props.navigation.push("ChatScreen", { chat: item })
                  }
                  style={styles.chatItem}
                  key={item.chatroomId}
                >
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
                    {item.lastMessage.type === "text" ? (
                      <Text style={styles.lastText}>
                        {item.lastMessage.text}
                      </Text>
                    ) : (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-end",
                        }}
                      >
                        <Image
                          source={icons.photoIcon}
                          style={styles.lastTextImage}
                        />
                        <Text style={styles.lastText}>Photo</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
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
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerImageContainer: {
    padding: 1,
    borderWidth: 2,
    borderRadius: 15,
    marginRight: 5,
  },
  headerImage: {
    height: 25,
    width: 25,
    borderRadius: 12,
  },
  pageTitle: {
    color: "black",
    fontFamily: "Bold",
    textAlign: "center",
    fontSize: 25,
    letterSpacing: -2.5,
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
    borderRadius: 22,

    marginRight: 10,
  },
  chatImage: {
    height: 50,
    width: 50,
    borderRadius: 19,
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
  lastTextImage: {
    height: 15,
    width: 15,
    opacity: 0.7,
    marginRight: 5,
  },
});

export default ChatList;
