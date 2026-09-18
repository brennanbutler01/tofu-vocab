import { IAPIGetWordResponse } from 'words/get';

const definition: IAPIGetWordResponse['definition'] = [
	{
		word: 'hello',
		phonetics: [
			{
				text: 'həˈləʊ',
				audio: 'https://lex-audio.useremarkable.com/mp3/hello_us_1_rr.mp3',
			},
		],
		meanings: [
			{
				partOfSpeech: 'interjection',
				definitions: [
					{
						definition: 'a greeting or salutation',
						antonyms: ['goodbye'],
						synonyms: ['hi'],
					},
				],
			},
		],
	},
];

export default definition;
