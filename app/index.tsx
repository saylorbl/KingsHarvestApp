import {Animated, Text} from "react-native";
import View = Animated.View;
import {Redirect} from "expo-router";
import { useAuth } from "@clerk/clerk-expo"

const Home = () => {
    const {isSignedIn} = useAuth();

    if(isSignedIn){
        return <Redirect href={"/(root)/(screens)/welcome"} />
    }
    return <Redirect href="/(auth)/sign-up" />;
};

export default Home;