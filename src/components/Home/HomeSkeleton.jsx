import {View, StyleSheet, Dimensions, SafeAreaView} from 'react-native';

const {width} = Dimensions.get('window');

const HomeSkeleton = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftrect}>
          <View style={[styles.LeftRect, styles.placeholder]} />
          <View style={[styles.Rect, styles.placeholder]} />
        </View>
        <View style={[styles.RightRect, styles.placeholder]} />
      </View>

      {/* Birinci */}
      <View style={styles.grid}>
        <View>
          <View style={styles.boxHeader}>
            <View style={[styles.circle, styles.placeholder]} />
            <View style={[styles.boxRect, styles.placeholder]} />
          </View>
          <View style={[styles.boxLeft, styles.placeholder]} />
        </View>

        <View>
          <View style={styles.firstBoxHeader}>
            <View style={[styles.circle, styles.placeholder]} />
            <View style={[styles.boxRect, styles.placeholder]} />
          </View>
          <View style={[styles.boxRight, styles.placeholder]} />
        </View>
      </View>

      {/* İkinci */}
      <View style={styles.grid}>
        <View>
          <View style={styles.secondBoxHeader}>
            <View style={[styles.circle, styles.placeholder]} />
            <View style={[styles.boxRect, styles.placeholder]} />
          </View>
          <View style={[styles.boxLeft, styles.placeholder]} />
        </View>

        <View>
          <View style={styles.secRightBoxHeader}>
            <View style={[styles.circle, styles.placeholder]} />
            <View style={[styles.boxRect, styles.placeholder]} />
          </View>
          <View style={[styles.boxRight, styles.placeholder]} />
        </View>
      </View>

      {/* Üçüncü */}
      <View style={styles.grid}>
        <View>
          <View style={styles.boxHeader}>
            <View style={[styles.circle, styles.placeholder]} />
            <View style={[styles.boxRect, styles.placeholder]} />
          </View>
          <View style={[styles.boxLeft, styles.placeholder]} />
        </View>

        <View>
          <View style={styles.thirdBoxHeader}>
            <View style={[styles.circle, styles.placeholder]} />
            <View style={[styles.boxRect, styles.placeholder]} />
          </View>
          <View style={[styles.boxRight, styles.placeholder]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingTop: Platform.OS === 'android' ? 0 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 20,
  },
  leftrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 27,
  },
  LeftRect: {
    width: width * 0.1,
    height: 15,
    borderRadius: 18,
  },
  Rect: {
    width: width * 0.2,
    height: 15,
    borderRadius: 18,
  },
  RightRect: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
    marginTop: -50,
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  secondBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
    marginTop: 15,
  },
  secRightBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
    marginTop: -130,
  },
  thirdBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
    marginTop: -215,
  },
  boxRect: {
    width: width * 0.2,
    height: 7,
    borderRadius: 18,
  },
  boxLeft: {
    width: (width - 40) / 2,
    height: 265,
    borderRadius: 5,
  },
  boxRight: {
    width: (width - 40) / 2,
    height: 215,
    borderRadius: 10,
  },
  placeholder: {
    backgroundColor: '#F4F5F6',
  },
});

export default HomeSkeleton;
