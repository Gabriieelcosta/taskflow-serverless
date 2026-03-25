<template>
  <v-app>
    <v-main class="auth-bg">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="5" lg="4">

            <!-- Logo e título -->
            <div class="text-center mb-8">
              <v-icon size="56" color="primary">mdi-movie-play</v-icon>
              <h1 class="text-h4 font-weight-bold mt-2 text-white">
                CLAQUETE
              </h1>
              <p class="text-caption text-medium-emphasis mt-1">
                Gestão de tarefas para quem produz entretenimento
              </p>
            </div>

            <!-- Conteúdo da página (Login ou Register) -->
            <slot />

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-bg {
  background: radial-gradient(ellipse at top, #1a0a0a 0%, #141414 60%);
  min-height: 100vh;
}
</style>
