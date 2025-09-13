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
        const payload = { userId, needCreatedBy: createdBy, needId: id };
        const response = await createWishList(payload);
        showAlert("Success", response.message || "Wishlist created successfully");
      } else if (usage === "DONATION") {
        const payload = { userId, donationCreatedBy: createdBy, donationId: id };
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

        <View style={styles.rightContent}>
  
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.name}>{name}</Text>

          <View style={styles.bottomRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.date}>{date}</Text>
              <Text style={styles.district}>{district}</Text>
            </View>

            <View style={styles.buttonContainer}>
              {usage === "WISHLIST" && (
                <CustomButtonSmall
                  title=" X "
                  onPress={handleRemoveWishlist}
                  buttonColor={COLORS.textgray}
                />
              )}
              <CustomButtonSmall
                title={buttonTitle}
                onPress={handleButtonPress}
                buttonColor={COLORS.buttonOdd}
              />
            </View>
          </View>
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
    borderRadius: 16,
    backgroundColor: COLORS.bgLight,
    marginVertical: 8,
    marginHorizontal: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    padding: 12,
    position: "relative",
    alignItems: "flex-start",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  rightContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: SIZE.small + 2,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  name: {
    fontSize: SIZE.mini + 1,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  infoLeft: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textPlaceHolder,
  },
  district: {
    fontSize: SIZE.mini,
    color: COLORS.textOption,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 6,
  },
});

export default CardMedium;
