import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";

type HeaderProfileProps = {
  name: string;
  userType: string;
  onTabPress?: (tab: string) => void;
};

const TABS = ["Personal", "Donation", "Need"];

const HeaderProfile: React.FC<HeaderProfileProps> = ({ name, userType, onTabPress }) => {
  const [activeTab, setActiveTab] = useState("Personal");

  const bgColor = useMemo(() => {
    const colors = ["#219dadff", "#25b338ff", "#156ae1ff", "#e57327ff", "#15e3cfff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Circle */}
      <View style={[styles.circle, { backgroundColor: bgColor }]}>
        <Text style={styles.circleText}>{name.charAt(0).toUpperCase()}</Text>
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
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  circleText: {
    fontSize: SIZE.large,
    color: COLORS.white,
    fontWeight: "bold",
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
    borderRadius: SIZE.buttonRadiusSmall,
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
