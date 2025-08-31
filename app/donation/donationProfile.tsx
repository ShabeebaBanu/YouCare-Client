import { View, StyleSheet, ActivityIndicator, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Footer from '../../assets/components/footer'
import DonationDetail from '@/assets/components/donationDetail';
import { useLocalSearchParams } from "expo-router";
import { getDonationByDonationId } from '../../services/donationService'
import { useEffect, useState } from 'react';

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
  userType?: string;
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

export default function DonationProfile() {
  const { id } = useLocalSearchParams();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const data = await getDonationByDonationId(id as string);
        setDonation(data);
      } catch (err) {
        setError("Failed to fetch Donation details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDonation();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.bgblue} />
      </View>
    );
  }

  if (error || !donation)
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.textHighlight }}>{error ?? "Donation not Found "}</Text>
      </View>
    );
  

  return (
    <View style={styles.container}>
      <DonationDetail
        key={donation._id}
        title={donation.title}
        name={donation.donerName ?? ""}
        type={donation.userType ?? ""}
        address={donation.pickupAddress ?? ""}
        phone={donation.donerPhone ?? ""}
        description={donation.description ?? ""}
        quantity={donation.quantity ?? 0}
        images={[
          
        ]}
      />
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
     
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.white,
    },

});
