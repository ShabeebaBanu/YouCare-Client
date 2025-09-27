import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import SIZE from "@/constants/size";
import CustomButtonSmall from "@/assets/components/customButtonSmall";
import Footer from "@/assets/components/footer";

import { getDonationRequestDetailsByDonationRequestId, confirmDonation } from "@/services/donationRequestService";
import { getApproveNeedDetailsByNeedId, createApproveNeed } from "@/services/approveNeedService";
import CustomAlert from "@/constants/customAlert";

const Confirmation: React.FC = () => {
  const router = useRouter();
  const { donationRequestId } = useLocalSearchParams();
  const { needId } = useLocalSearchParams();
  const { userId } = useLocalSearchParams();
  const [donor, setDonor] = useState<any>(null);
  const [beneficiary, setBeneficiary] = useState<any>(null);
  const [donation, setDonation] = useState<any>(null);
  const [donationRequest, setDonationRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      let response: any;

      if (donationRequestId) {
        response = await getDonationRequestDetailsByDonationRequestId(donationRequestId);
        setDonationRequest(response.data.donationRequestDetail);
      } else if (needId && userId) {
        response = await getApproveNeedDetailsByNeedId(needId, userId);
      }

      if (!response?.data) {
        showAlert("Not Found", "No donation requests found.");
        return;
      }

      const firstRequest = response.data;
      setDonation(firstRequest.donationDetail);
      setDonor(firstRequest.donorDetails);
      setBeneficiary(firstRequest.needyDetails);

    } catch (error: any) {
      showAlert("Error", error.message || "Failed to fetch confirmation data.");
    } finally {
      setLoading(false);
    }
  };

  if (donationRequestId || needId) fetchData();
}, [donationRequestId, needId]);

const handleConfirm = async () => {
  try {
    if (donationRequestId) {
      if (!donationRequest?.id) {
        showAlert("Error", "No donation request available to confirm.");
        return;
      }
   
      await confirmDonation(donationRequest.id);
      showAlert("Success", "Donation request confirmed successfully!");
    } 
    else if (needId && userId) {
      await createApproveNeed({
        needId: needId,
        userId: userId
      });   
      showAlert("Success", "Need Approved successfully!");
    } 
    else {
      showAlert("Error", "No valid confirmation data found.");
      return;
    }

    setTimeout(() => {
      router.push("/home/home");
    }, 1000);
  } catch (error: any) {
    showAlert("Error", error?.message || "Failed to confirm donation");
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.bgDark} />
      </View>
    );
  }

  return (
  <View style={STYLES.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.reportBox}>
        <Text style={styles.pageTitle}>Donation Confirmation</Text>
        <Text style={styles.subTitle}>
          Please review the details below before confirming.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Donor Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{donor?.username || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{donor?.phone || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Province</Text>
            <Text style={styles.value}>{donor?.province || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>District</Text>
            <Text style={styles.value}>{donor?.district || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Beneficiary Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{beneficiary?.username || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{beneficiary?.phone || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>District</Text>
            <Text style={styles.value}>{beneficiary?.district || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Donation Item</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Item</Text>
            <Text style={styles.value}>{donation?.item || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>{donation?.quantity || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{donation?.category || "N/A"}</Text>
          </View>
        </View>

        <CustomButtonSmall
          title="Confirm Donation Request"
          onPress={handleConfirm}
          buttonColor={COLORS.bgDark}
        />
      </View>
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
};

export default Confirmation;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reportBox: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.textPlaceHolder,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, 
  },
  pageTitle: {
    fontSize: SIZE.medium,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: COLORS.textDark,
    textTransform: "uppercase",
  },
  subTitle: {
    fontSize: SIZE.small,
    textAlign: "center",
    color: COLORS.textgray,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textPlaceHolder,
    paddingBottom: 12,
  },
  sectionHeader: {
    fontSize: SIZE.small,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgDark,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: SIZE.mini,
    color: COLORS.textgray,
    fontWeight: "500",
  },
  value: {
    flex: 1,
    fontSize: SIZE.mini,
    color: COLORS.textDark,
    fontWeight: "600",
    textAlign: "right",
  },
});
