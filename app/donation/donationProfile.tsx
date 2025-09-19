import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import COLORS from "../../constants/colors";
import STYLES from "@/constants/common.style";
import Footer from "../../assets/components/footer";
import DonationDetail from "@/assets/components/donationDetail";
import { useLocalSearchParams } from "expo-router";
import { getDonationByDonationId, Donation } from "../../services/donationService";
import { useEffect, useState } from "react";
import CustomAlert from "@/constants/customAlert";

export default function DonationProfile() {
  const { id } = useLocalSearchParams();
  const [donation, setDonation] = useState<Donation | null>(null);
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
    const fetchDonation = async () => {
      try {
        const response = await getDonationByDonationId(id as string);
        if (!response.data) {
          showAlert("Not Found", "Donation not found.");
        } else {
          setDonation(response.data);
        }
      } catch (error: any) {
        showAlert("Error", error.message || "Failed to fetch Donation details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDonation();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.bgblue} />
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.center}>
        <Text style={STYLES.emptyMessage}>No donation details to display.</Text>
      </View>
    );
  }

  return (
    <View style={STYLES.container}>
      <DonationDetail
        key={donation._id}
        title={donation.title}
        name={donation.donerName ?? ""}
        type={donation.userType ?? ""}
        address={donation.pickupAddress ?? ""}
        phone={donation.donerPhone ?? ""}
        description={donation.description ?? ""}
        quantity={donation.quantity ?? 0}
        image={donation.image ?? ""}
      />
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
  body: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
});
