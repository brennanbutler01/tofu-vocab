import { withVisitorGuard } from 'server/visitor';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { validateSession } from 'utils/validateSession';
import { NextApiRequest, NextApiResponse } from 'next';
import getWords from 'words/get';

const words = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET')
		return res.status(405).json({ err: 'Method not allowed.' });
	if (validateSession(await getServerSession(req, res, authOptions)).error)
		return res.status(401).json({ err: 'Please sign in.' });
	const randomWord = getWords.getRandomWord();
	//TODO - get new translation library
	const [word, definition] = await Promise.all([
		getWords.translateWithGoogle(randomWord, 'vi'),
		getWords.getDefinition(randomWord),
	]);

	res.status(200).json({
		word,
		definition,
	});
};

export default withVisitorGuard(words);
