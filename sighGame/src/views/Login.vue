<template>
  <div class="container">
    <div class="container-form">
      <div id="message">{{ message }}</div>
      <h1>LOGIN SIGHGAME</h1>
      <h3>Jogo para reabilitação respiratória infantil</h3>

      <form @submit.prevent="enviarDadosLogin">
        <input type="text" v-model="matricula" placeholder="Matrícula" required/>

        <input type="password" v-model="senha" placeholder="Senha" required/>

        <button type="submit">ENTRAR</button>
      </form>

      
    </div>
  </div>
</template>

<script>
//
</script>

<style scoped>
/* Seu CSS está perfeito, mantive o mesmo */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  background-image: url(../assets/login00.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-form {
  width: 90%;
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.container h1 {
  margin-bottom: 10px;
  font-size: 2em;
  color: #333;
}

.container h3 {
  margin-bottom: 20px;
  font-weight: normal;
  color: #555;
}

form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

form button {
  width: 100%;
  padding: 10px;
  background-color: #72127c;
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
  background-color: #480345;
}

form p {
  margin-top: 10px;
  color: #333;
}

form a {
  color: #72127c;
  text-decoration: none;
  font-weight: bold;
}

form a:hover {
  text-decoration: underline;
}
</style>
