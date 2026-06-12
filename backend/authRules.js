import { textoLimpo } from './pacienteValidation.js';

export const obterTokenBearer = (authorization = '') => {
  const [tipo, token] = String(authorization || '').split(' ');

  if (tipo?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

export const avaliarAcessoMesmoPaciente = ({ uidSolicitado, uidAutenticado }) => {
  const uidSolicitadoLimpo = textoLimpo(uidSolicitado);
  const uidAutenticadoLimpo = textoLimpo(uidAutenticado);

  if (!uidAutenticadoLimpo) {
    return {
      permitido: false,
      status: 401,
      error: 'Autenticação necessária para acessar este recurso.',
    };
  }

  if (uidSolicitadoLimpo !== uidAutenticadoLimpo) {
    return {
      permitido: false,
      status: 403,
      error: 'Você não tem permissão para acessar dados de outro paciente.',
    };
  }

  return {
    permitido: true,
    uid: uidSolicitadoLimpo,
  };
};
