import { trimAndLowercase } from 'utils/trimAndLowercase';
import { StudyGroupWithFlashcards } from './crud/getMany';

export default function searchStudyGroups(
	search: string,
	studyGroups: StudyGroupWithFlashcards[],
) {
	return search
		? studyGroups?.filter(
				studyGroup =>
					trimAndLowercase(studyGroup.name).includes(
						trimAndLowercase(search),
					) ||
					trimAndLowercase(studyGroup.description).includes(
						trimAndLowercase(search),
					),
		  )
		: studyGroups;
}
