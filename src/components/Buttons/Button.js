import {
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const Button = ({ text, icon, onClick }) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.5}
      style={{
        backgroundColor: "#e1edff",
        borderWidth: 2,
        borderRadius: 15,
        padding: 20,
        shadowColor: "black",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {icon && <Image source={icon} style={{ height: 20, width: 20 }} />}
      <Text
        style={{
          textAlign: "center",

          color: "black",
          fontFamily: "Bold",
          fontSize: 15,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};
