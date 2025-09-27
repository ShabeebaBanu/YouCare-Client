import { View, StyleSheet, ActivityIndicator } from 'react-native'
import COLORS from '../../constants/colors'
import STYLES from '@/constants/common.style'
import Footer from '../../assets/components/footer'
import NeedDetail from '../../assets/components/needDetail'
import { useLocalSearchParams } from "expo-router";
import { getNeedByNeedId, Need } from '../../services/needService'
import { useEffect, useState } from 'react';
import { createReview } from '@/services/reviewService'
import { getUserId } from '@/constants/config'
import CustomAlert from '@/constants/customAlert';


export default function NeedProfile() {
  const { id } = useLocalSearchParams();
  const [userId, setUserId] = useState("");
  const [need, setNeed] = useState<Need | null>(null);
  const [loading, setLoading] = useState(true);

  // alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchNeed = async () => {
      try {
        const response = await getNeedByNeedId(id as string);
        const user = await getUserId();
        if (!response?.data) {
          setAlertTitle("Not Found");
          setAlertMessage(response?.message || "The requested need could not be found.");
          setAlertVisible(true);
        } else {
          setNeed(response.data);
          setUserId(user);
          await createReview({
            isLiked: false,
            isViewed: true,
            postId: response.data._id,
            createdBy: user,   
            postType: "Need",
          });
        }
      } catch (error: any) {
        setAlertTitle("Error");
        setAlertMessage(error?.message || "Failed to fetch need details. Please try again later.");
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNeed();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.bgblue} />
      </View>
    );
  }

  return (
    <View style={STYLES.container}>
      {need && (
        <NeedDetail
          key={need._id}
          title={need.title}
          name={need.needyName ?? ""}
          type={need.userType ?? ""}
          address={need.delivaryAddress ?? ""}
          phone={need.needyPhone ?? ""}
          description={need.description ?? ""}
          quantity={need.quantity ?? 0}
          image={need.image ?? ""}
          likes={need.likes ?? 0}
          views={need.views ?? 0}
          createdBy={userId}
          needId={need._id}
        />
      )}
      <Footer />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  )
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
