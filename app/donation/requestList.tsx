import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";
import STYLES from "@/constants/common.style";
import CardMini from "@/assets/components/cardMini";
import Footer from "@/assets/components/footer"; 
import { getDonationByDonationId } from "@/services/donationService";
import { getDonationRequestByDonationId, getAllDonationRequestByDonationId } from "@/services/donationRequestService";
import CustomAlert from "@/constants/customAlert";
import { useLocalSearchParams, useRouter } from "expo-router";

function RequestList() {
  const router = useRouter();
  const { donationId } = useLocalSearchParams(); 
  const [donation, setDonation] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (donationId) {
      fetchDonationDetails(donationId as string);
      fetchRequests(donationId as string);
    }
  }, [donationId]);

  const fetchDonationDetails = async (id: string) => {
    try {
      const response = await getDonationByDonationId(id);
      if (!response) {
        showAlert("Not Found", "Donation details not found.");
      } else {
        setDonation(response.data);
      }
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to fetch donation details.");
    }
  };

  const fetchRequests = async (id: string) => {
    try {
      const response = await getAllDonationRequestByDonationId(id);
      setRequests(response.data);
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.buttonOther} />
      </View>
    );
  }

  const handleOnView = (userId: string, requestId: string) => {
    router.push({
      pathname: "/need/publicProfile",
      params: { userId, donationId, requestId }
    });
  };

  return (
    <View style={STYLES.container}>

      {donation && (
        <View style={styles.headerWrapper}>
          <View style={styles.headerAccent} />
          <View style={styles.headerBox}>
            <Image 
              source={donation.image} 
              style={styles.headerImage} 
              resizeMode="cover"
            />
            <View style={styles.headerRight}>
              <Text style={styles.title}>{donation.title}</Text>
              <Text style={styles.userType}>{donation.userType}</Text>
              <View style={styles.rowSpace}>
                <Text style={styles.district}>{donation.district.name}</Text>
                <Text style={styles.date}>{formatDateTime(donation.updatedAt)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <ScrollView style={styles.body}>
        {requests.map((req, index) => (
          <CardMini
            key={index}
            name={req.needyDetails.username}
            userType={req.needyDetails.userType}
            district={req.needyDetails.district}
            date={formatDateTime(req.donationRequestDetail.updatedAt)}
            onView={() => handleOnView(req.needyDetails.id, req.donationRequestDetail.id)}
          />
        ))}
      </ScrollView>

      <Footer />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: {
    margin: 12,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  headerAccent: {
    height: 6,
    backgroundColor: COLORS.buttonOther,
  },
  headerBox: {
    flexDirection: "row",
    padding: 14,
    backgroundColor: COLORS.bgDark,
    alignItems: "center",
  },
  headerImage: {
    width: 75,
    height: 75,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: COLORS.bgGray,
  },
  headerRight: {
    flex: 1,
  },
  title: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 4,
  },
  userType: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
    marginBottom: 6,
  },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  district: {
    fontSize: SIZE.small,
    color: COLORS.textHighlight,
    fontWeight: "600",
  },
  date: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default RequestList;
