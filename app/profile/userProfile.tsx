import { View, StyleSheet, ScrollView, Text, Modal, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import COLORS from '../../constants/colors';
import Footer from '../../assets/components/footer';
import HeaderProfile from '../../assets/components/headerProfile';
import ProfileForm from '../../assets/components/forms/profileForm';
import CardSmall from '../../assets/components/cardSmall';
import { getUserId } from "../../constants/config";
import { getUserById } from "../../services/userService";
import { getNeedByCreatedBy, deleteNeed } from '@/services/needService';
import { getDonationByCreatedBy, deleteDonation } from '@/services/donationService';
import { useRouter } from "expo-router";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Personal");
  const [tabData, setTabData] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await getUserId();
        const response = await getUserById(userId);
        setUser(response);
      } catch (err: any) {
        console.error(err);
        alert(err?.message || "Failed to load user");
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
          response = res.data || [];
        } else if (activeTab === "Need") {
          const res = await getNeedByCreatedBy(user.id);
          response = res.data || [];
        } else {
          response = [];
        }
        setTabData(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error(err);
        setTabData([]);
      }
    };

    fetchTabData();
  }, [activeTab, user]);

  const handleDeletePress = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      let response;
      if (itemToDelete.type === "Need") response = await deleteNeed(itemToDelete.id);
      else if (itemToDelete.type === "Donation") response = await deleteDonation(itemToDelete.id);

      if (response?.deletedCount === 1 || response?.success) {
        setTabData(prev => prev.filter(item => item._id !== itemToDelete.id));
        alert(`${itemToDelete.type} deleted successfully!`);
      } else {
        alert(`Failed to delete ${itemToDelete.type}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || `Failed to delete ${itemToDelete.type}`);
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleOnView = (active: string, id: string) => {
    if (active === "Need") router.push(`/need/needProfile?id=${id}`);
    else if (active === "Donation") router.push(`/donation/donationProfile?id=${id}`);
  };

  const handleOnEdit = (active: string, id: string) => {
  if (active === "Need") {
    router.push(`/need/addNeed?needId=${id}`);
  } else if (active === "Donation") {
    router.push(`/donation/addDonation?donationId=${id}`);
  }
  };


  if (!user) return null;

  return (
    <View style={styles.container}>
      <HeaderProfile
        name={user.username}
        userType={user.userType}
        onTabPress={(tab) => setActiveTab(tab)}
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
            imageUrl={item.images?.[0] || "https://via.placeholder.com/60"}
            onView={() => handleOnView(activeTab, item._id)}
            onEdit={() => handleOnEdit(activeTab, item._id)}
            onDelete={() => handleDeletePress(activeTab, item._id)}
          />
        ))}
      </ScrollView>

      <Footer />

      {/* Custom Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text>Are you sure you want to delete this item?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
                <Text style={{color: COLORS.textDark}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                <Text style={{color: COLORS.white}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  body: { 
    flexGrow: 1, 
    padding: 10 
  },
  modalOverlay: { 
    flex:1, 
    backgroundColor:'rgba(0,0,0,0.5)', 
    justifyContent:'center', 
    alignItems:'center' 
  },
  modalBox: { 
    width:300, 
    padding:20, 
    backgroundColor: COLORS.white, 
    borderRadius:10 },
  modalTitle: { 
    fontSize:18, 
    fontWeight:'bold', 
    marginBottom:10 },
  modalButtons: { 
    flexDirection:'row', 
    justifyContent:'flex-end', 
    marginTop:20, 
    gap:10 },
  cancelButton: { 
    paddingVertical:8, 
    paddingHorizontal:15, 
    borderWidth:1, 
    borderColor:COLORS.bgGray, 
    borderRadius:5 },
  deleteButton: { 
    paddingVertical:8, 
    paddingHorizontal:15, 
    backgroundColor:COLORS.buttonReject, 
    borderRadius:5 },
});
