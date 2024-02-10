import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import myApi from "../api/myApi";
import LoadingScreen from "../components/LoadingScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment-timezone";

const HomeScreen = () => {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [foods, setFoods] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [pastRecommendations, setPastRecommendations] = useState([]);
  const [discardedItems, setDiscardedItems] = useState([]);
  const [foodType, setFoodType] = useState("veg");
  const [previousData, setPreviousData] = useState("Chosen");
  const user = useSelector((state) => state.user);
  const userName = user.user_name;
  moment.tz.setDefault("Asia/Kolkata");

  const getTodayDate = () => {
    return moment().format("YYYY-MM-DD");
  };

  const deleteAsyncData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      await AsyncStorage.removeItem(`${foodType}${selectedMeal}`);
    } catch (err) {
      console.log(err);
    }
  };

  // To RETRIEVE FOOD DETAILS
  const fetchFood = async (filteredPastRecommendations = []) => {
    setLoadingRecommendations(true);
    console.log("API is called");
    console.log("PastRecomWhileFetching: ", pastRecommendations);
    const declined_array = JSON.stringify(
      filteredPastRecommendations.map((item) => item.food_id)
    );
    console.log("DeclinedArr: ", declined_array);
    const payload = {
      user_food_preference: foodType,
      food_time_type: selectedMeal,
      declined_food_array: declined_array,
      special_day: "y",
    };
    try {
      const formData = new FormData();

      // Append each key-value pair from the payload to the FormData object
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // Send the FormData object to the API
      const response = await myApi.post("/recommend", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFoods(response.data.data);
      setDiscardedItems([]);
    } catch (err) {
      console.log("ERROR: fetching breakfast", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // useEffect(() => {
  //   fetchFood();
  // }, [selectedMeal, foodType]);
  useEffect(() => {
    // Load data from AsyncStorage when the component mounts
    loadData();
    // deleteAsyncData();
  }, [foodType, selectedMeal]);

  useEffect(() => {
    // Save data to AsyncStorage whenever relevant state changes
    saveData();
  }, [foods, pastRecommendations, discardedItems]);

  const saveData = async () => {
    try {
      // const date = getTodayDate();
      // const timestamp = new Date().getTime();
      // const pastRecom = pastRecommendations.map((item) => {
      //   item.date = date;
      //   item.timestamp = timestamp;
      //   return item;
      // });
      // console.log("Past Recom with Date: ", pastRecom);
      // console.log("PAST RECOM: ", pastRecommendations);
      const data = {
        foods,
        pastRecommendations,
        discardedItems,
      };
      await AsyncStorage.setItem(
        `${foodType}${selectedMeal}`,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  };

  const loadData = async () => {
    setLoadingRecommendations(true);
    try {
      let isPastRecommendationDlt = false;
      const userData = await AsyncStorage.getItem(`${foodType}${selectedMeal}`);
      console.log(userData);
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        const currentTime = new Date().getTime(); // Current timestamp
        const today = moment();

        const filteredPastRecommendations =
          parsedData.pastRecommendations.filter((item) => {
            const diffMillis = currentTime - item.timestamp;
            const diffSec = diffMillis / 1000; // Convert milliseconds to seconds
            console.log("TIME DIFF: ", diffSec);
            if (diffSec <= 30) {
              return true;
            } else {
              isPastRecommendationDlt = true;
              return false;
            }
          });

        console.log("FilteredPastRecom: ", filteredPastRecommendations);
        setFoods(parsedData.foods || []);
        setPastRecommendations(filteredPastRecommendations || []);
        setDiscardedItems(parsedData.discardedItems || []);
        // Check if any past recommendations were deleted
        if (isPastRecommendationDlt) {
          console.log("PastRecomBeforeFetching: ", pastRecommendations);
          await fetchFood(filteredPastRecommendations);
        }
      } else {
        await fetchFood();
      }
    } catch (error) {
      console.error("Error loading data from AsyncStorage:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // To DELETE THE RECOMMENDATION
  const handleSelectFood = () => {
    const date = getTodayDate();
    const timestamp = new Date().getTime();
    if (foods.length > 1) {
      const foodId = foods[0].food_id;
      setPastRecommendations([
        { ...foods[0], date, timestamp },
        ...pastRecommendations,
      ]);
      const remainingFoods = foods.filter((item) => foodId !== item.food_id);
      setFoods(remainingFoods);
    } else
      Alert.alert(
        "Cannot Perform Action!",
        "Last Recommendation cannot be deleted."
      );
  };

  const handleDeleteFood = () => {
    const date = getTodayDate();
    const timestamp = new Date().getTime();
    if (foods.length > 1) {
      const foodId = foods[0].food_id;
      setDiscardedItems([{ ...foods[0], date, timestamp }, ...discardedItems]);
      const remainingFoods = foods.filter((item) => foodId !== item.food_id);
      setFoods(remainingFoods);
    } else
      Alert.alert(
        "Cannot Perform Action!",
        "Last Recommendation cannot be discarded."
      );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>
          Hello {userName},
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome Back</Text>
      </View>

      {/* To SELECT VEG AND NON-VEG */}
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            setPastRecommendations([]);
            setDiscardedItems([]);
            setFoodType("veg");
          }}
          style={[
            styles.buttonStyle,
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
            setPastRecommendations([]);
            setDiscardedItems([]);
            setFoodType("nonveg");
          }}
          style={[
            styles.buttonStyle,
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

      {/* To SELECT THE MEAL i.e. BREAKFAST, LUNCH OR DINNER */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              setPastRecommendations([]);
              setDiscardedItems([]);
              setSelectedMeal("Breakfast");
            }}
            style={[
              styles.buttonStyle,
              selectedMeal === "Breakfast"
                ? { backgroundColor: "#ffa300" }
                : { backgroundColor: "#f5f5f5" },
            ]}
          >
            <MaterialIcons
              name="free-breakfast"
              style={{ paddingTop: 3 }}
              size={18}
              color={selectedMeal === "Breakfast" ? "#f5f5f5" : "#4f4f4f"}
            />
            <Text
              style={[
                styles.sliderTextStyle,
                {
                  color: selectedMeal === "Breakfast" ? "#f5f5f5" : "#4f4f4f",
                },
              ]}
            >
              Breakfast
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPastRecommendations([]);
              setDiscardedItems([]);
              setSelectedMeal("Lunch");
            }}
            style={[
              styles.buttonStyle,
              selectedMeal === "Lunch"
                ? { backgroundColor: "#ffa300" }
                : { backgroundColor: "#f5f5f5" },
            ]}
          >
            <MaterialIcons
              name="lunch-dining"
              style={{ marginRight: 3 }}
              size={18}
              color={selectedMeal === "Lunch" ? "#f5f5f5" : "#4f4f4f"}
            />
            <Text
              style={[
                styles.sliderTextStyle,
                { color: selectedMeal === "Lunch" ? "#f5f5f5" : "#4f4f4f" },
              ]}
            >
              Lunch
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setPastRecommendations([]);
              setDiscardedItems([]);
              setSelectedMeal("Dinner");
            }}
            style={[
              styles.buttonStyle,
              selectedMeal === "Dinner"
                ? { backgroundColor: "#ffa300" }
                : { backgroundColor: "#f5f5f5" },
            ]}
          >
            <Text
              style={[
                styles.sliderTextStyle,
                { color: selectedMeal === "Dinner" ? "#f5f5f5" : "#4f4f4f" },
              ]}
            />
            <MaterialIcons
              name="dinner-dining"
              style={{ marginRight: 3 }}
              size={18}
              color={selectedMeal === "Dinner" ? "#f5f5f5" : "#4f4f4f"}
            />
            <Text
              style={[
                styles.sliderTextStyle,
                { color: selectedMeal === "Dinner" ? "#f5f5f5" : "#4f4f4f" },
              ]}
            >
              Dinner
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <Text
        style={{
          marginVertical: 15,
          fontSize: 18,
          fontWeight: "500",
          color: "#4f4f4f",
        }}
      >
        Recommendations
      </Text>

      {/* To DISPLAY RECOMMENDED FOOD ITEMS */}
      <View style={{ backgroundColor: "white", height: 320 }}>
        {loadingRecommendations ? (
          <LoadingScreen />
        ) : (
          <View style={styles.carouselFood}>
            <View style={styles.imageContainer}>
              <Image
                style={{ height: 200, width: 200, resizeMode: "contain" }}
                source={{
                  uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
                }}
              />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
              {foods[0].name}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleSelectFood}
                style={styles.carouselButton}
              >
                <Feather name="check" size={30} color="#ffa300" />
              </Pressable>
              <Pressable
                onPress={handleDeleteFood}
                style={styles.carouselButton}
              >
                <Feather name="x" size={30} color="black" />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* To LIST DOWN CHOSEN ITEMS OR DISCARDED ITEMS */}
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 7 }}>
        <Pressable
          onPress={() => {
            setPreviousData("Chosen");
          }}
          style={[
            styles.buttonStyle,
            previousData === "Chosen"
              ? { backgroundColor: "#ffa300", width: 170 }
              : { backgroundColor: "#f5f5f5", width: 170 },
          ]}
        >
          <Text
            style={[
              styles.sliderTextStyle,
              {
                color: previousData === "Chosen" ? "#f5f5f5" : "#4f4f4f",
              },
            ]}
          >
            Previously Chosen
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setPreviousData("Discarded");
          }}
          style={[
            styles.buttonStyle,
            previousData === "Discarded"
              ? { backgroundColor: "#ffa300", width: 170 }
              : { backgroundColor: "#f5f5f5", width: 170 },
          ]}
        >
          <Text
            style={[
              styles.sliderTextStyle,
              {
                color: previousData === "Discarded" ? "#f5f5f5" : "#4f4f4f",
              },
            ]}
          >
            Discarded
          </Text>
        </Pressable>
      </View>

      {/* To DISPLAY PAST RECOMMENDED ITEMS */}
      <View style={{ flex: 1 }}>
        {previousData === "Chosen" ? (
          <FlatList
            data={pastRecommendations}
            renderItem={({ item }) => (
              <View style={styles.pastRecommendationsContainer}>
                <View style={styles.pastRecommendedItems}>
                  <Image
                    style={{ height: 50, width: 50 }}
                    source={{
                      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
                    }}
                  />
                </View>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  {item.name}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.food_id}
          />
        ) : (
          <FlatList
            data={discardedItems}
            renderItem={({ item }) => (
              <View style={styles.pastRecommendationsContainer}>
                <View style={styles.pastRecommendedItems}>
                  <Image
                    style={{ height: 50, width: 50 }}
                    source={{
                      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
                    }}
                  />
                </View>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  {item.name}
                </Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.food_id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 30,
  },
  buttonStyle: {
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
  sliderTextStyle: {
    fontSize: 16,
    fontWeight: "500",
  },
  carouselFood: {
    width: "93%",
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: 12,
    // paddingHorizontal: 12,
    marginHorizontal: 10,
    backgroundColor: "#f5f5f5",
    // backgroundColor: "red",
    borderRadius: 15,
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "95%",
    marginTop: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  pastRecommendationsStyle: {
    marginLeft: 5,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#4f4f4f",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 20,
    gap: 10,
  },
  pastRecommendationsContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    marginVertical: 6,
    marginHorizontal: 10,
    padding: 8,
    gap: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  pastRecommendedItems: {
    backgroundColor: "white",
    borderRadius: 10,
    height: 50,
  },
  carouselButton: {
    width: 70,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
