import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface SubmitButtonProps {
  title: string;
  onPress: () => void;
  buttonColor: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  onPress,
  buttonColor,
}) => {
  const [scale] = useState(new Animated.Value(1));

  const isLight = buttonColor === COLORS.white;
  const textColor = isLight ? COLORS.textDark : COLORS.white;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.button,
          {
            backgroundColor: buttonColor,
            borderColor: isLight ? COLORS.borderSub : "transparent",
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZE.VerticlePaddingSmall + 2,
    paddingHorizontal: SIZE.HorizontalPaddingSmall + 10,
    borderRadius: 5, 
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4, 
  },
  text: {
    fontSize: SIZE.small,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});

export default SubmitButton;
