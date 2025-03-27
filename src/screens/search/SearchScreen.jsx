import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import SearchInput from '../../components/Search/SearchInput'
import Trends from '../../components/Search/Trends'
import FollowCard from '../../components/Home/FollowCard'
import { useState } from 'react'
import SearchPeople from '../../components/Search/SearchPeople'

const SearchScreen = ({navigation}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[0]}
      >
          <SearchInput onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}/>
        
        {!isFocused && (
          <>
            <Trends />
            <Text style={styles.text}>Beğeneceğin Kullanıcılar</Text>
            <FollowCard />
          </>)}
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#FFFFFF",
    flex:1
    
  },
  scrollContainer: {
    paddingBottom: 20, 
  },
  stickyHeader: {
    backgroundColor: "#fff", 
    paddingVertical: 10, 
    zIndex: 10, 
  },
  text:{
    fontSize:16,
    fontWeight: "600",
    color:"#000000",
    marginHorizontal:20,
    marginBottom:-8
  }
})