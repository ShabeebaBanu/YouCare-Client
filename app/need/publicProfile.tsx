import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import SIZE from "@/constants/size";
import CardPublic from "@/assets/components/cardPublic";
import Footer from "@/assets/components/footer";

import { getUserById } from "@/services/userService";
import { getNeedByCreatedBy } from "@/services/needService";
import { getDonationByCreatedBy } from "@/services/donationService";
import CustomButtonSmall from "@/assets/components/customButtonSmall";
import CustomAlert from "@/constants/customAlert";

const PublicProfile: React.FC = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { donationId } = useLocalSearchParams();

  const [user, setUser] = useState<any>(null);
  const [needs, setNeeds] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Need" | "Donation">("Need");
  const [loading, setLoading] = useState(true);

  //  Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirm, setAlertConfirm] = useState<(() => void) | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userDetails = await getUserById(userId);
        const userNeeds = await getNeedByCreatedBy(userId);
        const userDonations = await getDonationByCreatedBy(userId);

        setUser(userDetails.data);
        setNeeds(Array.isArray(userNeeds.data) ? userNeeds.data : []);
        setDonations(Array.isArray(userDonations.data) ? userDonations.data : []);
      } catch (error: any) {
        setAlertTitle("Error");
        setAlertMessage(error?.message || "Failed to fetch profile data. Please try again.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleOnAccept = () => {
    const donationIdStr = Array.isArray(donationId)
      ? donationId[0]
      : donationId ?? "";
    router.push(`/donation/confirmation?donationId=${donationIdStr}`);
  };

  const handleOnReject = () => {
    setAlertTitle("Reject Request");
    setAlertMessage("Are you sure you want to reject this request?");
    setAlertConfirm(() => () => {
    setAlertVisible(false);
    });
    setAlertVisible(true);
  };

  const handleOnView = (active: string, id: string) => {
    if (active === "Need") router.push(`/need/needProfile?id=${id}`);
    else if (active === "Donation") router.push(`/donation/donationProfile?id=${id}`);
  };

  const selectedData = activeTab === "Need" ? needs : donations;
  const tabData = Array.isArray(selectedData) ? selectedData : [];

  return (
    <View style={STYLES.container}>
    <View style={styles.header}>
      <LinearGradient
        colors={[COLORS.bgDark, "#3a506b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </Text>
        </View>

        <View style={styles.userInfo}>
          {user?.userType?.toLowerCase() === "organization" ? (
            <>
              <Text style={styles.name}>{user?.organizationName || ""}</Text>
              <Text style={styles.userType}>{user?.userType || ""}</Text>
              <Text style={styles.userType}>{user?.organizationAddress || ""}</Text>
            </>
          ) : (
            <>
              <Text style={styles.name}>{user?.username || ""}</Text>
              <Text style={styles.userType}>{user?.userType || ""}</Text>
            </>
          )}
        </View>

        {user?.userType?.toLowerCase() !== "organization" && (
          <View style={styles.districtContainer}>
            <Text style={styles.district}>{user?.district || ""}</Text>
          </View>
        )}
      </LinearGradient>
      </View>


      <View style={styles.actionButtons}>
        <CustomButtonSmall
          title="Accept Request"
          onPress={() => handleOnAccept()}
          buttonColor={COLORS.buttonOther}
        />
        <CustomButtonSmall
          title="Reject Request"
          onPress={handleOnReject}
          buttonColor={COLORS.buttonReject}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Need" && styles.activeTab]}
          onPress={() => setActiveTab("Need")}
        >
          <Text
            style={[styles.tabText, activeTab === "Need" && styles.activeTabText]}
          >
            Needs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Donation" && styles.activeTab]}
          onPress={() => setActiveTab("Donation")}
        >
          <Text
            style={[styles.tabText, activeTab === "Donation" && styles.activeTabText]}
          >
            Donations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.textLight} />
        ) : tabData.length === 0 ? (
          <Text style={{ textAlign: "center", color: COLORS.textPlaceHolder }}>
            No {activeTab} records found
          </Text>
        ) : (
          tabData.map((item) => (
            <CardPublic
              key={item._id}
              title={item.title}
              updatedAt={
                item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""
              }
              status={item.status}
              imageUrl={item.image}
              onView={() => handleOnView(activeTab, item._id)}
            />
          ))
        )}
      </ScrollView>

      <Footer />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfirm}
        confirmText={alertConfirm ? "Yes" : "OK"}
        cancelText={alertConfirm ? "No" : undefined}
      />
    </View>
  );
};

export default PublicProfile;

const styles = StyleSheet.create({
  header: {
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
  overflow: "hidden", 
  elevation: 3,
  },
  headerGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarText: {
    color: COLORS.bgDark,
    fontSize: SIZE.large,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1, 
    justifyContent: "center",
  },
  name: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  userType: {
    fontSize: SIZE.small,
    color: "rgba(255,255,255,0.85)",
  },
  districtContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 10, 
    alignSelf: "flex-start", 
  },
  district: {
    fontSize: SIZE.small,
    color: COLORS.white,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 14,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgGray,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 15,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.bgDark,
  },
  tabText: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
  },
  activeTabText: {
    color: COLORS.bgDark,
    fontWeight: "bold",
  },
  body: {
    padding: 18,
    flexGrow: 1,
    backgroundColor: COLORS.bgLight,
  },
});
