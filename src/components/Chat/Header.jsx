import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SvgBack from "../../assets/back"
import { useNavigation } from '@react-navigation/native'

const Header = ({userInfo}) => {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
      <SvgBack/>
      </TouchableOpacity>
      <Image source={userInfo?.userImage} style={styles.userImage} />
      <Text style={styles.username}>{userInfo?.username}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        gap:12,
        alignItems:"center",
        marginLeft:20,
        paddingBottom:10,
        marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, 
        
    },
    userImage:{
        width:37,
        height:37
    },
    username:{
        fontSize:14,
        fontWeight:"600"
    }
})