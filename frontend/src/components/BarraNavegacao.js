import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

// Escala base de 375px de referência
const scale = width / 375;
const rs = (size) => Math.round(size * scale);
const font = (size) => Math.min(Math.round(size * scale), Math.round(size * 1.35));

export default function BottomNav({ active, setScreen, temNotificacao }) {
    // useSafeAreaInsets retorna o inset inferior real do dispositivo
    // (respeita gesture bar do Android e home indicator do iPhone)
    const insets = useSafeAreaInsets();

    // Garante um espaço mínimo mesmo em dispositivos sem inset
    const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? rs(8) : rs(4));

    const ICONE_TAM = Math.min(rs(22), 28); // mínimo legível, máximo razoável

    const tabs = [
        { key: "menu",         active: "home",         icon: "home-outline",          label: "Principal"    },
        { key: "notificacoes", active: "notificacoes",  icon: "notifications-outline", label: "Notificações" },
        { key: "perfil",       active: "perfil",        icon: "person-outline",         label: "Perfil"       },
    ];

    return (
        <View style={[styles.wrapper, { bottom: bottomInset }]}>
            <View style={styles.navContainer}>
                {tabs.map((tab) => {
                    const isActive = active === tab.active;
                    const isNotif = tab.key === "notificacoes";

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.navItem}
                            onPress={() => setScreen(tab.key)}
                            activeOpacity={0.7}
                        >
                            <View>
                                <Ionicons
                                    name={tab.icon}
                                    size={ICONE_TAM}
                                    color={isActive ? "#ffffff" : "rgba(255,255,255,0.5)"}
                                />
                                {isNotif && temNotificacao && (
                                    <View style={styles.badge} />
                                )}
                            </View>
                            <Text style={[styles.navTexto, isActive && styles.textoAtivo]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
        // Não use bottom fixo aqui — é calculado dinamicamente com insets
    },

    navContainer: {
        backgroundColor: "rgba(15, 34, 86, 0.97)", // corrigido: sem aspas extras
        width: Math.min(width * 0.92, 420),         // limita em tablets
        height: Math.max(rs(62), 56),               // altura mínima tocável
        borderRadius: rs(32),
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: rs(20),

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 10,
        marginBottom: 3,
    },

    navItem: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: rs(12),
        paddingVertical: rs(6),
        minWidth: rs(60), // área de toque mínima
    },

    navTexto: {
        fontSize: Math.min(font(11), 14),
        marginTop: rs(3),
        color: "rgba(255,255,255,0.55)",
        fontWeight: "600",
    },

    textoAtivo: {
        color: "#ffffff",
        fontWeight: "700",
    },

    badge: {
        position: "absolute",
        right: -rs(3),
        top: -rs(3),
        width: rs(10),
        height: rs(10),
        borderRadius: rs(5),
        backgroundColor: "#28a745",
        borderWidth: 1.5,
        borderColor: "rgba(15, 34, 86, 0.97)",
        zIndex: 10,
    },
});
