import { StyleSheet, Text, View } from 'react-native'
import SvgHidden from "../../assets/hidden"

const SearchProfileHidden = () => {
  return (
    <View style={styles.container}>
      <SvgHidden style={styles.icon}/>
      <View style={styles.textContainer}>
        <Text style={styles.textHeader}>Bu hesap gizli</Text>
        <Text style={styles.text}>Fotoğraf ve videoları görebilmek için bu hesabı takip et</Text>
      </View>
    </View>
  )
}

export default SearchProfileHidden

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        backgroundColor:"#F0F0F0",
        flexDirection:"row",
        height:85,
        borderRadius:10,
        alignItems:"center",
        gap:9,
        marginTop:50
    },
    icon:{
        marginLeft:10
    },
    textContainer:{
        gap:2
    },
    textHeader:{
        fontSize:14,
        fontWeight: "600",
        color:"#000000"
    },
    text:{
        fontSize:14,
        color:"#9D9C9C",
        width:228
    }
})