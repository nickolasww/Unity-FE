import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

const menuItems = [
  {
    id: "1",
    title: "My Bookings",
    icon: "calendar",
  },
  {
    id: "2",
    title: "Saved Places",
    icon: "bookmark",
  },
  {
    id: "3",
    title: "Reviews",
    icon: "star",
  },
  {
    id: "4",
    title: "Settings",
    icon: "settings",
  },
  {
    id: "5",
    title: "Help Center",
    icon: "help-circle",
  },
  {
    id: "6",
    title: "About",
    icon: "information-circle",
  },
]

export default function Profile() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            {/* <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Local%20Connect-T8YuujmPybJqJtjlrjt3WkZCGPh2Bi.png",
              }}
              style={styles.profileImage}
            /> */}
            <View>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>36</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              {/* <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={20} color="#8B2323" />
              </View> */}
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out" size={20} color="#8B2323" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#8B2323",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "white",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 16,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B2323",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f0f0f0",
  },
  menuContainer: {
    backgroundColor: "white",
    marginTop: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f8f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  logoutText: {
    fontSize: 16,
    color: "#8B2323",
    fontWeight: "500",
    marginLeft: 8,
  },
})
