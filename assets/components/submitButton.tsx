import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface SubmitButtonProps {
    title: String;
    onPress: () => void;
    buttonColor: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({title, onPress, buttonColor}) => {

  const textColor = buttonColor == COLORS.white ? COLORS.textDark : COLORS.white;

    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={onPress}>
            <Text style={[styles.text, {color: textColor}]}>
               {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZE.VerticlePaddingSmall,     
    paddingHorizontal: SIZE.HorizontalPaddingSmall,   
    borderRadius: SIZE.buttonRadiusSmall,
    alignItems: "center",   
    justifyContent: "center", 
    borderColor: COLORS.buttonOther,
    borderWidth: 1
  },

  text: {
    fontSize: SIZE.small,      
  }
});

export default SubmitButton;