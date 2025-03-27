import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgPost from "../../assets/postProfile";
import SvgPostActive from "../../assets/postprofileActive";
import SvgCollections from "../../assets/collection";
import SvgCollectionActive from "../../assets/collectionActive";
import SvgFav from "../../assets/favProfile";
import SvgFavActive from "../../assets/favActive"
import ProfilePost from "../Profile/ProfilePost";
import Collections from "../Home/Collections";


const SearchProfileDetail = () => {
  const [activeTab, setActiveTab] = useState("post");
  console.log("Active Tab:", activeTab);
  const renderContent = () => {
    switch (activeTab) {
      case "post":
        return <ProfilePost />;
      case "collections":
        return <Collections />;
      case "fav":
        return <Text>Favoriler Eklenecek</Text>;
      default:
        return null;
    }
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab("post")}>
          {activeTab === "post" ? <SvgPostActive /> : <SvgPost />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("collections")}>
          {activeTab === "collections" ? <SvgCollectionActive /> : <SvgCollections />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("fav")}>
          {activeTab === "fav" ? <SvgFavActive /> : <SvgFav />}
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal:20,
    marginTop:35,
    gap:61
  },
  contentContainer: {
    marginHorizontal:20,
    marginTop:15
  },
});

export default SearchProfileDetail;
