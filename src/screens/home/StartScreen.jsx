import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Home/Header';
import FollowCard from '../../components/Home/FollowCard';

const StartScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Sadece bu ekranda TabBar'ı göster
        navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });

        // return () => {
        //     // Başka bir ekrana geçince tekrar gizle
        //     navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
        // };
    }, [navigation]);
  return (
    <View style={styles.container}>
      <Header/>
      <FollowCard/>
    </View>
  )
}

export default StartScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#FFFFFF",
    flex:1
  }
})