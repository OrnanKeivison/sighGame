<template>
  <div class="container">

    <aside class="sidebar">
      <nav>
        <div class="logo">
          <i v-if="!usuario.foto" class="fa-solid fa-circle-user"></i>
          <img v-else :src="usuario.foto" alt="Foto do Fisioterapeuta" />

          <div class="name-logo">
            <h1>{{ usuario.nome }}</h1>
            <h4>{{ usuario.tipoUsuario }}</h4>
          </div>
        </div>

        <div v-if="usuario.tipoUsuario == 'fisioterapeuta'" class="title">
          <h1>Seus Pacientes:</h1>
        </div>
        
        <div class="pacientes">
          <div 
            v-for="(paciente, index) in pacientes" 
            :key="index" 
            class="paciente" 
            :class="{ ativo: pacienteSelecionado && pacienteSelecionado.cpf === paciente.cpf }" 
            @click="selecionarPaciente(paciente)"
          >
            <i class="fa-solid fa-circle-user"></i> 
            <p>{{ paciente.nome }}</p>
          </div>
        </div>
      </nav>

      <button class="logout" @click="logout"> 
        <i class="fa-solid fa-right-from-bracket"></i> LOG OUT
      </button>
    </aside>

    <main class="main">
      <div class="banner">
        <img src="../assets/banner.png" alt="">
      </div>

      <section v-if="pacienteSelecionado == null && usuario.tipoUsuario == 'fisioterapeuta'" class="welcome">
        <div>
          <h1>Olá {{ usuario.nome }}!</h1>
          <p>Selecione um paciente ao lado para visualizar os gráficos</p>
        </div>
        <img src="../assets/fisio.png" alt="paciente">
      </section>

      <section v-else class="Dashboard">
        <div class="dashboard-content">
          <div class="graficos">

            <!-- GRÁFICO SCORE -->
            <div class="grafico-card">
              <div class="grafico-header">
                <h3>Gráfico de Pontuação</h3>
                <i class="fa-solid fa-up-right-and-down-left-from-center" 
                  @click="abrirFullscreen('graficoScore')" title="Expandir"></i>
              </div>
              <canvas id="graficoScore"></canvas>
            </div>

            <!-- GRÁFICO DE DISTÂNCIA -->
            <div class="grafico-card">
              <div class="grafico-header">
                <h3>Gráfico de Distância</h3>
                <i class="fa-solid fa-up-right-and-down-left-from-center" 
                  @click="abrirFullscreen('graficoDistancia')" title="Expandir"></i>
              </div>
              <canvas id="graficoDistancia"></canvas>
            </div>

            <!-- MODAL DE TELA CHEIA -->
            <div v-if="fullscreenGrafico" class="fullscreen-overlay" @click.self="fecharFullscreen">
              <div class="fullscreen-content">
                <i class="fa-solid fa-down-left-and-up-right-to-center fechar" @click="fecharFullscreen"></i>
                <canvas :id="fullscreenGrafico + '_fullscreen'"></canvas>
              </div>
            </div>
          </div>

          <!-- CARD DE INFORMAÇÕES -->
          <div class="info-card" v-if="pacienteSelecionado">
            <h1>INFORMAÇÕES DO PACIENTE:</h1>
            <i class="fa-solid fa-circle-user"></i>
            <p><strong>Nome:</strong> {{ pacienteSelecionado.nome }}</p>
            <p><strong>CPF:</strong> {{ pacienteSelecionado.cpf }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import { ref as dbRef, get } from "firebase/database";
import { database } from '../firebase';

export default {
  name: "PerfilUsuario",
  data() {
    return {
      usuario: {
        id: localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).id : '',
        nome: localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).nome : '',
        tipoUsuario: localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).tipo : '',
        cpf: localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).cpf : '',
        foto: ""
      },
      pacientes: [],
      pacienteSelecionado: null,
      chartScore: null,
      chartDistancia: null,
      fullscreenGrafico: null
    };
  },
  mounted() {
    this.iniciar(this.usuario);
  },
  methods: {
    logout() {
      localStorage.removeItem('usuario');
      this.$router.push('/');
    },
    async iniciar(usuario){
      if(usuario.tipoUsuario == 'fisioterapeuta'){
        this.carregarPacientes();
      }
      else{
        this.selecionarPaciente(usuario)
      }

    },
    async carregarPacientes() {
      const usuariosRef = dbRef(database, 'usuarios');
      try {
        const snapshot = await get(usuariosRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.pacientes = Object.entries(data)
            .map(([id, dados]) => ({ id, ...dados }))
            .filter(u => u.tipo === "paciente" && u.fisioterapeutaId === this.usuario.id);
        } else {
          console.log("Nenhum paciente encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    },
    selecionarPaciente(paciente) {
      this.pacienteSelecionado = paciente;
      this.$nextTick(() => {
        this.criarGraficos();
      });
    },
    async criarGraficos() {
      const ctxScore = document.getElementById('graficoScore');
      const ctxDistancia = document.getElementById('graficoDistancia');
      if (!ctxScore || !ctxDistancia) return;

      if (this.chartScore) this.chartScore.destroy();
      if (this.chartDistancia) this.chartDistancia.destroy();

      const sessoesRef = dbRef(database, `usuarios/${this.pacienteSelecionado.id}/sessoes`);

      try {
        const snapshot = await get(sessoesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const sessoes = Object.entries(data)
            .map(([id, dados]) => ({ id, ...dados }))
            .sort((a, b) => new Date(a.data) - new Date(b.data));

          const labels = sessoes.map((s, i) => s.nomeSessao || `Sessão ${i + 1}`);
          const scores = sessoes.map(s => s.pontos || 0);
          const distancias = sessoes.map(s => s.maiorDistancia || 0);

          this.chartScore = new Chart(ctxScore, {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Pontuação por Sessão',
                data: scores,
                backgroundColor: 'rgba(114, 18, 124, 0.2)',
                borderColor: 'rgba(114, 18, 124, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { display: true } },
              scales: { y: { beginAtZero: true } }
            }
          });

          this.chartDistancia = new Chart(ctxDistancia, {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Distância por Sessão',
                data: distancias,
                backgroundColor: 'rgba(44, 7, 78, 0.2)',
                borderColor: 'rgba(44, 7, 78, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { display: true } },
              scales: { y: { beginAtZero: true } }
            }
          });
        } else {
          console.log("Nenhum dado de sessão encontrado para o paciente.");
        }
      } catch (error) {
        console.error("Erro ao buscar sessões:", error);
      }
    },
    abrirFullscreen(tipo) {
      this.fullscreenGrafico = tipo;
      this.$nextTick(() => {
        const originalChart = tipo === 'graficoScore' ? this.chartScore : this.chartDistancia;
        const ctx = document.getElementById(tipo + '_fullscreen');
        new Chart(ctx, {
          type: originalChart.config.type,
          data: originalChart.config.data,
          options: {
            ...originalChart.config.options,
            plugins: { legend: { display: true } },
            maintainAspectRatio: false
          }
        });
      });
    },
    fecharFullscreen() {
      this.fullscreenGrafico = null;
    }
  }
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: rgba(240, 242, 245, 1);
}

.sidebar {
  width: 270px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: linear-gradient(rgba(45, 2, 87, 0.4), rgba(63, 8, 83, 0.4)),
              url('../assets/banner.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 1rem;
}

.sidebar .logo {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--bg-form);
}

.sidebar .logo i {
  font-size: 60px;
  margin-right: 15px;
}

.sidebar .logo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.sidebar .name-logo h1 {
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
}

.sidebar .name-logo h4 {
  font-size: 0.8rem;
  margin: 0; 
  padding: 0;
}

/* Pacientes */
.title {
  font-size: 10px;
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid var(--bg-form);
}

.pacientes {
  margin-top: 10px;
  margin-bottom: 10px;
  height: 60vh;
  overflow-y: auto; 
  padding-right: 10px;
}

.pacientes::-webkit-scrollbar {
  width: 8px;  
}

.pacientes::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.sidebar .paciente i{
  margin-right: 10px;
}

.sidebar nav .paciente {
  display: flex;
  align-items: center;
  color: white;
  margin-top: 10px;
  border-radius: 15px;
  padding: 15px;
  background-color: #38115cc4;
  font-weight: 600;
  cursor: pointer;
}

.sidebar nav .paciente:hover {
  background-color: var(--primary-hover);
}

.ativo {
  background-color: var(--accent-color) !important;
  box-shadow: 0 0 8px rgba(0,0,0,0.3);
  transform: scale(1.02);
}

/* Logout */
.logout {
  padding: 20px;
  background-color: rgba(240, 242, 245, 1);
  border: none;
  border-radius: 15px;
  color: var(--accent-color);
  font-weight: bold;
  font-size: 0.9rem;
}
.logout:hover {
  background-color: var(--accent-color);
  color: white;
  cursor: pointer;
}


/* Conteúdo principal (scroll só aqui) */

.welcome {
  flex: 1;
  margin: -40px 20px 0 20px;
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 15px;
  display: flex;
  gap: 20px;
  
  align-items: center;
  justify-content: center;
  text-align: center;
}

.welcome img {
  width: 260px;
  max-width: 80%;
}

.welcome h1 {
  font-size: 2rem;
  font-weight: bold;
}

.main { 
  width: calc(100vw - 270px);
  height: 100vh;
  overflow-y: auto;
  padding: 1.5rem;
  background: rgba(240, 242, 245, 1);
  display: flex;
  flex-direction: column;
}

/* Banner */
.banner img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 15px;
}

/* Dashboard */
.dashboard-content {
  flex: 1;
  margin: -40px 20px 0 20px;
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 15px;
  display: flex;
  gap: 20px;
}

/* Gráficos */
.graficos {
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 750px;
}

.grafico-card {
  flex: 1; 
  background-color: white;
  padding: 1rem;
  border-radius: 15px;
  box-shadow: var(--box-shadow);
  margin-bottom: 1rem;
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .5rem;
}

.grafico-header i {
  cursor: pointer;
  color: var(--accent-color);
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.grafico-header i:hover {
  transform: scale(1.2);
  color: var(--primary-hover);
}

/* Fullscreen */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fullscreen-content {
  position: relative;
  width: 90%;
  height: 85%;
  background: white;
  border-radius: 15px;
  padding: 1rem;
}

.fullscreen-content .fechar {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.5rem;
  color: var(--accent-color);
  cursor: pointer;
}

/* Card do paciente */
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
.info-card h1 {
  margin: 0;
  font-size: 1rem;
  color: var(--accent-color);
}
.info-card i {
  font-size: 150px;
  color: var(--accent-color);
  margin: 20px;
}
</style>

