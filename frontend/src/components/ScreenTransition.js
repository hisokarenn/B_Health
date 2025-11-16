import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function ScreenTransition({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0.8);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [children]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {children}
    </Animated.View>
  );
}

//é um componente que vai ser reutilizado várias vezes nas transições das telas