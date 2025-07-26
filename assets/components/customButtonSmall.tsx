import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CustomButtonSmallProps {
    title: String;
    onPress: () => void;
    buttonColor: string
}

const CustomButtonSmall: React.FC<CustomButtonSmallProps> = ({title, onPress, buttonColor}) => {
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: buttonColor}]} onPress={onPress}>
            <Text style={styles.text}>
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
    justifyContent: "center" ,
    alignSelf: "flex-start"
  },

  text: {
    color: COLORS.white,
    fontSize: SIZE.mini,         
  }
});

export default CustomButtonSmall;