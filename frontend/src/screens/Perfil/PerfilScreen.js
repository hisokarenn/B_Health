import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilScreen({ setCurrentScreen }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text style={styles.texto}>
          Esta tela ainda está em manutenção!{"\n"}Aguarde mais um pouco..
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  texto: {
    marginTop: 300,
    textAlign: "center",
    fontSize: 17,
  },

});