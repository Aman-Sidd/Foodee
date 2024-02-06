import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { Image } from "react-native";
import { Feather } from "@expo/vector-icons";

const HomeScreen = () => {
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");
  const recommendations = [
    {
      id: 1,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
    {
      id: 2,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
    {
      id: 3,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
  ];
  const pastRecommendations = [
    {
      id: 1,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
    {
      id: 2,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
    {
      id: 3,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
    {
      id: 4,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
    {
      id: 5,
      uri: "https://png.pngtree.com/png-clipart/20220206/original/pngtree-burger-vector-png-image_7263846.png",
    },
  ];

  const handlePressMeal = (mealCategory) => {
    setSelectedMeal(mealCategory);
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>Hello Prakhar,</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome Back</Text>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => setSelectedMeal("Breakfast")}
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
                { color: selectedMeal === "Breakfast" ? "#f5f5f5" : "#4f4f4f" },
              ]}
            >
              Breakfast
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedMeal("Lunch")}
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
            onPress={() => setSelectedMeal("Snacks")}
            style={[
              styles.buttonStyle,
              selectedMeal === "Snacks"
                ? { backgroundColor: "#ffa300" }
                : { backgroundColor: "#f5f5f5" },
            ]}
          >
            <Text
              style={[
                styles.sliderTextStyle,
                { color: selectedMeal === "Snacks" ? "#f5f5f5" : "#4f4f4f" },
              ]}
            />
            <MaterialIcons
              name="free-breakfast"
              style={{ paddingTop: 3 }}
              size={18}
              color={selectedMeal === "Snacks" ? "#f5f5f5" : "#4f4f4f"}
            />
            <Text
              style={[
                styles.sliderTextStyle,
                { color: selectedMeal === "Snacks" ? "#f5f5f5" : "#4f4f4f" },
              ]}
            >
              Snacks
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedMeal("Dinner")}
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

      <View>
        <FlatList
          data={recommendations}
          renderItem={({ item }) => (
            <View style={styles.carouselFood}>
              <View style={styles.imageContainer}>
                <Image
                  style={{ height: 200, width: 200, resizeMode: "contain" }}
                  source={{
                    uri: item.uri,
                  }}
                />
              </View>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Burger</Text>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.carouselButton}>
                  <Feather name="check" size={30} color="#ffa300" />
                </Pressable>
                <Pressable style={styles.carouselButton}>
                  <Feather name="x" size={30} color="black" />
                </Pressable>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
        }}
      >
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            fontWeight: "500",
            color: "#4f4f4f",
          }}
        >
          Past Recommendations
        </Text>
        <Text
          style={{
            marginTop: 20,
            fontSize: 18,
            fontWeight: "500",
            color: "#ffa300",
          }}
        >
          See All
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={pastRecommendations}
          renderItem={({ item }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#f5f5f5",
                marginVertical: 6,
                marginHorizontal: 10,
                padding: 8,
                gap: 8,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  height: 50,
                }}
              >
                <Image
                  style={{ height: 50, width: 50 }}
                  source={{
                    uri: item.uri,
                  }}
                />
              </View>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Burger</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
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
    width: 320,
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
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 20,
    gap: 10,
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
