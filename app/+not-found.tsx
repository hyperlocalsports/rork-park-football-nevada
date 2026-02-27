import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>THIS SCREEN DOESN&apos;T EXIST.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>GO TO HOME SCREEN</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#1A1A1A",
  },
  title: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#8B7355",
    letterSpacing: 1,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#8B7355",
  },
  linkText: {
    fontSize: 13,
    color: "#8B7355",
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
});
