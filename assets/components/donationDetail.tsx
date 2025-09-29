import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import COLORS from '../../constants/colors';
import STYLES from '@/constants/common.style';
import SIZE from '../../constants/size';
import SubmitButton from './submitButton';
import { FontAwesome } from '@expo/vector-icons';
import { getReviewByCreatedByAndPostId, updateReview } from '../../services/reviewService'
import { useRouter } from 'expo-router';

interface DetailProps {
  title: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  description: string;
  quantity: number;
  image: string;
  profileImage?: string;
  views?: number;
  likes?: number;
  donationId: string;
  createdBy: string;
  donationCreatedBy: string;
}

const DonationDetail: React.FC<DetailProps> = ({
  title,
  name,
  type,
  address,
  phone,
  description,
  quantity,
  image,
  profileImage,
  views,
  likes,
  donationId,
  createdBy,
  donationCreatedBy
}) => {
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);

  // Generate a random background color only once
  const randomBgColor = useMemo(() => {
    const colors = COLORS.randonColors;
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const review = await getReviewByCreatedByAndPostId(createdBy, donationId);
        if (review?.data) {
          setIsLiked(review.data.isLiked || false);
          setReviewId(review.data._id);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      }
    };

    fetchReview();
  }, [createdBy, donationId]);

  const toggleLike = async () => {
    try {
      if (!reviewId) return;

      const updatedReview = {
        isLiked: !isLiked,
        isViewed: true,
        postId: donationId,
        createdBy: createdBy,
        postType: 'Donation',
      };

      await updateReview(reviewId, updatedReview);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleOnRequest = () => {
    // navigate('');
  };

  const handleProfileClick = () => {
    router.push({
      pathname: "/need/publicProfile",
      params: { userId: donationCreatedBy }
    });
  };

  return (
    <View style={STYLES.container}>
      {image ? (
        <View style={styles.imageBox}>
          <Image source={{ uri: image }} style={styles.mainImage} resizeMode="cover" />
        </View>
      ) : null}

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.content}>
          <View style={styles.iconsTopRight}>
            <View style={styles.iconWithText}>
              <FontAwesome name="eye" size={16} color={COLORS.textgray} />
              <Text style={styles.iconText}>{views}</Text>
            </View>
            <TouchableOpacity onPress={toggleLike}>
              <View style={styles.iconWithText}>
                <FontAwesome name="heart" size={16} color={isLiked ? 'red' : COLORS.textgray} />
                <Text style={styles.iconText}>{likes}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.profileSummaryContainer}>
            <TouchableOpacity onPress={handleProfileClick}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileIcon}
                />
              ) : (
                <View style={[styles.profileIcon, { backgroundColor: randomBgColor, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.profileInitial}>{name?.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.userType}>{type}</Text>
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

export default DonationDetail;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  imageBox: {
    width: width - 10,
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.bgLight,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mainImage: {
    width: '100%',
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
    color: COLORS.textPlaceHolder,
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
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileInitial: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
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
    flex: 1,
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
