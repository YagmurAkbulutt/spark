import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
  } from 'react-native';

const Collections = () => {
  return (
    <>
    <View style={styles.collectionsContainer}>
                <TouchableOpacity style={styles.collectionItem} activeOpacity={0.7}>
                  <View style={styles.night}>
                    {[...Array(5)].map((_, index) => (
                      <Image
                        key={index}
                        source={require('../../assets/night.png')}
                        style={[
                          styles.image,
                          {
                            left: -index * 24,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.collectionTitle}>Gece Şıklığı</Text>
                  <Text style={styles.collectionCount}>320 fotoğraf</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.collectionItem} activeOpacity={0.7}>
                  <Image source={require('../../assets/sport.png')} style={styles.singleImage} />
                  <Text style={styles.collectionTitle}>Spor Şıklığı</Text>
                  <Text style={styles.collectionCount}>320 fotoğraf</Text>
                </TouchableOpacity>
              </View>
    
              <View style={styles.collectionsContainer}>
                <TouchableOpacity style={styles.collectionItem} activeOpacity={0.7}>
                  <Image source={require('../../assets/sport.png')} style={styles.singleImage} />
                  <Text style={styles.collectionTitle}>Spor Şıklığı</Text>
                  <Text style={styles.collectionCount}>320 fotoğraf</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.collectionItem} activeOpacity={0.7}>
                  <Image source={require('../../assets/sport.png')} style={styles.singleImage} />
                  <Text style={styles.collectionTitle}>Spor Şıklığı</Text>
                  <Text style={styles.collectionCount}>320 fotoğraf</Text>
                </TouchableOpacity>
              </View>
              </>
  )
}

export default Collections

const styles = StyleSheet.create({
    night: {
        width: 250,
        height: 102,
        position: 'relative',
        marginLeft: 100,
      },
      image: {
        width: 78,
        height: 102,
        borderRadius: 4,
        position: 'absolute',
        resizeMode: 'cover',
      },
      collectionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',  // Allow wrapping
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 10,
      },
      collectionItem: {
        width: '48%',  // This will make each item take up about half of the container
        justifyContent: 'flex-start',
        marginBottom: 20, // Add spacing between rows
      },
      // singleImage: {
      //   width: '100%',
      //   height: 140,
      //   borderRadius: 10,
      // },
      collectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
      },
      collectionCount: {
        fontSize: 12,
        color: '#666',
      },
})