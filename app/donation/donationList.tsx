import { View, StyleSheet, ActivityIndicator, FlatList, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import CardMedium from '../../assets/components/cardMedium'
import FilterTab from '../../assets/components/filterTab'
import { getAllDonation } from '../../services/donationService'
import { useEffect, useState } from 'react'
import { useRouter } from "expo-router";

type Donation = {
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
  donerName?: string;
  donerPhone?: string;
  pickupAddress?: string;
  district?: {
    _id: string;
    name: string;
    province: string;
  };
  delivary?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};


export default function DonationList() {
  const router = useRouter();

  const [donationList, setDonationList] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchAllDonations = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getAllDonation();
          console.log("donations: ", response);
          const needs: Donation[] = Array.isArray(response) ? response : response.data ?? [];
          setDonationList(needs);
        } catch (err: any) {
          console.error("Failed to fetch Donations:", err);
          setError(err?.message || "Failed to load Donations");
        } finally {
          setLoading(false);
        }
  };

  fetchAllDonations();
  }, []);

  const handleOnDonationSelect = (donationId: string) => {
    router.push(`/donation/donationProfile?id=${donationId}`);
  };

  const renderItem = ({ item }: { item: Donation }) => (
    <CardMedium
      key={item._id}
      id={item._id}
      usage='DONATION'
      imageUrl={ item }
      title={item.title}
      name={item.donerName ?? "Unknown"}
      userType="Individual"
      createdBy={item.createdBy}
      district={item.district?.name ?? ""}
      date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
      onPress={() => handleOnDonationSelect(item._id)}
      buttonTitle='REQUEST'
    />
  );

  return (
    <View style={styles.container}>
      <Header/>
      <FilterTab
        title='Doners'
      />
      <View style={styles.body}>
        {loading ? (
            <ActivityIndicator size="large" />
        ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
        ) : (
            <FlatList
              data={donationList}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text>No Donations found</Text>}
            />
        )}
      </View>
      <Footer/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white
    },
   
    body: {
      flex: 1,
      padding: 10,
    },

});
