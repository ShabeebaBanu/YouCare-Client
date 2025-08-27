import React, { useEffect, useState } from "react";
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
import { getUserId } from "@/constants/config";
import { createWishList,
         deleteWishlistById
 } from "@/services/wishlistService";
import { createDonationRequest } from "@/services/donationRequestService";


interface CardMediumProps {
  usage: string;
  id: string;
  imageUrl: any;
  title: string;
  name: string;
  userType: string;
  createdBy: any;
  district: string;
  date: string;
  onAddToWishList?: () => void;
  onPress?: () => void;
  buttonTitle: string;
}

const CardMedium: React.FC<CardMediumProps> = ({
  usage,
  id,
  imageUrl,
  title,
  name,
  userType,
  createdBy,
  district,
  date,
  onAddToWishList,
  onPress,
  buttonTitle
}) => {

  const handleButtonPress = async () => {
    const userId = await getUserId();

    try {
      if (usage === "WISHLIST") {
        // Remove from wishlist or view wishlist details
        console.log("Wishlist button pressed for:", id);
        // TODO: call your remove or view wishlist API
        alert("Wishlist button clicked");
      } 
      else if (usage === "NEED") {
        const payload = {
          userId: userId,
          needCreatedBy: createdBy,
          needId: id,
        };
        const response = await createWishList(payload);
        console.log("Wishlist API Response:", response);
        alert("Wishlist created");
      } 
      else if (usage === "DONATION") {
        const payload = {
          userId: userId,
          donerCreatedBy: createdBy,
          donationId: id,
        };
        const response = await createDonationRequest(payload);
        console.log("Donation Request API Response:", response);
        alert("Donation Request Sent");
      }
    } catch (error) {
      console.error(`Error handling ${usage} creation :`, error);
    }
  };

  const handleRemoveWishlist = async () => {
    try {
      const response = await deleteWishlistById(id); 
      console.log("Removed wishlist:", response);
      alert("Wishlist item removed");
    } catch (err) {
      console.error("Error removing wishlist:", err);
    }
  };

  const handleOnNeed = () => {
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handleOnNeed}>
    
      <Image source={imageUrl} style={styles.image} resizeMode="cover" />

      <View style={styles.description}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.userType}>{userType}</Text>
      </View>

      <View style={[styles.details, usage === "WISHLIST" && styles.detailsRow]}>
      <Text style={styles.district}>{district}</Text>
      <Text style={styles.date}>{date}</Text>

  {usage === "WISHLIST" ? (
        <View style={styles.buttonRow}>
          <CustomButtonSmall
            title=" X "
            onPress={handleRemoveWishlist}
            buttonColor={COLORS.textgray}
          />
          <CustomButtonSmall
            title={buttonTitle}
            onPress={handleButtonPress}
            buttonColor={COLORS.buttonOdd}
          />
        </View>
      ) : (
        <CustomButtonSmall
          title={buttonTitle}
          onPress={handleButtonPress}
          buttonColor={COLORS.buttonOdd}
        />
      )}
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
    justifyContent: "flex-start",
    alignItems: "flex-end",
    height: 60,
    marginLeft: 10,
  },

  detailsRow: {
    alignItems: "flex-end",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 6, 
    marginTop: 5
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
