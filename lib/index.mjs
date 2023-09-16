import { resolveConfig } from './config.mjs'
import { createParserOpts } from './parser.mjs'
import { createWriterOpts } from './writer.mjs'
import { createGitRawCommitsOpts } from './git.mjs'
import { createRecommendedBumpOpts } from './bump.mjs'

export default async function createPreset(
	config,
) {
	const resolvedConfig = resolveConfig(config)
	const parserOpts = createParserOpts(resolvedConfig)
	const writerOpts = await createWriterOpts(resolvedConfig)

	return {
		parserOpts,
		writerOpts,
		conventionalChangelog: { parserOpts, writerOpts },
		recommendedBumpOpts: createRecommendedBumpOpts(parserOpts, resolvedConfig),
		gitRawCommitsOpts: createGitRawCommitsOpts(resolvedConfig),
	}
}
