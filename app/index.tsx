import {Animated, Text} from "react-native";
import View = Animated.View;
import {Redirect} from "expo-router";

const Home = () => {
    // @ts-ignore
    return <Redirect href="/(screens)/welcome" />;
};

export default Home;