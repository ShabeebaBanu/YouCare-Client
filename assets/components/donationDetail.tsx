import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import COLORS from '../../constants/colors';
import SIZE from '../../constants/size';
import SubmitButton from './submitButton';
import { FontAwesome } from '@expo/vector-icons';

const dummyData = {
  images: [
    require('../images/need1.jpeg'),
    require('../images/donate1.jpeg'),
  ],
};

interface DetailProps {
  title: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  description: string;
  quantity: number;
  images: [];
}

const donationDetail: React.FC<DetailProps> = ({
  title,
  name,
  type,
  address,
  phone,
  description,
  quantity
}) => {

  const handleOnRequest = () => {
    //navigate('');
  };


  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={dummyData.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(_, index) => index.toString()}
          style={{ height: (width - 20) * 9 / 16 }}
          renderItem={({ item }) => (
            <View style={styles.imageBox}>
              <Image source={item} style={styles.carouselImage} resizeMode="cover" />
            </View>
          )}
        />
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.content}>
          <View style={styles.iconsTopRight}>
            <View style={styles.iconWithText}>
              <FontAwesome name="eye" size={16} color={COLORS.textDark} />
              <Text style={styles.iconText}>256</Text>
            </View>
            <View style={styles.iconWithText}>
              <FontAwesome name="heart" size={16} color="red" />
              <Text style={styles.iconText}>120</Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.profileSummaryContainer}>
            <View style={styles.profile}>
              <Image source={require('../images/need1.jpeg')} style={styles.profileIcon} />
              <View>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.userType}>{type}</Text>
              </View>
            </View>
            <View style={styles.contact}>
              <Text style={styles.contactDetail}>{address}</Text>
              <Text style={styles.contactDetail}>{phone}</Text>
            </View>
          </View>

          <View style={styles.description}>
            <Text style={styles.descriptionData}>{description}</Text>
            <Text style={styles.quantity}>Quantity: {quantity}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.halfButton}>
              <SubmitButton
                title="REQUEST HELP"
                onPress={handleOnRequest}
                buttonColor={COLORS.textHighlight}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default donationDetail;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flex: 1,
  },
  imageBox: {
    width: width - 20,
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.bgLight,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '99%',
    height: '100%',
  },
  content: {
    marginTop: 20,
    padding: 15,
    position: 'relative', 
  },
  iconsTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)', 
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    zIndex: 10,
  },
  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    fontSize: 12,
    color: COLORS.textDark,
    marginLeft: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: SIZE.average,
    fontWeight: 'bold',
    marginVertical: SIZE.VerticlePaddingMedium,
    color: COLORS.textDark,
  },
  profileSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZE.VerticlePaddingSmall,
    paddingHorizontal: SIZE.HorizontalPaddingSmall,
    marginBottom: 15,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileName: {
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  userType: {
    fontSize: SIZE.small,
    color: COLORS.textPlaceHolder,
  },
  contact: {
    alignItems: 'flex-end',
  },
  contactDetail: {
    color: COLORS.textHighlight,
    fontSize: SIZE.small,
  },
  description: {
    paddingVertical: SIZE.VerticlePaddingMedium,
    marginBottom: 15,
  },
  descriptionData: {
    fontSize: SIZE.small,
    color: COLORS.textgray,
  },
  quantity: {
    fontWeight: '600',
    marginTop: 5,
    color: COLORS.bgblue,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  halfButton: {
    width: '48%',
  },
});
