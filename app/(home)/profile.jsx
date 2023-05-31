import { View, Text, StyleSheet } from 'react-native'; 
import { Button } from 'react-native-paper';
import { supabase } from "../../lib/supabase";

export default function Profile() {
    return (
        <View style = {styles.container}>
            <Text>
                Profile page
            </Text>
            <Button onPress = {() => supabase.auth.signOut()}>log out</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },

});