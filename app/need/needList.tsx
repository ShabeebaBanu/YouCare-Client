import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import COLORS from '../../constants/colors';
import Header from '../../assets/components/header';
import Footer from '../../assets/components/footer';
import CardMedium from '../../assets/components/cardMedium';
import FilterTab from '../../assets/components/filterTab';
import { getAllNeed } from '../../services/needService';

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
  };
  delivary?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

const NeedList = () => {
  const [needList, setNeedList] = useState<Need[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNeeds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllNeed();
        console.log("needs: ", response);
        const needs: Need[] = Array.isArray(response) ? response : response.data ?? [];
        setNeedList(needs);
      } catch (err: any) {
        console.error("Failed to fetch Needs:", err);
        setError(err?.message || "Failed to load Needs");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNeeds();
  }, []); 

  const renderItem = ({ item }: { item: Need }) => (
    <CardMedium
      key={item._id}
      imageUrl={ item }
      title={item.title}
      name={item.needyName ?? "Unknown"}
      userType="Individual"
      district={item.district?.name ?? ""}
      date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
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
