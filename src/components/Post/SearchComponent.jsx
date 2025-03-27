import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SvgSearch from '../../assets/search';
import { FlatList, TextInput } from "react-native-gesture-handler";
import CategorySelector from "./CategorySelector";
import CategoryDetail from "./CategoryDetail";

const SearchComponent = () => {
    const categories = useSelector((state) => state.category.categories);  // Kategorileri state'ten alıyoruz
    const selectedCategories = useSelector((state) => state.category.selectedCategories);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!searchQuery.trim()) {
            // Eğer arama yapılmıyorsa, tüm kategorileri göster
            setFilteredCategories(categories);
        } else {
            // Arama yapılırsa, kategori adlarını filtrele
            const filtered = categories.filter(
                (category) =>
                    category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCategories(filtered);  // Filtrelenmiş kategoriler
        }
    }, [searchQuery, categories]);

     // Kategorileri arama ve seçili kategorilerle birleştiriyoruz
     const combinedCategories = [
        ...selectedCategories,
        ...filteredCategories.filter(
            (category) => !selectedCategories.includes(category)
        ),
    ];

    return (
      <View>
        <View style={styles.searchContainer}>
          <View style={styles.iconContainer}>
            <SvgSearch style={styles.searchIcon} />
          </View>
          <TextInput
            placeholder="Kategori Ara"
            style={styles.searchInput}
            placeholderTextColor="#9D9C9C"
            selectionColor="#D134AA"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
        
        {/* Seçili Kategorileri Gösteren Bileşen */}
        <CategorySelector
          categories={combinedCategories}
          selectedCategories={selectedCategories}
          dispatch={dispatch}
        />
         {selectedCategories.map((category, index) => (
            <CategoryDetail key={index} selectedCategory={category} />
        ))}

        
      </View>
    );
};

const styles = {
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 35,
        paddingHorizontal: 10,
        height: 40,
        width: 353,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 23,
        marginTop: 15,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        paddingLeft: 5,
    },
};

export default SearchComponent;
