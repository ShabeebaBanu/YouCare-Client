import React, { useEffect, useState } from 'react';
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
import { getReviewByCreatedByAndPostId, updateReview } from '@/services/reviewService';
import { useRouter } from 'expo-router';
import { getUserId } from '@/constants/config';

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
  needId: string;
  createdBy: string;
  needCreatedBy: string;
}

const NeedDetail: React.FC<DetailProps> = ({
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
  needId,
  createdBy,
  needCreatedBy
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);

  // Generate random background color
  const [bgColor, setBgColor] = useState(COLORS.bgDark);
  useEffect(() => {
    const colors = COLORS.randonColors;
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await getReviewByCreatedByAndPostId(createdBy, needId);
        if (response?.data) {
          setIsLiked(response.data.isLiked || false);
          setReviewId(response.data._id);
        }
      } catch (error) {
        console.log("Error fetching review: ", error);
      }
    };
    fetchReview();
  }, [createdBy, needId]);

  const handleOnDonate = async (needId: string) => {
    const userId = await getUserId();
    router.push(`/donation/confirmation?needId=${needId}&userId=${userId}`);
  };

  const handleOnAddToWishList = () => {
    // navigate('');
  };

  const handleLike = async () => {
    try {
      if (!reviewId) return;
      const body = {
        isLiked: isLiked ? false : true,
        isViewed: true,
        postId: needId,
        createdBy: createdBy,
        postType: "Need",
      };

      const response = await updateReview(reviewId, body);
      if (response?.data) {
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      console.log("Error updating review: ", error);
    }
  };

  const handleProfilePress = () => {
    router.push({
      pathname: "/need/publicProfile",
      params: { userId: needCreatedBy }
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
          {/* Top Right Icons */}
          <View style={styles.iconsTopRight}>
            <View style={styles.iconWithText}>
              <FontAwesome name="eye" size={16} color={COLORS.textgray} />
              <Text style={styles.iconText}>{views}</Text>
            </View>
            <TouchableOpacity onPress={handleLike}>
              <View style={styles.iconWithText}>
                <FontAwesome
                  name="heart"
                  size={16}
                  color={isLiked ? "red" : COLORS.textgray}
                />
                <Text style={styles.iconText}>{likes}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{title}</Text>

          {/* Profile Section */}
          <View style={styles.profileSummaryContainer}>
            <TouchableOpacity style={styles.profile} onPress={handleProfilePress}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileIcon} />
              ) : (
                <View style={[styles.profileCircle, { backgroundColor: bgColor }]}>
                  <Text style={styles.initial}>{name?.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View>
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.userType}>{type}</Text>
              </View>
            </TouchableOpacity>

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
                title="DONATE"
                onPress={() => handleOnDonate(needId)}
                buttonColor={COLORS.bgDark}
              />
            </View>
            <View style={styles.halfButton}>
              <SubmitButton
                title="ADD TO WISHLIST"
                onPress={handleOnAddToWishList}
                buttonColor={COLORS.textHighlight}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NeedDetail;

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
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  initial: {
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
