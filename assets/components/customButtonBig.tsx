import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CustomButtonProps {
    title: String;
    onPress: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({title, onPress}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>
               {title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.buttonOther,
    paddingVertical: SIZE.VerticlePaddingLarge,     
    paddingHorizontal: SIZE.HorizontalPaddingLarge,   
    borderRadius: SIZE.buttonRadiusLarge,
    alignItems: "center",   
    justifyContent: "center" 
  },

  text: {
    color: COLORS.textLight,
    fontSize: SIZE.medium,         
  }
});

export default CustomButton;