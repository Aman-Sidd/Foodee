import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardDismissWrapper from "../components/KeyboardDismissWrapper";
import { useDispatch } from "react-redux";
import { set_food_type, set_name, set_user_info } from "../redux/UserSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const dispatch = useDispatch();

  console.log(name);

  const handleGetStarted = () => {
    if (name === "") {
      Alert.alert("Oops!", "Name cannot be empty.");
    } else {
      dispatch(set_user_info({ name, foodType }));
      navigation.replace("Home");
    }
  };

  return (
    <KeyboardDismissWrapper>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={{ height: 900, width: 800, resizeMode: "contain" }}
            source={{
              uri: "https://scontent.fixc4-1.fna.fbcdn.net/v/t39.30808-6/431018799_1540621363453706_7222498144680716548_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=3635dc&_nc_ohc=WCfiF9r5_UcAX-otU6q&_nc_ht=scontent.fixc4-1.fna&oh=00_AfA0bza6RYCf6DEfHPz0kaV1-wOKSibVBOBC7ZssIzos-w&oe=65E75721",
            }}
          />
        </View>
        <View style={styles.footerContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.textStyle}>Get your personalized</Text>
            <Text style={styles.textStyle}>Food Recommendations</Text>
            <Text
              style={{ textAlign: "center", fontSize: 15, color: "#c2c2c2" }}
            >
              Food app will recommend you over 15 personalized meals per day
            </Text>
          </View>
          <KeyboardAvoidingView>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={(text) => setName(text)}
              autoCorrect={false}
              placeholder="Your Good Name, Please!"
            />
          </KeyboardAvoidingView>

          {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Pressable
              style={{
                width: 80,
                backgroundColor: "gray",
                height: 40,
                marginHorizontal: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
              onPress={() => setFoodType("veg")}
            >
              <Text
                style={{ fontSize: 15, color: "white", fontWeight: "bold" }}
              >
                Veg
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: 80,
                backgroundColor: "gray",
                height: 40,
                marginHorizontal: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
              onPress={() => setFoodType("nonveg")}
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Non-Veg
              </Text>
            </Pressable>
          </View> */}

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={() => {
                setFoodType("veg");
              }}
              style={[
                styles.buttonStyleFoodType,
                foodType === "veg"
                  ? { backgroundColor: "#ffa300" }
                  : { backgroundColor: "#f5f5f5" },
              ]}
            >
              <MaterialCommunityIcons
                name="food-apple"
                size={18}
                color={foodType === "veg" ? "#f5f5f5" : "#4f4f4f"}
              />
              <Text
                style={[
                  styles.sliderTextStyle,
                  {
                    color: foodType === "veg" ? "#f5f5f5" : "#4f4f4f",
                  },
                ]}
              >
                veg
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setFoodType("nonveg");
              }}
              style={[
                styles.buttonStyleFoodType,
                foodType === "nonveg"
                  ? { backgroundColor: "#ffa300" }
                  : { backgroundColor: "#f5f5f5" },
              ]}
            >
              <MaterialCommunityIcons
                name="food-turkey"
                size={18}
                color={foodType === "nonveg" ? "#f5f5f5" : "#4f4f4f"}
              />
              <Text
                style={[
                  styles.sliderTextStyle,
                  {
                    color: foodType === "nonveg" ? "#f5f5f5" : "#4f4f4f",
                  },
                ]}
              >
                non-veg
              </Text>
            </Pressable>
          </View>

          <View>
            <Pressable onPress={handleGetStarted} style={styles.buttonStyle}>
              <Text style={{ fontWeight: "600", fontSize: 18, color: "white" }}>
                Get Started
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardDismissWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 6,
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    // backgroundColor: "red",
    justifyContent: "center",
    flex: 1,
  },
  sliderTextStyle: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonStyleFoodType: {
    width: 120,
    height: 35,
    gap: 5,
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 13,
    marginHorizontal: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    // backgroundColor: "gray",
    flex: 1,
    height: 240,
    gap: 30,
    marginHorizontal: 10,
  },
  nameInput: {
    alignSelf: "center",
    marginBottom: 5,
    width: "56%",
    height: 55,
    color: "black",
    borderColor: "#405064",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
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
