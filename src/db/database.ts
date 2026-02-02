import { supabase } from './dbClient'

export const saveData = async (inputtext: string, userid?: string) => {
  const { error } = await supabase
    .from('reflections') 
    .upsert({ 
      text: inputtext
    });

  if (error) {
    console.error('Error saving:', error)
  } else {
    console.log('Data saved!')
  }
}

export const loadData = async () => {
  // get all rows from 'reflections' table for now
  const { data, error } = await supabase
    .from('reflections') 
    .select('*');

  if (error) {
    console.error('Error loading:', error);
    return null;
  }

  // console.log all text fields of data for debugging
  console.log('Loaded data:', data?.map(row => row.text));

  // TypeScript knows 'data' has .score and .game_data
  console.log('Done loading data'); 
  return data
}