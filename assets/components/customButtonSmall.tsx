import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CustomButtonSmallProps {
  title: string;
  onPress: () => void;
  buttonColor: string;
}

const CustomButtonSmall: React.FC<CustomButtonSmallProps> = ({
  title,
  onPress,
  buttonColor,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall + 6,
    borderRadius: 50, 
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZE.mini,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default CustomButtonSmall;
