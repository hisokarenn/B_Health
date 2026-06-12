import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const ICONE_TAM = width * 0.05;

export default function BottomNav({ active, setScreen, temNotificacao }) { 
    const activeItem = active === "home" ? "menu" : active;
    const isActive = (screen) => activeItem === screen;

    return (
        <View style={styles.wrapper}>
            <View style={styles.navContainer}>
                
                {/*menu */}
                <TouchableOpacity
                    style={[styles.navItem, isActive("menu") && styles.navItemAtivo]}
                    onPress={() => setScreen("menu")}
                >
                    <Ionicons
                        name="home-outline"
                        size={ICONE_TAM}
                        color={isActive("menu") ? "#ffffff" : "rgba(255,255,255,0.55)"}
                    />
                    <Text style={[styles.navTexto, isActive("menu") && styles.textoAtivo]}>
                        Principal
                    </Text>
                </TouchableOpacity>

                {/*notificações*/}
                <TouchableOpacity
                    style={[styles.navItem, isActive("notificacoes") && styles.navItemAtivo]}
                    onPress={() => setScreen("notificacoes")}
                > 
                    <View>
                        <Ionicons
                            name="notifications-outline"
                            size={ICONE_TAM}
                            color={isActive("notificacoes") ? "#ffffff" : "rgba(255,255,255,0.55)"}
                        />
                        {/* Exibe a bolinha se temNotificacao for true */}
                        {temNotificacao && <View style={styles.badge} />} 
                    </View>
                    <Text style={[styles.navTexto, isActive("notificacoes") && styles.textoAtivo]}>
                        Notificações
                    </Text>
                </TouchableOpacity>

                {/*perfil*/}
                <TouchableOpacity
                    style={[styles.navItem, isActive("perfil") && styles.navItemAtivo]}
                    onPress={() => setScreen("perfil")}
                >
                    <Ionicons
                        name="person-outline"
                        size={ICONE_TAM}
                        color={isActive("perfil") ? "#ffffff" : "rgba(255,255,255,0.55)"}
                    />
                    <Text style={[styles.navTexto, isActive("perfil") && styles.textoAtivo]}>
                        Perfil
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: width * 0.03,
        width: "100%",
        alignItems: "center",
    },

    navContainer: {
        backgroundColor: "rgba(15, 34, 86, 0.97)", 
        width: width * 0.95,
        height: width * 0.20,
        borderRadius: 32,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: width * 0.05,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
        marginBottom: height * 0.015,
    },

    navItem: {
        alignItems: "center",
        justifyContent: "center",
        minWidth: width * 0.23,
        minHeight: width * 0.14,
        borderRadius: 20,
    },

    navItemAtivo: {
        backgroundColor: "rgba(255,255,255,0.14)",
    },

    navTexto: {
        fontSize: width * 0.035,
        marginTop: 4,
        color: "rgba(255,255,255,0.65)",
        fontWeight: "600",
    },

    textoAtivo: {
        color: "#fff",
        fontWeight: "700",
    },

    badge: {
        position: 'absolute',
        right: -2,
        top: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#28a745',
        borderColor: '#143582ff',
        zIndex: 10,
    }
});
