import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SIZE from "@/constants/size";
import COLORS from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";

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
      <LinearGradient
        colors={["#3a506b", COLORS.bgDark, "#1a1a1a"]} 
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.containerGradient}
      >

        <View
          style={[
            styles.circle,
            {
              backgroundColor: bgColor,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 4 },
            },
          ]}
        >
          <Text style={styles.circleText}>{name.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.userType}>{userType}</Text>

        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab ? COLORS.buttonOther : "rgba(255,255,255,0.15)",
                },
              ]}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
  },
  containerGradient: {
    width: "100%",
    alignItems: "center",
    paddingVertical: SIZE.VerticlePaddingMedium + 4,
     borderRadius: 10
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  circleText: {
    fontSize: SIZE.large,
    color: COLORS.white,
    fontWeight: "bold",
  },
  name: {
    fontSize: SIZE.medium + 2,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 4,
  },
  userType: {
    fontSize: SIZE.small,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 18,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    paddingVertical: 4,
    borderRadius: 20,
  },
  tab: {
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall + 6,
    borderRadius: 16,
  },
  tabText: {
    fontSize: SIZE.small - 1,
    color: COLORS.white,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "700",
  },
});

export default HeaderProfile;
