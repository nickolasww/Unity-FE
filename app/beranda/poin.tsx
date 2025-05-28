import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/Feather"

export default function PoinScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.voucherGrid}>
          {/* Gojek Voucher */}
          <VoucherCard
            image="https://via.placeholder.com/200x100"
            provider="Gojek"
            title="Voucher Goride 20rb"
            points={1200}
          />

          {/* Dana Voucher */}
          <VoucherCard image="https://via.placeholder.com/200x100" provider="Dana" title="Saldo 20rb" points={1500} />

          {/* Telkomsel Voucher */}
          <VoucherCard
            image="https://via.placeholder.com/200x100"
            provider="Telkomsel"
            title="Kuota Internet 4gb"
            points={3000}
          />

          {/* Tokopedia Voucher */}
          <VoucherCard
            image="https://via.placeholder.com/200x100"
            provider="Tokopedia"
            title="Voucher 40rb"
            points={4100}
          />

          {/* Indomaret Voucher */}
          <VoucherCard
            image="https://via.placeholder.com/200x100"
            provider="Indomaret"
            title="Voucher 60rb"
            points={5000}
          />

          {/* Gopay Voucher */}
          <VoucherCard image="https://via.placeholder.com/200x100" provider="Gopay" title="Saldo 30rb" points={4250} />

          {/* Additional Gopay Vouchers */}
          <VoucherCard
            image="https://via.placeholder.com/200x100"
            provider="Gopay"
            title=""
            points={0}
            isEmpty={true}
          />

          <VoucherCard
            image="https://via.placeholder.com/200x100"
            provider="Gopay"
            title=""
            points={0}
            isEmpty={true}
          />
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  )
}

// Component untuk kartu voucher
function VoucherCard({ image, provider, title, points, isEmpty = false }) {
  return (
    <View style={styles.voucherCard}>
      <Image source={require("../../assets/Voucher.png")}  style={styles.voucherImage} resizeMode="cover" />
      <View style={styles.voucherContent}>
        {!isEmpty ? (
          <>
            <Text style={styles.providerText}>{provider}</Text>
            <Text style={styles.voucherTitle}>{title}</Text>
            <View style={styles.voucherFooter}>
              <View style={styles.pointsWrapper}>
                <Image source={require("../../assets/Coin.png")} style={styles.voucherCoinIcon} />
                <Text style={styles.voucherPointsText}>{points}</Text>
              </View>
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Tukarkan</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyVoucher} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  pointsText: {
    color: "#f59e0b",
    fontWeight: "500",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  voucherGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  voucherCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  voucherImage: {
    width: "100%",
    height: 100,
  },
  voucherContent: {
    padding: 12,
  },
  providerText: {
    fontSize: 12,
    color: "#777",
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  voucherFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  pointsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  voucherCoinIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  voucherPointsText: {
    color: "#f59e0b",
    fontSize: 14,
  },
  redeemButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  emptyVoucher: {
    height: 64,
  },
  bottomPadding: {
    height: 20,
  },
})
