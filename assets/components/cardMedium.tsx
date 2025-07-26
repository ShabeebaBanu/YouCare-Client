import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
} from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import CustomButtonSmall from "./customButtonSmall";
import { navigate } from "../../navigation/globalNavigation";

interface CardMediumProps {
  imageUrl: any;
  title: string;
  name: string;
  userType: string;
  district: string;
  date: string;
  onAddToWishList?: () => void;
  onPress?: () => void;
}

const CardMedium: React.FC<CardMediumProps> = ({
  imageUrl,
  title,
  name,
  userType,
  district,
  date,
  onAddToWishList,
  onPress,
}) => {

  const handleOnAddToWishList = () => {
    
  };

  const handleOnNeed = () => {
    navigate('/need/needProfile')
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handleOnNeed}>
    
      <Image source={imageUrl} style={styles.image} resizeMode="cover" />

      <View style={styles.description}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.userType}>{userType}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.district}>{district}</Text>
        <Text style={styles.date}>{date}</Text>
        <CustomButtonSmall
          title="Add to Wishlist"
          onPress={handleOnAddToWishList}
          buttonColor={COLORS.buttonOdd}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: SIZE.buttonRadiusSmall,
    backgroundColor: COLORS.bgLight,
    marginVertical: 10,
    marginHorizontal: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor:COLORS.bgGray,
    // elevation: 3,
    // shadowColor: COLORS.bgDark,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.4,
    // shadowRadius: 2,
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: SIZE.buttonRadiusSmall,
    marginRight: 10,
  },
  description: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  name: {
    fontSize: SIZE.small,
    color: COLORS.textDark,
  },
  userType: {
    fontSize: SIZE.mini,
    color: COLORS.textLight,
  },
  details: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 60,
    marginLeft: 10,
  },
  district: {
    fontSize: SIZE.small,
    color: COLORS.textOption,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textHighlight,
  },
});

export default CardMedium;
