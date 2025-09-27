import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { navigate } from "../../navigation/globalNavigation";
import { getUnreadNotificationCountByUserId } from "@/services/notificationService";
import { getUserId } from "@/constants/config";
import { useRouter } from "expo-router";

const Footer = () => {
  const router = useRouter();

  const [showOptions, setShowOptions] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadWishlist, setUnreadWishlist] = useState(0);
  const [unreadRequest, setUnreadRequest] = useState(0);
  const [userId, setUserId] = useState("");

  // Format notification count
  const formatCount = (count: number) => {
    if (count > 999) return "999+";
    if (count > 99) return "99+";
    return count.toString();
  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const id = await getUserId();
        setUserId(id);

        const response = await getUnreadNotificationCountByUserId(id);
        const totalUnread = response.data.totalCount;

        if (totalUnread > 0) {
          setNotificationCount(totalUnread);
          setUnreadWishlist(response.data.wishListCount);
          setUnreadRequest(response.data.requestCount);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

    fetchNotificationCount();
  }, []);

  const handleOnHome = () => {
    navigate("/home/home");
  };

  const handleOnAdd = () => {
    setShowOptions(true);
  };

  const handleOnNotification = () => {
    router.push({
      pathname: "/notification/notification",
      params: {
        wishListCount: unreadWishlist,
        donationCount: unreadRequest,
      },
    });
  };

  const handleOnProfile = () => {
    navigate("/profile/userProfile");
  };

  const handleOptionSelect = (option: string) => {
    setShowOptions(false);
    switch (option) {
      case "donation":
        navigate("/donation/addDonation");
        break;
      case "need":
        navigate("/need/addNeed");
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Footer Navigation */}
      <View style={styles.container}>
        <TouchableOpacity onPress={handleOnHome} style={styles.iconWrapper}>
          <MaterialIcons name="home" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOnAdd} style={styles.iconWrapper}>
          <Feather name="plus-circle" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOnNotification} style={styles.iconWrapper}>
          <Feather name="bell" style={styles.icon} />

          {notificationCount > 0 && (
            <View
              style={[
                styles.badge,
                notificationCount > 99 && styles.badgeLarge,
              ]}
            >
              <Text style={styles.badgeText}>{formatCount(notificationCount)}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOnProfile} style={styles.iconWrapper}>
          <Feather name="user" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Modal for Add Options */}
      <Modal transparent visible={showOptions} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect("donation")}
              >
                <Text style={styles.optionText}>Donation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect("need")}
              >
                <Text style={styles.optionText}>Need</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZE.HorizontalPaddingMedium,
    paddingVertical: SIZE.VerticlePaddingMedium,
    backgroundColor: COLORS.bgDark,
  },
  iconWrapper: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  icon: {
    color: COLORS.white,
    fontSize: SIZE.iconSize,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: 12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.textHighlight,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    //borderWidth: 1,
    //borderColor: COLORS.bgGray,
    shadowColor: '#ecececdd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  badgeLarge: {
    minWidth: 26,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: COLORS.bgLight,
    padding: 20,
    borderRadius: 16,
    flexDirection: "column",
    gap: 24,
    elevation: 5,
  },
  optionButton: {
    alignItems: "center",
  },
  optionText: {
    fontSize: SIZE.medium,
    color: COLORS.textgray,
    fontWeight: "600",
  },
});
