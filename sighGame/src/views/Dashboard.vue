<template>
  <v-app>
    <!-- Cabeçalho -->
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Fisioterapeuta / Médico</v-app-bar-title>
    </v-app-bar>

    <!-- Layout principal -->
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>

          <!-- Sidebar: Pacientes -->
          <v-col cols="12" md="2">
            <v-card class="pa-2">
              <v-card-title class="text-h6">Pacientes</v-card-title>
              <v-divider class="my-2" />
              <v-btn
                v-for="(p, index) in pacientes"
                :key="index"
                class="mb-2"
                block
                variant="outlined"
              >
                {{ p }}
              </v-btn>
            </v-card>
          </v-col>

          <!-- Área principal: gráfico + texto -->
          <v-col cols="12" md="7">
            <v-card class="pa-4 mb-4">
              <v-card-title class="text-h6">Evolução do Score</v-card-title>
              <!-- Gráfico fictício -->
              <canvas ref="chartCanvas"></canvas>
            </v-card>

            <v-card class="pa-4">
              <v-card-title class="text-h6">Atualizações</v-card-title>
              <v-card-text>
                O paciente teve uma melhora de 8% nas últimas 3 sessões.
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Painel direito: médico/fisio -->
          <v-col cols="12" md="3">
            <v-card class="pa-4">
              <v-avatar size="80" class="mx-auto mb-4">
                <v-img src="https://randomuser.me/api/portraits/men/85.jpg" />
              </v-avatar>
              <v-card-title class="text-center">Dr. João Silva</v-card-title>
              <v-card-subtitle class="text-center mb-2">CRM: 123456</v-card-subtitle>
              <v-divider />
              <v-card-text>
                <p><strong>Especialidade:</strong> Fisioterapia</p>
                <p><strong>Email:</strong> joao@clinica.com</p>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import Chart from 'chart.js/auto'

const pacientes = ref(['Paciente A', 'Paciente B', 'Paciente C', 'Paciente D'])

const chartCanvas = ref(null)

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ['Sessão 1', 'Sessão 2', 'Sessão 3', 'Sessão 4'],
      datasets: [{
        label: 'Score',
        data: [30, 50, 45, 70],
        borderColor: 'red',
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  })
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}
</style>
