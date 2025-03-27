import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleCategory } from "../../redux/slices/categoriesSlice";

const CategorySelector = ({categories, selectedCategories, dispatch}) => {
  const numColumns = 4;

  const numRows = Math.ceil(categories.length / numColumns);

  const columns = Array.from({ length: numColumns }, (_, colIndex) =>
    categories.filter((_, index) => index % numColumns === colIndex)
  );

  return (
    <View style={styles.container}>
      {columns.map((column, colIndex) => (
        <View key={colIndex} style={styles.column}>
          {column.map((category, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              style={styles.categoryContainer}
              onPress={() => dispatch(toggleCategory(category))}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedCategories.includes(category) && styles.checkedBox,
                ]}
              />
              <Text style={styles.text}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginHorizontal:23,
    paddingLeft:7
  },
  column: {
    width: "22%", 
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 5,
    borderRadius: 2,
  },
  checkedBox: {
    backgroundColor: "black",
  },
  text: {
    fontSize: 12,
    color: "#000000",
  },
});

export default CategorySelector;
