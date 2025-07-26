import React, { useState } from "react";
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

const Footer = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOnHome = () => {
    navigate("/home/home");
  };

  const handleOnAdd = () => {
    setShowOptions(true);
  };

  const handleOnNotification = () => {
    navigate(""); // Add correct route
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
      case "volunteer":
        navigate("/volunteer/register");
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

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleOptionSelect("volunteer")}
              >
                <Text style={styles.optionText}>Volunteer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZE.HorizontalPaddingMedium,
    paddingVertical: SIZE.VerticlePaddingMedium,
    backgroundColor: COLORS.bgDark,
  },
  icon: {
    color: COLORS.white,
    fontSize: SIZE.iconSize,
  },
  iconWrapper: {
    flex: 1,
    alignItems: "center",
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

export default Footer;
