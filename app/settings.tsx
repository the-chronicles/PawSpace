import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/favorite')}
      >
        <Text style={styles.optionText}>My Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => router.push('/favorite')}
      >
        <Text style={styles.optionText}>My Favorites</Text>
      </TouchableOpacity>

      {/* More settings options can go here later */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333',
  },
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 16,
//   },
});
