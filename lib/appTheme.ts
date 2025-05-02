import { useColorScheme } from "react-native";
import Colors from "./color";

export default function useAppTheme(){
    const colorScheme = useColorScheme();
    const backgroundColor = colorScheme == 'dark'? Colors.bgDark : Colors.bgLight;
    const bgColor = colorScheme === "dark" ? Colors.dark : Colors.light;
    const textColor = colorScheme === "dark" ? Colors.textLight : Colors.textDark;
    const primaryColor = Colors.primary;
    return { bgColor, textColor, primaryColor, backgroundColor };
}