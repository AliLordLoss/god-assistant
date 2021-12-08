<template>
  <v-container>
    <br />
    <v-row justify="center" align="center">
      <h1>دستیار خداوند متعال</h1>
    </v-row>
    <MafiaGame v-if="$store.state.started" />
    <BeginForm v-else />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </v-container>
</template>