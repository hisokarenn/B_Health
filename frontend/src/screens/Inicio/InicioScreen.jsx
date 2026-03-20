import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function InicioScreen({ setScreen }) {
  return (
    <LinearGradient
      colors={["#0b2139ff", "#105eb1ff", "#b6d4ffff"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        
        <View style={styles.logoArea}>
          <View style={styles.logoIcone}/>
        </View>

        <Image 
          source={require("../../../assets/bhealth.png")}
          style={styles.img}
        />

        <Text style={styles.logoTexto}>B HEALTH</Text>

        <TouchableOpacity style={styles.btn} onPress={() => setScreen("login")}>
            <Text style={styles.btnTexto}>Entrar</Text>
          </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient:{
    flex:1,
  },

  container:{
    flex:1,
    alignItems:"center",
    color: "#638ea9ff"
  },

  logoArea:{
    alignItems:"center",
    marginTop:height * 0.09,   
  },

  logoIcone:{
    width:width * 0.06,
    height:width * 0.06,
    backgroundColor:"#c1ebffff",
    borderRadius:30,
    marginBottom:8
  },

  img:{
    width:width * 0.5,
    height:height * 0.28,
    resizeMode:"contain",
    marginTop:height * 0.09,
  },

  logoTexto:{
    fontSize:40,
    fontWeight:"700",
    color:"#c1ebffff",

  },

  btn:{
    width:"80%",
    backgroundColor: "rgba(0,0,0,0)",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems:"center",
    marginBottom:14,
    marginTop: height * 0.31,
    borderColor: "rgba(255, 255, 255, 1)",
    borderWidth: width * 0.004
  },

  btnTexto:{
    color:"#fff",
    fontSize: width * 0.05,
    fontWeight:"600"
  },
});

export default InicioScreen;