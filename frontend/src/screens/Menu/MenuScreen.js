import React, { useState } from "react";
import { fonte } from '../../utilitarios/responsivo';

import {
    View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Platform, Image, Dimensions
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context"; 
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";       

const { width, height } = Dimensions.get("window");

const MenuScreen = ({ setScreen, pacienteInfo }) => {
    const [modalVisibleImp, setModalVisibleImp] = useState(false);
    const [modalVisibleFale, setModalVisibleFale] = useState(false);
    const [modalVisibleNos, setModalVisibleNos] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            "Deseja realmente sair?",
            "Você será desconectado do aplicativo.",
            [
                { text: "Não", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: () => setScreen("login") }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safe} testID="tela-menu" accessibilityLabel="tela-menu">
            <View style={styles.container}>
                {/*scroll bar*/}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: height * 0.15 }}
                    showsVerticalScrollIndicator
                >

                {/*cabecalhor*/}
                <LinearGradient
                    colors={["#001c42ff", "#0b4786ff"]}
                    style={styles.header}
                >
                    <View>
                        <Image
                            source={require('../../../assets/bhealth.png')}
                            style={styles.logo}
                        />

                        <Text style={styles.cabecalhoTitulo}>
                            Seja bem-vindo(a) ao{"\n"}B Health
                        </Text>
                        
                        <Text style={styles.cabSubtitulo}>Olá, {pacienteInfo?.displayName || "Usuário"}!</Text>
                    
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={fonte(24)} color="white" />
                    </TouchableOpacity>
                </LinearGradient>

                    <Text style={styles.secaoTitulo}>Minha Carteira</Text>

                    <TouchableOpacity
                        testID="menu-botao-historico" // <--- ADICIONADO PARA O APPIUM
                        accessibilityLabel="menu-botao-historico"
                        style={styles.bigBtn}
                        onPress={() => setScreen("historico")}
                    >
                        <Text style={styles.bigBtnTexto}>Carteira de {"\n"}Vacina</Text>
                        <Ionicons style={styles.iconeBigBtn} name="document-text-outline" size={fonte(53)} color="white"/>
                    </TouchableOpacity>

                    <Text style={styles.secaoTitulo}>Ações de Vacinação</Text>

                        <TouchableOpacity
                            testID="menu-botao-campanhas" // <--- ADICIONADO PARA O APPIUM
                            accessibilityLabel="menu-botao-campanhas"
                            style={styles.miniBtn} 
                            onPress={() => setScreen("campanhas")}
                        >
                            <Text style={styles.miniBtnTexto}>Campanhas</Text>
                            <Ionicons style={styles.miniIcones} name="megaphone-outline" size={fonte(26)} color="white" />
                        </TouchableOpacity>

                    {/*ajuda e informações*/}
                    <Text style={styles.secaoTitulo}>Ajuda e Informações</Text>

                    <TouchableOpacity
                        testID="menu-botao-importancia" // <--- ADICIONADO PARA O APPIUM
                        accessibilityLabel="menu-botao-importancia"
                        style={styles.infoBtn} onPress={() => setModalVisibleImp(true)}>
                        <Ionicons name="alert-circle-outline" size={fonte(26)} color="#313B8D" />
                        <Text style={styles.infoBtnText}>Importância da Vacina</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        testID="menu-botao-fale-conosco" // <--- ADICIONADO PARA O APPIUM
                        accessibilityLabel="menu-botao-fale-conosco"
                        style={styles.infoBtn} onPress={() => setModalVisibleFale(true)}>
                        <Ionicons name="call-outline" size={fonte(26)} color="#313B8D" />
                        <Text style={styles.infoBtnText}>Fale conosco</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        testID="menu-botao-sobre-nos" // <--- ADICIONADO PARA O APPIUM
                        accessibilityLabel="menu-botao-sobre-nos"
                        style={styles.infoBtn} onPress={() => setModalVisibleNos(true)}>
                        <Ionicons name="people-circle-outline" size={fonte(26)} color="#313B8D" />
                        <Text style={styles.infoBtnText}>Sobre nós</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/*modal - importancia*/}
                <Modal visible={modalVisibleImp} transparent animationType="fade">
                    <View style={styles.ModalImportancia}>
                        <View style={styles.ImpModal}>
                            <Text style={styles.ImpModalTitulo}>Importância</Text>

                            <Text style={styles.ImpModalTexto}>
                                Conforme a Sociedade Brasileira de Imunizações (SBIm),
                                a vacina gera imunidade e contribui para o controle e
                                eliminação de doenças causadas por vírus e bactérias.
                            </Text>

                            <TouchableOpacity
                                testID="menu-modal-importante-fechar" // <--- ADICIONADO PARA O APPIUM
                                style={styles.FecharModal}
                                onPress={() => setModalVisibleImp(false)}
                            >
                                <Text style={{ color: "white" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/*modal - contato*/}
                <Modal visible={modalVisibleFale} transparent animationType="fade">
                    <View style={styles.ModalFale}>
                        <View style={styles.FaleModal}>
                            <Text style={styles.FaleModalTitulo}>Fale Conosco</Text>

                            <Text style={styles.FaleModalTexto}>
                                Contato: (92) 99121-9076{"\n"}
                                Email: bhealth@org.com.br{"\n"}
                                2089, R. Nossa Sra. do Rosário,{"\n"}
                                1951, Itacoatiara - AM{"\n"}
                                69100-000
                            </Text>

                            <TouchableOpacity
                                testID="menu-modal-fale-conosco-fechar" // <--- ADICIONADO PARA O APPIUM
                                style={styles.FecharModal}
                                onPress={() => setModalVisibleFale(false)}
                            >
                                <Text style={{ color: "white" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/*modal - sobreNos*/}
                <Modal visible={modalVisibleNos} transparent animationType="fade">
                    <View style={styles.ModalSobreNos}>
                        <View style={styles.SobreNosModal}>
                            <Text style={styles.NosModalTitulo}>Sobre Nós</Text>

                            <Text style={styles.NosModalTexto}>
                                Nós somos uma equipe de estudantes
                                de Engenharia de Software da Universidade
                                Federal do Amazonas (UFAM).
                            </Text>

                            <TouchableOpacity
                                testID="menu-modal-sobre-nos-fechar" // <--- ADICIONADO PARA O APPIUM
                                style={styles.FecharModal}
                                onPress={() => setModalVisibleNos(false)}
                            >
                                <Text style={{ color: "white" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { 
        flex: 1, 
        backgroundColor: "#08366171" 
    },

    container: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },

    //cabeçalho
    header: {
        paddingTop: Platform.OS === "android" ? 0 : 0,
        paddingBottom: height * 0.04,
        paddingHorizontal: width * 0.05,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        width: width * 0.17,
        height: width * 0.17,
        tintColor: "#fff",
        marginLeft: width * 0.03,
        marginTop: height * 0.03
    },

    cabecalhoTitulo: {
        color: "white",
        fontSize: fonte(15),
        fontWeight: "bold",
        lineHeight: fonte(24),
        marginTop: height * -0.075,
        marginLeft: width * 0.25,
    },

    cabSubtitulo: {
        color: "rgba(255,255,255,0.9)",
        marginTop: height * 0.005,
        fontSize: fonte(13),
        marginLeft: width * 0.25,
    },

    logoutBtn: {
        padding: width * 0.02,
        borderRadius: 10,
    },

    //seção de titluos
    secaoTitulo: {
        marginTop: height * 0.02,
        marginLeft: width * 0.05,
        fontSize: fonte(17),
        color: "#444",
        fontWeight: "bold",
    },

    //carteira
    bigBtn: {
        width: width * 0.88,
        backgroundColor: "#6c9fd9ff",
        marginTop: height * 0.02,
        padding: width * 0.06,
        borderRadius: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "center",
        height: height * 0.16,
        elevation: 9,
    },

    bigBtnTexto: {
        color: "white",
        fontSize: fonte(24),
        fontWeight: "bold",
        width: "60%",
    },

    iconeBigBtn: {
        alignSelf: "center",
    },

    //mini botões
    miniBtn: {
        backgroundColor: "#2b61b7c5",
        width: width * 0.88,
        height: height * 0.08,
        paddingHorizontal: width * 0.04,
        borderRadius: 20,
        borderTopLeftRadius: 0,
        justifyContent: "center",
        alignSelf: "center",
        elevation: 9,
        marginTop: height * 0.015,
    },

    miniBtnTexto: {
        color: "white",
        fontWeight: "bold",
        fontSize: fonte(17),
        marginLeft: width * 0.03,
        color: "#ffffffff"
    },

    miniIcones: {
        position: "absolute",
        right: width * 0.09,
        top: height * 0.023,
    },

    //Informações Btn
    infoBtn: {
        backgroundColor: "#dfeef5ff",
        padding: width * 0.035,
        marginHorizontal: width * 0.08,
        marginTop: height * 0.02,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.04,
        elevation: 5,
        alignSelf: "center",
        width: width * 0.85,
    },

    infoBtnText: {
        fontSize: fonte(16),
        color: "#333",
    },

    //Modal Importancia
    ModalImportancia: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    ImpModal: {
        backgroundColor: "white",
        width: width * 0.80,
        padding: width * 0.06,
        borderRadius: 20,
    },

    ImpModalTitulo: {
        fontSize: fonte(21),
        fontWeight: "bold",
        marginBottom: 15,
    },

    ImpModalTexto: {
        fontSize: fonte(15),
        lineHeight: fonte(21),
        color: "#555",
    },

    //Modal Fale Conosco
    ModalFale: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    FaleModal: {
        backgroundColor: "white",
        width: width * 0.80,
        padding: width * 0.06,
        borderRadius: 20,
    },

    FaleModalTitulo: {
        fontSize: fonte(21),
        fontWeight: "bold",
        marginBottom: 15,
    },

    FaleModalTexto: {
        fontSize: fonte(15),
        lineHeight: fonte(21),
        color: "#555",
    },

    //Modal Sobre Nós
    ModalSobreNos: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    SobreNosModal: {
        backgroundColor: "white",
        width: width * 0.80,
        padding: width * 0.06,
        borderRadius: 20,
    },

    NosModalTitulo: {
        fontSize: fonte(21),
        fontWeight: "bold",
        marginBottom: 15,
    },

    NosModalTexto: {
        fontSize: fonte(15),
        lineHeight: fonte(21),
        color: "#555",
    },

    //fechar modal
    FecharModal: {
        backgroundColor: "#5758b9ff",
        marginTop: height * 0.02,
        padding: width * 0.03,
        borderRadius: 15,
        alignItems: "center",
    },
});

export default MenuScreen;
