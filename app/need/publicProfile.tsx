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

import COLORS from "@/constants/colors";
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

        setUser(userDetails);
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
      console.log("Rejected");
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <CustomButtonSmall
          title="Accept Request"
          onPress={() => handleOnAccept()}
          buttonColor={COLORS.buttonAccept}
        />
        <CustomButtonSmall
          title="Reject Request"
          onPress={handleOnReject}
          buttonColor={COLORS.buttonReject}
        />
      </View>

      {/* Tabs */}
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

      {/* Content */}
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
              imageUrl={item.images?.[0] || "https://via.placeholder.com/60"}
              onView={() => handleOnView(activeTab, item._id)}
            />
          ))
        )}
      </ScrollView>

      <Footer />

      {/* 🔹 CustomAlert */}
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
  container: { flex: 1, backgroundColor: COLORS.white },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: COLORS.bgDark,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.bgGray,
  },
  avatarText: {
    color: COLORS.bgDark,
    fontSize: SIZE.average,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 2,
  },
  userType: {
    fontSize: SIZE.small,
    color: COLORS.textLight,
  },
  districtContainer: {
    marginLeft: "auto",
  },
  district: {
    fontSize: SIZE.small,
    color: COLORS.textHighlight,
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgGray,
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
    padding: 15,
    flexGrow: 1,
    backgroundColor: COLORS.bgLight,
  },
});
