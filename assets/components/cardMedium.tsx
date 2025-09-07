import React, { useState } from "react";
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
import {
  createWishList,
  deleteWishlistById,
} from "@/services/wishlistService";
import { createDonationRequest } from "@/services/donationRequestService";
import CustomAlert from "@/constants/customAlert";

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
  onPress,
  buttonTitle,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirm, setAlertConfirm] = useState<(() => void) | undefined>(undefined);

  const showAlert = (
    title: string,
    message: string,
    confirmAction?: () => void
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertConfirm(() => confirmAction); 
    setAlertVisible(true);
  };

  const handleButtonPress = async () => {
    const userId = await getUserId();

    try {
      if (usage === "WISHLIST") {
        showAlert("Wishlist", "Wishlist button clicked");
      } else if (usage === "NEED") {
        const payload = {
          userId: userId,
          needCreatedBy: createdBy,
          needId: id,
        };
        const response = await createWishList(payload);
        showAlert("Success", response.message || "Wishlist created successfully");
      } else if (usage === "DONATION") {
        const payload = {
          userId: userId,
          donationCreatedBy: createdBy,
          donationId: id,
        };
        const response = await createDonationRequest(payload);
        showAlert("Success", response.message || "Donation Request Sent");
      }
    } catch (error: any) {
      showAlert("Error", error?.message || "Something went wrong, Please try again.");
    }
  };

  const handleRemoveWishlist = async () => {
    try {
      const response = await deleteWishlistById(id);
      showAlert("Removed", response.message || "Wishlist Item Removed Successfully");
    } catch (error: any) {
      showAlert("Error", error?.message || "Failed to remove wishlist");
    }
  };

  const handleOnNeed = () => {
    if (onPress) onPress();
  };

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={handleOnNeed}
      >
        <Image source={imageUrl} style={styles.image} resizeMode="cover" />

        <View style={styles.description}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.userType}>{userType}</Text>
        </View>

        <View
          style={[styles.details, usage === "WISHLIST" && styles.detailsRow]}
        >
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

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfirm}
      />
    </>
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
    borderColor: COLORS.bgGray,
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
    marginTop: 5,
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
