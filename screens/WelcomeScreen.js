import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={{ height: 300, width: 300, resizeMode: "contain" }}
          source={{
            uri: "https://img.freepik.com/premium-vector/traditional-cuisine-map-realistic-composition-with-view-india-country-border-with-dish-icons-text-vector-illustration_1284-75907.jpg?w=740",
          }}
        />
      </View>
      <View style={styles.footerContainer}>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.textStyle}>Get your personalized</Text>
          <Text style={styles.textStyle}>Food Recommendations</Text>
          <Text style={{ textAlign: "center", fontSize: 15, color: "#c2c2c2" }}>
            Food app will recommend you over 15 personalized meals per day
          </Text>
        </View>
        <View>
          <Pressable
            onPress={() => navigation.navigate("Home")}
            style={styles.buttonStyle}
          >
            <Text style={{ fontWeight: "600", fontSize: 18, color: "white" }}>
              Get Started
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    // backgroundColor: "red",
    justifyContent: "center",
    flex: 1,
  },
  footerContainer: {
    height: 240,
    gap: 30,
    marginHorizontal: 10,
  },
  textStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    fontFamily: "sans-serif-light",
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    borderWidth: 10,
    borderColor: "#ffa300",
    borderRadius: 18,
    backgroundColor: "#ffa300",
    height: 55,
    alignSelf: "center",
  },
});
