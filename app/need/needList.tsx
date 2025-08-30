import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import COLORS from '../../constants/colors';
import Header from '../../assets/components/header';
import Footer from '../../assets/components/footer';
import CardMedium from '../../assets/components/cardMedium';
import FilterTab from '../../assets/components/filterTab';
import { getAllNeed } from '../../services/needService';
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

type Need = {
  _id: string;
  title: string;
  item?: string;
  description?: string;
  status?: string;
  quantity?: number;
  category?: {
    _id: string;
    name: string;
  };
  needyName?: string;
  needyPhone?: string;
  delivaryAddress?: string;
  district?: {
    _id: string;
    name: string;
    province: string;
  };
  userType: string;
  delivary?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

const NeedList = () => {
  const { needs } = useLocalSearchParams();
  const router = useRouter();

  const [needList, setNeedList] = useState<Need[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        } catch (err) {
          console.error("Failed to fetch Needs:", err);
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
      imageUrl={ item }
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
    <View style={styles.container}>
      <Header />
      <FilterTab title="Needies" />
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <FlatList
            data={needList}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text>No needs found</Text>}
          />
        )}
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  body: {
    flex: 1,
    padding: 10,
  },
});

export default NeedList;
