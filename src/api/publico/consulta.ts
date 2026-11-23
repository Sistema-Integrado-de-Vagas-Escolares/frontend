import { apiRequest } from '@/api/utils/api';
import type {
  ConsultaPublicaRequest,
  ConsultaPublicaResponse,
} from '@/entities/consulta-publica';

export async function consultarPosicaoPublica(
  payload: ConsultaPublicaRequest,
): Promise<ConsultaPublicaResponse> {
  return apiRequest<ConsultaPublicaResponse>('/api/publico/consulta', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function consultarPosicaoPorProtocolo(
  protocolo: string,
): Promise<ConsultaPublicaResponse> {
  return apiRequest<ConsultaPublicaResponse>(
    `/api/publico/consulta/protocolo/${encodeURIComponent(protocolo)}`,
    {
      method: 'GET',
    },
  );
}
