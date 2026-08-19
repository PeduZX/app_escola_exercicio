import {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export default function home({navigation}) {
   
 
    return (
 
        <View style={styles.container}>
 
            <Text style={styles.titulo}>App Escola</Text>
 
 
 
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.textoBotao}>Tela cadastro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('login')}>
                <Text style={styles.textoBotao}>Tela Login</Text>
            </TouchableOpacity>
 
        </View>
    )
 
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20
    },
 
    containerLoading:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
 
    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
 
    card:{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 10
    },
 
    nomeFilme:{
        fontSize: 16,
        fontWeight: 'bold'
    },
 
    generoFilme:{
        fontSize: 14,
        color: '#666'
    },
 
    botao:{
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
    },
    textoBotao:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
 
});