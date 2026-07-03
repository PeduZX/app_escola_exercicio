import {useState} from 'react';

import {View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert} from 'react-native';

export default function login({navigation}) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function fazerLogin(){
        try{
            const resposta = await fetch('http://172.20.90.117:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, senha
                })
            });

            const dados = await resposta.json();

            console.log(dados);

            if(dados.sucesso){
                Alert.alert('Sucesso', 'Login realizado com sucesso');
                //navigation.navigate('Home');
            }

        }catch(error){
            Alert.alert('Erro', 'Falha ao fazer login');
            console.log(error);
        }
    }

    return (

        <View style={styles.container}>
        
            <Text style={styles.container}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={fazerLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity> 
        </View>
    )

}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },

    titulo:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginBottom: 10
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