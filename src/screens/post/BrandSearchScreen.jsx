import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import SvgSearch from '../../assets/searchpeople';
import { width } from '../../utils/helpers';
import { useState } from 'react';

const BrandSearchScreen = () => {
     const [searchText, setSearchText] = useState('');
        const [isFocused, setIsFocused] = useState(false);

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                {/* Search Box */}
                <View style={styles.searchContainer}>
                  <SvgSearch style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Marka ara"
                    placeholderTextColor="#BBBBBB"
                    onChangeText={(text) => {
                      setSearchText(text);
                      if (text.trim() === '') {
                        setSelectedUser(null);
                      }
                    }}
                    value={searchText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor="#D134AA"
                  />
                </View>
        
                {/* User List would go here */}
              </View>
            </TouchableWithoutFeedback>
          );
        };
        
        export default BrandSearchScreen;
        
        const styles = StyleSheet.create({
          container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
           
          },
          searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 30,
            borderWidth: 1,
            borderColor: '#000',
            paddingHorizontal: 10,
            height: 44,
            width: '100%',
            marginTop:20
          },
          searchIcon: {
            marginRight: 8,
          },
          searchInput: {
            flex: 1,
            fontSize: 14,
            color: '#000',
            fontWeight: '500',
          },
        });