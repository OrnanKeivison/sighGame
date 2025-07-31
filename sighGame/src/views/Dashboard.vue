<template>
  <div class="container">

    <aside class="sidebar">
      <nav>
      <div class="logo">
        <i v-if="!fisioterapeuta.foto" class="fa-solid fa-circle-user"></i>
        <img v-else :src="fisioterapeuta.foto" alt="Foto do Fisioterapeuta" />

        <div class="name-logo">
          <h1>{{ fisioterapeuta.nome }}</h1>
          <h4>{{ fisioterapeuta.tipoUsuario }}</h4>
        </div>
      </div>

      <div class="title">
        <h1>Seus Pacientes:</h1>
      </div>

      <div v-for="(paciente, index) in pacientes" :key="index" class="paciente"> <i class="fa-solid fa-circle-user"></i> <p>{{ paciente.nome }}</p> </div>
  
      </nav>
      <button class="logout"> <i class="fa-solid fa-right-from-bracket"></i> LOG OUT</button>
    </aside>

    <main class="main">
      <div class="banner">
        <img src="../assets/banner.png" alt="">
      </div>

      <section class="profile-card">
        
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "PerfilUsuario",
  data() {
    return {
      fisioterapeuta: {
        nome: "Bruna Dantas",
        idade: 30,
        tipoUsuario: "Fisioterapeuta",
        cpf: "12345678901",
        foto: ""
      },
      pacientes: [
        {
          nome: "Maria Oliveira",
          idade: 8,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "98765432100"
        },
        {
          nome: "Pedro Santos",
          idade: 10,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "12345678900"
        },
        {
          nome: "Ana Costa",
          idade: 9,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "11223344556"
        }
      ]
    };
  },
  created() {
    //
  },
  methods: {
    //
  },
};

</script>

<style scoped>
.container {
  --primary-color: #2c074e;
  --accent-color: #72127c;
  --primary-hover: #440241;
  --text-dark: #333;
  --text-muted: #555;
  --bg-form: rgba(255, 255, 255, 0.8);
  --box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  --input-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  
  display: flex;
  height: 100vh;
  width: 100%;
  background: rgba(240, 242, 245, 1);
}

.sidebar {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
}

/* SIDEBAR LOGO */
.sidebar .logo{
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  padding-right: 20px;
  /* border-radius: 15px; */
  border-bottom: 1px solid var(--bg-form);

}
.sidebar .logo i {
  font-size: 60px;
  margin-right: 10px;
}

.sidebar .logo img {
  width: 80px;
  height: 80px;
}

.sidebar .logo .name-logo h1{
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
}

.sidebar .logo .name-logo h4 {
  font-size: 0.8rem;
  margin: 0;
  padding: 0; 
}

.title{
  display: flex;
  align-items: center;
  justify-content: center;
}

/* NAV BAR */
.sidebar nav {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.sidebar nav .paciente p {
  font-weight: 300;
}

.sidebar nav .paciente{
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  margin-top: 10px;
  border-radius: 3px;
  margin-left: 0px;
  padding: 20px;
  font-weight: 600;
  border-radius: 20px;
  background-color:  var(--accent-color);
}

.sidebar nav .paciente:hover {
  background-color:  var(--primary-hover);
  border-radius: 20px;
  transition: background-color 0.3s ease;
  color: white;
}

.sidebar .paciente i{
  margin-right: 10px;
}

.sidebar .paciente .active {
  background-color: var(--accent-color);
  border-radius: 15px;
}

/* BTN LOGOUT */
.logout {
  padding: 20px;
  background-color: rgba(240, 242, 245, 1);
  border: none;
  border-radius: 15px;
  color: var(--accent-color);
  font-weight: bold;
  font-size: 0.9rem;
}

.sidebar .logout:hover {
  background-color: var(--accent-color);
  color: white;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

/* CARD INFO */
.main {
  flex: 1;
  padding: 1rem;
}

.banner  img {
  object-fit: cover;
  object-position: 0 30%;
  height: 250px;
  width: 100%;
  border-radius: 15px;
}

.profile-card {
  margin-left: 20px;
  margin-right: 20px;
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 15px;
  position: relative;
  top: -50px;
}
</style>
