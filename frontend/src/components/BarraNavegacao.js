import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ICONE_TAM = width * 0.05;

export default function BottomNav({ active, setScreen, temNotificacao }) { 
    return (
        <View style={styles.wrapper}>
            <View style={styles.navContainer}>
                
                {/*menu */}
                <TouchableOpacity style={styles.navItem} onPress={() => setScreen("menu")}>
                    <Ionicons
                        name="home-outline"
                        size={ICONE_TAM}
                        color={active === "home" ? "#ffffff" : "rgba(255,255,255,0.5)"}
                    />
                    <Text style={[styles.navTexto, active === "home" && styles.textoAtivo]}>
                        Principal
                    </Text>
                </TouchableOpacity>

                {/*notificações*/}
                <TouchableOpacity style={styles.navItem} onPress={() => setScreen("notificacoes")}> 
                    <View>
                        <Ionicons
                            name="notifications-outline"
                            size={ICONE_TAM}
                            color={active === "notificacoes" ? "#ffffff" : "rgba(255,255,255,0.5)"}
                        />
                        {/* Exibe a bolinha se temNotificacao for true */}
                        {temNotificacao && <View style={styles.badge} />} 
                    </View>
                    <Text style={[styles.navTexto, active === "notificacoes" && styles.textoAtivo]}>
                        Notificações
                    </Text>
                </TouchableOpacity>

                {/*perfil*/}
                <TouchableOpacity style={styles.navItem} onPress={() => setScreen("perfil")}>
                    <Ionicons
                        name="person-outline"
                        size={ICONE_TAM}
                        color={active === "perfil" ? "#ffffff" : "rgba(255,255,255,0.5)"}
                    />
                    <Text style={[styles.navTexto, active === "perfil" && styles.textoAtivo]}>
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
        backgroundColor: "#143582ff", 
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
    },

    navItem: {
        alignItems: "center",
    },

    navTexto: {
        fontSize: width * 0.035,
        marginTop: 4,
        color: "rgba(255,255,255,0.5)",
        fontWeight: "600",
    },

    textoAtivo: {
        color: "#fff",
        fontWeight: "700",
    },

    // Estilo da bolinha verde
    badge: {
        position: 'absolute',
        right: -2,
        top: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#28a745', // Verde vibrante
        borderWidth: 1.5,
        borderColor: '#143582ff', // Borda da cor do fundo para destacar
        zIndex: 10,
    }
});