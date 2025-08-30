import { View, StyleSheet, ScrollView } from 'react-native' 
import { useState, useEffect } from 'react'
import COLORS from '../../constants/colors' 
import Footer from '../../assets/components/footer' 
import HeaderProfile from '../../assets/components/headerProfile' 
import ProfileForm from '../../assets/components/forms/profileForm'
import { getUserId } from "../../constants/config"
import { getUserById } from "../../services/userService"

export default function UserProfile() {
  const [user, setUser] = useState<{ 
    username: string; 
    email: string; 
    userType: "individual" | "organization"; 
    district: string;
    province: string;
    organizationName: string;
    organizationAddress: string;
   } | null>(null)

  useEffect(() => {
    console.log("inside userprofile")
    const fetchUser = async () => {
      try {
        const userId = await getUserId()
        const response = await getUserById(userId)
        setUser(response)
    
      } catch (err:any) {
        console.error("Failed to fetch user:", err);
        alert(err?.message || "Failed to load user");
      }
    }

    fetchUser()
  }, [])

  if (!user) return null

  return (
    <View style={styles.container}>
      <HeaderProfile
         name={user.username}
         userType={user.userType}
      />

      <ScrollView contentContainerStyle={styles.body}>
        <ProfileForm initialData={user}/>
      </ScrollView>

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
      flexGrow: 1,
      padding: 10,
    },
});
