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
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardDismissWrapper from "../components/KeyboardDismissWrapper";
import { useDispatch } from "react-redux";
import { set_food_type, set_name, set_user_info } from "../redux/UserSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import LoadingScreen from "../components/LoadingScreen";

const WelcomeScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  console.log(name);

  const handleGetStarted = async () => {
    if (name === "") {
      Alert.alert("Oops!", "Name cannot be empty.");
    } else {
      dispatch(set_user_info({ name, foodType }));
      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify({ username: name, food_pref: foodType })
      );
      navigation.replace("Home");
    }
  };

  useEffect(() => {
    const checkForData = async () => {
      try {
        setLoading(true);
        const userInfo = await AsyncStorage.getItem("userInfo");
        if (userInfo) {
          const parsedData = JSON.parse(userInfo);
          console.log(parsedData);
          console.log(
            "name: ",
            parsedData.username,
            "foodType: ",
            parsedData.food_pref
          );
          dispatch(
            set_user_info({
              name: parsedData.username,
              foodType: parsedData.food_pref,
            })
          );
          navigation.replace("Home");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    checkForData();
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <KeyboardDismissWrapper>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={{ height: 1000, width: 900, resizeMode: "cover" }}
            source={{
              uri: "https://raw.githubusercontent.com/metaladmiral/Foodee/master/foodee-images/foodee.png",
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
    marginTop: 5,
    marginHorizontal: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    // backgroundColor: "gray",
    flex: 1,
    // height: 240,
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
