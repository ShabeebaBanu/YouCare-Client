import { View, StyleSheet, ActivityIndicator, Text} from 'react-native'
import COLORS from '../../constants/colors'
import Footer from '../../assets/components/footer'
import NeedDetail from '../../assets/components/needDetail'
import { useLocalSearchParams } from "expo-router";
import { getNeedByNeedId } from '../../services/needService'
import { useEffect, useState } from 'react';

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

export default function NeedProfile() {
  const { id } = useLocalSearchParams();
  const [need, setNeed] = useState<Need | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeed = async () => {
      try {
        const data = await getNeedByNeedId(id as string);
        setNeed(data);
      } catch (err) {
        setError("Failed to fetch need details.");
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

  if (error || !need) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.textHighlight }}>{error ?? "Need not found."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NeedDetail
        key={need._id}
        title={need.title}
        name={need.needyName ?? ""}
        type={need.userType ?? ""}
        address={need.delivaryAddress ?? ""}
        phone={need.needyPhone ?? ""}
        description={need.description ?? ""}
        quantity={need.quantity ?? 0}
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
