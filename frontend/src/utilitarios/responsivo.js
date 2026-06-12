import { Dimensions, PixelRatio } from 'react-native';

// Dispositivo de referência usado no design (iPhone X / Android comum).
const BASE_LARGURA = 375;
const BASE_ALTURA = 812;

const { width, height } = Dimensions.get('window');

// Usa a menor/maior dimensão para ser estável independente da orientação.
const dimMin = Math.min(width, height);
const dimMax = Math.max(width, height);

export const largura = width;
export const altura = height;

// Escala proporcional à largura de referência.
export const escala = (tamanho) => (dimMin / BASE_LARGURA) * tamanho;

// Escala proporcional à altura de referência.
export const escalaVertical = (tamanho) => (dimMax / BASE_ALTURA) * tamanho;

// Escala "moderada": amortece o crescimento/encolhimento.
// fator 0 = tamanho fixo, fator 1 = escala linear cheia.
export const escalaModerada = (tamanho, fator = 0.5) =>
  tamanho + (escala(tamanho) - tamanho) * fator;

// Tamanho de fonte/ícone responsivo, amortecido, arredondado ao pixel
// e com clamp opcional para evitar extremos em telas muito pequenas/grandes.
export const fonte = (tamanho, { min, max, fator = 0.3 } = {}) => {
  let valor = escalaModerada(tamanho, fator);
  if (min != null) valor = Math.max(valor, min);
  if (max != null) valor = Math.min(valor, max);
  return Math.round(PixelRatio.roundToNearestPixel(valor));
};
