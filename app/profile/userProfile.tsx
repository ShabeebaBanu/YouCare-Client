import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useState, useEffect } from 'react';
import COLORS from '../../constants/colors';
import STYLES from '@/constants/common.style';
import Footer from '../../assets/components/footer';
import HeaderProfile from '../../assets/components/headerProfile';
import ProfileForm from '../../assets/components/forms/profileForm';
import CardSmall from '../../assets/components/cardSmall';
import { getUserId, clearAccessToken } from "../../constants/config";
import { getUserById } from "../../services/userService";
import { getNeedByCreatedBy, deleteNeed } from '@/services/needService';
import { getDonationByCreatedBy, deleteDonation } from '@/services/donationService';
import { useRouter } from "expo-router";
import CustomAlert from "../../constants/customAlert";  

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Personal");
  const [tabData, setTabData] = useState<any[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirmAction, setAlertConfirmAction] = useState<(() => void) | undefined>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await getUserId();
        const response = await getUserById(userId);
        setUser(response.data);
      } catch (error: any) {
        setAlertTitle("Error");
        setAlertMessage(error?.message || "Failed to load user");
        setAlertVisible(true);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user || activeTab === "Personal") return;

    const fetchTabData = async () => {
      try {
        let response: any = [];
        if (activeTab === "Donation") {
          const res = await getDonationByCreatedBy(user.id);
          response = res.data;
        } else if (activeTab === "Need") {
          const res = await getNeedByCreatedBy(user.id);
          response = res.data;
        } else {
          response = [];
        }
        setTabData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error(error);
        setTabData([]);
      }
    };

    fetchTabData();
  }, [activeTab, user]);

  const handleDeletePress = (type: string, id: string) => {
    setAlertTitle("Confirm Delete");
    setAlertMessage(`Are you sure you want to delete this ${type}?`);
    setAlertConfirmAction(() => () => confirmDelete(type, id));
    setAlertVisible(true);
  };

  const confirmDelete = async (type: string, id: string) => {
    try {
      let response;
      if (type === "Need") response = await deleteNeed(id);
      else if (type === "Donation") response = await deleteDonation(id);

      if (response?.deletedCount === 1 || response?.success) {
        setTabData(prev => prev.filter(item => item._id !== id));
        setAlertTitle("Success");
        setAlertMessage(`${type} deleted successfully!`);
        setAlertConfirmAction(undefined);
      } else {
        setAlertTitle("Failed");
        setAlertMessage(`Failed to delete ${type}`);
        setAlertConfirmAction(undefined);
      }
    } catch (error: any) {
      setAlertTitle("Error");
      setAlertMessage(error?.message || `Failed to delete ${type}`);
      setAlertConfirmAction(undefined);
    } finally {
      setAlertVisible(true);
    }
  };

  const handleOnView = (active: string, id: string) => {
    if (active === "Need") router.push(`/need/needProfile?id=${id}`);
    else if (active === "Donation") router.push(`/donation/donationProfile?id=${id}`);
  };

  const handleOnViewCompletedDonationDetail = (id: string, type: string) => {
   router.push(`/profile/completeDetail?id=${id}&type=${type}`);
  };

  const handleOnViewCompletedNeedDetail = (id: string, type: string) => {
   router.push(`/profile/completeDetail?id=${id}&type=${type}`);
  };

  const handleOnEdit = (active: string, id: string) => {
    if (active === "Need") {
      router.push(`/need/addNeed?needId=${id}`);
    } else if (active === "Donation") {
      router.push(`/donation/addDonation?donationId=${id}`);
    }
  };

  const handleOnRequests = (id: string) => {
    router.push(`/donation/requestList?donationId=${id}`);
  };

  const handleOnLogout = async () => {
    await clearAccessToken();
    router.push("/auth/login");
  };

  if (!user) return null;

  return (
    <View style={STYLES.container}>
      <HeaderProfile
        name={user.username}
        userType={user.userType}
        onTabPress={(tab) => setActiveTab(tab)}
        onLogout={handleOnLogout}
      />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {activeTab === "Personal" && <ProfileForm initialData={user} />}

        {activeTab !== "Personal" && tabData.length === 0 && (
          <Text style={{ textAlign: "center", color: COLORS.textPlaceHolder }}>
            No {activeTab} records found
          </Text>
        )}

        {activeTab !== "Personal" && tabData.map(item => (
          <CardSmall
            key={item._id}
            title={item.title}
            updatedAt={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
            status={item.status}
            imageUrl={item.image}
            onView={() => handleOnView(activeTab, item._id)}
            onEdit={() => handleOnEdit(activeTab, item._id)}
            onDelete={() => handleDeletePress(activeTab, item._id)}
            activeTab={activeTab}
            onRequests={() => handleOnRequests(item._id)}
            onViewDonationDetails={() => handleOnViewCompletedDonationDetail(item._id, "Donation")}
            onViewNeedDetails={() => handleOnViewCompletedNeedDetail(item._id, "Need")}
          />
        ))}
      </ScrollView>

      <Footer />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfirmAction}
        confirmText={alertConfirmAction ? "Yes" : "OK"}
        cancelText="No"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { 
    flexGrow: 1, 
    padding: 10 
  },
});
