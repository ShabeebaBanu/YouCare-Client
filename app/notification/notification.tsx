import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import COLORS from '@/constants/colors';
import STYLES from '@/constants/common.style';
import Footer from '@/assets/components/footer';
import dayjs from "dayjs";
import CardMedium from '@/assets/components/cardMedium'; 
import SendRequestCard from '@/assets/components/sendRequestCard';
import ReceiveRequestCard from '@/assets/components/receiveRequestCard';
import { getWishlistByUserId } from '../../services/wishlistService';
import { getAllDonationRequestForAUser } from '../../services/donationRequestService'
import { getUserId } from '@/constants/config';
import { useRouter } from "expo-router";
import CustomAlert from '@/constants/customAlert';  

function Notification() {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<'Wishlist' | 'Donation-Request' | 'Volunteer'>('Wishlist');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Alert");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirm, setAlertConfirm] = useState<(() => void) | undefined>(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const id = await getUserId(); 
        setUserId(id);
        fetchData(selectedTab, id);
      } catch (error: any) {
        showAlert("Error", error?.message || "Failed to fetch user ID");
      }
    };

    init();
  }, [selectedTab]);

  const fetchData = async (tab: 'Wishlist' | 'Donation-Request' | 'Volunteer', id: string) => {
    setLoading(true);
    try {
      let res: any;
      if (tab === 'Wishlist') {
        res = await getWishlistByUserId(id);
      } else if (tab === 'Donation-Request') {
        res = await getAllDonationRequestForAUser(id);
      } else {
        // Future Volunteer API
      }
      setData(res.data);
    } catch (error: any) {
      showAlert("Error", error?.message || "Failed to fetch data. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOnNeedSelect = (needId: string) => {
    router.push(`/need/needProfile?id=${needId}`);
  }; 

  const handleOnReceiveRequestSelect = (userId: string, donationId: string) => {
    router.push({
      pathname: "/need/publicProfile",
      params: { userId, donationId }
    });
  }; 

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertConfirm(() => onConfirm); 
    setAlertVisible(true);
  };

  return (
    <View style={STYLES.container}>
     
      <View style={styles.tabContainer}>
        {['Wishlist', 'Donation-Request', 'Volunteer'].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
              index !== 0 && { borderLeftWidth: 0}
            ]}
            onPress={() => setSelectedTab(tab as any)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.body}>
        {loading ? (
          <Text>Loading...</Text>
        ) : selectedTab === 'Wishlist' ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CardMedium
                key={item._id}
                usage='WISHLIST'
                id={item._id}
                imageUrl={item.imageUrl}
                title={item.needId?.title}
                name={item.needId?.needyName ?? 'Unknown'}
                userType="Individual"
                createdBy={item.createdBy}
                district={item.needId?.district.name ?? ''}
                date={item.needId?.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                onPress={() => handleOnNeedSelect(item.needId._id)}
                buttonTitle='DONATE'
              />
            )}
            ListEmptyComponent={<Text>No data found</Text>}
          />
        ) : selectedTab === 'Donation-Request' ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) =>
              item.userId === userId ? (
                <SendRequestCard
                  title={item.donationId?.title ?? " "}
                  name={item.donationId?.donerName ?? "Unknown"}
                  date={dayjs(item.createdAt).format("MMMM D, YYYY h:mm A")}
                  onPress={() => showAlert("Info", "You sent this request")}
                />
              ) : (
                <ReceiveRequestCard
                  title={item.donationId?.title ?? " "}
                  name={item.name}
                  date={dayjs(item.createdAt).format("MMMM D, YYYY h:mm A")}
                  onPress={() => handleOnReceiveRequestSelect(item.userId, item.donationId._id)}
                />
              )
            }
            ListEmptyComponent={<Text>No data found</Text>}
          />
        ) : (
          <FlatList
            data={[
              {
                _id: "1",
                title: "Clothes Donation",
                name: "John Doe",
                district: "Colombo",
                date: "2025-08-10 14:30",
                imageUrl: "https://via.placeholder.com/60"
              },
              {
                _id: "2",
                title: "Food Packets",
                name: "Jane Smith",
                district: "Kandy",
                date: "2025-08-09 09:15",
                imageUrl: "https://via.placeholder.com/60"
              }
            ]}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ReceiveRequestCard
                title={item.title}
                name={item.name}
                date={item.date}
                onPress={() => showAlert("Volunteer", `You selected: ${item.title}`)}
              />
            )}
            ListEmptyComponent={<Text>No data found</Text>}
          />
        )}
      </View>

      <Footer />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfirm}
        confirmText="OK"
        cancelText="Cancel"
      />
    </View>
  );
}

export default Notification;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    overflow: 'hidden', 
    shadowColor: COLORS.bgDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tab: {
    flex: 1, 
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.bgDark,
  },
  tabText: {
    color: COLORS.bgDark,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    padding: 10,
  },
});
