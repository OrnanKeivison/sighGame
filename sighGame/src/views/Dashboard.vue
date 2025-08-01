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
      
      <div class="pacientes">
        <div v-for="(paciente, index) in pacientes" 
     :key="index" 
     class="paciente" 
     :class="{ ativo: pacienteSelecionado && pacienteSelecionado.cpf === paciente.cpf }" 
     @click="selecionarPaciente(paciente)"> <i class="fa-solid fa-circle-user"></i> <p>{{ paciente.nome }}</p> </div>
      </div>

      </nav>
      <button class="logout"> <i class="fa-solid fa-right-from-bracket"></i> LOG OUT</button>
    </aside>

    <main class="main">
      <div class="banner">
        <img src="../assets/banner.png" alt="">
      </div>

      <section class="Dashboard">
        <div class="dashboard-content">
          <div class="grafico-card">
            <canvas id="graficoScore"></canvas>
          </div>
          <div class="info-card" v-if="pacienteSelecionado">
            <h1>INFORMAÇÕES DO PACIENTE:</h1>
            <i class="fa-solid fa-circle-user"></i>
            <p><strong>Nome:</strong> {{ pacienteSelecionado.nome }}</p>
            <p><strong>Idade:</strong> {{ pacienteSelecionado.idade }} anos</p>
            <p><strong>CPF:</strong> {{ pacienteSelecionado.cpf }}</p>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
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
        },
        {
          nome: "Lucas Almeida",
          idade: 7,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "99887766554"
        },
        {
          nome: "Sofia Lima",
          idade: 6,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "55667788990"
        },  
        {
          nome: "Gabriel Rocha",
          idade: 11,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "44332211000"
        },
        {
          nome: "Isabela Martins",
          idade: 5,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "22334455667"
        },
        {
          nome: "Rafael Pereira",
          idade: 12,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "66778899001"
        },
        {
          nome: "Laura Souza",
          idade: 4,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "33445566778"
        },
        {
          nome: "Matheus Silva",
          idade: 3,
          tipoUsuario: "Paciente",
          foto: "https://via.placeholder.com/80",
          cpf: "77889900112"
        }
      ],
      pacienteSelecionado: null,
    };
  },
  created() {
    //
  },
  methods: {
    selecionarPaciente(paciente) {
      this.pacienteSelecionado = paciente;
      this.$nextTick(() => {
        this.criarGrafico();
     });
    },
    criarGrafico() {
      const ctx = document.getElementById('graficoScore');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 10 }, (_, i) => `Sessão ${i + 1}`),
          datasets: [{
            label: 'Score do Paciente',
            data: [60, 65, 70, 68, 72, 75, 78, 80, 85, 90],
            backgroundColor: 'rgba(114, 18, 124, 0.2)',
            borderColor: 'rgba(114, 18, 124, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    }

  },
};

</script>

<style scoped>
.container {
  --primary-color: #2c074e;
  --accent-color: #72127c;
  --primary-hover: #1b0244;
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
  /* background: var(--primary-color); */
  background: linear-gradient(rgba(45, 2, 87, 0.4), rgba(63, 8, 83, 0.4)),
              url('../assets/banner.png');
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin:  1rem 0 1rem 1rem;
}

/* SIDEBAR LOGO */
.sidebar .logo{
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 15px;
  padding-right: 10px;
  /* border-radius: 15px; */
  border-bottom: 1px solid var(--bg-form);

}

.sidebar .logo i {
  font-size: 60px;
  margin-right: 15px;
  margin-left: 10px;
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
  padding: 10px;
  border-bottom: 1px solid var(--bg-form);
}

/* NAV BAR */
.sidebar nav {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
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
  background-color:  #38115cc4;
}

.pacientes{
  margin-top: 10px;
  margin-bottom: 10px;
  height: 60vh;
  overflow-y: auto; 
  padding-right: 10px;
}

.pacientes::-webkit-scrollbar {
  width: 8px;  
}

.pacientes::-webkit-scrollbar-track {
  background: transparent; /* remove o fundo branco */
}

.pacientes::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* cor da "alça" da barra */
  border-radius: 4px;
}

.pacientes::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
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

.ativo {
  background-color: var(--accent-color) !important;
  box-shadow: 0 0 8px rgba(0,0,0,0.3);
  transform: scale(1.02);
  transition: all 0.2s ease;
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
  height: 170px;
  width: 100%;
  border-radius: 15px;
}

.dashboard-content {
  margin-left: 20px;
  margin-right: 20px;
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 15px;
  position: relative;
  top: -50px;

  display: flex;
  gap: 20px;

}

.grafico-card {
  flex: 3;
  background-color: white;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
}

.info-card h1 {
  margin: 0;
  font-size: 1rem;
  color: var(--accent-color);
}

.info-card {
  flex: 1;
  background-color: white;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.info-card i {
  font-size: 150px;
  color: var(--accent-color);
  margin: 20px;
}

</style>
