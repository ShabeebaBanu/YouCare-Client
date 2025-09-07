import { View, StyleSheet, ActivityIndicator, FlatList, Text} from 'react-native'
import STYLES from '@/constants/common.style'
import Header  from '../../assets/components/header'
import Footer from '../../assets/components/footer'
import CardMedium from '../../assets/components/cardMedium'
import FilterTab from '../../assets/components/filterTab'
import { getAllDonation, Donation } from '../../services/donationService'
import { useEffect, useState } from 'react'
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function DonationList() {
  const { donations } = useLocalSearchParams();
  const router = useRouter();

  const [donationList, setDonationList] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (donations) {
        try {
          const parsedDonations: Donation[] = JSON.parse(donations as string);
          setDonationList(parsedDonations);
        } catch {
          setDonationList([]);
        }
      } else {
      const fetchAllDonations = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getAllDonation();
          const responseData: Donation[] = Array.isArray(response) ? response : response.data ?? [];
          setDonationList(responseData);
        } catch (error: any) {
          setError(error?.message || "Failed to load Donations");
        } finally {
          setLoading(false);
        }
  };

  fetchAllDonations();
  }
  }, [donations]);

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
      userType={item.userType ?? ""}
      createdBy={item.createdBy}
      district={item.district?.name ?? ""}
      date={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
      onPress={() => handleOnDonationSelect(item._id)}
      buttonTitle='REQUEST'
    />
  );

  return (
    <View style={STYLES.container}>
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
              ListEmptyComponent={<Text style={STYLES.emptyMessage} >No Donations found</Text>}
            />
        )}
      </View>
      <Footer/>
    </View>
  )
}

const styles = StyleSheet.create({
    body: {
      flex: 1,
      padding: 10,
    },

});
