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
          
          <div class="info">
            <!-- CARD DE INFORMAÇÕES DO PACIENTE -->
            <div class="info-card" v-if="pacienteSelecionado">
              <div class="img">
                <i class="fa-solid fa-circle-user"></i>
              </div>

              <div class="info-paciente">
                <h1>INFORMAÇÕES DO PACIENTE:</h1>
                <p><strong>Nome:</strong> {{ pacienteSelecionado.nome }}</p>
                <p><strong>CPF:</strong> {{ pacienteSelecionado.cpf }}</p>
              </div>
            </div>

            <div class="info-card" v-if="pacienteSelecionado">
              <div class="img">
                <i class="fa-solid fa-trophy"></i>
              </div>

              <div class="info-paciente">
                <h1>MAIOR DISTÂNCIA</h1>
                <p>{{ maxDistancia }}</p>
              </div>
            </div>

            <div class="info-card" v-if="pacienteSelecionado">
              <div class="img">
                <i class="fa-solid fa-medal"></i>
              </div>

              <div class="info-paciente">
                <h1>MAIOR PONTUAÇÃO</h1>
                <p>{{ maxPontos}}</p>
              </div>
            </div>
          </div>

          <!-- GRÁFICOS LADO A LADO -->
          <div class="graficos-lado">
            
            <!-- SCORE -->
            <div class="grafico-card">
              <div class="grafico-header">
                <h3>Gráfico de Pontuação</h3>
                <i class="fa-solid fa-up-right-and-down-left-from-center" 
                  @click="abrirFullscreen('graficoScore')" title="Expandir"></i>
              </div>
              <canvas id="graficoScore"></canvas>
            </div>

            <!-- DISTÂNCIA -->
            <div class="grafico-card">
              <div class="grafico-header">
                <h3>Gráfico de Distância</h3>
                <i class="fa-solid fa-up-right-and-down-left-from-center" 
                  @click="abrirFullscreen('graficoDistancia')" title="Expandir"></i>
              </div>
              <canvas id="graficoDistancia"></canvas>
            </div>
          </div>

          <!-- MODAL DE TELA CHEIA -->
          <div v-if="fullscreenGrafico" class="fullscreen-overlay" @click.self="fecharFullscreen">
            <div class="fullscreen-content">
              <i class="fa-solid fa-down-left-and-up-right-to-center fechar" @click="fecharFullscreen"></i>
              <canvas :id="fullscreenGrafico + '_fullscreen'"></canvas>
            </div>
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
        foto: ''
      },
      todasSessoes: [],
      maxPontos: '',
      maxDistancia: '',
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

          this.todasSessoes = sessoes;
          this.maxPontos = Math.max(...sessoes.map(s => s.pontos || 0));
          this.maxDistancia = Math.max(...sessoes.map(s => s.maiorDistancia || 0));

          const sessoesFiltradas = sessoes.length > 5 ? sessoes.slice(-5) : sessoes;

          const labels = sessoesFiltradas.map(s => {
            
            if (!s.dataHora) return "Sem data";

            const [data] = s.dataHora.split(" "); 
            const [ano, mes, dia] = data.split("-");

            const meses = [
              "jan", "fev", "mar", "abr", "mai", "jun",
              "jul", "ago", "set", "out", "nov", "dez"
            ];

            return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`;
          });
          const scores = sessoesFiltradas.map(s => s.pontos || 0);
          const distancias = sessoesFiltradas.map(s => s.maiorDistancia || 0);

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
              scales: { 
                y: { beginAtZero: true } }
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

        const sessoes = this.todasSessoes;

        const labels = sessoes.map(s => {
          if (!s.dataHora) return "Sem data";
          const [data] = s.dataHora.split(" ");
          const [ano, mes, dia] = data.split("-");

          const meses = [
            "jan", "fev", "mar", "abr", "mai", "jun",
            "jul", "ago", "set", "out", "nov", "dez"
          ];

          return `${dia} ${meses[parseInt(mes) - 1]} ${ano}`;
        });

        const scores = sessoes.map(s => s.pontos || 0);
        const distancias = sessoes.map(s => s.maiorDistancia || 0);

        const data = tipo === 'graficoScore' ? scores : distancias;
        const label = tipo === 'graficoScore' ? 'Pontuação por Sessão' : 'Distância por Sessão';

        const background = tipo === 'graficoScore'
          ? 'rgba(114, 18, 124, 0.2)'
          : 'rgba(44, 7, 78, 0.2)';

        const border = tipo === 'graficoScore'
          ? 'rgba(114, 18, 124, 1)'
          : 'rgba(44, 7, 78, 1)';

        const ctx = document.getElementById(tipo + '_fullscreen');

        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label,
              data,
              backgroundColor: background,
              borderColor: border,
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: {
              y: { beginAtZero: true }
            }
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

<style src="../styles/dashboard.css" scoped></style>
