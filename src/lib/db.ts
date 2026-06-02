import { get, set, del, keys } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';

export interface SavedSurvey {
  id: string;
  name: string;
  updatedAt: string;
  formData: any;
  results: any;
}

export const saveSurvey = async (formData: any, results: any, existingId?: string) => {
  const id = existingId || uuidv4();
  const name = formData.identitas.namaFaskes || 'FKTP Tanpa Nama';
  const survey: SavedSurvey = {
    id,
    name,
    updatedAt: new Date().toISOString(),
    formData,
    results
  };
  await set(`survey_${id}`, survey);
  return id;
};

export const getSurveys = async (): Promise<SavedSurvey[]> => {
  const allKeys = await keys();
  const surveyKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith('survey_'));
  const surveys = await Promise.all(surveyKeys.map(k => get(k)));
  return surveys as SavedSurvey[];
};

export const getSurvey = async (id: string): Promise<SavedSurvey | undefined> => {
  return await get(`survey_${id}`);
};

export const deleteSurvey = async (id: string) => {
  await del(`survey_${id}`);
};
