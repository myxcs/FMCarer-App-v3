import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../store/authStore';


export default function Profile() {
   const { user, token, logout } = useAuthStore();
  return (
  <View>
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', padding: 10, paddingTop: 200 }} onPress={() => logout()}>
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
  )
}