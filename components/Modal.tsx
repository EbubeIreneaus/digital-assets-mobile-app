import React, { useState } from "react";
import { Modal } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

type Props = {
    children: React.ReactNode
}
const CustomModal: React.FC<Props> = ({children}) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal animationType="slide" visible={isVisible} transparent={true} onRequestClose={()}>
            {children}
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CustomModal;
