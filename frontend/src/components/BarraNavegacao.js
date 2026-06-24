import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const scale = width / 375;
const rs = (size) => Math.round(size * scale);
const font = (size) => Math.min(Math.round(size * scale), Math.round(size * 1.35));

const tabs = [
    { key: "menu", icon: "home-outline", label: "Principal" },
    { key: "notificacoes", icon: "notifications-outline", label: "Notificações" },
    { key: "perfil", icon: "person-outline", label: "Perfil" },
];

export default function BottomNav({ active, setScreen, temNotificacao }) {
    const insets = useSafeAreaInsets();
    const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? rs(8) : rs(4));
    const iconSize = Math.min(rs(22), 28);

    return (
        <View style={[styles.wrapper, { bottom: bottomInset }]}>
            <View style={styles.navContainer}>
                {tabs.map((tab) => {
                    const isActive = active === tab.key || (active === "home" && tab.key === "menu");
                    const isNotificationTab = tab.key === "notificacoes";

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
                                    size={iconSize}
                                    color={isActive ? "#ffffff" : "rgba(255,255,255,0.5)"}
                                />
                                {isNotificationTab && temNotificacao && (
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
    },

    navContainer: {
        backgroundColor: "rgba(15, 34, 86, 0.97)", 
        width: Math.min(width * 0.92, 420),
        height: Math.max(rs(62), 56),
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
        minWidth: rs(60),
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
