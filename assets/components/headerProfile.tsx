import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

// Update these paths based on your project structure
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";

type HeaderProfileProps = {
  name: string;
  userType: string;
  onTabPress?: (tab: string) => void;
};

const TABS = ["Personal", "Donation", "Need", "Volunteer"];

const HeaderProfile: React.FC<HeaderProfileProps> = ({ name, userType, onTabPress }) => {
  const [activeTab, setActiveTab] = useState("Personal");

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/LogoLight.png")} 
          style={styles.profileImage}
        />
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.userType}>{userType}</Text>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: SIZE.VerticlePaddingMedium,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.bgDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderSub,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  name: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 4,
  },
  userType: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: COLORS.white,
    padding: 2,
  },
  tab: {
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.buttonOther,
    borderRadius: SIZE.buttonRadiusSmall
  },
  tabText: {
    fontSize: SIZE.small,
    color: COLORS.textDark,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});


export default HeaderProfile;
