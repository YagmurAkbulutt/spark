
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SvgPost from "../../assets/postProfile";
import SvgPostActive from "../../assets/postprofileActive";
import SvgCollections from "../../assets/collection";
import SvgCollectionActive from "../../assets/collectionActive";
import SvgFav from "../../assets/favProfile";
import SvgFavActive from "../../assets/favActive"
import ProfilePost from "../Profile/ProfilePost";
import Collections from "../Home/Collections";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedPosts, fetchUserPosts } from "../../redux/actions/postActions";
import { useEffect, useState } from "react";


const SearchProfileDetail = () => {
  const [activeTab, setActiveTab] = useState("post");
  const dispatch = useDispatch()
  const route = useRoute();

  const userInfo = useSelector((state) => state.user);
  const  userId  = userInfo?.userInfo.id

   const userPosts = useSelector((state) => state.posts.userPosts);
   const loading = useSelector((state) => state.posts.loading);
   const error = useSelector((state) => state.posts.error);


  console.log("useerid", userId)
  console.log("userinfo", userInfo)
console.log("userPosts",userPosts)



  useEffect(() => {
     if (activeTab === "post") {
       dispatch(fetchUserPosts(userId)); 
     }
   }, [activeTab, dispatch]);
   

  const renderContent = () => {
    switch (activeTab) {
      case "post":
        return <ProfilePost posts={userPosts} />;
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
// const userId = useSelector((state) => state.user.userInfo?.id);
//   const { userPosts, loading, error } = useSelector((state) => state.posts);
// console.log("userpost", userPosts)
//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchFeedPosts(userId));
//     }
//   }, [userId]);