import { useState } from 'react';

import{ View, Text, TextInput, TouchableOpacity, 
    StyleSheet, Alert } from 'react-native';

export default function Cadastro({navigation}) {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function cadastrarUsuario() {
        try {
            const resposta = 
            await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, senha }),
            });
            
            const dados = await resposta.json();

            Alert.alert(dados.mensagem);
        
            setNome('');
            setEmail('');
            setSenha('');
    } catch (erro) {
        Alert.alert('Erro ao cadastrar usuário');
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  botao: {
    backgroundColor: '#007AFF',
    padding: 12,
    marginTop: 10,
    borderRadius: 5
  },
  textoBotao: {
    color: '#000',
    textAlign: 'center'
  }
});


return (
<View style={styles.container}>
    <Text style={styles.titulo}>Cadastro de Usuário</Text>
    
    <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
    />
    <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
    />
    <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
    />
    <TouchableOpacity style={styles.botao} onPress={cadastrarUsuario}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('listaUsuarios')}>
        <Text style={styles.textoBotao}>Ver Lista de Usuários</Text>
    </TouchableOpacity>

</View>


)

}