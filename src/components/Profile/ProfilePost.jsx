import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { post } from '../../utils/helpers'

const ProfilePost = () => {
  return (
    <FlatList
      data={post}
      keyExtractor={(item) => item.id.toString()}
      numColumns={3}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Image source={item.postPhoto} style={styles.image} />
        </View>
      )}
    />
  )
}

export default ProfilePost

const styles = StyleSheet.create({
    columnWrapper: {
        justifyContent: "space-between", 
        marginHorizontal: -2, 
      },
    itemContainer: {
        flex: 1,
        margin:1
      },
      image: {
        width: 120,
        height: 177,
        borderRadius: 4,
      },
})