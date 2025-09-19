import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import COLORS from '../../constants/colors';
import STYLES from "@/constants/common.style";
import Header from '../../assets/components/header';
import Footer from '../../assets/components/footer';
import CardMedium from '../../assets/components/cardMedium';
import FilterTab from '../../assets/components/filterTab';
import { getAllNeed, Need } from '../../services/needService';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import CustomAlert from "@/constants/customAlert";

const NeedList = () => {
  const { needs } = useLocalSearchParams();
  const router = useRouter();

  const [needList, setNeedList] = useState<Need[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (needs) {
      try {
        const parsedNeeds: Need[] = JSON.parse(needs as string);
        setNeedList(parsedNeeds);
      } catch {
        setNeedList([]);
      }
    } else {
      const fetchAllNeeds = async () => {
        setLoading(true);
        try {
        const response = await getAllNeed();
        const allNeeds: Need[] = Array.isArray(response) ? response : response.data ?? [];
        setNeedList(allNeeds);

        if (allNeeds.length === 0) {
          setAlertTitle("No Needs Found");
          setAlertMessage("Currently there are no needs available.");
          setAlertVisible(true);
        }
        } catch (error: any) {
          setAlertTitle("Error");
          setAlertMessage(error?.message || "Failed to load needs. Please try again later.");
          setAlertVisible(true);
        } finally {
          setLoading(false);
        }
      };
      fetchAllNeeds();
    }
  }, [needs]); 

  const handleOnNeedSelect = (needId: string) => {
    router.push(`/need/needProfile?id=${needId}`);
  };

  const renderItem = ({ item }: { item: Need }) => (
    <CardMedium
      key={item._id}
      usage="NEED"
      id={item._id}
      imageUrl={ item.image }
      title={item.title}
      name={item.needyName ?? "Unknown"}
      userType={item.userType ?? ""}
      createdBy={item.createdBy}
      district={item.district?.name ?? ""}
      date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
      onPress={() => handleOnNeedSelect(item._id)}
      buttonTitle="ADD TO WISHLIST"
    />
  );

  return (
    <View style={STYLES.container}>
      <FilterTab title="Needies" />
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={needList}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <CustomAlert
                visible={true}
                title="No Needs Found"
                message="Currently there are no needs available."
                onClose={() => setAlertVisible(false)}
              />
            }
          />
        )}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 10,
  },
});

export default NeedList;
