import { hasBreakingChange } from './parser.mjs'

export function createRecommendedBumpOpts(parserOpts, config) {
	return {
		parserOpts,
		whatBump: (commits) => {
			let level = 2
			let breakings = 0
			let features = 0

			commits.forEach((commit) => {
				if (hasBreakingChange(commit)) {
					breakings += commit.notes.length
					level = 0
				}
				else if (commit.type === 'feat' || commit.type === 'feature') {
					features += 1
					if (level === 2)
						level = 1
				}
			})

			if (config.preMajor && level < 2)
				level++

			return {
				level,
				reason: breakings === 1
					? `There is ${breakings} BREAKING CHANGE and ${features} features`
					: `There are ${breakings} BREAKING CHANGES and ${features} features`,
			}
		},
	}
}
