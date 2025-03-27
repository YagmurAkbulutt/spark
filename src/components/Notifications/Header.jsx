import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SvgBack from "../../assets/back"
import SvgFilter from "../../assets/filter"
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'


const Header = () => {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><SvgBack style={{width:24, height:24}}/></TouchableOpacity>
        <Text style={styles.text}>Bildirimler</Text>
      </View>
      <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}
            activeOpacity={0.7}>
      <SvgFilter/>
      </TouchableOpacity>
      
      </View>

    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginHorizontal:20,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 

    },
    header:{
        flexDirection:"row",
        alignItems:"center",
        gap:8
    },
    text:{
        fontSize: 16,
        fontWeight:"600"
    }
})