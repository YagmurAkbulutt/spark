import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { width } from '../../utils/helpers'

const Trends = () => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.text}>Trendler</Text>
        <Text style={styles.allText}>Hepsi</Text>
      </View>
      <View style={styles.trends}>
        <View>
            <TouchableOpacity activeOpacity={0.7}>
                <Image style={styles.trendOne} source={require("../../assets/trend-1.png")}/>
                <Text style={styles.trendText}>Plaj Modası</Text>
        </TouchableOpacity>

        </View>
        <View style={styles.trendRight}>
        <TouchableOpacity activeOpacity={0.7}>
        <Image style={styles.trendTwo} source={require("../../assets/trend-3.png")}/>
        <Text style={styles.trendText}>Celebrity</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
        <Image style={styles.trendTwo} source={require("../../assets/trend-2.png")}/>
        <Text style={styles.trendText}>Kapsül Dolap</Text>
        </TouchableOpacity>

        </View>

      </View>
    </View>
  )
}

export default Trends

const styles = StyleSheet.create({
    header:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginHorizontal:20,
        marginBottom:15
    },
    text:{
        fontSize:20,
        fontWeight: "600"
    },
    allText:{
        fontSize:14
    },
    trends:{
        flexDirection:"row",
        gap:2,
        marginBottom:30
    },
    trendRight:{
        gap:2
    },
    trendOne:{
        width: width * 0.60,
        position: "relative"
    },
    trendText:{
        position:"absolute",
        bottom:5,
        backgroundColor:"#FFFFFF",
        opacity: 0.80,
        color: "#000000",
        padding:7,
        borderRadius:31,
        fontSize:11,
        paddingVertical:5,
        left:5
    },
    trendTwo:{
        width: width * 0.40,
        position: "relative"
    }
})