<template>
  <div class="container">
    <div class="container-form">
      <div class="erro-login" v-if="message">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ message }}</span>
      </div>

      <h1>LOGIN SIGHGAME</h1>
      <h3>Jogo Para Reabilitação Respiratória Infantil</h3>

      <form @submit.prevent="enviarDadosLogin">
        <input type="text" v-model="matricula" autocomplete="off" name="user_field" placeholder="Email" required />
        <input type="password" v-model="senha" autocomplete="new-password" name="access_key" placeholder="Senha" required />
        <button type="submit">ENTRAR</button>
      </form>
    </div>
  </div>
</template>

<script>
import { auth, database } from '../firebase'; // ajuste o caminho
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";

export default {
  data() {
    return {
      matricula: '',
      senha: '',
      message: '',
    }
  },
  methods: {
    async enviarDadosLogin() {
      try {
        // Autenticar com Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, this.matricula, this.senha);
        const user = userCredential.user;

        // Pegar os dados no Realtime Database usando UID
        const userRef = ref(database, 'usuarios/' + user.uid);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const dadosUsuario = snapshot.val();
          this.message = `Bem-vindo(a), ${dadosUsuario.nome || 'usuário'}!`;

          // Aqui você pode salvar dados no localStorage, redirecionar, etc
          localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
          this.$router.push('/Dashboard'); // Redireciona para o Dashboard
        } else {
          this.message = "Usuário autenticado, mas dados não encontrados no banco.";
        }

      } catch (error) {
        console.error("Erro de login:", error);
        if (error.code === 'auth/wrong-password') {
          this.message = "Senha incorreta.";
        } else if (error.code === 'auth/user-not-found') {
          this.message = "Usuário não encontrado.";
        } else {
          this.message = "Erro ao fazer login.";
        }
      }
    },
  },
}
</script>

<style scoped>
.container {
  --primary-color: #72127c;
  --primary-hover: #480345;
  --text-dark: #333;
  --text-muted: #555;
  --bg-form: rgba(255, 255, 255, 0.8);
  --box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  --input-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

  background-image: url(../assets/fundoLogin.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.erro-login {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff0000;
  border: 0.1rem solid #ff0000;
  border-radius: 1rem;
  background-color: #ff4d4da1;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 1rem;
  gap: 1rem;
}


.erro-login i {
  font-size: 18px;
}

.container-form {
  width: 90%;
  max-width: 400px;
  background-color: var(--bg-form);
  padding: 30px;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  text-align: center;
}

.container h1 {
  margin-bottom: 10px;
  font-size: 2em;
  color: var(--text-dark);
}

.container h3 {
  margin-bottom: 20px;
  font-weight: normal;
  font-size: 18px;
  color: var(--text-muted);
}

form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: none;
  border-radius: 8px;
  box-shadow: var(--input-shadow);
}

form button {
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
  margin-top: 25px;
}

form button:hover {
  background-color: var(--primary-hover);
}

form p {
  margin-top: 10px;
  color: var(--text-dark);
}

form a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
}

form a:hover {
  text-decoration: underline;
}
</style>