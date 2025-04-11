import { FlatList, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import SvgSearchPeople from '../../assets/searchpeople';
import { useEffect, useState } from 'react';
import { messageList, users, width } from '../../utils/helpers';
import SearchPeople from './SearchPeople';
import { useDispatch, useSelector } from 'react-redux';
import { searchProfile } from '../../redux/actions/searchActions';



const SearchInput = () => {
    const [searchText, setSearchText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const dispatch = useDispatch();
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Get data from Redux
    const { users, status, error } = useSelector((state) => state.searchProfile);

    // Single API call effect
    useEffect(() => {
        console.log(`🔍 Arama Terimi: "${searchText}"`);
    
        if (searchText.trim() === '') {
            console.log('🚫 Boş sorgu, API çağrısı yapılmayacak.');
        } else {
            console.log(`📡 API çağrısı yapılıyor: users/search?q=${searchText}`);
            dispatch(searchProfile(searchText));
        }
    }, [searchText, dispatch]);

    useEffect(() => {
        if (searchText.trim() === '') {
          setFilteredUsers([]); 
        } else {
          const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchText.toLowerCase()),
          );
          setFilteredUsers(filtered);
        }
    }, [searchText]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.scontainer}>
                {/* Arama Kutusu */}
                <View style={styles.searchContainer}>
                    <SvgSearchPeople style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Kişi, kıyafet kodu veya koleksiyon ara"
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

                {/* Kullanıcı Listesi */}
                 {(isFocused || filteredUsers.length > 0) && (
                <SearchPeople isFocused={isFocused} filteredUsers={filteredUsers} />
            )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SearchInput;

const styles = StyleSheet.create({
    scontainer: {
        alignItems: "center",
        width: width * 0.90,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom:20
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#000",
        paddingHorizontal: 10,
        height: 44,
        width: "100%"
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#000",
        fontWeight:"500",
    },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: width * 0.85,
    marginTop: 15
},
userImage: {
    width: 56,
    height: 56,
    borderRadius: 30,
    marginRight: 10,
    position:"relative"
},
icon:{
    position:"absolute",
    bottom:-2,
    right:5

},
userInfo: {
    flex: 1,
    gap:4
},
username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
},
userHandle: {
    fontSize: 14,
    color: "#9D9C9C",
    fontWeight: "400"
},
});
