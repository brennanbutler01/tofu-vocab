import http from 'utils/http';
import { translate } from '@vitalets/google-translate-api';
import randomWords from 'random-words';

interface IWord {
	text: string;
	translation?: string;
}

export interface IAPIGetWordResponse {
	word: IWord;
	definition?: IDictionaryAPIResponse[];
}

interface IDictionaryAPIResponse {
	word: string;
	phonetic?: string;
	phonetics: IPhoneticResponse[];
	origin?: string;
	meanings: IMeaning[];
}

interface IPhoneticResponse {
	text: string;
	audio?: string;
}

interface IMeaning {
	partOfSpeech: string;
	definitions: IDefinition[];
}

export interface IDefinition {
	definition: string;
	synonyms: string[];
	antonyms: string[];
}

class GetWords {
	apiGetWord = async () => await http.get<IAPIGetWordResponse>('/api/words');

	getRandomWord = () => randomWords(1)[0];

	getDefinition = async (word: string) =>
		await http.get<IDictionaryAPIResponse[]>(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
		);

	translateWithGoogle = async (text: string, target = 'vi') => {
		const { text: translation } = await translate(text, { to: 'vi' });
		return { text, translation };
	};
}

const getWords = new GetWords();
export default getWords;
