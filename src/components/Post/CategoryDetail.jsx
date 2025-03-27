import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { height } from '../../utils/helpers'
import SvgNext from "../../assets/nextSm"

const CategoryDetail = ({ selectedCategory }) => {
  return (
    <View style={styles.container}>
        <Text style={styles.header}>{ selectedCategory }</Text>
        <View style={styles.selectionContainer}>
      <TouchableOpacity style={styles.selection} activeOpacity={0.7}>
        <Text style={styles.text}>Marka</Text>
        <SvgNext style={styles.button}/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.selection} activeOpacity={0.7}>
        <Text style={styles.text}>Renk</Text>
        <SvgNext style={styles.button}/>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default CategoryDetail

const styles = StyleSheet.create({
    container:{
        marginTop:20
    },
    header:{
        fontSize:16,
        fontWeight:"500",
        marginHorizontal:23,
        marginBottom:10
    },
    selectionContainer:{
        gap:2
    },
    selection:{
        backgroundColor:"#F0F0F0",
        height:height* 0.06,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
    },
    text:{
        marginHorizontal:23,
        fontWeight:"300",
        fontSize:15
    },
    button:{
        marginHorizontal:23
    }
})