import React from 'react';
import { StatusBar } from 'expo-status-bar';
import GuiaVisitante from './src/pages/guia-visitante';

export default function GuiaVisitanteApp() {
  return (
    <>
      <StatusBar style="dark" />
      <GuiaVisitante />
    </>
  );
}