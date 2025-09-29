import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import COLORS from "@/constants/colors";
import STYLES from "@/constants/common.style";
import SIZE from "@/constants/size";
import CardPublic from "@/assets/components/cardPublic";
import Footer from "@/assets/components/footer";
import CustomButtonSmall from "@/assets/components/customButtonSmall";
import CustomAlert from "@/constants/customAlert";
import CommentCard from "@/assets/components/commentCard";

import { getUserById } from "@/services/userService";
import { getNeedByCreatedBy } from "@/services/needService";
import { getDonationByCreatedBy } from "@/services/donationService";
import { rejectDonation } from "@/services/donationRequestService";
import {
  createUserFeedback,
  getFeedbackByUserId,
} from "@/services/userFeedbackService";
import { getUserId } from "@/constants/config";

const PublicProfile: React.FC = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { requestType } = useLocalSearchParams();
  const { requestId } = useLocalSearchParams();

  const [user, setUser] = useState<any>(null);
  const [needs, setNeeds] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Need" | "Donation">("Need");
  const [loading, setLoading] = useState(true);

  // Feedback states
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [feedbackListVisible, setFeedbackListVisible] = useState(false);

  // Alert state
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
        const userFeedbacks = await getFeedbackByUserId(userId);

        setUser(userDetails.data);
        setNeeds(Array.isArray(userNeeds.data) ? userNeeds.data : []);
        setDonations(
          Array.isArray(userDonations.data) ? userDonations.data : []
        );
        setFeedbackList(
          Array.isArray(userFeedbacks.data) ? userFeedbacks.data : []
        );
      } catch (error: any) {
        setAlertTitle("Error");
        setAlertMessage(
          error?.message || "Failed to fetch profile data. Please try again."
        );
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleOnAccept = () => {
    router.push(`/donation/confirmation?donationRequestId=${requestId}`);
  };

  const handleOnReject = async () => {
    setAlertTitle("Reject Request");
    setAlertMessage("Are you sure you want to reject this request?");
    setAlertConfirm(() => async () => {
      try {
        await rejectDonation(requestId);
        router.push("/home/home");
      } catch (error: any) {
        console.error(error?.message || "Error rejecting request:");
      } finally {
        setAlertVisible(false);
      }
    });
    setAlertVisible(true);
  };

  const handleOnView = (active: string, id: string) => {
    if (active === "Need") router.push(`/need/needProfile?id=${id}`);
    else if (active === "Donation")
      router.push(`/donation/donationProfile?id=${id}`);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) return;
    const loggedInUser = await getUserId();

    try {
      setSubmitting(true);
      await createUserFeedback({
        createdBy: loggedInUser,
        userId: userId,
        feedback: feedbackText,
        isRead: false,
      });

      setFeedbackText("");
      setFeedbackVisible(false);
      setAlertTitle("Success");
      setAlertMessage("Feedback submitted successfully.");
      setAlertVisible(true);
    } catch (err: any) {
      setAlertTitle("Error");
      setAlertMessage(err?.message || "Failed to submit feedback.");
      setAlertVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedData = activeTab === "Need" ? needs : donations;
  const tabData = Array.isArray(selectedData) ? selectedData : [];

  return (
    <View style={STYLES.container}>
      {/* Header */}
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
                <Text style={styles.userType}>
                  {user?.organizationAddress || ""}
                </Text>
                <Text style={styles.userType}>{user?.phone || ""}</Text>
              </>
            ) : (
              <>
                <Text style={styles.name}>{user?.username || ""}</Text>
                <Text style={styles.userType}>{user?.userType || ""}</Text>
                <Text style={styles.userType}>{user?.phone || ""}</Text>
              </>
            )}
          </View>

          <View style={styles.rightHeader}>
            {user?.userType?.toLowerCase() !== "organization" && (
              <Text style={styles.district}>{user?.district || ""}</Text>
            )}
              <CustomButtonSmall
                title="Add Feedback"
                onPress={()=> setFeedbackVisible(true)}
                buttonColor={COLORS.bgDark}/>
          </View>
        </LinearGradient>
      </View>

      {requestType === "Donation" && (
        <View style={styles.actionButtons}>
          <CustomButtonSmall
            title="Accept Request"
            onPress={handleOnAccept}
            buttonColor={COLORS.buttonOther}
          />
          <CustomButtonSmall
            title="Reject Request"
            onPress={handleOnReject}
            buttonColor={COLORS.buttonReject}
          />
        </View>
      )}

      <View style={styles.feedbackPreview}>
        <Text style={styles.feedbackPreviewTitle}>Feedback</Text>
        {feedbackList.length === 0 ? (
          <Text style={{ color: COLORS.textPlaceHolder, textAlign: "center" }}>
            No feedback available
          </Text>
        ) : (
          <FlatList
            data={feedbackList.slice(0, 3)}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={{ marginRight: 10 }}>
                <CommentCard
                  username={item.createdBy?.username || "Anonymous"}
                  feedback={item.feedback}
                  createdAt={item.createdAt}
                />
              </View>
            )}
          />
        )}
        {feedbackList.length > 3 && (
          <TouchableOpacity onPress={() => setFeedbackListVisible(true)}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        )}
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
            style={[
              styles.tabText,
              activeTab === "Donation" && styles.activeTabText,
            ]}
          >
            Donations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
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

      {/* Add Feedback Modal */}
      <Modal
        visible={feedbackVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFeedbackVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Feedback</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write your feedback..."
              placeholderTextColor={COLORS.textPlaceHolder}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CustomButtonSmall
                title="Cancel"
                onPress={() => setFeedbackVisible(false)}
                buttonColor={COLORS.buttonReject}
              />
              <CustomButtonSmall
                title={submitting ? "Submitting..." : "Submit"}
                onPress={handleSubmitFeedback}
                buttonColor={COLORS.buttonOther}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Feedback List Modal */}
      <Modal
        visible={feedbackListVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFeedbackListVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "70%" }]}>
            <Text style={styles.modalTitle}>Feedback List</Text>
            <ScrollView>
              {feedbackList.length === 0 ? (
                <Text
                  style={{
                    color: COLORS.textPlaceHolder,
                    textAlign: "center",
                    marginVertical: 20,
                  }}
                >
                  No feedback available
                </Text>
              ) : (
                feedbackList.map((fb) => (
                  <CommentCard
                    key={fb._id}
                    username={fb.createdBy?.username || "Anonymous"}
                    feedback={fb.feedback}
                    createdAt={fb.createdAt}
                  />
                ))
              )}
            </ScrollView>
            <CustomButtonSmall
              title="Close"
              onPress={() => setFeedbackListVisible(false)}
              buttonColor={COLORS.bgDark}
            />
          </View>
        </View>
      </Modal>

      {/* Alert */}
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
  rightHeader: {
    alignItems: "flex-end",
    gap: 6,
  },
  district: {
    fontSize: SIZE.small,
    color: COLORS.white,
    fontWeight: "600",
  },
  feedbackButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  feedbackButtonText: {
    fontSize: SIZE.small,
    fontWeight: "600",
    color: COLORS.bgDark,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 14,
  },
  feedbackPreview: {
    padding: 5,
    marginTop: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.bgGray
  },
  feedbackPreviewTitle: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.textgray,
  },
  viewAll: {
    marginTop: 8,
    fontSize: SIZE.small,
    textAlign: "right",
    color: COLORS.textDark,
    fontWeight: "400",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    elevation: 5,
  },
  modalTitle: {
    fontSize: SIZE.medium,
    fontWeight: "bold",
    color: COLORS.bgDark,
    marginBottom: 12,
    textAlign: "center",
  },
  textArea: {
    minHeight: 100,
    borderColor: COLORS.bgGray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: COLORS.textDark,
    marginBottom: 16,
  },
});
