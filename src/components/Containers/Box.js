import { View } from "react-native";

export const Box = (props) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderWidth: 2,
        borderRadius: 15,
        padding: 20,
        shadowColor: "#7799b5",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
      }}
    >
      {props.children}
    </View>
  );
};
