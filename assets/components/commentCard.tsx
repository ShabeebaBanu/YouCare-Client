import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";
import SIZE from "@/constants/size";

interface CommentCardProps {
  username: string;
  feedback: string;
  createdAt?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  username,
  feedback,
  createdAt,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.feedback}>{feedback }</Text>
      {createdAt && (
        <Text style={styles.date}>
          {new Date(createdAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.bgGray
    // elevation: 2,
    // shadowColor: "#333232ea",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 3,
  },
  username: {
    fontSize: SIZE.small,
    color: COLORS.bgDark,
    fontWeight: "600",
    marginBottom: 4,
  },
  feedback: {
    fontSize: SIZE.small,
    color: COLORS.textDark,
    fontStyle: "italic",
    marginBottom: 6,
  },
  date: {
    fontSize: SIZE.mini,
    color: COLORS.textPlaceHolder,
    textAlign: "right",
  },
});
