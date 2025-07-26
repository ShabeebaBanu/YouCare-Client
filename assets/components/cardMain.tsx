import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CardMainProps {
  imageUrl: any;
  title: string;
  onPress?: () => void;
}

const CardMain: React.FC<CardMainProps> = ({ imageUrl, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.gradient}
        >
          <Text style={styles.title}>{title}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZE.buttonRadiusSmall,
    overflow: "hidden",
    height: 150,
    marginHorizontal: 20,
    marginVertical: 12,
    elevation: 5,
    backgroundColor: COLORS.bgLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default CardMain;
