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
import { getAllDonationRequestForAUser, deleteDonationRequest } from '../../services/donationRequestService';
import { getUserId } from '@/constants/config';
import { useRouter, useLocalSearchParams } from "expo-router";  
import { getAllApproveNeedForAUser } from '@/services/approveNeedService';
import CustomAlert from '@/constants/customAlert';  
import { 
  updateUnreadRequestAsRead,
  updateUnreadWishlistAsRead,
  getUnreadNotificationCountByUserId,
  getDonationRequestAndNeedApprovalForAUser
} from '@/services/notificationService';
import SIZE from '@/constants/size';

function Notification() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const rawWishListCount = parseInt(params.wishListCount as string, 10) || 0;
  const rawDonationCount = parseInt(params.donationCount as string, 10) || 0;

  const [wishListCount, setWishListCount] = useState(rawWishListCount);
  const [donationCount, setDonationCount] = useState(rawDonationCount);

  const [selectedTab, setSelectedTab] = useState<'Wishlist' | 'Donation-Request' | 'Need-Approval' | 'Activity'>('Wishlist');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("Alert");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertConfirm, setAlertConfirm] = useState<(() => void) | undefined>(undefined);

  // Format numbers
  const formatCount = (count: number) => {
    if (count > 999) return '999+';
    if (count > 99) return '99+';
    return count.toString();
  };

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

  const fetchData = async (tab: 'Wishlist' | 'Donation-Request' | 'Need-Approval' | 'Activity', id: string) => {
    setLoading(true);
    try {
      let res: any;

      if (tab === 'Wishlist') {
        res = await getWishlistByUserId(id);
        if (wishListCount > 0) {
           await updateUnreadWishlistAsRead(id);
           const response = await getUnreadNotificationCountByUserId(id);
           setWishListCount(response.data.wishListCount || 0);
        }
      } else if (tab === 'Donation-Request') {
        res = await getAllDonationRequestForAUser(id);
        if (donationCount > 0) {
            await updateUnreadRequestAsRead(id);
            const response = await getUnreadNotificationCountByUserId(id);
            setDonationCount(response.data.requestCount || 0);
        }
      } else if (tab === 'Need-Approval') {
        res = await getAllApproveNeedForAUser(id);
      } else if (tab === 'Activity') {
        res = await getDonationRequestAndNeedApprovalForAUser(id);
      } else {
        res = [];
      }

      setData(res?.data || []);
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
  
  const handleCancelRequest = async (sendRequestId: string) => {
    try {
      const response = await deleteDonationRequest(sendRequestId);
      showAlert("Success", response.message);
    } catch (error: any) {
      showAlert("Error", error?.message || "Failed to cancel request.");
    } finally {
      fetchData("Donation-Request", userId);
    }
  };

  const handleOnReceiveRequestSelect = (userId: string, donationId: string, requestId: string, requestType: string) => {
    router.push({
      pathname: "/need/publicProfile",
      params: { userId, donationId, requestId, requestType }
    });
  }; 

  const handleActivityPress = async (postId: string, postType: string) => {
    try {
      router.push(`/profile/completeDetail?id=${postId}&type=${postType}`);
    } catch (error: any) {
      console.error("Error fetching activity details:", error.message);
    }
  };


  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertConfirm(() => onConfirm); 
    setAlertVisible(true);
  };

  const ActivityCard = ({ item }: { item: any }) => {
    let label = "";
    let isSent = false;

    if (item.createdBy === userId) {
      isSent = true;
      label = item.postType === "Donation" ? "Donation Sent" : "Need Sent";
    } else if (item.userId === userId) {
      isSent = false;
      label = item.postType === "Donation" ? "Donation Received" : "Need Received";
    }

    return (
      <TouchableOpacity
        style={[
          styles.activityCard,
          isSent ? styles.sentActivityCard : styles.receivedActivityCard,
        ]}
        onPress={() => handleActivityPress(item.postId, item.postType)}
      >
        <View style={styles.activityContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityTitle}>{item.title ?? "Untitled"}</Text>
            <Text style={styles.activityLabel}>{label}</Text>
          </View>
          <Text style={styles.activityDate}>
            {dayjs(item.updatedAt).format("MMMM D, YYYY h:mm A")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={STYLES.container}>
 
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "Wishlist" && styles.activeTab]}
          onPress={() => setSelectedTab("Wishlist")}
        >
          <Text style={[styles.tabText, selectedTab === "Wishlist" && styles.activeTabText]}>
            Wishlist
          </Text>
          {wishListCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{formatCount(wishListCount)}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Donation-Request" && styles.activeTab]}
          onPress={() => setSelectedTab("Donation-Request")}
        >
          <Text style={[styles.tabText, selectedTab === "Donation-Request" && styles.activeTabText]}>
            Donation{"\n"}Request
          </Text>
          {donationCount > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{formatCount(donationCount)}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Need-Approval" && styles.activeTab]}
          onPress={() => setSelectedTab("Need-Approval")}
        >
          <Text style={[styles.tabText, selectedTab === "Need-Approval" && styles.activeTabText]}>
            Need{"\n"}Approval
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === "Activity" && styles.activeTab]}
          onPress={() => setSelectedTab("Activity")}
        >
          <Text style={[styles.tabText, selectedTab === "Activity" && styles.activeTabText]}>
            Activity
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab body */}
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
                imageUrl={item.needId?.image}
                title={item.needId?.title}
                name={item.needId?.needyName ?? 'Unknown'}
                userType="Individual"
                createdBy={item.createdBy}
                district={item.needId?.district.name ?? ''}
                date={item.needId?.createdAt ? new Date(item.needId.createdAt).toLocaleDateString() : ''}
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
                  date={dayjs(item.updatedAt).format("MMMM D, YYYY h:mm A")}
                  onPress={() => showAlert("Info", "You sent this request")}
                  onCancel={() => handleCancelRequest(item._id)}
                  status={item?.status ?? ""}
                  requestType='Donation'
                />
              ) : (
                <ReceiveRequestCard
                  title={item.donationId?.title ?? " "}
                  name={item.name}
                  imageUrl={item.donationId?.image ?? ""}
                  date={dayjs(item.updatedAt).format("MMMM D, YYYY h:mm A")}
                  onPress={() => handleOnReceiveRequestSelect(item.userId, item.donationId._id, item._id, "Donation")}
                  status={item.status}
                  requestType='Donation'
                />
              )
            }
            ListEmptyComponent={<Text>No data found</Text>}
          />
        ) : selectedTab === 'Need-Approval' ? (
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) =>
              item.userId === userId ? (
                <SendRequestCard
                  title={item.needId?.title ?? " "}
                  name={item.needId?.needyName ?? "Unknown"}
                  date={dayjs(item.updatedAt).format("MMMM D, YYYY h:mm A")}
                  onPress={() => showAlert("Info", "You Approved this Need")}
                  onCancel={() => handleCancelRequest(item._id)} 
                  status={item?.status ?? ""}
                  requestType='Need'
                />
              ) : (
                <ReceiveRequestCard
                  title={item.needId?.title ?? " "}
                  name={item.name}
                  imageUrl={item.needId?.image ?? ""}
                  date={dayjs(item.updatedAt).format("MMMM D, YYYY h:mm A")}
                  onPress={() => handleOnReceiveRequestSelect(item.userId, item.needId._id, item._id, "Need")}
                  status={item.status}
                  requestType='Need'
                />
              )
            }
            ListEmptyComponent={<Text>No data found</Text>}
          />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => item.postId || index.toString()}
            renderItem={({ item }) => <ActivityCard item={item} />}
            ListEmptyComponent={<Text>No activity found</Text>}
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
    textAlign: "center"
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: "center"
  },
  body: {
    flex: 1,
    padding: 10,
  },
  tabBadge: {
    position: 'absolute',
    top: 5,
    right: 15,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.textHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tabBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sentActivityCard: {
    //backgroundColor: COLORS.textLight, 
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3", 
  },
  receivedActivityCard: {
    //backgroundColor: COLORS.bgGray,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.textgray, 
  },
  activityTitle: {
    fontSize: SIZE.small,
    fontWeight: '600',
    color: COLORS.bgDark,
  },
  activityLabel: {
    fontSize: SIZE.mini,
    marginVertical: 4,
    color: COLORS.textHighlight,
  },
  activityContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  activityDate: {
    fontSize: SIZE.mini,
    color: COLORS.textPlaceHolder,
    textAlign: "right",
  },

});
