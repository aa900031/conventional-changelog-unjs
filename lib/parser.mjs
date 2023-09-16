const BREAKING_CHNAGE_NOTE_TITLES = [
	'BREAKING CHANGE',
	'BREAKING-CHANGE',
]

export function createParserOpts(
	config,
) {
	return {
		headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
		breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
		headerCorrespondence: [
			'type',
			'scope',
			'subject',
		],
		noteKeywords: [
			...BREAKING_CHNAGE_NOTE_TITLES,
		],
		revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
		revertCorrespondence: ['header', 'hash'],
		issuePrefixes: config.issuePrefixes,
	}
}

export function checkBreakingChangeNote(note) {
	return BREAKING_CHNAGE_NOTE_TITLES.includes(note.title)
}

export function hasBreakingChange(commit) {
	return commit.notes.some(checkBreakingChangeNote)
}
