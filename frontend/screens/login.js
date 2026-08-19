import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  async function fazerLogin() {
    try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      console.log(dados);

      if (dados.sucesso) {
        Alert.alert("Sucesso", "Login realizado com sucesso");
        setIsLogged(true);
        if (dados.email && dados.senha) {
          await AsyncStorage.setItem("email", dados.email);
          await AsyncStorage.setItem("senha", dados.senha);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login");
      console.log(error);
    }
  }

  async function carregarEmailSalvo() {
    const emailArmazenado = await AsyncStorage.getItem("email");
    if (emailArmazenado) {
      setEmail(emailArmazenado);
    }
  }

  async function fazerLogout() {
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("senha");
    setIsLogged(false);
    setEmail("");
    setSenha("");
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {isLogged ? (
        <Text style={styles.container}>Usuário logado: {email}</Text>
      ) : (
        <Text style={styles.container}>Não logado</Text>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 12,
          borderRadius: 5,
          marginTop: 10,
        }}
        onPress={fazerLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
