import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import SIZE from "@/constants/size";
import CustomButtonSmall from "@/assets/components/customButtonSmall";
import Footer from "@/assets/components/footer";

import { getDonationRequestByDonationId, confirmDonation } from "@/services/donationRequestService";
import CustomAlert from "@/constants/customAlert";

const Confirmation: React.FC = () => {
  const router = useRouter();
  const { donationId } = useLocalSearchParams();
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
        const response = await getDonationRequestByDonationId(donationId);
        if (!response?.data || response.data.length === 0) {
          showAlert("Not Found", "No donation requests found for this donation.");
          return;
        }
        const firstRequest = response.data[0];
        setDonation(firstRequest.donationDetail);
        setDonor(firstRequest.donorDetails);
        setBeneficiary(firstRequest.needyDetails);
        setDonationRequest(firstRequest.donationRequestDetail);
      } catch (error: any) {
        showAlert("Error", error.message || "Failed to fetch confirmation data.");
      } finally {
        setLoading(false);
      }
    };

    if (donationId) fetchData();
  }, [donationId]);

  const handleConfirm = async () => {
    try {
      if (!donationRequest?.id) {
        showAlert("Error", "No donation request available to confirm.");
        return;
      }
      await confirmDonation(donationRequest.id);
      showAlert("Success", "Donation confirmed successfully!");
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
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: SIZE.average,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: COLORS.textDark,
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
    borderBottomColor: COLORS.textgray,
    paddingBottom: 12,
  },
  sectionHeader: {
    fontSize: SIZE.medium,
    fontWeight: "600",
    marginBottom: 8,
    paddingVertical: 4,
    color: COLORS.textDark,
    backgroundColor: COLORS.bgLight,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: SIZE.small,
    color: COLORS.textgray,
  },
  value: {
    fontSize: SIZE.small,
    fontWeight: "500",
    color: COLORS.textDark,
  },
});
