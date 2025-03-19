import { createWhatBump } from './bump.mjs'
import { resolveConfig } from './config.mjs'
import { createGitRawCommitsOpts } from './git.mjs'
import { createParserOpts } from './parser.mjs'
import { createWriterOpts } from './writer.mjs'

export default async function createPreset(
	config,
) {
	const resolvedConfig = resolveConfig(config)
	const parserOpts = createParserOpts(resolvedConfig)
	const writerOpts = await createWriterOpts(resolvedConfig)

	return {
		parser: parserOpts,
		writer: writerOpts,
		commits: createGitRawCommitsOpts(resolvedConfig),
		whatBump: createWhatBump(resolvedConfig),
	}
}
