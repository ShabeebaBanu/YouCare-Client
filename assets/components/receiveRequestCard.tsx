import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';

interface ReceiveRequestProps {
  title: string;
  name: string;
  date: string;
  imageUrl?: any;
  onPress?: () => void;
  status?: string; 
  requestType?: "Donation" | "Need";
}

const ReceiveRequestCard: React.FC<ReceiveRequestProps> = ({
  title,
  name,
  date,
  imageUrl,
  onPress,
  status,
  requestType = "Donation",
}) => {

  const handleOnPress = () => {
    if (onPress) onPress();
  };

  const renderStatusBadge = () => {
    if (requestType === "Donation") {
      if (status === "ACCEPTED") {
        return (
          <View style={[styles.badge, { backgroundColor: COLORS.buttonAccept }]}>
            <Text style={styles.badgeText}>You Accepted</Text>
          </View>
        );
      }
      if (status === "REJECTED") {
        return (
          <View style={[styles.badge, { backgroundColor: COLORS.buttonReject }]}>
            <Text style={styles.badgeText}>You Rejected</Text>
          </View>
        );
      }
    } else if (requestType === "Need") {
      if (status === "ACCEPTED") {
        return (
          <View style={[styles.badge, { backgroundColor: COLORS.buttonAccept }]}>
            <Text style={styles.badgeText}>Accepted</Text>
          </View>
        );
      }
      if (status === "DELIVERED") {
        return (
          <View style={[styles.badge, { backgroundColor: "green" }]}>
            <Text style={styles.badgeText}>Delivered</Text>
          </View>
        );
      }
    }
    return null; 
  };

  const renderContent = () => {
    if (requestType === "Donation") {
      return (
        <Text style={styles.titleText}>
          <Text style={styles.titleBold}>{title} </Text>
          {status === "PENDING" && (
            <Text style={styles.titleNormal}>has a new Request {name}</Text>
          )}
        </Text>
      );
    }

    if (requestType === "Need") {
      return (
        <Text style={styles.titleText}>
          <Text style={styles.titleBold}>{title} </Text>
          <Text style={styles.titleNormal}>
            is ready to be donated by a donor
          </Text>
        </Text>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handleOnPress}>
      <View style={styles.row}>
        <View style={styles.imageBox}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={24} color={COLORS.textLight} />
          )}
        </View>

        <View style={styles.content}>
          {renderContent()}
          <View style={styles.footerRow}>
            <Text style={styles.date}>{date}</Text>
            {renderStatusBadge()}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReceiveRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.textLight,
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageBox: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.textPlaceHolder,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleText: {
    marginBottom: 8,
    flexShrink: 1,
  },
  titleBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  titleNormal: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 11,
    color: COLORS.textOption,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: "600",
  },
});
