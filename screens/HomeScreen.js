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
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
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
  const user = useSelector((state) => state.user);
  const userName = user.user_name;
  const userFoodType = user.food_type;

  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const [foods, setFoods] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [pastRecommendations, setPastRecommendations] = useState([]);
  const [foodType, setFoodType] = useState(userFoodType);
  const [previousData, setPreviousData] = useState("Chosen");
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const carouselRef = useRef(null);
  const paginationRef = useRef(null);
  moment.tz.setDefault("Asia/Kolkata");

  const getTodayDate = () => {
    return moment().format("YYYY-MM-DD");
  };
  const timestamp = new Date().getTime();

  const deleteAsyncData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys);
      await AsyncStorage.multiRemove(keys);
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
      setCarouselItems([
        {
          ...response.data.data[0],
          timestamp,
          date: getTodayDate(),
          isSelected: null,
        },
      ]);
    } catch (err) {
      console.log("ERROR: fetching breakfast", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    // Load data from AsyncStorage when the component mounts
    loadData();
    // deleteAsyncData();
  }, [foodType, selectedMeal]);

  useEffect(() => {
    // Save data to AsyncStorage whenever relevant state changes
    saveData();
  }, [foods, pastRecommendations, carouselItems]);

  const saveData = async () => {
    try {
      const data = {
        foods,
        pastRecommendations,
        carouselItems,
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
    console.log("LOADING DATA");
    setLoadingRecommendations(true);
    try {
      let isPastRecommendationDlt = false;
      const userData = await AsyncStorage.getItem(`${foodType}${selectedMeal}`);
      console.log("ASYNC USERDATA: ", userData);
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        const currentTime = new Date().getTime(); // Current timestamp
        const currentDate = moment().tz("Asia/Kolkata").startOf("day");
        const filteredPastRecommendations =
          parsedData.pastRecommendations.filter((item) => {
            // const diffMillis = currentTime - item.timestamp;
            // const diffSec = diffMillis / 1000; // Convert milliseconds to seconds
            // console.log("TIME DIFF: ", diffSec);
            // if (diffSec <= 1000) {
            //   return true;
            // } else {
            //   isPastRecommendationDlt = true;
            //   return false;
            // }
            const storedDate = moment
              .tz(item.date, "Asia/Kolkata")
              .startOf("day"); // Convert stored date string to moment object in Asia/Kolkata time zone, with time set to 00:00:00
            console.log("CURRENT DATE: ", currentDate);
            console.log("STORED DATE: ", storedDate);
            const diffInDays = currentDate.diff(storedDate, "days"); // Difference in days
            console.log("Days difference: ", diffInDays);
            const diffMillis = currentTime - item.timestamp;
            const diffSec = diffMillis / 1000; // Convert milliseconds to seconds
            console.log("TIME DIFF: ", diffSec);
            if (diffInDays <= 7) {
              return true;
            } else {
              isPastRecommendationDlt = true;
              return false;
            }
            // Refresh after 7 day old for each item
            // const storedDate = moment
            //   .tz(item.date, "Asia/Kolkata")
            //   .startOf("day"); // Convert stored date string to moment object in Asia/Kolkata time zone, with time set to 00:00:00
            // console.log("CURRENT DATE: ", currentDate);
            // console.log("STORED DATE: ", storedDate);
            // const diffInDays = currentDate.diff(storedDate, "days"); // Difference in days
            // console.log("Days difference: ", diffInDays);
            // return diffInDays <= 7;
          });

        // Updates Carousel Food list at 11 PM everyday
        // const carouselUpdate =
        //   (currentTime - parsedData.carouselItems[0].timestamp) / 1000 >= 1000
        //     ? true
        //     : false;

        setFoods(parsedData.foods || []);
        setPastRecommendations(filteredPastRecommendations || []);
        parsedData.carouselItems.sort((a, b) => {
          if (a.isSelected === "selected" && b.isSelected === "discarded") {
            return -1;
          } else if (
            a.isSelected === "discarded" &&
            b.isSelected === "selected"
          ) {
            return 1;
          } else return 0;
        });

        setCarouselItems(parsedData.carouselItems || []);

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

  useEffect(() => {
    // Set up the timer to trigger the update at 11 PM
    const timer = setTimeout(updateCarousel, calculateTimeToNextUpdate());

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [carouselItems]);

  const updateCarousel = async () => {
    // Fetch new data and update the carousel
    await fetchFood();
  };

  const calculateTimeToNextUpdate = () => {
    const now = moment();
    const elevenPM = moment().hour(23).minute(0).second(0); // Set the time to 11 PM
    if (now.isAfter(elevenPM)) {
      elevenPM.add(1, "day"); // If it's past 11 PM, set it to 11 PM of the next day
    }
    const diffInMilliseconds = elevenPM.diff(now);
    return diffInMilliseconds;
  };

  // To DELETE THE RECOMMENDATION
  const handleSelectFood = (id, index) => {
    const date = getTodayDate();
    const timestamp = new Date().getTime();

    const foodId = id;
    console.log("INDEX:", index);
    setPastRecommendations([
      { ...carouselItems[index], date, timestamp },
      ...pastRecommendations,
    ]);
    const remainingFoods = foods.filter((item) => foodId !== item.food_id);
    const updatedCarouselItems = carouselItems.map((item) => {
      if (item.food_id === id) {
        item.isSelected = "selected";
      } else item.isSelected = "discarded";
      return item;
    });
    // updatedCarouselItems.sort((a, b) => {
    //   if (a.isSelected === "selected" && b.isSelected === "discarded") {
    //     return -1;
    //   } else if (a.isSelected === "discarded" && b.isSelected === "selected") {
    //     return 1;
    //   } else return 0;
    // });

    setFoods(remainingFoods);
    setCarouselItems(updatedCarouselItems);
    // if (carouselRef.current) {
    //   carouselRef.current.snapToItem(0);
    // }
  };

  const handleDeleteFood = () => {
    const date = getTodayDate();
    const timestamp = new Date().getTime();
    if (foods.length > 1) {
      const foodId = foods[0].food_id;
      setCarouselItems([{ ...foods[1], date, timestamp }, ...carouselItems]);
      const remainingFoods = foods.filter((item) => foodId !== item.food_id);
      setFoods(remainingFoods);
    } else
      Alert.alert(
        "Maximum Recommendations Reached!",
        "You've reached the maximum limit of recommendations for today. Please select from the existing 6."
      );
  };

  const _renderItem = ({ item, index }) => {
    console.log("ITEM: ", item);
    return (
      <View style={styles.carouselFood}>
        <View style={styles.imageContainer}>
          <Image
            style={{
              height: 150,
              width: 150,
              resizeMode: "contain",
              borderRadius: 10,
            }}
            source={{
              // uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
              uri: item.image,
            }}
          />
        </View>
        <Text style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}>
          {item.name}
        </Text>

        {item.isSelected === "selected" ? (
          <View
            style={{
              margin: 6,
              marginBottom: 9,
              // backgroundColor: "#CCCCCC",
              padding: 5,
              alignSelf: "center",
              borderRadius: 7,
            }}
          >
            <Text
              style={{ color: "black", fontWeight: "bold", color: "#008000" }}
            >
              SELECTED
            </Text>
          </View>
        ) : item.isSelected === "discarded" ? (
          <View style={{ margin: 6, marginBottom: 9, alignSelf: "center" }}>
            <Text>NOT SELECTED</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => handleSelectFood(item.food_id, index)}
              style={styles.carouselButton}
            >
              <Feather name="check" size={30} color="#ffa300" />
            </Pressable>
            <Pressable onPress={handleDeleteFood} style={styles.carouselButton}>
              <Feather name="x" size={30} color="black" />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "500" }}>
          Hello {userName},
        </Text>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>Welcome Back</Text>
      </View>

      {/* To SELECT VEG AND NON-VEG */}
      {/* <View style={{ display: "flex", flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            setPastRecommendations([]);
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
      </View> */}

      {/* To SELECT THE MEAL i.e. BREAKFAST, LUNCH OR DINNER */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              setPastRecommendations([]);
              setActiveSlide(0);
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
              setActiveSlide(0);

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
              setActiveSlide(0);
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
      <View>
        <Text
          style={{
            marginVertical: 10,
            fontSize: 18,
            fontWeight: "500",
            color: "#4f4f4f",
          }}
        >
          Recommendations
        </Text>
      </View>

      {/* To DISPLAY RECOMMENDED FOOD ITEMS */}
      {/* <View style={{ backgroundColor: "white", height: 320 }}>
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
      </View> */}

      <View style={styles.carouselContainer}>
        {loadingRecommendations ? (
          <LoadingScreen />
        ) : (
          <View
            style={{
              height: 320,
              // backgroundColor: "red",
              padding: 10,
            }}
          >
            <View
              style={{
                padding: 10,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                // paddingTop: 12,
                // paddingHorizontal: 12,
                // marginHorizontal: 20,
                backgroundColor: "#f5f5f5",
                // backgroundColor: "red",
                borderRadius: 15,
              }}
            >
              <Carousel
                ref={carouselRef}
                layout={"default"}
                data={carouselItems}
                renderItem={_renderItem}
                sliderWidth={Dimensions.get("window").width - 60}
                // sliderWidth={100}
                itemWidth={Dimensions.get("window").width - 60} // You can adjust the width of each item as per your requirement
                // itemWidth={100} // You can adjust the width of each item as per your requirement
                onSnapToItem={(index) => setActiveSlide(index)}
                activeSlide={activeSlide}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Pagination
                dotsLength={carouselItems.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.dotStyle}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
          </View>
        )}
      </View>

      {/* To LIST DOWN CHOSEN ITEMS OR DISCARDED ITEMS */}
      <View style={{ flex: 1 }}>
        {/* To DISPLAY PAST RECOMMENDED ITEMS */}
        <View style={{}}>
          <Pressable
            onPress={() => {
              setPreviousData("Chosen");
            }}
            style={[
              styles.buttonStyle,
              previousData === "Chosen"
                ? { backgroundColor: "#ffa300", width: 170 }
                : { backgroundColor: "#f5f5f5", width: 170 },
              { marginBottom: 8 },
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
          <FlatList
            data={pastRecommendations}
            renderItem={({ item }) => (
              <View style={styles.pastRecommendationsContainer}>
                <View style={styles.pastRecommendedItems}>
                  <Image
                    style={{ height: 50, width: 50, borderRadius: 5 }}
                    source={{
                      // uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
                      uri: item.image,
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
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    // backgroundColor: "#fff",
    // backgroundColor: "blue",
    alignItems: "center",
    height: 300,
    marginBottom: 20,
    // justifyContent: "center",
  },
  slide: {
    width: 200,
    height: 200,
    backgroundColor: "skyblue",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paginationContainer: {
    paddingVertical: 8,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
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
    // width: "93%",
    // alignItems: "center",
    // justifyContent: "center",
    // // paddingTop: 12,
    // // paddingHorizontal: 12,
    // marginHorizontal: 10,
    // backgroundColor: "#f5f5f5",
    // // backgroundColor: "red",
    // borderRadius: 15,
  },
  imageContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    // borderWidth: 6,
    // borderColor: "red",
    width: "50%",
    marginTop: 7,
    paddingVertical: 12,
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
    justifyContent: "center",
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
